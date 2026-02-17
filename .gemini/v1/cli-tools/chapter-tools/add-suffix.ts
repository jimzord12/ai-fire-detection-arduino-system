#!/usr/bin/env tsx
// concat-md.ts
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

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
  .name('add-suffix')
  .description(
    'Add a suffix to markdown files following <document-name>-<suffix>.md into one file.'
  )
  .argument('<filepaths...>', 'Paths to the markdown files or directories to add the suffix to')
  .option(
    '-s, --suffix <suffix>',
    'Suffix (last "-" segment before .md, default: Humanized)',
    'Humanized'
  )
  .option('-o, --out-file <file>', 'Output markdown file (default: <document-name>.md in inputDir)')
  .option('--all', 'Process all markdown files if a directory is provided')
  .option('--dry-run', 'Print planned order and output path without writing the file')
  .action((filepaths: string[], opts) => {
    const suffix: string = opts.suffix;
    const filesToProcess: string[] = [];

    filepaths.forEach(filepath => {
      const fp = path.resolve(process.cwd(), filepath);

      if (!fs.existsSync(fp)) {
        console.error(
          `${colors.red}${icons.error} Path does not exist: ${colors.reset}${filepath}`
        );
        return;
      }

      const stats = fs.statSync(fp);
      if (stats.isDirectory()) {
        if (opts.all) {
          const files = fs
            .readdirSync(fp)
            .filter(f => f.endsWith('.md'))
            .map(f => path.join(fp, f));
          filesToProcess.push(...files);
        } else {
          console.error(
            `${colors.yellow}${icons.warning} ${colors.bright}${filepath}${colors.reset}${colors.yellow} is a directory. Use ${colors.cyan}--all${colors.reset}${colors.yellow} to process all files in it.${colors.reset}`
          );
        }
      } else if (stats.isFile()) {
        filesToProcess.push(fp);
      }
    });

    if (opts.outFile && filesToProcess.length > 1) {
      console.error(
        `${colors.red}${icons.error} Error: ${colors.cyan}--out-file${colors.reset}${colors.red} cannot be used with multiple input files.${colors.reset}`
      );
      process.exit(1);
    }

    if (filesToProcess.length === 0) {
      console.log(
        `${colors.yellow}${icons.info} No markdown files found to process.${colors.reset}`
      );
      return;
    }

    console.log(
      `${colors.cyan}${icons.info} Processing ${colors.bright}${filesToProcess.length}${colors.reset}${colors.cyan} file(s)...${colors.reset}\n`
    );

    filesToProcess.forEach(fp => {
      const fileName = path.basename(fp);
      const dest = opts.outFile || fp.replace(/\.md$/, `-${suffix}.md`);
      const destName = path.basename(dest);

      if (opts.dryRun) {
        console.log(
          `${colors.gray}${icons.dryRun} [DRY RUN] Would rename ${colors.reset}${colors.bright}${fileName}${colors.reset}${colors.gray} to ${colors.reset}${colors.green}${destName}${colors.reset}`
        );
      } else {
        try {
          fs.renameSync(fp, dest);
          console.log(
            `${colors.green}${icons.success} Renamed ${colors.reset}${colors.bright}${fileName}${colors.reset}${colors.gray} → ${colors.reset}${colors.green}${destName}${colors.reset}`
          );
        } catch (err) {
          console.error(
            `${colors.red}${icons.error} Failed to rename ${colors.bright}${fileName}${
              colors.reset
            }${colors.red}: ${err instanceof Error ? err.message : String(err)}${colors.reset}`
          );
        }
      }
    });

    console.log(`\n${colors.green}${colors.bright}${icons.success} Done!${colors.reset}`);
  });

program.parse(process.argv);

