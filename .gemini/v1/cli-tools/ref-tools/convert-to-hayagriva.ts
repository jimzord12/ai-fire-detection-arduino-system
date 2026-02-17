#!/usr/bin/env tsx
/**
 * APA 7th Edition to Hayagriva YAML Converter
 *
 * Converts markdown references in APA 7th edition format to Hayagriva YAML
 * format for use with Typst bibliography system.
 *
 * @see https://github.com/typst/hayagriva for Hayagriva format documentation
 */

import { program } from 'commander';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'url';

// ============================================================================
// Types
// ============================================================================

interface HayagrivaEntry {
  type: string;
  title: string;
  author?: string | string[];
  date?: string;
  url?: string;
  'serial-number'?: { doi?: string; isbn?: string; arxiv?: string };
  parent?: {
    type?: string;
    title?: string;
    volume?: string | number;
    issue?: string | number;
    publisher?: string;
    location?: string;
  };
  'page-range'?: string;
  edition?: string | number;
  publisher?: string;
  organization?: string;
  genre?: string;
}

interface ParsedReference {
  originalText: string;
  authors: string[];
  year: string;
  month?: string;
  day?: string;
  noDate?: boolean; // True when "n.d." was explicitly specified
  title: string;
  containerTitle?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  publisher?: string;
  edition?: string;
  type: 'article' | 'book' | 'web' | 'thesis' | 'report' | 'conference' | 'misc';
}

interface ConversionResult {
  key: string;
  entry: HayagrivaEntry;
  original: string;
  warnings: string[];
}

interface ConversionReport {
  total: number;
  successful: number;
  warnings: number;
  errors: number;
  entries: ConversionResult[];
  errorMessages: string[];
}

// ============================================================================
// Parser Functions
// ============================================================================

/**
 * Generate a citation key from author names and year
 */
function generateCitationKey(authors: string[], year: string, existingKeys: Set<string>): string {
  // Get first author's last name
  let baseKey = '';

  if (authors.length > 0) {
    const firstAuthor = authors[0];
    // Extract last name (before first comma or the whole string if no comma)
    const lastName = firstAuthor.split(',')[0].trim();
    // Clean the last name: remove special chars, normalize
    baseKey = lastName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9]/g, ''); // Keep only alphanumeric
  } else {
    baseKey = 'anon';
  }

  // Add year
  const cleanYear = year.replace(/[^0-9]/g, '').slice(0, 4) || 'nd';
  let key = `${baseKey}${cleanYear}`;

  // Handle duplicates by adding suffix
  if (existingKeys.has(key)) {
    const suffixes = 'abcdefghijklmnopqrstuvwxyz';
    for (const suffix of suffixes) {
      const newKey = `${key}${suffix}`;
      if (!existingKeys.has(newKey)) {
        key = newKey;
        break;
      }
    }
  }

  existingKeys.add(key);
  return key;
}

/**
 * Parse author string from APA format
 * Handles: "Smith, J.", "Smith, J., & Jones, B.", "Smith, J., Jones, B., & Williams, C."
 */
function parseAuthors(authorStr: string): string[] {
  if (!authorStr) return [];

  // Split by '&' first, then by ', ' for multiple authors
  const authors: string[] = [];

  // Handle "et al." cases
  if (authorStr.includes('et al.')) {
    const mainAuthor = authorStr.split('et al.')[0].trim().replace(/,\s*$/, '');
    return [mainAuthor];
  }

  // Split by ' & ' or ', &' for the last author
  const parts = authorStr.split(/\s*&\s*/);

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();

    if (i === parts.length - 1) {
      // Last part (after &) - single author
      if (part) authors.push(part);
    } else {
      // Before & - might contain multiple comma-separated authors
      // Pattern: "Last, F., Last2, F2." - we need to identify each author
      const subAuthors = splitMultipleAuthors(part);
      authors.push(...subAuthors);
    }
  }

  return authors.filter(a => a.length > 0);
}

/**
 * Split a string containing multiple comma-separated APA authors
 */
function splitMultipleAuthors(str: string): string[] {
  const authors: string[] = [];
  // Match pattern: "LastName, Initial(s)." or "LastName, Initial(s),"
  const authorPattern =
    /([A-ZÀ-ÖØ-ß][A-Za-zÀ-ÖØ-öø-ÿ\-'\s]+),\s*([A-ZÀ-ÖØ-ß]\.(?:\s*[A-ZÀ-ÖØ-ß]\.)*)/g;

  let match;
  while ((match = authorPattern.exec(str)) !== null) {
    authors.push(`${match[1]}, ${match[2]}`);
  }

  // If pattern matching failed, treat the whole string as one author
  if (authors.length === 0 && str.trim()) {
    authors.push(str.trim());
  }

  return authors;
}

/**
 * Parse date from APA format
 * Handles: "(2023)", "(2023, May 15)", "(n.d.)", "(2023a)"
 */
function parseDate(dateStr: string): {
  year: string;
  month?: string;
  day?: string;
  noDate?: boolean;
} {
  const result: { year: string; month?: string; day?: string; noDate?: boolean } = { year: '' };

  // Remove parentheses
  const clean = dateStr.replace(/[()]/g, '').trim();

  // Handle "n.d." (no date)
  if (clean.toLowerCase() === 'n.d.') {
    return { year: '', noDate: true };
  }

  // Match year with optional letter suffix (e.g., 2023a, 2023b)
  const yearMatch = clean.match(/(\d{4})[a-z]?/);
  if (yearMatch) {
    result.year = yearMatch[1];
  }

  // Match month and day (e.g., "May 15", "September")
  const monthDayMatch = clean.match(
    /,\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s*(\d{1,2})?/i
  );
  if (monthDayMatch) {
    result.month = monthDayMatch[1];
    if (monthDayMatch[2]) {
      result.day = monthDayMatch[2];
    }
  }

  return result;
}

/**
 * Format date for Hayagriva (YYYY-MM-DD or YYYY-MM or YYYY)
 */
function formatHayagrivaDate(date: {
  year: string;
  month?: string;
  day?: string;
}): string | undefined {
  if (!date.year) return undefined;

  const monthMap: Record<string, string> = {
    january: '01',
    february: '02',
    march: '03',
    april: '04',
    may: '05',
    june: '06',
    july: '07',
    august: '08',
    september: '09',
    october: '10',
    november: '11',
    december: '12',
  };

  let result = date.year;

  if (date.month) {
    const monthNum = monthMap[date.month.toLowerCase()];
    if (monthNum) {
      result += `-${monthNum}`;
      if (date.day) {
        result += `-${date.day.padStart(2, '0')}`;
      }
    }
  }

  return result;
}

/**
 * Extract DOI from URL or text
 */
function extractDoi(text: string): string | undefined {
  const doiPattern = /10\.\d{4,}\/[^\s)]+/;
  const match = text.match(doiPattern);
  return match ? match[0].replace(/[.,;]+$/, '') : undefined;
}

/**
 * Extract URL from text
 */
function extractUrl(text: string): string | undefined {
  const urlPattern = /https?:\/\/[^\s)]+/;
  const match = text.match(urlPattern);
  return match ? match[0].replace(/[.,;]+$/, '') : undefined;
}

/**
 * Detect entry type from reference text
 */
function detectEntryType(
  text: string
): 'article' | 'book' | 'web' | 'thesis' | 'report' | 'conference' | 'misc' {
  const lowerText = text.toLowerCase();

  // Thesis indicators
  if (
    lowerText.includes('thesis') ||
    lowerText.includes('dissertation') ||
    lowerText.includes("master's") ||
    lowerText.includes('doctoral')
  ) {
    return 'thesis';
  }

  // Conference indicators
  if (
    lowerText.includes('conference') ||
    lowerText.includes('proceedings') ||
    lowerText.includes('symposium') ||
    lowerText.includes('workshop')
  ) {
    return 'conference';
  }

  // Report indicators
  if (
    lowerText.includes('report') ||
    lowerText.includes('technical') ||
    lowerText.includes('white paper') ||
    lowerText.includes('working paper')
  ) {
    return 'report';
  }

  // Book indicators (before article check)
  if (
    (lowerText.includes('(ed.)') ||
      lowerText.includes('(eds.)') ||
      lowerText.includes('edition') ||
      lowerText.match(/\.\s*[A-Za-z\s]+\s+Press/) ||
      lowerText.includes('wiley') ||
      lowerText.includes('springer') ||
      lowerText.includes('elsevier') ||
      lowerText.includes('cambridge university press') ||
      lowerText.includes('oxford university press')) &&
    !lowerText.match(/,\s*\d+\s*\(\d+\)/) // No volume(issue) pattern
  ) {
    return 'book';
  }

  // Article indicators (journal patterns)
  if (
    text.match(/,\s*\d+\s*\(\d+\)/) || // Volume(issue) pattern
    text.match(/,\s*\d+\s*,\s*\d+[-–]\d+/) || // Volume, pages pattern
    lowerText.includes('journal')
  ) {
    return 'article';
  }

  // Web indicators
  if (
    (lowerText.includes('retrieved') ||
      lowerText.includes('http') ||
      lowerText.includes('www.') ||
      lowerText.includes('online')) &&
    !text.match(/doi\.org/)
  ) {
    return 'web';
  }

  // Default to misc
  return 'misc';
}

/**
 * Parse a single APA reference line
 */
function parseReference(line: string): ParsedReference | null {
  const original = line.trim();

  // Remove leading "- " from markdown list
  const text = original.replace(/^-\s*/, '');

  if (!text || text.startsWith('#') || text.startsWith('>')) {
    return null;
  }

  const warnings: string[] = [];

  // APA role designations that appear in parentheses before the date
  // e.g., (Ed.), (Eds.), (Trans.), (Dir.), (Narrator), (Host), etc.
  const roleDesignations =
    /\((Eds?|Trans|Dir|Narrator|Host|Producer|Writer|Compiler|Illustrator)\.?\)/gi;

  // Pattern to match APA format with optional role designation:
  // Authors (Role). (Year). Title. Rest...  OR  Authors. (Year). Title. Rest...
  // We need to find the date parentheses which contains a year (4 digits) or "n.d."
  const dateParenPattern = /\((\d{4}[a-z]?(?:,\s*[A-Za-z]+(?:\s+\d{1,2})?)?|n\.d\.)\)\.\s*/i;
  const dateMatch = text.match(dateParenPattern);

  if (!dateMatch) {
    return null;
  }

  // Find where the date parentheses starts
  const dateStartIndex = text.indexOf(dateMatch[0]);
  const beforeDate = text.slice(0, dateStartIndex).trim();
  const datePart = dateMatch[1];
  const rest = text.slice(dateStartIndex + dateMatch[0].length);

  // Extract author part by removing trailing role designation and period
  // e.g., "Karakostas, B., & Katsoulakos, T. (Eds.)." -> "Karakostas, B., & Katsoulakos, T."
  let authorPart = beforeDate.replace(/\.\s*$/, ''); // Remove trailing period
  authorPart = authorPart.replace(roleDesignations, '').trim(); // Remove role designation
  authorPart = authorPart.replace(/\.\s*$/, ''); // Remove any remaining trailing period

  const authors = parseAuthors(authorPart);
  const date = parseDate(`(${datePart})`);

  // Extract title (usually in italics _Title_ or before the journal/publisher)
  let title = '';
  let containerTitle = '';
  let volume = '';
  let issue = '';
  let pages = '';
  let publisher = '';
  let edition = '';

  // Check for italicized title first
  const italicTitleMatch = rest.match(/^_([^_]+)_\.?\s*/);

  if (italicTitleMatch) {
    title = italicTitleMatch[1].trim();
    const afterTitle = rest.slice(italicTitleMatch[0].length);

    // Parse container/journal info
    const containerMatch = afterTitle.match(/^([^.]+)\.\s*/);
    if (containerMatch) {
      // Could be publisher or just the URL
      const potentialContainer = containerMatch[1];
      if (!potentialContainer.startsWith('http')) {
        publisher = potentialContainer.trim();
      }
    }
  } else {
    // Title is not italicized - look for journal in italics
    const journalPattern = /^([^_]+?)\.\s*_([^_]+)_/;
    const journalMatch = rest.match(journalPattern);

    if (journalMatch) {
      title = journalMatch[1].trim();
      containerTitle = journalMatch[2].trim();

      // Extract volume, issue, pages
      const afterJournal = rest.slice(journalMatch[0].length);
      const volIssueMatch = afterJournal.match(/,?\s*(\d+)\s*\((\d+)\)/);
      if (volIssueMatch) {
        volume = volIssueMatch[1];
        issue = volIssueMatch[2];
      } else {
        const volMatch = afterJournal.match(/,?\s*(\d+)/);
        if (volMatch) {
          volume = volMatch[1];
        }
      }

      const pagesMatch = afterJournal.match(/,?\s*(\d+[-–]\d+)/);
      if (pagesMatch) {
        pages = pagesMatch[1].replace('–', '-');
      }
    } else {
      // No journal pattern - title might end at period
      const simpleTitleMatch = rest.match(/^([^.]+)\./);
      if (simpleTitleMatch) {
        title = simpleTitleMatch[1].trim();
      } else {
        title = rest.split(/\s+https?:\/\//)[0].trim();
      }
    }
  }

  // Extract DOI and URL
  const doi = extractDoi(text);
  const url = extractUrl(text);

  // Detect entry type
  const type = detectEntryType(text);

  // Extract edition if present
  const editionMatch = text.match(/\((\d+)(?:st|nd|rd|th)?\s+ed\.?\)/i);
  if (editionMatch) {
    edition = editionMatch[1];
  }

  return {
    originalText: original,
    authors,
    year: date.year,
    month: date.month,
    day: date.day,
    noDate: date.noDate,
    title,
    containerTitle,
    volume,
    issue,
    pages,
    doi,
    url,
    publisher,
    edition,
    type,
  };
}

/**
 * Convert a parsed reference to Hayagriva format
 */
function toHayagriva(ref: ParsedReference, existingKeys: Set<string>): ConversionResult {
  const warnings: string[] = [];

  // Generate citation key
  const key = generateCitationKey(ref.authors, ref.year, existingKeys);

  // Map type to Hayagriva type
  const typeMap: Record<string, string> = {
    article: 'Article',
    book: 'Book',
    web: 'Web',
    thesis: 'Thesis',
    report: 'Report',
    conference: 'Article', // Conference papers are usually treated as articles
    misc: 'Misc',
  };

  const entry: HayagrivaEntry = {
    type: typeMap[ref.type] || 'Misc',
    title: ref.title,
  };

  // Add authors
  if (ref.authors.length > 0) {
    entry.author = ref.authors.length === 1 ? ref.authors[0] : ref.authors;
  } else {
    warnings.push('No authors detected');
  }

  // Add date
  const dateStr = formatHayagrivaDate({ year: ref.year, month: ref.month, day: ref.day });
  if (dateStr) {
    entry.date = dateStr;
  } else if (!ref.noDate) {
    // Only warn if n.d. was NOT explicitly specified
    warnings.push('No date detected');
  }
  // Note: When ref.noDate is true, we intentionally omit the date field (APA "n.d." = no date)

  // Add URL
  if (ref.url) {
    entry.url = ref.url;
  }

  // Add DOI
  if (ref.doi) {
    entry['serial-number'] = { doi: ref.doi };
  }

  // Add parent (container) info for articles
  if (ref.containerTitle || ref.volume || ref.issue) {
    entry.parent = {};

    if (ref.containerTitle) {
      entry.parent.title = ref.containerTitle;
      if (ref.type === 'article' || ref.type === 'conference') {
        entry.parent.type = 'Periodical';
      }
    }

    if (ref.volume) {
      entry.parent.volume = ref.volume;
    }

    if (ref.issue) {
      entry.parent.issue = ref.issue;
    }
  }

  // Add publisher (separate from parent)
  if (ref.publisher) {
    entry.publisher = ref.publisher;
  }

  // Add page range
  if (ref.pages) {
    entry['page-range'] = ref.pages;
  }

  // Add edition
  if (ref.edition) {
    entry.edition = parseInt(ref.edition) || ref.edition;
  }

  // Validation warnings
  if (!ref.title) {
    warnings.push('No title detected');
  }

  return {
    key,
    entry,
    original: ref.originalText,
    warnings,
  };
}

// ============================================================================
// YAML Serialization
// ============================================================================

/**
 * Serialize a value to YAML with proper formatting
 */
function serializeValue(value: unknown, indent: number): string {
  const spaces = '  '.repeat(indent);

  if (typeof value === 'string') {
    // Check if string needs quoting
    if (
      value.includes(':') ||
      value.includes('#') ||
      value.includes("'") ||
      value.includes('"') ||
      value.includes('\n') ||
      value.startsWith(' ') ||
      value.endsWith(' ') ||
      /^[\[\]{}>|*&!%@`]/.test(value)
    ) {
      // Use double quotes and escape internal quotes
      const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      return `"${escaped}"`;
    }
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return value.map(v => `\n${spaces}- ${serializeValue(v, indent + 1)}`).join('');
  }

  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    return entries.map(([k, v]) => `\n${spaces}${k}: ${serializeValue(v, indent + 1)}`).join('');
  }

  return String(value);
}

/**
 * Convert entries to YAML string
 */
function toYamlString(entries: ConversionResult[]): string {
  const lines: string[] = [
    '# Hayagriva Bibliography',
    '# Generated from APA 7th Edition references',
    `# Date: ${new Date().toISOString().split('T')[0]}`,
    `# Total entries: ${entries.length}`,
    '',
  ];

  for (const { key, entry } of entries) {
    lines.push(`${key}:`);

    // Order fields for readability
    const fieldOrder = [
      'type',
      'title',
      'author',
      'date',
      'parent',
      'page-range',
      'edition',
      'publisher',
      'organization',
      'genre',
      'serial-number',
      'url',
    ];

    const entryObj = entry as Record<string, any>;

    for (const field of fieldOrder) {
      if (field in entryObj && entryObj[field] !== undefined) {
        const value = entryObj[field];
        lines.push(`  ${field}: ${serializeValue(value, 2)}`);
      }
    }

    lines.push('');
  }

  return lines.join('\n');
}

// ============================================================================
// Main Conversion Logic
// ============================================================================

/**
 * Parse markdown file and extract references
 */
function parseMarkdownReferences(content: string): string[] {
  const lines = content.split('\n');
  const references: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Match lines starting with "- " that look like references
    if (trimmed.startsWith('- ') && trimmed.length > 10) {
      // Skip metadata lines
      if (
        trimmed.includes('**Total References**') ||
        trimmed.includes('**Source Files**') ||
        trimmed.includes('**Generated**') ||
        trimmed.includes('**Duplicates')
      ) {
        continue;
      }
      references.push(trimmed);
    }
  }

  return references;
}

/**
 * Convert references file to Hayagriva YAML
 */
function convertReferences(inputPath: string): ConversionReport {
  const content = fs.readFileSync(inputPath, 'utf-8');
  const referenceLines = parseMarkdownReferences(content);

  const report: ConversionReport = {
    total: referenceLines.length,
    successful: 0,
    warnings: 0,
    errors: 0,
    entries: [],
    errorMessages: [],
  };

  const existingKeys = new Set<string>();

  for (const line of referenceLines) {
    try {
      const parsed = parseReference(line);

      if (!parsed) {
        report.errors++;
        report.errorMessages.push(`Failed to parse: ${line.slice(0, 80)}...`);
        continue;
      }

      const result = toHayagriva(parsed, existingKeys);
      report.entries.push(result);

      if (result.warnings.length > 0) {
        report.warnings++;
      } else {
        report.successful++;
      }
    } catch (error) {
      report.errors++;
      report.errorMessages.push(`Error processing: ${line.slice(0, 80)}... - ${error}`);
    }
  }

  return report;
}

// ============================================================================
// CLI Interface
// ============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .name('convert-to-hayagriva')
  .description('Convert APA 7th Edition references to Hayagriva YAML format for Typst')
  .version('1.0.0')
  .argument('<input>', 'Input markdown file with APA references')
  .option('-o, --output <file>', 'Output YAML file', 'references.yaml')
  .option('-r, --report', 'Generate a conversion report', false)
  .option('-v, --verbose', 'Show verbose output', false)
  .action((input: string, options: { output: string; report: boolean; verbose: boolean }) => {
    const inputPath = path.resolve(input);

    if (!fs.existsSync(inputPath)) {
      console.error(`❌ Error: Input file not found: ${inputPath}`);
      process.exit(1);
    }

    console.log(`📚 Converting references from: ${inputPath}`);

    const report = convertReferences(inputPath);

    // Write YAML output
    const outputPath = path.resolve(options.output);
    const yamlContent = toYamlString(report.entries);
    fs.writeFileSync(outputPath, yamlContent, 'utf-8');
    console.log(`✅ YAML written to: ${outputPath}`);

    // Print summary
    console.log('\n📊 Conversion Summary:');
    console.log(`   Total references: ${report.total}`);
    console.log(`   ✅ Successful: ${report.successful}`);
    console.log(`   ⚠️  With warnings: ${report.warnings}`);
    console.log(`   ❌ Errors: ${report.errors}`);

    // Generate report if requested
    if (options.report) {
      const reportPath = outputPath.replace(/\.ya?ml$/, '-report.md');
      const reportContent = generateReport(report);
      fs.writeFileSync(reportPath, reportContent, 'utf-8');
      console.log(`📝 Report written to: ${reportPath}`);
    }

    // Show verbose output
    if (options.verbose && report.errorMessages.length > 0) {
      console.log('\n❌ Error details:');
      for (const msg of report.errorMessages) {
        console.log(`   - ${msg}`);
      }
    }

    if (options.verbose && report.warnings > 0) {
      console.log('\n⚠️  Entries with warnings:');
      for (const entry of report.entries) {
        if (entry.warnings.length > 0) {
          console.log(`   - ${entry.key}: ${entry.warnings.join(', ')}`);
        }
      }
    }
  });

/**
 * Generate markdown report
 */
function generateReport(report: ConversionReport): string {
  const lines: string[] = [
    '# Hayagriva Conversion Report',
    '',
    `**Generated**: ${new Date().toISOString()}`,
    '',
    '## Summary',
    '',
    `| Metric | Count |`,
    `|--------|-------|`,
    `| Total references | ${report.total} |`,
    `| Successful | ${report.successful} |`,
    `| With warnings | ${report.warnings} |`,
    `| Errors | ${report.errors} |`,
    '',
  ];

  if (report.errorMessages.length > 0) {
    lines.push('## Errors', '');
    for (const msg of report.errorMessages) {
      lines.push(`- ${msg}`);
    }
    lines.push('');
  }

  const entriesWithWarnings = report.entries.filter(e => e.warnings.length > 0);
  if (entriesWithWarnings.length > 0) {
    lines.push('## Entries with Warnings', '');
    for (const entry of entriesWithWarnings) {
      lines.push(`### \`${entry.key}\``);
      lines.push('');
      lines.push(`**Original**: ${entry.original}`);
      lines.push('');
      lines.push('**Warnings**:');
      for (const warning of entry.warnings) {
        lines.push(`- ${warning}`);
      }
      lines.push('');
    }
  }

  lines.push('## All Entries', '');
  lines.push('| Key | Type | Title | Warnings |');
  lines.push('|-----|------|-------|----------|');

  for (const entry of report.entries) {
    const titleShort =
      entry.entry.title.slice(0, 50) + (entry.entry.title.length > 50 ? '...' : '');
    const warnings = entry.warnings.length > 0 ? `⚠️ ${entry.warnings.length}` : '✅';
    lines.push(`| \`${entry.key}\` | ${entry.entry.type} | ${titleShort} | ${warnings} |`);
  }

  return lines.join('\n');
}

program.parse();
