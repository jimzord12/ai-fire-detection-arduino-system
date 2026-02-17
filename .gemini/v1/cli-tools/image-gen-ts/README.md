# Image Generation CLI

A command-line tool for generating images using the OpenRouter API with models like Google Gemini.

## Prerequisites

- **Node.js** (v18 or later)
- **npm** or **pnpm**
- An **OpenRouter API key** (get one at [openrouter.ai](https://openrouter.ai))

## Installation

1. Navigate to the tool directory:

   ```bash
   cd .gemini/cli-tools/image-gen-ts
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables. Create a `.env` file in this directory or the project root with:

   ```env
   OPENROUTER_API_KEY=your_api_key_here
   OPENROUTER_IMAGE_MODEL=google/gemini-3-pro-image-preview
   ```

   > **Note:** A `.env` symlink may already exist pointing to the project root's `.env` file.

## Usage

### Using the Shell Script (Recommended)

The shell script provides a convenient wrapper for the TypeScript tool:

```bash
./image-gen.sh <prompt-file> [output-path] [options]
```

### Arguments

| Argument        | Required | Description                                                |
| --------------- | -------- | ---------------------------------------------------------- |
| `<prompt-file>` | Yes      | Path to a text file containing the image generation prompt |
| `[output-path]` | No       | Output path for the generated image (default: `out.png`)   |

### Options

| Option                       | Description                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------------- |
| `-m, --model <model>`        | OpenRouter model ID (default: from env or `google/gemini-2.5-flash-image-preview`) |
| `-a, --aspect-ratio <ratio>` | Aspect ratio: `1:1`, `16:9`, `9:16`, `4:3`, `3:4`                                  |
| `-s, --image-size <size>`    | Image size: `1K`, `2K`, `4K` (Gemini models only)                                  |

## Examples

### Basic Usage

1. Create a prompt file:

   ```bash
   echo "A beautiful sunset over the ocean with sailing boats" > prompt.txt
   ```

2. Generate an image:
   ```bash
   ./image-gen.sh prompt.txt sunset.png
   ```

### With Options

Generate a widescreen image:

```bash
./image-gen.sh prompt.txt output.png --aspect-ratio 16:9
```

Use a specific model:

```bash
./image-gen.sh prompt.txt output.png -m google/gemini-2.5-flash-image-preview
```

Combine multiple options:

```bash
./image-gen.sh prompt.txt output.png --aspect-ratio 16:9 --image-size 2K
```

### Using TypeScript Directly

You can also run the TypeScript file directly with `tsx`:

```bash
npx tsx image-gen.ts prompt.txt output.png
```

Or use the npm script:

```bash
npm start -- prompt.txt output.png
```

## Prompt Tips

For best results:

- Be descriptive and specific about what you want
- Include style references (e.g., "in the style of oil painting")
- Specify lighting, mood, and atmosphere
- Mention colors and composition details

**Example prompt:**

```
A majestic pirate ship sailing on the high seas under a full moon,
in the style of classic oil paintings. The ship has tattered sails
and a skull flag. Dramatic lighting with moonbeams reflecting on
the dark ocean waves.
```

## Supported Models

The tool works with OpenRouter's image generation models. Some recommended models:

- `google/gemini-3-pro-image-preview` - High quality, supports aspect ratios and sizes
- `google/gemini-2.5-flash-image-preview` - Faster generation

Check [OpenRouter's model list](https://openrouter.ai/models) for all available image generation models.

## Troubleshooting

### "OPENROUTER_API_KEY is not set"

Make sure your `.env` file exists and contains a valid API key.

### "Failed to read prompt file"

Check that the prompt file path is correct and the file exists.

### No image in response

- Verify your API key is valid and has credits
- Check that the model supports image generation
- Try a different prompt

### Permission denied when running the script

Make the script executable:

```bash
chmod +x image-gen.sh
```

## File Structure

```
image-gen-ts/
├── image-gen.sh      # Shell script wrapper
├── image-gen.ts      # Main TypeScript implementation
├── package.json      # Node.js dependencies
├── tsconfig.json     # TypeScript configuration
├── .env             # Environment variables (symlink or local)
├── prompt.txt       # Example prompt file
└── README.md        # This file
```

## License

ISC
