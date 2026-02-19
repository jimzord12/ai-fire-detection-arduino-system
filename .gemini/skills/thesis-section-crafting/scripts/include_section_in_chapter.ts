import * as fs from 'fs';

function includeSection(chapterTypPath: string, sectionSnakeCase: string): void {
  if (!fs.existsSync(chapterTypPath)) {
    console.error(`Error: Chapter Typst file not found at ${chapterTypPath}`);
    process.exit(1);
  }

  const includeStatement = `#include "sections/${sectionSnakeCase}/content.typ"`;

  const content = fs.readFileSync(chapterTypPath, 'utf-8');
  const lines = content.split(/\r?\n/);

  let updatedLines: string[] = [];
  let alreadyIncluded = false;

  // Check if already included
  for (const line of lines) {
    if (line.includes(includeStatement)) {
      alreadyIncluded = true;
      break;
    }
  }

  if (alreadyIncluded) {
    console.log(
      `Section '${sectionSnakeCase}' is already included in '${chapterTypPath}'. No changes made.`
    );
    return;
  }

  // Find the right place to insert: directly after the last existing #include, else at end
  let insertIdx = lines.length;
  let lastIncludeIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#include ')) {
      lastIncludeIdx = i;
    }
  }

  if (lastIncludeIdx !== -1) {
    insertIdx = lastIncludeIdx + 1;
  }

  updatedLines = [...lines];
  updatedLines.splice(insertIdx, 0, includeStatement);

  let newContent = updatedLines.join('\n');
  if (!newContent.endsWith('\n')) {
    newContent += '\n';
  }

  fs.writeFileSync(chapterTypPath, newContent, 'utf-8');
  console.log(`Added '${includeStatement}' to '${chapterTypPath}'.`);
}

async function main() {
  if (process.argv.length < 4) {
    console.error(
      'Usage: npx tsx include_section_in_chapter.ts <path_to_chapter.typ> <section_snake_case>'
    );
    process.exit(1);
  }

  const chapterTypFilePath = process.argv[2];
  const sectionSnakeCase = process.argv[3];

  includeSection(chapterTypFilePath, sectionSnakeCase);
}

main();
