# md-stats

A CLI tool to analyze markdown files and return detailed statistics.
Supports multiple languages with language-specific entity detection (English, Greek).

## Installation

```bash
cd .gemini/cli-tools/stats
npm install
```

## Usage

```bash
# Basic usage - formatted text output (auto-detects language)
npx tsx md-stats.ts <filepath>

# Specify language explicitly
npx tsx md-stats.ts <filepath> --lang gr
npx tsx md-stats.ts <filepath> --lang en

# JSON output
npx tsx md-stats.ts <filepath> --json

# Compact JSON output
npx tsx md-stats.ts <filepath> --json --compact

# List supported languages
npx tsx md-stats.ts --list-langs

# Using npm script
npm run stats -- <filepath>
npm run stats -- <filepath> --lang gr --json
```

## Examples

```bash
# Analyze a Greek thesis chapter (auto-detected)
npx tsx md-stats.ts ../../chapters/Chapter-2/gr/Chapter-2-Final.md

# Analyze with explicit Greek language
npx tsx md-stats.ts ../../chapters/Chapter-2/gr/Chapter-2-Final.md --lang gr

# Get JSON output for programmatic use
npx tsx md-stats.ts ../../../final-document/Thesis_Final.md --json
```

## Supported Languages

| Code | Name             | Notes                                                     |
| ---- | ---------------- | --------------------------------------------------------- |
| `en` | English          | Default, Latin alphabet patterns                          |
| `gr` | Ελληνικά (Greek) | Greek alphabet, `;` as question mark, `κ.α.` for "et al." |

### Language-Specific Features

Each language configuration includes:

- **Sentence detection patterns** - Greek uses `;` for question marks
- **Word splitting patterns** - Handles language-specific word boundaries
- **Citation patterns** - Recognizes both Latin and Greek author names
- **Abbreviation lists** - Language-specific abbreviations that don't end sentences

## Statistics Provided

### File Info

- File name and path
- File size (bytes and KB)

### Content Metrics

- Total words, characters (with/without spaces)
- Total lines, paragraphs, sentences

### Reading Estimates

- Reading time (~200 words/minute)
- Speaking time (~150 words/minute)

### Headings

- Total headings count
- Breakdown by level (H1-H6)

### References & Citations

- Total citations and unique count
- Author-year style citations (e.g., `[Author, 2020]`)
- Numbered citations (e.g., `[1]`, `[2]`)
- Footnotes (e.g., `[^1]`)
- References older than 5 years
- References older than 10 years
- Average reference age
- Oldest and newest references

### Links

- Total links
- External vs internal links
- Broken links (missing URLs)

### Images

- Total images
- Images with/without alt text

### Code

- Code blocks count
- Inline code count
- Programming languages used

### Lists

- Total lists (ordered/unordered)
- Total list items

### Tables

- Total tables
- Total rows and cells

### Blockquotes

- Total blockquotes

### Complexity Metrics

- Average words per sentence
- Average words per paragraph
- Longest/shortest paragraph word counts

## Output Formats

### Text (default)

Formatted, human-readable output with emojis and sections.

### JSON (`--json`)

Full statistics object as pretty-printed JSON.

### Compact JSON (`--json --compact`)

Minified JSON for piping to other tools.
