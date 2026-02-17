// md-h3-sections.ts (ESM)

import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import type { Heading, Root, RootContent } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toMarkdown } from 'mdast-util-to-markdown';
import { toString as mdastToString } from 'mdast-util-to-string';

type H3Range = {
  h2Title: string;
  h3Title: string;
  headingIndex: number; // index of the ### node in root.children
  bodyStart: number; // first node after ###
  bodyEnd: number; // exclusive
};

function isMarkdownFilePath(p: string): boolean {
  const ext = path.extname(p).toLowerCase();
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
  if (!isMarkdownFilePath(filePath)) throw new Error(`Not a markdown file: ${filePath}`);
}

function makeSuffixedPath(filePath: string, suffix: string): string {
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const base = path.basename(filePath, ext);
  const safeSuffix = (suffix || 'Humanized').trim() || 'Humanized';
  return path.join(dir, `${base}-${safeSuffix}${ext}`);
}

function buildH3Ranges(root: Root, excludeH2Titles: string[] = []): H3Range[] {
  const exclude = new Set(excludeH2Titles);
  const nodes = root.children as RootContent[];

  // H3s before the first H2 are ignored:
  let currentH2Title: string | null = null;
  let currentH2Included = false;

  const ranges: H3Range[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (!n || n.type !== 'heading') continue;

    const h = n as Heading;

    if (h.depth === 1) {
      currentH2Title = null;
      currentH2Included = false;
      continue;
    }

    if (h.depth === 2) {
      const title = mdastToString(h).trim();
      currentH2Title = title;
      currentH2Included = title.length > 0 && !exclude.has(title);
      continue;
    }

    if (h.depth === 3 && currentH2Title !== null && currentH2Included) {
      const h3Title = mdastToString(h).trim();
      const bodyStart = i + 1;

      // Body ends at next heading of depth <= 3, or end of document.
      let bodyEnd = nodes.length;
      for (let j = bodyStart; j < nodes.length; j++) {
        const m = nodes[j];
        if (m && m.type === 'heading' && (m as Heading).depth <= 3) {
          bodyEnd = j;
          break;
        }
      }

      ranges.push({
        h2Title: currentH2Title,
        h3Title,
        headingIndex: i,
        bodyStart,
        bodyEnd,
      });
    }
  }

  return ranges;
}

function serializeNodesAsMarkdown(children: RootContent[]): string {
  const subtree: Root = { type: 'root', children };
  return toMarkdown(subtree).trimEnd();
}

/**
 * Extract Markdown bodies of all H3 sections under included H2 sections.
 *
 * @param filePath Path to a .md/.markdown file
 * @param excludeH2Titles Optional list of H2 titles to exclude (skips their H3 sections)
 * @returns Array of Markdown strings (each is the body under an H3 heading)
 */
export async function extractLevel3SectionBodies(
  filePath: string,
  excludeH2Titles: string[] = []
): Promise<string[]> {
  await assertReadableMarkdownFile(filePath);
  if (!Array.isArray(excludeH2Titles))
    throw new Error('excludeH2Titles must be an array of strings');

  const md = await fs.readFile(filePath, 'utf8');
  const root = fromMarkdown(md) as Root;

  const ranges = buildH3Ranges(root, excludeH2Titles);
  const nodes = root.children as RootContent[];

  return ranges.map(r => serializeNodesAsMarkdown(nodes.slice(r.bodyStart, r.bodyEnd)));
}

/**
 * Replace Markdown bodies of all H3 sections under included H2 sections and write to a NEW file
 * (default: basename-SUFFIX.ext, suffix defaults to "Humanized").
 *
 * If output file already exists, it will be overwritten.
 *
 * @param filePath Path to a .md/.markdown file
 * @param newBodies Array of Markdown strings to replace H3 bodies (must match extracted count)
 */
export async function replaceLevel3SectionBodies(
  filePath: string,
  newBodies: string[],
  opts?: {
    excludeH2Titles?: string[];
    outputPath?: string;
    suffix?: string; // default "Humanized"
  }
): Promise<void> {
  await assertReadableMarkdownFile(filePath);
  if (!Array.isArray(newBodies)) throw new Error('newBodies must be an array of strings');

  const excludeH2Titles = opts?.excludeH2Titles ?? [];
  if (!Array.isArray(excludeH2Titles))
    throw new Error('opts.excludeH2Titles must be an array of strings');

  const md = await fs.readFile(filePath, 'utf8');
  const root = fromMarkdown(md) as Root;

  const ranges = buildH3Ranges(root, excludeH2Titles);
  if (newBodies.length !== ranges.length) {
    throw new Error(
      `Replacement count mismatch: expected ${ranges.length}, got ${newBodies.length}`
    );
  }

  const nodes = root.children as RootContent[];

  // Splice from end to start so indices remain valid.
  for (let k = ranges.length - 1; k >= 0; k--) {
    const r = ranges[k];
    if (!r) continue;
    const replacementRoot = fromMarkdown(newBodies[k] ?? '') as Root;
    const replacementNodes = (replacementRoot.children ?? []) as RootContent[];
    nodes.splice(r.bodyStart, r.bodyEnd - r.bodyStart, ...replacementNodes);
  }

  let out = toMarkdown(root);
  if (!out.endsWith('\n')) out += '\n';

  const outputPath = opts?.outputPath ?? makeSuffixedPath(filePath, opts?.suffix ?? 'Humanized');

  await fs.writeFile(outputPath, out, 'utf8');
}

export interface Section {
  heading: number;
  title: string;
  content: string;
}

/**
 * Extract all sections from a Markdown file.
 * Each section starts with a heading and includes all content until the next heading.
 */
export async function extractSections(filePath: string): Promise<Section[]> {
  await assertReadableMarkdownFile(filePath);
  const md = await fs.readFile(filePath, 'utf8');
  const root = fromMarkdown(md) as Root;
  const nodes = root.children as RootContent[];
  const sections: Section[] = [];

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (n && n.type === 'heading') {
      const h = n as Heading;
      const title = mdastToString(h).trim();
      const bodyStart = i + 1;

      let bodyEnd = nodes.length;
      for (let j = bodyStart; j < nodes.length; j++) {
        const m = nodes[j];
        if (m && m.type === 'heading') {
          bodyEnd = j;
          break;
        }
      }

      const content = serializeNodesAsMarkdown(nodes.slice(bodyStart, bodyEnd));
      sections.push({
        heading: h.depth,
        title,
        content,
      });
    }
  }

  return sections;
}

/**
 * Write an array of sections back to a Markdown file.
 */
export async function writeSections(filePath: string, sections: Section[]): Promise<void> {
  let md = '';
  for (const section of sections) {
    md += `${'#'.repeat(section.heading)} ${section.title}\n\n${section.content}\n\n`;
  }
  await fs.writeFile(filePath, md.trim() + '\n', 'utf8');
}

