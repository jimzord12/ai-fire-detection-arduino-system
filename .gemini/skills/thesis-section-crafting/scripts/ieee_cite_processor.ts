import * as fs from 'fs';

// Helper to remove all References and Glossary sections from content
// This is now used to aggressively clean the content before processing
function removeAllReferencesAndGlossaryBlocks(content: string): string {
  // Regex to match any ### References or ### Glossary section including its content
  // Uses a non-greedy match (.*?) to ensure it stops at the next heading or end of file.
  const regex = /^(#{1,6})\s*(References|Glossary)\s*$(.*?)(?=^#{1,6}\s*|$)/gims;
  return content.replace(regex, '').trim();
}

// Extracts the LAST glossary section and its content, and returns content without it
function extractLastGlossarySection(content: string): {
  contentWithoutGlossary: string;
  glossarySection: string;
} {
  const allGlossaryMatches = Array.from(
    content.matchAll(/^(#{1,6})\s*Glossary\s*$(.*?)(?=^#{1,6}\s*|$)/gms)
  );

  if (allGlossaryMatches.length === 0) {
    return { contentWithoutGlossary: content, glossarySection: '' };
  }

  const lastGlossaryMatch = allGlossaryMatches[allGlossaryMatches.length - 1];

  // Remove only the last matched glossary section from the content
  const [start, end] = [
    lastGlossaryMatch.index!,
    lastGlossaryMatch.index! + lastGlossaryMatch[0].length,
  ];
  const contentWithoutGlossary = content.substring(0, start) + content.substring(end);

  return {
    contentWithoutGlossary: contentWithoutGlossary.trim(),
    glossarySection: lastGlossaryMatch[0],
  };
}

// Extracts APA references from the LAST References section
function extractApaReferencesFromLastSection(content: string): string[] {
  const allReferencesMatches = Array.from(
    content.matchAll(/^(#{1,6})\s*References\s*$(.*?)(?=^#{1,6}\s*|$)/gms)
  );

  if (allReferencesMatches.length === 0) {
    return [];
  }

  const lastReferencesMatch = allReferencesMatches[allReferencesMatches.length - 1];
  const referencesContent = lastReferencesMatch[2];

  // Each APA reference is typically a block separated by newlines.
  const apaRefs = referencesContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('-'));
  return apaRefs;
}

function processCitations(
  bodyContent: string,
  apaReferences: string[]
): { processedBody: string; newIeeeReferencesSection: string } {
  const citationMapping: { [key: string]: number } = {};
  const ieeeReferencesList: { num: number; entryText: string }[] = [];

  let currentBody = bodyContent; // Use a mutable copy for replacements

  // Regex to find APA-style in-text citations: (Author, Year) or (Author & Author, Year)
  const apaInTextCitationPattern = /\(([^,]+(?:,\s*[^)]+)*),\s*(\d{4})\)/g;

  let citationMatches: {
    originalText: string;
    apaText?: { author: string; year: string; original: string };
    start: number;
    end: number;
  }[] = [];

  // Collect APA matches
  let apaMatch;
  while ((apaMatch = apaInTextCitationPattern.exec(bodyContent)) !== null) {
    citationMatches.push({
      originalText: apaMatch[0],
      apaText: { author: apaMatch[1].trim(), year: apaMatch[2].trim(), original: apaMatch[0] },
      start: apaMatch.index,
      end: apaMatch.index + apaMatch[0].length,
    });
  }

  // Sort matches by their starting position to ensure "first appearance" logic holds
  citationMatches.sort((a, b) => a.start - b.start);

  // Prepare for replacements from right to left to avoid index shifting issues
  const replacements: { start: number; end: number; replacement: string; matchedRefKey: string }[] =
    [];

  for (const match of citationMatches) {
    let matchedRefKey: string | undefined = undefined;
    let entryTextForIeee: string = match.originalText; // Fallback

    if (match.apaText) {
      // Attempt to find the best matching APA reference entry from the extracted list
      // This is a heuristic. More robust matching would involve fuzzy string matching or parsing APA structure.
      const authorKeywords = match.apaText.author
        .split(/,\s*|\s*&\s*/)
        .map(s => s.trim().toLowerCase())
        .filter(s => s.length > 0);
      const yearKeyword = match.apaText.year;

      let bestMatchRef: string | undefined = undefined;
      for (const apaRefEntry of apaReferences) {
        const apaRefLower = apaRefEntry.toLowerCase();
        const authorYearMatch =
          authorKeywords.every(keyword => apaRefLower.includes(keyword)) &&
          apaRefLower.includes(yearKeyword);

        if (authorYearMatch) {
          bestMatchRef = apaRefEntry;
          break;
        }
      }

      if (bestMatchRef) {
        matchedRefKey = bestMatchRef; // Use the full APA entry text as the key
        entryTextForIeee = bestMatchRef;
      } else {
        // If no clear match in extracted APA list, use the original APA citation as a fallback key
        matchedRefKey = match.apaText.original;
        entryTextForIeee = `UNKNOWN (APA - No Full Match): ${match.apaText.original}`;
      }
    }

    if (!matchedRefKey) {
      // Fallback for any other type of citation match not handled above (e.g., bare URLs if re-added)
      matchedRefKey = `generic_ref_${Object.keys(citationMapping).length}`;
      entryTextForIeee = match.originalText;
    }

    let ieeeNum: number;
    if (citationMapping.hasOwnProperty(matchedRefKey)) {
      ieeeNum = citationMapping[matchedRefKey];
    } else {
      ieeeNum = ieeeReferencesList.length + 1;
      citationMapping[matchedRefKey] = ieeeNum;
      ieeeReferencesList.push({ num: ieeeNum, entryText: entryTextForIeee });
    }

    replacements.push({
      start: match.start,
      end: match.end,
      replacement: `[${ieeeNum}]`,
      matchedRefKey: matchedRefKey,
    });
  }

  // Sort replacements from right to left to apply them correctly
  replacements.sort((a, b) => b.start - a.start);

  for (const rep of replacements) {
    currentBody =
      currentBody.substring(0, rep.start) + rep.replacement + currentBody.substring(rep.end);
  }

  // Build the new IEEE formatted references section
  let newIeeeReferencesSection = '\n### References\n\n';
  for (const { num, entryText } of ieeeReferencesList) {
    newIeeeReferencesSection += `- [${num}] ${entryText}\n`;
  }

  return { processedBody: currentBody, newIeeeReferencesSection };
}

async function main() {
  if (process.argv.length < 3) {
    console.error('Usage: npx tsx ieee_cite_processor.ts <path_to_markdown_file>');
    process.exit(1);
  }

  const inputFilePath = process.argv[2];
  if (!fs.existsSync(inputFilePath)) {
    console.error(`Error: Input file not found at ${inputFilePath}`);
    process.exit(1);
  }

  const fullContent = fs.readFileSync(inputFilePath, 'utf-8');

  // Step 1: Extract the LAST Glossary section and hold it aside.
  const { glossarySection } = extractLastGlossarySection(fullContent);

  // Step 2: Extract APA references from the content (potentially with multiple References sections)
  const extractedApaReferences = extractApaReferencesFromLastSection(fullContent);

  // Step 3: Create a truly clean body for citation processing by removing ALL References and Glossary blocks
  const cleanBodyForCitations = removeAllReferencesAndGlossaryBlocks(fullContent);

  // Step 4: Process in-text citations and generate new IEEE references section
  const { processedBody, newIeeeReferencesSection } = processCitations(
    cleanBodyForCitations,
    extractedApaReferences
  );

  // Step 5: Combine processed body, new IEEE references, and the preserved glossary section
  let finalOutputContent = processedBody;
  finalOutputContent += '\n' + newIeeeReferencesSection;
  if (glossarySection) {
    finalOutputContent += '\n' + glossarySection;
  }

  const outputFilePath = inputFilePath.replace('.md', '_ieee.md');

  fs.writeFileSync(outputFilePath, finalOutputContent.trim(), 'utf-8');

  fs.unlinkSync(inputFilePath);
  console.log(`Processed citations and saved to ${outputFilePath}`);
  console.log(`Original file ${inputFilePath} deleted.`);
}

main();
