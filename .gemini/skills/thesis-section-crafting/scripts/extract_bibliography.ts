import * as fs from 'fs';

export interface ParsedReference {
  authors: string;
  title: string;
  year: string;
  doi: string;
  url: string;
}

/**
 * Parses a single raw reference string into structured metadata.
 *
 * Supports two common citation styles found in this project:
 *
 * IEEE: `A. Author and B. Author, "Title," _Journal_, vol. X, no. Y, Year, doi: ...`
 * APA:  `Author, A., Author, B. (Year). Title. *Journal*, volume(issue), pages.`
 *
 * Falls back gracefully when neither pattern matches, leaving fields empty so
 * the caller can still produce a valid (partial) BibTeX entry.
 */
export function parseReference(refContent: string): ParsedReference {
  // console.log('parseReference input refContent:', refContent); // DEBUG
  let authors = '';
  let title = '';
  let year = '';
  let doi = '';
  let url = '';

  // ── 1. Extract DOI ────────────────────────────────────────────────────────
  // Matches "doi: 10.xxxx/..." or "DOI: 10.xxxx/..." anywhere in the string.
  const doiMatch = refContent.match(/\bdoi:\s*(10\.\d{4,9}\/\S+)/i);
  if (doiMatch) {
    // Strip any trailing punctuation that may have been captured (e.g. period, bracket)
    doi = doiMatch[1].replace(/[.,)\]]+$/, '');
    url = `https://doi.org/${doi}`;
  } else {
    // Fall back to a bare URL if no DOI is present
    const urlMatch = refContent.match(/(https?:\/\/[^\s)]+)/);
    if (urlMatch) url = urlMatch[1];
  }

  // ── 2. Extract year ───────────────────────────────────────────────────────
  // Handles both APA "(2023)" and IEEE "2023," patterns.
  // Modified to also capture "(n.d.)" for "no date".
  const yearParenMatch = refContent.match(/\((\d{4}|n\.d\.)\)/); // Modified regex
  // console.log('parseReference yearParenMatch:', yearParenMatch); // DEBUG
  if (yearParenMatch) {
    year = yearParenMatch[1];
  } else {
    // IEEE bare year near the end: "..., 2024," or "..., 2024."
    const yearBareMatch = refContent.match(/,\s*(\d{4})[,.]?\s*(?:doi:|$)/i);
    if (yearBareMatch) year = yearBareMatch[1];
  }

  // ── 3. Try IEEE format ────────────────────────────────────────────────────
  // Pattern: `Authors, "Title," rest...`
  // Titles are enclosed in straight (") or curly (\u201C / \u201D) double quotes.
  const ieeeMatch = refContent.match(/^(.+?),\s*[\u201C"](.+?)(?:,[\u201D"]|[\u201D"],)/);
  if (ieeeMatch) {
    authors = ieeeMatch[1].trim();
    title = ieeeMatch[2].trim();
    return { authors, title, year, doi, url };
  }

  // ── 4. Try APA format ─────────────────────────────────────────────────────
  // Pattern: `Authors (Year). Title. *Journal*, ...`
  // Modified regex to allow "(n.d.)" and optional period after year.
  const apaMatch = refContent.match(/^(.+?)\s*\((?:\d{4}|n\.d\.)\)\.?[,\s]*([\s\S]+)/); // Modified regex
  // console.log('parseReference apaMatch:', apaMatch); // DEBUG
  if (apaMatch) {
    // Authors: everything before the parenthesised year, strip trailing punctuation
    authors = apaMatch[1].replace(/[,.\s]+$/, '').trim();

    const afterYear = apaMatch[2];

    // 4a. Title wrapped in italic Markdown markers: *Title*. or _Title_.
    const italicTitleMatch =
      afterYear.match(/^\*(.+?)\*[.!?]?\s*/) ?? // Changed to non-greedy and optional space/punctuation
      afterYear.match(/^_(.+?)_[.!?]?\s*/); // Changed to non-greedy and optional space/punctuation
    if (italicTitleMatch) {
      title = italicTitleMatch[1].trim();
      return { authors, title, year, doi, url };
    }

    // 4b. Title ends just before the journal name (which is typically in italics).
    // e.g. "Early fire detection... learning. *Sensors*, ..."
    const titleBeforeItalicJournal = afterYear.match(/^(.+?)\.\s*[*_]/);
    if (titleBeforeItalicJournal) {
      title = titleBeforeItalicJournal[1].replace(/[*_]/g, '').trim();
      return { authors, title, year, doi, url };
    }

    // 4c. Generic fallback: take the first sentence as the title.
    const firstSentenceMatch = afterYear.match(/^(.+?)\.\s/);
    if (firstSentenceMatch) {
      title = firstSentenceMatch[1].replace(/[*_]/g, '').trim();
    }

    return { authors, title, year, doi, url };
  }

  // ── 5. No pattern matched – return what we have (doi/url/year) ────────────
  return { authors, title, year, doi, url };
}

export function extractBibliography(inputFilePath: string, outputBibFilePath: string): void {
  let content: string;
  try {
    content = fs.readFileSync(inputFilePath, 'utf-8');
  } catch (e: any) {
    throw new Error(`Error reading file "${inputFilePath}": ${e.message}`);
  }

  // Find the APA ### References section.
  // Changed regex to capture everything after ### References until end of content
  const referencesSectionMatch = content.match(/^(#{1,6})\s*References\s*\n([\s\S]*)$/m);

  let referenceLines: string[] = [];

  if (referencesSectionMatch) {
    const referencesText = referencesSectionMatch[2];
    console.log('referencesText extracted by extractBibliography:', referencesText); // DEBUG
    // Split by new line and filter out empty lines.
    // Assuming APA style will have each reference on its own line, possibly multi-line.
    // For now, let's treat each non-empty line as a potential reference.
    // The parseReference function will attempt to parse APA.
    referenceLines = referencesText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    console.log('referenceLines after split and filter:', referenceLines); // DEBUG
  } else {
    console.log(`No '### References' section found in ${inputFilePath}.`);
    fs.writeFileSync(outputBibFilePath, '', 'utf-8');
    console.log(`Created empty bibliography file at ${outputBibFilePath}`);
    return;
  }

  const bibEntries: string[] = [];

  for (const line of referenceLines) {
    console.log('extractBibliography processing line:', line); // DEBUG
    const refContent = line.trim();
    if (refContent.length === 0) continue; // Skip empty lines

    const currentEntryKey = `ref${bibEntries.length + 1}`;

    // Parse structured metadata from the raw reference string.
    // This correctly separates authors, title, year, doi, and url
    // using the existing parseReference function which handles APA.
    const parsed = parseReference(refContent);
    const { authors, title, year, doi, url } = parsed;

    // Build the BibTeX entry, omitting any fields that could not be extracted.
    let bibEntry = `@article{${currentEntryKey},\n`;
    if (title) bibEntry += `  title={{{${title}}}},\n`;
    if (authors) bibEntry += `  author={{{${authors}}}},\n`;
    if (year) bibEntry += `  year={{{${year}}}},\n`;
    if (doi) bibEntry += `  doi={{{${doi}}}},\n`;
    if (url) bibEntry += `  url={{{${url}}}},\n`;
    // Always preserve the original reference text in the note field for full context / manual review.
    bibEntry += `  note={{{${refContent}}}}\n`;
    bibEntry += `}\n`;

    bibEntries.push(bibEntry);
  }

  if (bibEntries.length > 0) {
    fs.writeFileSync(outputBibFilePath, bibEntries.join('\n'), 'utf-8');
    console.log(`Extracted ${bibEntries.length} references to ${outputBibFilePath}`);
  } else {
    console.log(
      `No valid reference entries found in '### References' section of ${inputFilePath}.`
    );
    fs.writeFileSync(outputBibFilePath, '', 'utf-8');
    console.log(`Created empty bibliography file at ${outputBibFilePath}`);
  }
}

async function main() {
  if (process.argv.length < 4) {
    console.error('Usage: npx tsx extract_bibliography.ts <input_markdown_file> <output_bib_file>');
    process.exit(1);
  }

  const inputMdFilePath = process.argv[2];
  const outputBibFilePath = process.argv[3];

  if (!fs.existsSync(inputMdFilePath)) {
    console.error(`Error: Input file not found at ${inputMdFilePath}`);
    process.exit(1);
  }

  try {
    extractBibliography(inputMdFilePath, outputBibFilePath);
  } catch (e: any) {
    console.error(e.message);
    process.exit(1);
  }
}

// Only run as CLI when this file is the entry point, not when imported by tests.
if (
  process.argv[1]?.endsWith('extract_bibliography.ts') ||
  process.argv[1]?.endsWith('extract_bibliography.js')
) {
  main();
}
