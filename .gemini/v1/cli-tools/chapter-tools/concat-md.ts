#!/usr/bin/env tsx
import * as fs from 'node:fs';
import * as path from 'node:path';
// concat-md.ts
import { Command } from 'commander';

const removeFirstExtension = (filename: string): string | null => {
  const a = filename.split('.');
  if (a.length <= 1) return null;
  console.log('Filename parts:', a);
  if (!a[0]) return null;
  return a[0];
};

const program = new Command();

program
  .name('concat-md')
  .description('Concat markdown files following <document-name>-<suffix>.md into one file.')
  .argument('<inputDir>', 'Directory containing the markdown files to concatenate')
  .option(
    '-s, --suffix <suffix>',
    'Suffix (last "-" segment before .md, default: Humanized)',
    'Humanized'
  )
  .option('-o, --out-file <file>', 'Output markdown file (default: <document-name>.md in inputDir)')
  .option('--dry-run', 'Print planned order and output path without writing the file')
  .action((inputDir, opts) => {
    const suffix: string = opts.suffix;
    const dirPath = path.resolve(process.cwd(), inputDir);

    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      console.error(`Input directory does not exist or is not a directory: ${dirPath}`);
      process.exit(1);
    }

    // Read directory and filter files matching *.md
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const mdFiles = entries
      .filter(ent => ent.isFile() && ent.name.toLowerCase().endsWith('.md'))
      .map(ent => ent.name);

    if (mdFiles.length === 0) {
      console.error(`No .md files found in directory: ${dirPath}`);
      process.exit(1);
    }

    // Filter to those that end with -<suffix>.md, based on last '-'
    const matching = mdFiles.filter(file => {
      const parsed = path.parse(file);
      const name = parsed.name; // filename without extension
      const lastDashIndex = name.lastIndexOf('-');
      if (lastDashIndex === -1) return false;
      const fileSuffix = name.slice(lastDashIndex + 1);
      return fileSuffix === suffix;
    });

    if (matching.length === 0) {
      console.error(`No .md files with suffix "${suffix}" found in directory: ${dirPath}`);
      process.exit(1);
    }

    // Sort file names lexicographically; if you want natural order, you could add a
    // custom comparator later.
    matching.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));

    // Derive document-name from first matching file: <document-name>-<suffix>.md
    const firstFile = matching[0];
    console.log('First matching file:', firstFile);
    if (!firstFile) {
      // This should not happen due to the check above, but satisfies TS
      process.exit(1);
    }
    const firstParsed = path.parse(firstFile);
    const docName = removeFirstExtension(firstParsed.name);
    if (!docName) {
      console.error(`Could not derive document name from file: ${firstFile}`);
      process.exit(1);
    }
    const outFile: string = opts.outFile ?? path.join(dirPath, `${docName}-Combined.md`);
    if (opts.dryRun) {
      console.log(`Directory: ${dirPath}`);
      console.log(`Suffix: ${suffix}`);
      console.log('Matching files in concat order:');
      for (const f of matching) {
        console.log(`  - ${f}`);
      }
      console.log(`Output file would be: ${outFile}`);
      process.exit(0);
    }

    // Concatenate files in order
    let combined = '';
    for (const file of matching) {
      const fullPath = path.join(dirPath, file);
      const content = fs.readFileSync(fullPath, 'utf8');
      combined += content;

      // Optional: ensure there is exactly one blank line between files
      if (!combined.endsWith('\n\n')) {
        if (combined.endsWith('\n')) {
          combined += '\n';
        } else {
          combined += '\n\n';
        }
      }
    }

    fs.writeFileSync(outFile, combined, 'utf8');
    console.log(`Wrote concatenated markdown to: ${outFile}`);
  });

program.parse(process.argv);

