#!/usr/bin/env tsx
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { getHumanizedText } from './humanize.ts';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const icons = {
  success: '✔',
  error: '✖',
  info: 'ℹ',
  warning: '⚠',
  dryRun: '🔍',
};

const program = new Command();

program
  .name('batch-humanize')
  .description('Humanize all markdown files in a directory and save them to a "humanized" folder.')
  .argument('[directory]', 'Path to the directory containing markdown files', '.')
  .option('-s, --suffix <suffix>', 'Suffix for the output files', 'Humanized')
  .option('--all', 'Process all markdown files (included for compatibility)')
  .option('--dry-run', 'Print planned actions without calling the API')
  .action(async (directory: string, opts) => {
    const { suffix, dryRun } = opts;
    const dirPath = path.resolve(process.cwd(), directory);

    console.log(`${icons.info} ${colors.cyan}Scanning directory: ${dirPath}${colors.reset}`);

    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      console.error(
        `${icons.error} ${colors.red}Invalid directory path: ${directory}${colors.reset}`
      );
      process.exit(1);
    }

    const files = fs
      .readdirSync(dirPath)
      .filter(f => f.endsWith('.md') && !f.includes(`-${suffix}.md`))
      .sort();

    if (files.length === 0) {
      console.error(
        `${icons.error} ${colors.red}No markdown files found in ${directory}${colors.reset}`
      );
      process.exit(1);
    }

    const outputDir = path.join(dirPath, 'humanized');
    let outputDirCreated = false;

    for (const file of files) {
      const inputFilePath = path.join(dirPath, file);
      const outputFileName = file.replace(/\.md$/, `-${suffix}.md`);
      const outputFilePath = path.join(outputDir, outputFileName);

      try {
        const content = fs.readFileSync(inputFilePath, 'utf-8');

        if (content.length > 20000) {
          console.error(
            `${icons.error} ${colors.red}File ${file} is too long (${content.length} chars). Max 20,000.${colors.reset}`
          );
          continue;
        }

        if (dryRun) {
          console.log(
            `${icons.dryRun} ${colors.cyan}[Dry Run] Would humanize ${file} -> humanized/${outputFileName}${colors.reset}`
          );
          continue;
        }

        console.log(`${icons.info} ${colors.cyan}Humanizing ${file}...${colors.reset}`);

        const humanizedText = await getHumanizedText(content);

        if (!outputDirCreated) {
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          outputDirCreated = true;
        }

        fs.writeFileSync(outputFilePath, humanizedText, 'utf-8');
        console.log(
          `${icons.success} ${colors.green}Saved to humanized/${outputFileName}${colors.reset}`
        );
      } catch (error) {
        console.error(
          `${icons.error} ${colors.red}Failed to process ${file}: ${(error as Error).message}${
            colors.reset
          }`
        );
      }
    }
  });

program.parse(process.argv);

