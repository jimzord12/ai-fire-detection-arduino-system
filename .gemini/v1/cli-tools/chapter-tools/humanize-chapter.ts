#!/usr/bin/env tsx
import { Command } from 'commander';
import fs from 'node:fs/promises';
import { getHumanizedText } from './humanize.ts';
import { playBeeps } from './tests/utils/generic/beep.ts';
import { sleep } from './tests/utils/generic/sleep.ts';
import {
  extractLevel3SectionBodies,
  replaceLevel3SectionBodies,
} from './utils/markdown/markdown.ts';

const humanizeChapter = async (chapterFilePath: string): Promise<void> => {
  const excludedH2Titles = ['Βιβλιογραφία', 'Βιβλιογραφiα', 'References'];
  // 1. Extract all the Level 3 Heading Body Text
  const sectionBodies = await extractLevel3SectionBodies(chapterFilePath, excludedH2Titles);

  console.log(`\n📝 Extracted ${sectionBodies.length} Level 3 sections for humanization.\n`);

  const tempFilePath = `${chapterFilePath}.temp.json`;
  let humanizedBodies: (string | null)[] = [];

  // Try to load from temp file
  try {
    const fileContent = await fs.readFile(tempFilePath, 'utf-8');
    const data = JSON.parse(fileContent);
    if (Array.isArray(data)) {
      humanizedBodies = data;
      console.log(
        `\n🔄 Resuming from temp file. Found ${
          humanizedBodies.filter(b => b !== null).length
        } humanized sections.`
      );
    }
  } catch (_error) {
    // Ignore error if file doesn't exist
  }

  // 2. Humanize each section body text
  for (const [index, sb] of sectionBodies.entries()) {
    // Skip if already humanized
    if (index < humanizedBodies.length && humanizedBodies[index] !== null) {
      console.log(
        `\n⏩ Skipping SubSection ${index + 1}/${sectionBodies.length} (already humanized).`
      );
      continue;
    }

    try {
      const humanizedText = await getHumanizedText(sb);
      console.log(`\n--- Humanized SubSection ${index + 1}/${sectionBodies.length} ---\n`);

      humanizedBodies[index] = humanizedText;
      await fs.writeFile(tempFilePath, JSON.stringify(humanizedBodies, null, 2));
    } catch (error) {
      if (error instanceof Error && error.message.includes('JWT')) {
        console.error('Authentication error detected. Aborting further processing.');
        await playBeeps(0.2, 2, 600);
        return;
      }
      console.error(`Error humanizing section ${index + 1}:`, error);
      humanizedBodies[index] = null;
      await fs.writeFile(tempFilePath, JSON.stringify(humanizedBodies, null, 2));
      await playBeeps(0.2, 4, 600);
    } finally {
      await sleep(10 * 1000); // To avoid hitting rate limits
    }
  }

  // If any section failed to humanize, abort the process
  if (humanizedBodies.some(hb => hb === null)) {
    console.error('Aborting: Some sections failed to humanize.');
    await playBeeps(0.1, 5, 600);
    return;
  }

  // 3. Create a new chapter file with humanized sections
  await replaceLevel3SectionBodies(chapterFilePath, humanizedBodies as string[], {
    suffix: 'Humanized',
    excludeH2Titles: excludedH2Titles,
  });

  // Delete temp file
  try {
    await fs.unlink(tempFilePath);
  } catch (_error) {
    // ignore
  }

  console.log(`\n✅ Humanized chapter saved successfully.`);
  await playBeeps(0.5, 1, 300);
  await playBeeps(0.1, 3, 300);
  await playBeeps(0.5, 1, 300);
};

const program = new Command();

program
  .name('humanize-chapter')
  .description('Humanize a single markdown chapter file.')
  .argument('<file>', 'Path to the markdown chapter file')
  .action(async file => {
    await humanizeChapter(file);
  });

program.parse();

