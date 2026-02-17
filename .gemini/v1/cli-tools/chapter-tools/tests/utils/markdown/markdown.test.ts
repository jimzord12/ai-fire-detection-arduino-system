import * as assert from 'node:assert';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { describe, test } from 'node:test';
import {
  extractLevel3SectionBodies,
  extractSections,
  replaceLevel3SectionBodies,
  writeSections,
} from '../../../utils/markdown/markdown.ts';

describe('Markdown Utilities', () => {
  const testDir = path.join(process.cwd(), 'test-temp');
  const dataDir = path.join(process.cwd(), 'tests', 'data');
  const chapterPath = path.join(dataDir, 'test-chapter.md');

  test.before(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });

  test.after(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  test('extractSections should correctly parse headings and content', async () => {
    const filePath = path.join(testDir, 'test-extract.md');
    const content = `# Heading 1
Content 1

## Heading 2
Content 2
More content 2

### Heading 3
Content 3`;
    await fs.writeFile(filePath, content);

    const sections = await extractSections(filePath);

    assert.strictEqual(sections.length, 3);

    assert.strictEqual(sections[0]?.heading, 1);
    assert.strictEqual(sections[0]?.title, 'Heading 1');
    assert.strictEqual(sections[0]?.content, 'Content 1');

    assert.strictEqual(sections[1]?.heading, 2);
    assert.strictEqual(sections[1]?.title, 'Heading 2');
    assert.strictEqual(sections[1]?.content, 'Content 2\nMore content 2');

    assert.strictEqual(sections[2]?.heading, 3);
    assert.strictEqual(sections[2]?.title, 'Heading 3');
    assert.strictEqual(sections[2]?.content, 'Content 3');
  });

  test('writeSections should correctly format sections into a markdown file', async () => {
    const filePath = path.join(testDir, 'test-write.md');
    const sections = [
      { heading: 1, title: 'Section A', content: 'Content A' },
      { heading: 2, title: 'Section B', content: 'Content B' },
    ];

    await writeSections(filePath, sections);

    const output = await fs.readFile(filePath, 'utf-8');
    const expected = `# Section A

Content A

## Section B

Content B
`;
    assert.strictEqual(output, expected);
  });

  test('extractSections should handle files with no headings', async () => {
    const filePath = path.join(testDir, 'no-headings.md');
    const content = 'Just some text\nwithout any headings.';
    await fs.writeFile(filePath, content);

    const sections = await extractSections(filePath);
    assert.strictEqual(sections.length, 0);
  });

  test('extractSections should handle empty files', async () => {
    const filePath = path.join(testDir, 'empty.md');
    await fs.writeFile(filePath, '');

    const sections = await extractSections(filePath);
    assert.strictEqual(sections.length, 0);
  });

  test('extractLevel3SectionBodies should extract correct number of H3 sections from test-chapter.md', async () => {
    const bodies = await extractLevel3SectionBodies(chapterPath);
    // 6 sections * 6 H3s each = 36
    assert.strictEqual(bodies.length, 36);
  });

  test('extractSections should extract all sections from test-chapter.md', async () => {
    const sections = await extractSections(chapterPath);
    // 1 H1 + 9 H2 + 36 H3 = 46
    assert.strictEqual(sections.length, 46);

    // Verify first section (H1)
    assert.strictEqual(sections[0]?.heading, 1);
    assert.ok(sections[0]?.title.includes('Κεφάλαιο 4'));

    // Verify a random H3 section
    const h3Section = sections.find(s => s.title === 'Σπουδαιότητα και Σκοπιμότητα της Έρευνας');
    assert.ok(h3Section);
    assert.strictEqual(h3Section?.heading, 3);
  });

  test('replaceLevel3SectionBodies should replace content correctly', async () => {
    const bodies = await extractLevel3SectionBodies(chapterPath);
    const newBodies = bodies.map((b, i) => `New content for section ${i}`);

    const outputPath = path.join(testDir, 'test-chapter-replaced.md');
    await replaceLevel3SectionBodies(chapterPath, newBodies, { outputPath });

    const replacedBodies = await extractLevel3SectionBodies(outputPath);
    assert.strictEqual(replacedBodies.length, 36);
    assert.strictEqual(replacedBodies[0]?.trim(), 'New content for section 0');
    assert.strictEqual(replacedBodies[35]?.trim(), 'New content for section 35');
  });
});
