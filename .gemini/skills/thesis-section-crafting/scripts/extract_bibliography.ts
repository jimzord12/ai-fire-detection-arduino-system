import * as fs from 'fs';

function extractBibliography(inputFilePath: string, outputBibFilePath: string): void {
  if (!fs.existsSync(inputFilePath)) {
    console.error(`Error: Input file not found at ${inputFilePath}`);
    process.exit(1);
  }

  let content: string;
  try {
    content = fs.readFileSync(inputFilePath, 'utf-8');
  } catch (e: any) {
    console.error(`Error reading file: ${e.message}`);
    process.exit(1);
  }

  // Regex to find the ### References section
  const referencesSectionMatch = content.match(/^(#{1,6})\s*References\s*$(.*?)(?=^#{1,6}\s*|$)/ms);

  if (!referencesSectionMatch) {
    console.log(`No '### References' section found in ${inputFilePath}.`);
    // Create an empty .bib file if no references, so verify_references.ts doesn't fail
    fs.writeFileSync(outputBibFilePath, '', 'utf-8');
    console.log(`Created empty bibliography file at ${outputBibFilePath}`);
    process.exit(0);
  }

  const referencesText = referencesSectionMatch[2];

  // This is a very simplified BibTeX extraction.
  // It assumes each reference entry starts with "- [num]" as per ieee_cite_processor.ts output.
  // A more robust solution would involve a proper BibTeX parser or generating BibTeX entries from APA.

  const bibEntries: string[] = [];

  // Find all lines starting with "- [num]"
  const referenceLines = referencesText.split('\n').filter(line => line.match(/^- \[\d+\]\s*.+/));

  for (const line of referenceLines) {
    const refContent = line.replace(/^- \[\d+\]\s*/, '').trim(); // Get content after "- [num]"

    // Attempt to parse components for a basic @misc BibTeX entry.
    // This is a heuristic and might not be perfect for all reference styles.

    let authorsRaw = '';
    let year = '';
    let title =
      refContent.substring(0, Math.min(refContent.length, 100)) +
      (refContent.length > 100 ? '...' : ''); // Default title to start of content
    let journalOrVenue = '';
    let url = '';
    let doi = '';

    // Extract DOI/URL
    const doiMatch = refContent.match(/(doi:\s*10\.\d{4,9}\/[^\s)]+)/i);
    if (doiMatch) {
      doi = doiMatch[0];
      url = `https://doi.org/${doiMatch[0].substring(4).trim()}`; // Construct URL from DOI
    } else {
      const urlMatch = refContent.match(/(https?:\/\/\S+)/);
      if (urlMatch) url = urlMatch[0];
    }

    // Extract Year (e.g., (2023) or year: 2023)
    const yearMatch = refContent.match(/\((\d{4})\)|\syear:\s*(\d{4})/i);
    if (yearMatch) year = yearMatch[1] || yearMatch[2] || '';

    // Extract Authors (simple: up to first year or title in quotes)
    const authorsPart = refContent.split('(')[0].trim();
    if (authorsPart.length > 0) {
      authorsRaw = authorsPart.replace(/,\s*&?\s*$/, ''); // Remove trailing comma/&
    }

    // Extract Title (between quotes "Title" or after authors/year before venue)
    const titleMatch = refContent.match(/"(.*?)"/);
    if (titleMatch) {
      title = titleMatch[1].trim();
    } else {
      // Fallback: title is often after authors and year, before venue or other details
      const afterAuthorsYear = refContent.replace(authorsPart, '').replace(`(${year})`, '').trim();
      const potentialTitleEnd = afterAuthorsYear.indexOf('.');
      if (potentialTitleEnd !== -1) {
        title = afterAuthorsYear.substring(0, potentialTitleEnd).trim();
      }
    }

    // Ensure a key is generated
    let key = `ref${bibEntries.length + 1}`;
    if (authorsRaw && year && title) {
      const firstAuthor = authorsRaw.split(',')[0].trim().replace(/\s/g, '');
      const firstTitleWord = title.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '');
      key = `${firstAuthor}${year}${firstTitleWord}`;
    }

    // Basic BibTeX entry construction
    let bibEntry = `@article{${key},\n`;
    if (title) bibEntry += `  title={{{${title}}}},\n`;
    if (authorsRaw) bibEntry += `  author={{{${authorsRaw}}}},\n`;
    if (year) bibEntry += `  year={{{${year}}}},\n`;
    if (journalOrVenue) bibEntry += `  journal={{{${journalOrVenue}}}},\n`; // Placeholder
    if (doi) bibEntry += `  doi={{{${doi}}}},\n`;
    if (url) bibEntry += `  url={{{${url}}}},\n`;
    bibEntry += `  note={{{${refContent}}}}\n`; // Keep original content as a note
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
    fs.writeFileSync(outputBibFilePath, '', 'utf-8'); // Ensure an empty file is created
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

  extractBibliography(inputMdFilePath, outputBibFilePath);
}

main();
