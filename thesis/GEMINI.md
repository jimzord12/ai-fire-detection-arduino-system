# Thesis Writing Workflow: Typst & Modular Composition

This document explains the technical setup for the Fire Detection System thesis and how to use the iterative workflow.

## 1. Directory Structure

The `thesis` directory is organized to separate the written content from other project assets.

```
thesis/
├── assets/         # Figures, images, and other assets for the thesis
├── data_analysis/  # Reports and data specific to the thesis
├── literature/     # Literature review materials (PRISMA, extraction tables)
├── prompts/        # Prompts used for AI-assisted writing
├── thesis_templates/ # Templates for chapters, sections, etc.
└── typst/          # Core Typst source files for the thesis
    ├── assets/     # Typst-specific assets (e.g., fonts, logos)
    ├── chapters/   # Modular chapter files, each with its own sections
    ├── common/     # Shared Typst code (e.g., templates, glossary)
    ├── main.typ    # The master Typst document that assembles the thesis
    └── bibliography.bib # Global bibliography for the entire thesis
```

## 2. Why Typst?

We are using **Typst** instead of LaTeX for several reasons:

- **Performance:** Instant incremental compilation (no more waiting for PDFs to render).
- **Simplicity:** A modern, readable syntax that feels like Markdown but has the power of LaTeX.
- **Modularity:** Excellent support for `#include` which powers our "Section-to-Chapter" workflow.

## 3. The Modular Workflow

To allow for iterative development, the thesis is broken down into three tiers:

### Tier 1: Atomic Sections (`sections/`)

Every sub-heading in your outline is a standalone **section folder**.

- Each section folder contains:
  - `content.typ`: The actual Typst content for the section.
  - `references.bib`: Section-local bibliography.
- **Location:** `thesis/typst/chapters/[chapter_name]/sections/[section_id]_[section_name]/`
- **Benefit:** You can focus on writing 500–1000 words at a time without getting lost in a 70-page document.

### Tier 2: Chapter Controllers (`chapter.typ`)

Each chapter folder contains a `chapter.typ` file that acts as a glue layer.

- **Function:** It contains the main Chapter Heading and `#include` statements for each section.
- **Control:** You can comment out a section (using `//`) if you want to temporarily hide it from the final render.

### Tier 3: The Master Document (`main.typ`)

The root file that pulls everything together.

- **Function:** Manages the Title Page, Abstract, Table of Contents, Bibliography, and Global Styles.

---

## 4. How to Write and Preview

### Adding Content

1.  Create or open the section content file:
    `thesis/typst/chapters/01_introduction/sections/1_2_problem_statement/content.typ`.
2.  Write your content using Typst syntax.
3.  Ensure the section is included in the chapter's `chapter.typ`.

Optional but recommended:

- Add references for that section in:
  `thesis/typst/chapters/01_introduction/sections/1_2_problem_statement/references.bib`.

### Real-time Preview

If you have the Typst CLI installed, run this command in your terminal from the project root:

```bash
typst watch thesis/typst/main.typ
```

This will open/update a PDF every time you save a `.typ` file.

### Citations

For drafting, keep citations **close to the text**:

- Put new entries in the section-local `.bib` file next to your section `.typ`.
- Periodically merge curated entries into the thesis-wide bibliography: `thesis/typst/bibliography.bib`.

In the `.typ` text, cite them using `@key`.
Example: `As discussed by @perez2023tinyml...`

---

## 5. Key Formatting Tips (Robotic Framing)

Per the `WRITING_TIPS.md`, remember to use the specific "Robotic" terminology in your sections:

- **Instead of "Detector":** Use _Autonomous Sensing Node_ or _Edge Intelligence Unit_.
- **Architecture:** Emphasize the _Asymmetric Multi-Processing_ of the Arduino UNO R4 (Renesas + ESP32).

## 6. Progress Tracking

Use `thesis/THESIS_PROGRESS.md` to mark sections as:

- 🔲 **Todo**
- 📝 **Drafting**
- ✅ **Done**

This helps you see the "big picture" while working on tiny, modular pieces.

---

## 7. Reference Verification

All references in the bibliography must be verified for validity and accessibility before final submission.

### How to Run the Tool

```bash
cd .gemini/v1/cli-tools
npx tsx ref-tools/verify-references.ts ../../thesis/typst/bibliography.bib
```

### Understanding the Report

- **Location:** Generated in the same directory as the input file
- **Format:** `{input_basename}-validation-report-{timestamp}.md`
- **Contents:** Summary stats, confidence levels, detailed findings per reference

**Status Icons:**

| Icon | Status      | Description                             |
| ---- | ----------- | --------------------------------------- |
| ✅   | Verified    | High confidence match found in database |
| ⚠️   | Suspicious  | Partial match or title discrepancy      |
| ❌   | Broken Link | URL/DOI unreachable or returns 404      |

### Workflow for Fixing References

1. Review all `broken_link` and `suspicious` entries in the report
2. Find appropriate replacements for invalid DOIs (check Crossref, Semantic Scholar)
3. Ensure all references have either a `doi` or `url` field
4. Delete the previous report before re-running: `rm thesis/typst/bibliography-validation-report-*.md`
5. Re-run the verification tool
6. Repeat until no `broken_link` or `suspicious` entries remain

### Common Issues

- **DOI Not Found** - DOI may be incorrect or not yet registered; verify at https://doi.org
- **Access Denied** - Paywalled or restricted access; try alternative sources
- **HTTP 429** - Rate limited; wait a few minutes and retry

### ⚠️ Author Requirements

> **IMPORTANT:** "Anonymous" author values are **NOT permitted** in the bibliography.
>
> All references must have **identifiable authors**:
>
> - Individual researchers (e.g., "Smith, John")
> - Organizations (e.g., "IEEE Standards Association")
> - Institutions (e.g., "National Fire Protection Association")
>
> If a source has no identifiable author, **replace it with a better source** that has proper attribution. Anonymous sources lack academic credibility and should not be used in the thesis.
