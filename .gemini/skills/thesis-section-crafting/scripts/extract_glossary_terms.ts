import * as fs from 'fs';
import * as path from 'path';

function buildProcessedPath(filePath: string): string {
  const { dir, name, ext } = path.parse(filePath);
  let newName = name;
  if (newName.endsWith('_ieee')) {
    newName = newName.substring(0, newName.length - '_ieee'.length) + '_ieee_no_glossary';
  } else {
    newName += '_no_glossary';
  }
  return path.join(dir, newName + ext);
}

function extractGlossary(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    process.exit(1);
  }

  let content: string;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (e: any) {
    console.error(`Error reading file: ${e.message}`);
    process.exit(1);
  }

  // Find a "Glossary" heading and capture content until the next heading or EOF.
  // The regex needs to be on a single line and properly escaped.
  const glossaryMatch = content.match(/^(#{1,6})\s+Glossary\s*$\n(.*?)(?=^#{1,6}\s*|$)/ms);

  if (!glossaryMatch) {
    console.log('No glossary section found. Renaming file to signify completion of this step.');
    const newFilePath = buildProcessedPath(filePath);
    if (!fs.existsSync(newFilePath)) {
      // Only rename if target doesn't exist
      fs.renameSync(filePath, newFilePath);
      console.log(`Renamed file to ${newFilePath}`);
    } else {
      console.log(`Target file ${newFilePath} already exists. Deleting original ${filePath}.`);
      fs.unlinkSync(filePath);
    }
    process.exit(0); // Exit successfully as no glossary was found/extracted
  }

  const glossaryContentFull = glossaryMatch[0];
  const glossaryTermsText = glossaryMatch[2];

  // Extract terms in the format **Term**: Definition, optionally prefixed by a list bullet.
  const terms = Array.from(
    glossaryTermsText.matchAll(/^\s*(?:[-*]\s+)?\*\*(.*?)\*\*:\s*(.+)$/gm)
  ).map(match => ({ term: match[1].trim(), definition: match[2].trim() }));

  const dirPath = path.dirname(filePath);
  const glossaryFilePath = path.join(dirPath, 'glossary.md');

  if (terms.length > 0) {
    // Append extracted terms to the section's glossary.md file
    const mode = fs.existsSync(glossaryFilePath) ? 'a' : 'w';
    let fileContent = '';
    if (mode === 'a' && fs.statSync(glossaryFilePath).size > 0) {
      fileContent += '\n'; // Add newline before appending if file not empty
    }
    for (const { term, definition } of terms) {
      fileContent += `**${term}**: ${definition}\n`;
    }
    fs.appendFileSync(glossaryFilePath, fileContent, 'utf-8'); // Using appendFileSync for simplicity, can optimize
    console.log(`Appended ${terms.length} terms to ${glossaryFilePath}`);
  } else {
    console.log('Glossary section found, but no terms in the expected format were extracted.');
  }

  // Remove exactly the matched glossary section from the source content.
  const [start, end] = [glossaryMatch.index!, glossaryMatch.index! + glossaryMatch[0].length];
  const newContent = (content.substring(0, start) + content.substring(end)).trim();

  const newFilePath = buildProcessedPath(filePath);

  fs.writeFileSync(newFilePath, newContent, 'utf-8');
  fs.unlinkSync(filePath);

  console.log(`Glossary extracted. Original file removed. New file created at ${newFilePath}`);
}

async function main() {
  if (process.argv.length < 3) {
    console.error('Usage: npx tsx extract_glossary_terms.ts <path_to_markdown_file>');
    process.exit(1);
  }

  const fileToProcess = process.argv[2];
  extractGlossary(fileToProcess);
}

main();
