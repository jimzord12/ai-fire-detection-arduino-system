# Markdown Utilities

This module provides utilities for parsing, extracting, and modifying Markdown files using `mdast`.

## Features

- **Section Extraction**: Extract all sections (heading + content) from a Markdown file.
- **Level 3 Section Targeting**: Specifically target and replace bodies of `###` (H3) sections that reside under `##` (H2) headings.
- **Round-trip Support**: Read sections into structured objects and write them back to Markdown.

## Usage

### Extracting All Sections

Extract every heading and its subsequent content into a structured array.

```typescript
import { extractSections } from './markdown.ts';

const sections = await extractSections('path/to/file.md');
// Returns Array<{ heading: number, title: string, content: string }>
```

### Targeting H3 Section Bodies

Extract only the content (bodies) of H3 sections that are children of specific H2 sections.

```typescript
import { extractLevel3SectionBodies } from './markdown.ts';

const bodies = await extractLevel3SectionBodies('path/to/file.md', ['Excluded H2 Title']);
// Returns string[] containing the Markdown content of each H3 section
```

### Replacing H3 Section Bodies

Replace the content of H3 sections and save to a new file (useful for automated processing like "humanizing" text).

```typescript
import { replaceLevel3SectionBodies } from './markdown.ts';

const newBodies = ['Updated content for H3 section 1', 'Updated content for H3 section 2'];

await replaceLevel3SectionBodies('path/to/file.md', newBodies, {
  suffix: 'Updated',
  excludeH2Titles: ['Introduction'],
});
// Creates path/to/file-Updated.md with replaced content
```

### Writing Sections Back

Write a structured array of sections back to a Markdown file.

```typescript
import { writeSections, Section } from './markdown.ts';

const sections: Section[] = [
  { heading: 1, title: 'Title', content: 'Content' },
  { heading: 2, title: 'Subtitle', content: 'More content' },
];

await writeSections('output.md', sections);
```

## Dependencies

This utility relies on the following `unified` ecosystem packages:

- `mdast`
- `mdast-util-from-markdown`
- `mdast-util-to-markdown`
- `mdast-util-to-string`
