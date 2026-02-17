#!/usr/bin/env tsx

// split-md.ts
import { Command } from 'commander';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';

const program = new Command();

program
  .name('split-md')
  .description('Split a markdown file into ~N-char chunks without splitting H2 sections.')
  .argument('<input>', 'Input markdown file')
  .option('-m, --max-chars <number>', 'Maximum characters per chunk', '20000')
  .option('-o, --out-dir <dir>', 'Output directory (default: <input>.parts)')
  .option('-p, --prefix <prefix>', 'Output filename prefix (default: input base name)')
  .option('--dry-run', 'Do not write files, just print planned chunks')
  .action(async (input, opts) => {
    const maxChars = parseInt(opts.maxChars, 10);
    if (Number.isNaN(maxChars) || maxChars <= 0) {
      console.error(`Invalid --max-chars value: ${opts.maxChars}`);
      process.exit(1);
    }

    const inputPath = path.resolve(process.cwd(), input);
    if (!fs.existsSync(inputPath) || !fs.statSync(inputPath).isFile()) {
      console.error(`Input file does not exist or is not a file: ${inputPath}`);
      process.exit(1);
    }

    const inputDir = path.dirname(inputPath);
    const baseName = path.basename(inputPath, path.extname(inputPath));
    const outDir: string = opts.outDir
      ? path.resolve(process.cwd(), opts.outDir)
      : path.join(inputDir, `${baseName}.parts`);
    const prefix: string = opts.prefix ?? baseName;

    const source = fs.readFileSync(inputPath, 'utf8');

    const { preamble, sections } = splitIntoH2Sections(source);

    if (sections.length === 0) {
      // No H2 headings: treat whole file as a single chunk.
      const chunks = [source];
      await writeChunks(chunks, outDir, prefix, !!opts.dryRun);
      printSummary(chunks);
      return;
    }

    // Attach preamble (incl. H1) to first H2 section as required
    if (preamble.length > 0) {
      const firstSection = sections[0];
      if (firstSection !== undefined) {
        sections[0] = preamble + firstSection;
      }
    }

    const chunks = chunkByMaxChars(sections, maxChars);
    await writeChunks(chunks, outDir, prefix, !!opts.dryRun);
    printSummary(chunks);
  });

program.parse(process.argv);

interface SplitResult {
  preamble: string;
  sections: string[];
}

/**
 * Split markdown into: preamble (before first H2) + array of H2 sections.
 * A section starts at a line that is an H2 heading, outside of fenced code blocks.
 */
function splitIntoH2Sections(source: string): SplitResult {
  const lines = splitIntoLines(source);
  const sections: string[] = [];
  let preambleLines: string[] = [];

  let currentSectionLines: string[] | null = null;
  let inFence = false;

  const fenceRegex = /^(```|~~~)/; // start or end of fenced code block
  const h2Regex = /^##(?!#)\s+/; // exactly two hashes followed by space

  for (const line of lines) {
    const trimmed = line.trimEnd();

    if (fenceRegex.test(trimmed)) {
      inFence = !inFence;
    }

    if (!inFence && h2Regex.test(trimmed)) {
      // Starting a new H2 section
      if (currentSectionLines !== null) {
        sections.push(currentSectionLines.join(''));
      } else {
        // first H2, so everything so far is preamble
      }
      currentSectionLines = [line];
    } else {
      if (currentSectionLines === null) {
        preambleLines.push(line);
      } else {
        currentSectionLines.push(line);
      }
    }
  }

  if (currentSectionLines !== null) {
    sections.push(currentSectionLines.join(''));
  }

  const preamble = preambleLines.join('');
  return { preamble, sections };
}

/**
 * Split string into lines, preserving newline characters.
 */
function splitIntoLines(text: string): string[] {
  const result: string[] = [];
  let start = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '\n') {
      result.push(text.slice(start, i + 1)); // include newline
      start = i + 1;
    }
  }
  if (start < text.length) {
    result.push(text.slice(start));
  }

  if (result.length === 0) {
    return [''];
  }

  return result;
}

/**
 * Chunk H2 sections into contiguous groups not exceeding maxChars,
 * using JS string.length (code units) for measurement.
 * Does the “add → exceed → remove last → write → start new with last” behavior.
 */
function chunkByMaxChars(sections: string[], maxChars: number): string[] {
  const chunks: string[] = [];
  let currentSections: string[] = [];
  let currentLength = 0;

  const flushCurrent = () => {
    if (currentSections.length > 0) {
      chunks.push(currentSections.join(''));
      currentSections = [];
      currentLength = 0;
    }
  };

  for (const section of sections) {
    const sectionLen = section.length;

    if (sectionLen > maxChars && currentSections.length === 0) {
      // Single section larger than limit: emit oversized chunk alone
      chunks.push(section);
      continue;
    }

    // Tentatively add
    currentSections.push(section);
    currentLength += sectionLen;

    if (currentLength > maxChars) {
      // Remove the last one (the one we just added)
      const last = currentSections.pop()!;
      currentLength -= sectionLen;

      // Flush current (without last)
      flushCurrent();

      // Start new chunk with last section
      currentSections.push(last);
      currentLength = last.length;
    }
  }

  flushCurrent();
  return chunks;
}

async function writeChunks(
  chunks: string[],
  outDir: string,
  prefix: string,
  dryRun: boolean
): Promise<void> {
  if (dryRun) {
    console.log(`Dry run: would write ${chunks.length} chunks to ${outDir}`);
    return;
  }

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true }); // Node >=10.12.0[3][4]
  }

  for (const [i, chunk] of chunks.entries()) {
    const index = i + 1;
    const fileName = `${prefix}.part${index.toString().padStart(3, '0')}.md`;
    const filePath = path.join(outDir, fileName);
    fs.writeFileSync(filePath, chunk, 'utf8');
  }
}

function printSummary(chunks: string[]): void {
  console.log(`Created ${chunks.length} chunk(s):`);
  chunks.forEach((chunk, i) => {
    console.log(`  #${i + 1}: length=${chunk.length} chars`);
  });
}

