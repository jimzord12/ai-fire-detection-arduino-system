# Typst Workflow and Thesis File Structure

This document describes (i) basic Typst usage and (ii) how the thesis is structured in this repository.

## Typst quickstart

- Watch (live rebuild): `typst watch thesis/typst/main.typ`
- Compile once: `typst compile thesis/typst/main.typ /tmp/thesis_preview.pdf`

## Repository structure (thesis)

The thesis is composed using a three-tier include structure.

### Tier 3: Master document

- Entry point: `thesis/typst/main.typ`
- Responsibilities:
  - imports shared helpers
  - sets title/author/date/abstract via the template
  - includes all chapter controllers
  - loads the global bibliography

### Shared template and helpers

- Template: `thesis/typst/common/template.typ`
  - defines the document layout, metadata, ToC, and main body heading numbering
- Section-local glossary helper: `thesis/typst/common/glossary.typ`
  - provides `#section_glossary(entries)`

Glossary helper usage:

```typst
#section_glossary((
  (term: "TinyML", def: "Machine learning models designed to run on microcontrollers under tight RAM/Flash and power constraints."),
  (term: "Sensor fusion", def: "Combining multiple sensor modalities to improve discrimination of fire vs nuisance events."),
))
```

Notes:

- If `entries` is empty, nothing is rendered.
- Prefer a glossary subsection when a section introduces specialized terms.

### Tier 2: Chapter controllers

Each chapter has a controller file:

- Example: `thesis/typst/chapters/02_literature_review/chapter.typ`

Responsibilities:

- defines the chapter heading
- includes atomic section files using `#include`

### Tier 1: Atomic sections

Atomic sections live under each chapter folder:

- `thesis/typst/chapters/<chapter>/sections/<section_name>/content.typ`
- `thesis/typst/chapters/<chapter>/sections/<section_name>/references.bib` (section-local references)

Guideline:

- each subsection in `thesis/THESIS_OUTLINE.md` maps to one atomic section folder
- avoid writing large chapter-long blocks; keep content modular

## Citations and bibliography

- Cite inside Typst text using `@key`.
- Draft references close to the section being written (section-local `.bib`).
- Periodically merge curated entries into the global bibliography: `thesis/typst/bibliography.bib`.

## Figures and assets

- Thesis figures folder: `thesis/assets/figures/`.
- Prefer vector or high-resolution exports (e.g., `.svg` or high-res `.png`).

## Source-of-truth constraints

- `thesis/THESIS_OUTLINE.md` is the table of contents and source of truth.
- Do not invent new headings or reorder sections without updating the outline first.

## Related docs

More detailed notes (Markdown) exist in the same docs tree:

- `thesis/typst/docs/typst/usage/SETTINGS_AND_METADATA.md`
- `thesis/typst/docs/typst/usage/FIGURES.md`
- `thesis/typst/docs/typst/usage/TABLES.md`
- `thesis/typst/docs/typst/usage/MATH.md`
- `thesis/typst/docs/typst/usage/BIBLIOGRAPHY.md`
