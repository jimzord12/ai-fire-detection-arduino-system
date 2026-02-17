#!/usr/bin/env bun

import { program } from 'commander';
import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Try loading from project root if not found locally
if (!process.env.OPENROUTER_API_KEY) {
  const rootEnvPath = path.resolve(__dirname, '../../../.env');
  if (fs.existsSync(rootEnvPath)) {
    dotenv.config({ path: rootEnvPath });
  }
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// CLI Configuration
program
  .name('image-gen')
  .description('Generate images using OpenRouter API')
  .argument('[prompt-file]', 'Path to a text file containing the prompt')
  .argument('[output-path]', 'Output path for the generated image', 'out.png')
  .option(
    '-m, --model <model>',
    'OpenRouter model ID',
    process.env.OPENROUTER_IMAGE_MODEL || 'google/gemini-2.5-flash-image-preview'
  )
  .option('-a, --aspect-ratio <ratio>', 'Aspect ratio (1:1, 16:9, 9:16, 4:3, 3:4, etc.)')
  .option('-s, --image-size <size>', 'Image size (1K, 2K, 4K) - Gemini only')
  .option('-t, --test', 'Use a test prompt to verify that the setup is working', false)
  .parse();

const options = program.opts();
let [promptFile, outputPath] = program.args;

interface ImageResponse {
  choices?: Array<{
    message?: {
      images?: Array<{ imageUrl?: { url?: string }; image_url?: { url?: string } }>;
      content?: string | Array<{ type?: string; image_url?: { url?: string } }>;
    };
  }>;
  error?: { message?: string };
}

async function main() {
  // Validate API key
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('Error: OPENROUTER_API_KEY environment variable is required');
    console.error('Set it in .env file or export it in your shell');
    process.exit(1);
  }

  // Use test prompt if specified
  if (options.test) promptFile = path.resolve(__dirname, 'test/test-prompt.txt');

  if (!promptFile) {
    console.error('Error: Prompt file argument is required unless --test is specified.');
    program.help();
  }

  // Read prompt from file
  if (!fs.existsSync(promptFile)) {
    console.error(`Error: Prompt file not found: ${promptFile}`);
    process.exit(1);
  }

  // Set default output path if not provided
  if (!outputPath) {
    const promptDir = path.dirname(promptFile);
    outputPath = path.join(promptDir, 'generated-img.png');
  }

  const prompt = fs.readFileSync(promptFile, 'utf-8').trim();
  if (!prompt) {
    console.error('Error: Prompt file is empty');
    process.exit(1);
  }

  console.log(`Using model: ${options.model}`);
  console.log(`Prompt: ${prompt.substring(0, 100)}...`);

  try {
    console.log('Generating image...');

    // Build request body - must include modalities for image generation
    const requestBody: Record<string, unknown> = {
      model: options.model,
      messages: [{ role: 'user', content: prompt }],
      modalities: ['image', 'text'], // REQUIRED for image generation
    };

    // Add image config if specified
    if (options.aspectRatio || options.imageSize) {
      requestBody.image_config = {
        ...(options.aspectRatio && { aspect_ratio: options.aspectRatio }),
        ...(options.imageSize && { image_size: options.imageSize }),
      };
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}): ${errorText}`);
      process.exit(1);
    }

    const result = (await response.json()) as ImageResponse;

    if (result.error) {
      console.error(`API Error: ${result.error.message}`);
      process.exit(1);
    }

    // Extract image from response
    let imageDataUrl: string | null = null;

    if (result.choices && result.choices.length > 0) {
      const message = result.choices[0].message;

      // Check for images array (per OpenRouter docs)
      if (message?.images && Array.isArray(message.images)) {
        for (const image of message.images) {
          const url = image.imageUrl?.url || image.image_url?.url;
          if (url) {
            imageDataUrl = url;
            break;
          }
        }
      }

      // Also check content array for image_url type
      if (!imageDataUrl && message?.content && Array.isArray(message.content)) {
        for (const part of message.content) {
          if (typeof part === 'object' && part.type === 'image_url') {
            imageDataUrl = part.image_url?.url || null;
            if (imageDataUrl) break;
          }
        }
      }
    }

    if (!imageDataUrl) {
      console.error('No image found in response');
      console.error('Full response:', JSON.stringify(result, null, 2));
      process.exit(1);
    }

    // Parse and save the image
    const { mimeType, data } = parseDataUrl(imageDataUrl);
    const imageBuffer = Buffer.from(data, 'base64');

    // Determine output path with correct extension
    let finalOutputPath = outputPath;
    if (outputPath === 'out.png' && mimeType) {
      const ext = mimeTypeToExt(mimeType);
      if (ext) {
        finalOutputPath = `out${ext}`;
      }
    }

    fs.writeFileSync(finalOutputPath, imageBuffer);
    console.log(`Image saved to: ${finalOutputPath}`);
    console.log(`Size: ${imageBuffer.length} bytes`);
  } catch (error) {
    console.error('Error generating image:', error);
    process.exit(1);
  }
}

function parseDataUrl(dataUrl: string): { mimeType: string; data: string } {
  // Handle data URL format: data:image/png;base64,AAAA...
  if (dataUrl.startsWith('data:')) {
    const [header, data] = dataUrl.split(',', 2);
    const mimeMatch = header.match(/data:([^;]+)/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    return { mimeType, data };
  }

  // Fallback: raw base64
  return { mimeType: 'image/png', data: dataUrl };
}

function mimeTypeToExt(mimeType: string): string {
  const mapping: Record<string, string> = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/webp': '.webp',
    'image/gif': '.gif',
  };
  return mapping[mimeType] || '.png';
}

main();

