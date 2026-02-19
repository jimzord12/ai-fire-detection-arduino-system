import * as fs from 'fs';
import * as path from 'path';

function getSectionDetails(
  sectionId: string,
  outlinePath: string
): { title: string; approxWords: string; outlineBullets: string } {
  const outlineContent = fs.readFileSync(outlinePath, 'utf-8');

  let sectionTitle: string = 'Unknown Title';
  let approxWords: string = 'Unknown';
  const outlineBulletsRaw: string[] = [];

  // Find the section header, e.g., "#### 1.2 Problem Statement (~600 words)"
  const sectionHeaderPattern = new RegExp(
    `^#### ${sectionId.replace(/\./g, '\\.')}\\s+(.*?)\\s+\\((~?\\d+\\s*words?)\\)`,
    'm'
  );
  const headerMatch = outlineContent.match(sectionHeaderPattern);

  if (headerMatch) {
    sectionTitle = headerMatch[1].trim();
    approxWords = headerMatch[2].trim();

    // Extract outline bullets following the section header
    const startIndex = outlineContent.indexOf(headerMatch[0]) + headerMatch[0].length;

    const nextHeaderPattern = /^(?:####|### Chapter)\s+\S+/m;
    const sectionBodySubstring = outlineContent.substring(startIndex);
    const nextHeaderMatch = sectionBodySubstring.match(nextHeaderPattern);

    const endIndex = nextHeaderMatch ? nextHeaderMatch.index : sectionBodySubstring.length;

    const sectionBodyContent = sectionBodySubstring.substring(0, endIndex);

    for (const line of sectionBodyContent.split('\n')) {
      const strippedLine = line.trim();
      if (strippedLine && !/^-?\s*$/.test(strippedLine)) {
        outlineBulletsRaw.push(strippedLine);
      }
    }
  }

  const outlineBullets =
    outlineBulletsRaw.length > 0
      ? outlineBulletsRaw.join('\n')
      : 'No specific outline bullets found.';

  return { title: sectionTitle, approxWords, outlineBullets };
}

function toSnakeCaseSegment(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function getChapterNameFromSectionId(sectionId: string, outlinePath: string): string | null {
  const outlineContent = fs.readFileSync(outlinePath, 'utf-8');
  const lines = outlineContent.split('\n');

  let currentChapterNumber: string | null = null;
  let currentChapterTitle: string | null = null;

  const targetChapterNumber = sectionId.split('.')[0];

  for (const line of lines) {
    const chapterMatch = line.match(/^### Chapter\s+(\d+):\s+(.*?)\s+\(.*?\)/);
    if (chapterMatch) {
      currentChapterNumber = chapterMatch[1];
      currentChapterTitle = chapterMatch[2];
    }

    const sectionMatch = line.match(/^####\s+(\d+\.\d+)\s+(.*?)\s+\(.*?\)/);
    if (sectionMatch) {
      const parsedSectionId = sectionMatch[1];
      if (parsedSectionId === sectionId && currentChapterNumber === targetChapterNumber) {
        if (currentChapterNumber && currentChapterTitle) {
          const chapterDirName = `${currentChapterNumber.padStart(2, '0')}_${toSnakeCaseSegment(currentChapterTitle)}`;
          return chapterDirName;
        }
      }
    }
  }
  return null;
}

async function main() {
  if (process.argv.length < 3) {
    console.error('Usage: npx tsx create_section_draft.ts <SECTION_ID>');
    process.exit(1);
  }

  const sectionId = process.argv[2];

  const projectRoot = process.cwd();
  const outlinePath = path.join(projectRoot, 'thesis', 'THESIS_OUTLINE.md');

  const chapterDirName = getChapterNameFromSectionId(sectionId, outlinePath);
  if (!chapterDirName) {
    console.error(`Error: Could not determine chapter name for section ID ${sectionId}`);
    process.exit(1);
  }

  const { title: sectionTitleRaw } = getSectionDetails(sectionId, outlinePath); // Get raw title for snake_case
  // Sanitize section title for use in snake_case folder name
  const sectionTitleSnake = toSnakeCaseSegment(sectionTitleRaw);
  const sectionIdParts = sectionId.split('.');
  const sectionSnakeCase = `${sectionIdParts.join('_')}_${sectionTitleSnake}`;

  const outputDir = path.join(
    projectRoot,
    'thesis',
    'typst',
    'chapters',
    chapterDirName,
    'sections',
    sectionSnakeCase
  );
  fs.mkdirSync(outputDir, { recursive: true });
  const outputFilePath = path.join(outputDir, 'content.md');

  if (fs.existsSync(outputFilePath)) {
    console.warn(
      `Warning: ${outputFilePath} already exists. Skipping content generation and exiting successfully.`
    );
    process.exit(0);
  }

  const {
    title: sectionTitle,
    approxWords,
    outlineBullets,
  } = getSectionDetails(sectionId, outlinePath);

  const promptForAgent = `
# ACADEMIC SCHOLAR AGENT: SECTION DRAFTING TASK

You are an Academic Scholar Agent. Your task is to draft the content for a specific thesis section.

## SECTION DETAILS:
-   **Section ID**: ${sectionId}
-   **Section Title**: ${sectionTitle}
-   **Approx. Word Count**: ${approxWords}
-   **Outline Bullets**:
${outlineBullets}

## INSTRUCTIONS:
1.  **Draft the section content** in Markdown format.
2.  Adhere to an **impersonal academic writing style**.
3.  Include **in-text citations** using APA 7th edition style (e.g., (Author, Year)). You will use this format for now, it will be converted to IEEE numeric later.
4.  Ensure factual claims are **supported by academic sources**.
5.  Include a \`### References\` section at the end, listing all sources used in APA 7th format.
6.  If there are any new or key terms that need definition, include a \`### Glossary\` section at the end in the format \`**Term**: Definition\`. If no terms, omit this section.
7.  **Do NOT** include a top-level heading like \`# ${sectionId} ${sectionTitle}\`. The template handles this.
8.  **DO NOT** write anything before the section content itself.

## CONTEXT FOR ALIGNMENT (DO NOT CITE):
-   **Thesis Outline**: @{{thesis/THESIS_OUTLINE.md}}
-   **Writing Tips & Style**: @{{thesis/WRITING_TIPS.md}}
-   **Project Technical Context**: @{{AGENTS.md}}
-   **Literature Review Protocol**: @{{thesis/literature/PRISMA_PROTOCOL.md}}
-   **Section Template (Reference)**: @{{.gemini/skills/thesis-section-crafting/templates/SECTION_TEMPLATE.md}}

## DELIVERABLE:
Provide ONLY the Markdown content for this section, starting directly with the prose.
`;
  console.log(promptForAgent);
  console.log(`\n--- Saving draft to ${outputFilePath} ---`);
}

main();
