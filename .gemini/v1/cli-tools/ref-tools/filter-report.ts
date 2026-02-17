#!/usr/bin/env npx tsx
import { program } from 'commander';
import * as fs from 'node:fs';
import * as path from 'node:path';

type Status = 'verified' | 'suspicious' | 'broken_link' | 'unverified' | 'all';

interface FilterOptions {
  status: Status;
  output?: string;
}

function filterReport(content: string, status: Status): string {
  const lines = content.split('\n');
  const filteredLines: string[] = [];

  let inSection = false;
  let currentSection: string[] = [];
  let includeSection = false;

  for (const line of lines) {
    // Check if we're at a new reference section (### 1. ✅ ...)
    if (line.match(/^### \d+\./)) {
      // Save previous section if it should be included
      if (inSection && includeSection) {
        filteredLines.push(...currentSection);
      }

      // Start new section
      inSection = true;
      currentSection = [line];

      if (status === 'all') {
        includeSection = true;
      } else if (status === 'verified') {
        includeSection = line.includes('✅');
      } else if (status === 'suspicious') {
        includeSection = line.includes('⚠️');
      } else if (status === 'broken_link') {
        includeSection = line.includes('❌');
      } else if (status === 'unverified') {
        // Include everything that is NOT verified (suspicious + broken_link)
        includeSection = !line.includes('✅');
      }
    } else if (inSection) {
      currentSection.push(line);
    } else {
      // Header content before detailed findings
      filteredLines.push(line);
    }
  }

  // Don't forget the last section
  if (inSection && includeSection) {
    filteredLines.push(...currentSection);
  }

  return filteredLines.join('\n');
}

if (
  process.argv[1] === path.resolve(import.meta.dirname!, 'filter-report.ts') ||
  process.argv[1]?.endsWith('filter-report.ts')
) {
  program
    .name('filter-report')
    .description('Filter reference validation report by status')
    .argument('<report>', 'Validation report markdown file')
    .option(
      '-s, --status <status>',
      'Filter by status: verified, suspicious, broken_link, unverified, all',
      'verified'
    )
    .option('-o, --output <file>', 'Output file (defaults to stdout)')
    .action((reportPath: string, options: FilterOptions) => {
      const baseCwd = process.env.INIT_CWD || process.cwd();
      const resolvedPath = path.isAbsolute(reportPath)
        ? reportPath
        : path.resolve(baseCwd, reportPath);

      if (!fs.existsSync(resolvedPath)) {
        console.error(`Error: File not found: ${resolvedPath}`);
        process.exit(1);
      }

      const content = fs.readFileSync(resolvedPath, 'utf-8');
      const filtered = filterReport(content, options.status as Status);

      // Update summary counts
      const verifiedCount = (filtered.match(/### \d+\. ✅/g) || []).length;
      const suspiciousCount = (filtered.match(/### \d+\. ⚠️/g) || []).length;
      const brokenCount = (filtered.match(/### \d+\. ❌/g) || []).length;
      const total = verifiedCount + suspiciousCount + brokenCount;

      let output = filtered.replace(
        /## Summary[\s\S]*?(?=## Detailed)/,
        `## Summary (Filtered: ${options.status})\n- Showing: ${total}\n- Verified: ${verifiedCount}\n- Suspicious: ${suspiciousCount}\n- Broken Links: ${brokenCount}\n\n`
      );

      if (options.output) {
        const outputPath = path.isAbsolute(options.output)
          ? options.output
          : path.resolve(baseCwd, options.output);
        fs.writeFileSync(outputPath, output);
        console.log(`Filtered report written to ${outputPath}`);
      } else {
        console.log(output);
      }
    });

  program.parse();
}

export { filterReport };
