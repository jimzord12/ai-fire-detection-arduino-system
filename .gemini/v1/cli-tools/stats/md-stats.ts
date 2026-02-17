#!/usr/bin/env tsx
/**
 * md-stats.ts
 * CLI tool to analyze markdown files and return detailed statistics
 * Supports multiple languages (English, Greek)
 */

import { program } from 'commander';
import type { Code, Heading, Image, Link, List, ListItem, Root, Table } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { toString as mdastToString } from 'mdast-util-to-string';
import { gfm } from 'micromark-extension-gfm';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import {
  type LanguageConfig,
  detectLanguage,
  getLanguageConfig,
  listSupportedLanguages,
} from './lang/index.ts';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface MarkdownStats {
  // File info
  fileName: string;
  filePath: string;
  fileSizeBytes: number;
  fileSizeKB: number;

  // Language info
  language: {
    code: string;
    name: string;
    detected: boolean; // true if auto-detected, false if specified
  };

  // Content metrics
  totalCharacters: number;
  totalCharactersNoSpaces: number;
  totalWords: number;
  totalLines: number;
  totalParagraphs: number;
  totalSentences: number;

  // Reading estimates
  readingTimeMinutes: number; // ~200 words per minute
  speakingTimeMinutes: number; // ~150 words per minute

  // Headings breakdown
  headings: {
    total: number;
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
  };

  // References/Citations
  references: {
    total: number;
    inTextCitations: number; // [Author, Year] or (Author, Year) style
    numberedCitations: number; // [1], [2], etc.
    footnotes: number; // [^1], [^note], etc.
    unique: number; // unique reference keys
    referencesOlderThan5Years: number;
    referencesOlderThan10Years: number;
    averageReferenceAge: number | null;
    oldestReference: { year: number; key: string } | null;
    newestReference: { year: number; key: string } | null;
  };

  // Links
  links: {
    total: number;
    external: number;
    internal: number;
    broken: number; // links without href
  };

  // Images
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
  };

  // Code
  code: {
    codeBlocks: number;
    inlineCode: number;
    languages: string[];
  };

  // Lists
  lists: {
    total: number;
    ordered: number;
    unordered: number;
    totalItems: number;
  };

  // Tables
  tables: {
    total: number;
    totalRows: number;
    totalCells: number;
  };

  // Blockquotes
  blockquotes: number;

  // Complexity metrics
  averageWordsPerSentence: number;
  averageWordsPerParagraph: number;
  longestParagraphWords: number;
  shortestParagraphWords: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function isMarkdownFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return ext === '.md' || ext === '.markdown';
}

async function assertReadableMarkdownFile(filePath: string): Promise<void> {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('filePath must be a non-empty string');
  }

  let st: Awaited<ReturnType<typeof fs.stat>>;
  try {
    st = await fs.stat(filePath);
  } catch {
    throw new Error(`Path does not exist: ${filePath}`);
  }

  if (!st.isFile()) throw new Error(`Not a file: ${filePath}`);
  if (!isMarkdownFile(filePath)) throw new Error(`Not a markdown file: ${filePath}`);
}

function countWords(text: string, langConfig: LanguageConfig): number {
  return text.split(langConfig.wordSplitPattern).filter(word => word.length > 0).length;
}

function countSentences(text: string, langConfig: LanguageConfig): number {
  // Count sentences by looking for sentence-ending punctuation
  const matches = text.match(langConfig.sentenceEndPattern);
  return matches ? matches.length : 0;
}

function extractYear(text: string): number | null {
  // Try to extract a 4-digit year from text (between 1900 and current year + 5)
  const currentYear = new Date().getFullYear();
  const yearMatch = text.match(/\b(19\d{2}|20\d{2})\b/);
  if (yearMatch?.[1]) {
    const year = parseInt(yearMatch[1], 10);
    if (year >= 1900 && year <= currentYear + 5) {
      return year;
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// AST Traversal
// ─────────────────────────────────────────────────────────────────────────────

interface ASTStats {
  headings: Heading[];
  links: Link[];
  images: Image[];
  codeBlocks: Code[];
  inlineCodeCount: number;
  tables: Table[];
  lists: List[];
  listItems: ListItem[];
  blockquotes: number;
  paragraphTexts: string[];
}

function traverseAST(node: Root | Root['children'][number], stats: ASTStats): void {
  if (!node) return;

  switch (node.type) {
    case 'heading':
      stats.headings.push(node as Heading);
      break;
    case 'link':
      stats.links.push(node as Link);
      break;
    case 'image':
      stats.images.push(node as Image);
      break;
    case 'code':
      stats.codeBlocks.push(node as Code);
      break;
    case 'inlineCode':
      stats.inlineCodeCount++;
      break;
    case 'table':
      stats.tables.push(node as Table);
      break;
    case 'list':
      stats.lists.push(node as List);
      break;
    case 'listItem':
      stats.listItems.push(node as ListItem);
      break;
    case 'blockquote':
      stats.blockquotes++;
      break;
    case 'paragraph':
      stats.paragraphTexts.push(mdastToString(node));
      break;
  }

  // Recurse into children
  if ('children' in node && Array.isArray(node.children)) {
    for (const child of node.children) {
      traverseAST(child as Root['children'][number], stats);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Reference Analysis
// ─────────────────────────────────────────────────────────────────────────────

interface ReferenceInfo {
  key: string;
  year: number | null;
  type: 'author-year' | 'numbered' | 'footnote';
}

function extractReferences(content: string, langConfig: LanguageConfig): ReferenceInfo[] {
  const references: ReferenceInfo[] = [];
  const seen = new Set<string>();

  // Step 1: Find all citation blocks (parenthetical or bracketed citations with years)
  const citationBlockPattern = new RegExp(langConfig.citationBlockPattern.source, 'g');
  let blockMatch;

  while ((blockMatch = citationBlockPattern.exec(content)) !== null) {
    const blockContent = blockMatch[1] || '';

    // Step 2: Extract individual citations from within the block
    // This handles: (Lin et al., 2010; Xylouris et al., 2024)
    const individualPattern = new RegExp(langConfig.individualCitationPattern.source, 'g');
    let citationMatch;

    while ((citationMatch = individualPattern.exec(blockContent)) !== null) {
      const author = (citationMatch[1] || '').trim();
      const year = citationMatch[2] || '';
      const key = `${author}, ${year}`;

      if (!seen.has(key) && author && year) {
        seen.add(key);
        references.push({
          key,
          year: extractYear(year),
          type: 'author-year',
        });
      }
    }
  }

  // Also look for inline citations like "βάσει των Lin et al., 2010" (based on Lin et al., 2010)
  // These aren't in parentheses but still count as citations
  const inlinePattern = new RegExp(langConfig.individualCitationPattern.source, 'g');
  let inlineMatch;
  while ((inlineMatch = inlinePattern.exec(content)) !== null) {
    const author = (inlineMatch[1] || '').trim();
    const year = inlineMatch[2] || '';
    const key = `${author}, ${year}`;

    if (!seen.has(key) && author && year) {
      seen.add(key);
      references.push({
        key,
        year: extractYear(year),
        type: 'author-year',
      });
    }
  }

  // Numbered citations using language-specific pattern
  const numberedPattern = new RegExp(langConfig.numberedCitationPattern.source, 'g');
  let match;
  while ((match = numberedPattern.exec(content)) !== null) {
    const key = match[1] || '';
    // Don't count if it looks like a footnote reference we already counted
    if (!seen.has(key) && key) {
      seen.add(key);
      references.push({
        key,
        year: null,
        type: 'numbered',
      });
    }
  }

  // Footnotes using language-specific pattern
  const footnotePattern = new RegExp(langConfig.footnoteCitationPattern.source, 'g');
  while ((match = footnotePattern.exec(content)) !== null) {
    const key = `^${match[1]}`;
    if (!seen.has(key)) {
      seen.add(key);
      references.push({
        key,
        year: null,
        type: 'footnote',
      });
    }
  }

  return references;
}

function analyzeReferenceAges(references: ReferenceInfo[]): {
  olderThan5Years: number;
  olderThan10Years: number;
  averageAge: number | null;
  oldest: { year: number; key: string } | null;
  newest: { year: number; key: string } | null;
} {
  const currentYear = new Date().getFullYear();
  const refsWithYears = references.filter(r => r.year !== null);

  if (refsWithYears.length === 0) {
    return {
      olderThan5Years: 0,
      olderThan10Years: 0,
      averageAge: null,
      oldest: null,
      newest: null,
    };
  }

  let olderThan5 = 0;
  let olderThan10 = 0;
  let totalAge = 0;
  let oldest: { year: number; key: string } | null = null;
  let newest: { year: number; key: string } | null = null;

  for (const ref of refsWithYears) {
    const year = ref.year!;
    const age = currentYear - year;
    totalAge += age;

    if (age > 5) olderThan5++;
    if (age > 10) olderThan10++;

    if (!oldest || year < oldest.year) {
      oldest = { year, key: ref.key };
    }
    if (!newest || year > newest.year) {
      newest = { year, key: ref.key };
    }
  }

  return {
    olderThan5Years: olderThan5,
    olderThan10Years: olderThan10,
    averageAge: Math.round((totalAge / refsWithYears.length) * 10) / 10,
    oldest,
    newest,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Analysis Function
// ─────────────────────────────────────────────────────────────────────────────

export interface AnalyzeOptions {
  /** Language code (e.g., 'en', 'gr'). If not provided, auto-detects. */
  language?: string;
}

export async function analyzeMarkdown(
  filePath: string,
  options: AnalyzeOptions = {}
): Promise<MarkdownStats> {
  await assertReadableMarkdownFile(filePath);

  const absolutePath = path.resolve(filePath);
  const content = await fs.readFile(absolutePath, 'utf8');
  const fileStats = await fs.stat(absolutePath);

  // Parse markdown with GFM support for tables, strikethrough, etc.
  const root = fromMarkdown(content, {
    extensions: [gfm()],
    mdastExtensions: [gfmFromMarkdown()],
  }) as Root;
  const plainText = mdastToString(root);

  // Determine language configuration
  let langConfig: LanguageConfig;
  let detected = false;

  if (options.language) {
    langConfig = getLanguageConfig(options.language);
  } else {
    // Auto-detect language from content
    const detectedLang = detectLanguage(plainText);
    langConfig = getLanguageConfig(detectedLang);
    detected = true;
  }

  // Initialize AST stats
  const astStats: ASTStats = {
    headings: [],
    links: [],
    images: [],
    codeBlocks: [],
    inlineCodeCount: 0,
    tables: [],
    lists: [],
    listItems: [],
    blockquotes: 0,
    paragraphTexts: [],
  };

  traverseAST(root, astStats);

  // Basic text metrics (using language-aware functions)
  const totalWords = countWords(plainText, langConfig);
  const totalSentences = countSentences(plainText, langConfig);
  const totalLines = content.split('\n').length;
  const totalCharacters = content.length;
  const totalCharactersNoSpaces = content.replace(/\s/g, '').length;

  // Paragraph analysis
  const paragraphWordCounts = astStats.paragraphTexts.map(p => countWords(p, langConfig));
  const nonEmptyParagraphs = paragraphWordCounts.filter(c => c > 0);

  // Heading counts by level
  const headingCounts = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
  for (const h of astStats.headings) {
    const key = `h${h.depth}` as keyof typeof headingCounts;
    headingCounts[key]++;
  }

  // Link analysis
  let externalLinks = 0;
  let internalLinks = 0;
  let brokenLinks = 0;
  for (const link of astStats.links) {
    if (!link.url || link.url.trim() === '') {
      brokenLinks++;
    } else if (link.url.startsWith('http://') || link.url.startsWith('https://')) {
      externalLinks++;
    } else {
      internalLinks++;
    }
  }

  // Image analysis
  let imagesWithAlt = 0;
  let imagesWithoutAlt = 0;
  for (const img of astStats.images) {
    if (img.alt && img.alt.trim().length > 0) {
      imagesWithAlt++;
    } else {
      imagesWithoutAlt++;
    }
  }

  // Code analysis
  const languages = [
    ...new Set(
      astStats.codeBlocks
        .map(block => block.lang?.toLowerCase())
        .filter((lang): lang is string => !!lang)
    ),
  ];

  // List analysis
  const orderedLists = astStats.lists.filter(l => l.ordered).length;
  const unorderedLists = astStats.lists.filter(l => !l.ordered).length;

  // Table analysis
  let totalTableRows = 0;
  let totalTableCells = 0;
  for (const table of astStats.tables) {
    totalTableRows += table.children.length;
    for (const row of table.children) {
      totalTableCells += row.children.length;
    }
  }

  // Reference analysis (using language-specific patterns)
  const references = extractReferences(content, langConfig);
  const refAges = analyzeReferenceAges(references);

  // Count by type
  const authorYearRefs = references.filter(r => r.type === 'author-year').length;
  const numberedRefs = references.filter(r => r.type === 'numbered').length;
  const footnoteRefs = references.filter(r => r.type === 'footnote').length;

  return {
    // File info
    fileName: path.basename(absolutePath),
    filePath: absolutePath,
    fileSizeBytes: fileStats.size,
    fileSizeKB: Math.round((fileStats.size / 1024) * 100) / 100,

    // Language info
    language: {
      code: langConfig.code,
      name: langConfig.name,
      detected,
    },

    // Content metrics
    totalCharacters,
    totalCharactersNoSpaces,
    totalWords,
    totalLines,
    totalParagraphs: nonEmptyParagraphs.length,
    totalSentences,

    // Reading estimates
    readingTimeMinutes: Math.ceil(totalWords / 200),
    speakingTimeMinutes: Math.ceil(totalWords / 150),

    // Headings
    headings: {
      total: astStats.headings.length,
      ...headingCounts,
    },

    // References
    references: {
      total: references.length,
      inTextCitations: authorYearRefs,
      numberedCitations: numberedRefs,
      footnotes: footnoteRefs,
      unique: new Set(references.map(r => r.key)).size,
      referencesOlderThan5Years: refAges.olderThan5Years,
      referencesOlderThan10Years: refAges.olderThan10Years,
      averageReferenceAge: refAges.averageAge,
      oldestReference: refAges.oldest,
      newestReference: refAges.newest,
    },

    // Links
    links: {
      total: astStats.links.length,
      external: externalLinks,
      internal: internalLinks,
      broken: brokenLinks,
    },

    // Images
    images: {
      total: astStats.images.length,
      withAlt: imagesWithAlt,
      withoutAlt: imagesWithoutAlt,
    },

    // Code
    code: {
      codeBlocks: astStats.codeBlocks.length,
      inlineCode: astStats.inlineCodeCount,
      languages,
    },

    // Lists
    lists: {
      total: astStats.lists.length,
      ordered: orderedLists,
      unordered: unorderedLists,
      totalItems: astStats.listItems.length,
    },

    // Tables
    tables: {
      total: astStats.tables.length,
      totalRows: totalTableRows,
      totalCells: totalTableCells,
    },

    // Blockquotes
    blockquotes: astStats.blockquotes,

    // Complexity
    averageWordsPerSentence:
      totalSentences > 0 ? Math.round((totalWords / totalSentences) * 10) / 10 : 0,
    averageWordsPerParagraph:
      nonEmptyParagraphs.length > 0
        ? Math.round((totalWords / nonEmptyParagraphs.length) * 10) / 10
        : 0,
    longestParagraphWords: nonEmptyParagraphs.length > 0 ? Math.max(...nonEmptyParagraphs) : 0,
    shortestParagraphWords: nonEmptyParagraphs.length > 0 ? Math.min(...nonEmptyParagraphs) : 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Output Formatting
// ─────────────────────────────────────────────────────────────────────────────

function formatStatsAsText(stats: MarkdownStats): string {
  const lines: string[] = [];
  const divider = '─'.repeat(60);

  lines.push(divider);
  lines.push(`📄 MARKDOWN STATISTICS: ${stats.fileName}`);
  lines.push(divider);
  lines.push('');

  // File Info
  lines.push('📁 FILE INFO');
  lines.push(`   Path: ${stats.filePath}`);
  lines.push(`   Size: ${stats.fileSizeKB} KB (${stats.fileSizeBytes.toLocaleString()} bytes)`);
  lines.push(
    `   Language: ${stats.language.name} (${stats.language.code})${
      stats.language.detected ? ' [auto-detected]' : ''
    }`
  );
  lines.push('');

  // Content Metrics
  lines.push('📊 CONTENT METRICS');
  lines.push(`   Words: ${stats.totalWords.toLocaleString()}`);
  lines.push(
    `   Characters: ${stats.totalCharacters.toLocaleString()} (${stats.totalCharactersNoSpaces.toLocaleString()} without spaces)`
  );
  lines.push(`   Lines: ${stats.totalLines.toLocaleString()}`);
  lines.push(`   Paragraphs: ${stats.totalParagraphs.toLocaleString()}`);
  lines.push(`   Sentences: ${stats.totalSentences.toLocaleString()}`);
  lines.push('');

  // Reading Time
  lines.push('⏱️  READING ESTIMATES');
  lines.push(`   Reading time: ~${stats.readingTimeMinutes} min (@ 200 wpm)`);
  lines.push(`   Speaking time: ~${stats.speakingTimeMinutes} min (@ 150 wpm)`);
  lines.push('');

  // Headings
  lines.push('📑 HEADINGS');
  lines.push(`   Total: ${stats.headings.total}`);
  lines.push(`   H1: ${stats.headings.h1} | H2: ${stats.headings.h2} | H3: ${stats.headings.h3}`);
  lines.push(`   H4: ${stats.headings.h4} | H5: ${stats.headings.h5} | H6: ${stats.headings.h6}`);
  lines.push('');

  // References
  lines.push('📚 REFERENCES & CITATIONS');
  lines.push(`   Total citations: ${stats.references.total} (${stats.references.unique} unique)`);
  lines.push(`   Author-year style: ${stats.references.inTextCitations}`);
  lines.push(`   Numbered [n]: ${stats.references.numberedCitations}`);
  lines.push(`   Footnotes [^n]: ${stats.references.footnotes}`);
  if (stats.references.averageReferenceAge !== null) {
    lines.push(`   Average age: ${stats.references.averageReferenceAge} years`);
    lines.push(`   Older than 5 years: ${stats.references.referencesOlderThan5Years}`);
    lines.push(`   Older than 10 years: ${stats.references.referencesOlderThan10Years}`);
    if (stats.references.oldestReference) {
      lines.push(
        `   Oldest: ${stats.references.oldestReference.key} (${stats.references.oldestReference.year})`
      );
    }
    if (stats.references.newestReference) {
      lines.push(
        `   Newest: ${stats.references.newestReference.key} (${stats.references.newestReference.year})`
      );
    }
  }
  lines.push('');

  // Links
  lines.push('🔗 LINKS');
  lines.push(`   Total: ${stats.links.total}`);
  lines.push(`   External: ${stats.links.external} | Internal: ${stats.links.internal}`);
  if (stats.links.broken > 0) {
    lines.push(`   ⚠️  Broken (no URL): ${stats.links.broken}`);
  }
  lines.push('');

  // Images
  lines.push('🖼️  IMAGES');
  lines.push(`   Total: ${stats.images.total}`);
  lines.push(`   With alt text: ${stats.images.withAlt} | Without: ${stats.images.withoutAlt}`);
  lines.push('');

  // Code
  lines.push('💻 CODE');
  lines.push(`   Code blocks: ${stats.code.codeBlocks}`);
  lines.push(`   Inline code: ${stats.code.inlineCode}`);
  if (stats.code.languages.length > 0) {
    lines.push(`   Languages: ${stats.code.languages.join(', ')}`);
  }
  lines.push('');

  // Lists
  lines.push('📋 LISTS');
  lines.push(
    `   Total lists: ${stats.lists.total} (${stats.lists.ordered} ordered, ${stats.lists.unordered} unordered)`
  );
  lines.push(`   Total items: ${stats.lists.totalItems}`);
  lines.push('');

  // Tables
  lines.push('📊 TABLES');
  lines.push(`   Tables: ${stats.tables.total}`);
  lines.push(`   Rows: ${stats.tables.totalRows} | Cells: ${stats.tables.totalCells}`);
  lines.push('');

  // Blockquotes
  lines.push('💬 BLOCKQUOTES');
  lines.push(`   Total: ${stats.blockquotes}`);
  lines.push('');

  // Complexity
  lines.push('📈 COMPLEXITY METRICS');
  lines.push(`   Avg words/sentence: ${stats.averageWordsPerSentence}`);
  lines.push(`   Avg words/paragraph: ${stats.averageWordsPerParagraph}`);
  lines.push(`   Longest paragraph: ${stats.longestParagraphWords} words`);
  lines.push(`   Shortest paragraph: ${stats.shortestParagraphWords} words`);
  lines.push('');

  lines.push(divider);

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────────────────────────────────────

const supportedLangs = listSupportedLanguages()
  .map(l => `${l.code} (${l.name})`)
  .join(', ');

program
  .name('md-stats')
  .description('Analyze markdown files and return detailed statistics')
  .version('1.0.0')
  .argument('[filepath]', 'Path to the markdown file to analyze')
  .option('-j, --json', 'Output as JSON instead of formatted text')
  .option('-c, --compact', 'Output compact JSON (no pretty printing)')
  .option(
    '-l, --lang <language>',
    `Language for analysis. Supported: ${supportedLangs}. Auto-detects if not specified.`
  )
  .option('--list-langs', 'List all supported languages and exit')
  .action(
    async (
      filepath: string | undefined,
      options: { json?: boolean; compact?: boolean; lang?: string; listLangs?: boolean }
    ) => {
      try {
        if (options.listLangs) {
          console.log('Supported languages:');
          for (const lang of listSupportedLanguages()) {
            console.log(`  ${lang.code} - ${lang.name}`);
          }
          return;
        }

        if (!filepath) {
          console.error('Error: filepath is required');
          process.exit(1);
        }

        const stats = await analyzeMarkdown(filepath, { language: options.lang });

        if (options.json) {
          if (options.compact) {
            console.log(JSON.stringify(stats));
          } else {
            console.log(JSON.stringify(stats, null, 2));
          }
        } else {
          console.log(formatStatsAsText(stats));
        }
      } catch (error) {
        console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
      }
    }
  );

program.parse();
