# Typst Directory Agent Guidelines

This document provides agent-specific guidelines for the `thesis/typst` directory, which contains all the source files for the thesis.

## Directory Structure

The `typst` directory is organized as follows:

```
typst/
├── assets/
│   ├── figures/  # Figures, plots, and images used in the thesis
│   └── tables/   # Data for tables
├── chapters/
│   ├── 01_introduction/
│   │   ├── chapter.typ
│   │   └── sections/
│   ├── ...       # Other chapters follow the same structure
│   └── 10_conclusion/
├── common/
│   ├── glossary.typ
│   └── template.typ  # The main thesis template
├── docs/           # Documentation for the Typst setup
├── main.typ        # The master file that assembles the thesis
└── bibliography.bib # Global bibliography file
```

### Key Files

-   **`main.typ`**: The entry point for the thesis. It sets up the document structure, includes chapters, and generates the table of contents and bibliography.
-   **`bibliography.bib`**: The global bibliography file in Hayagriva format. Section-specific `.bib` files are periodically merged into this file.
-   **`common/template.typ`**: The main Typst template that defines the style, layout, and formatting for the entire thesis.
-   **`chapters/**/*.typ`**: Each chapter is a directory containing a `chapter.typ` file that includes the individual sections. Sections are in the `sections` subdirectory.

## Workflow

The thesis is written in a modular way. Each section is a standalone directory containing a `content.typ` file (the text) and a `references.bib` file (the citations). These are then included in a chapter's `chapter.typ` file. Finally, all chapters are included in `main.typ`.

### Established Pattern (01_introduction example)
- Chapter folder: `thesis/typst/chapters/01_introduction/`
- Chapter controller: `thesis/typst/chapters/01_introduction/chapter.typ`
- Section folder: `thesis/typst/chapters/01_introduction/sections/1_1_background/`
- Section content: `thesis/typst/chapters/01_introduction/sections/1_1_background/content.typ`
- Section references: `thesis/typst/chapters/01_introduction/sections/1_1_background/references.bib`
- Inclusion in `chapter.typ`: `#include "sections/1_1_background/content.typ"`

### Compilation

To compile the thesis and generate a PDF, you can use the provided scripts from the project root:

```bash
# Using Bash
./tools/typst/compile.sh

# Using PowerShell
.\tools\typst\compile.ps1
```

Alternatively, you can use the Typst CLI to watch for changes and update the PDF automatically:

```bash
typst watch thesis/typst/main.typ
```

### Bibliography Management

-   **Modular References:** Each section can maintain its own `references.bib` file for drafting.
-   **Consolidation:** All local (section `references.bib`) `.bib` files should be consolidated into the global `bibliography.bib` file. This is done automatically using the synchronization script:
    ```bash
    ./tools/utils/sync-bib.sh
    ```
-   **De-duplication:** Typst's bibliography processing (via `#bibliography`) automatically handles de-duplication. Multiple in-text citations referencing the same unique key in `bibliography.bib` will only result in a single entry in the final reference list. This ensures consistency and avoids redundancy.

## Academic Standards & Rigor

### 1. Reference Validation
All bibliography entries must be verified for academic validity. Hobbyist blogs, YouTube videos, and "expert network" posts are **not permitted** as primary sources for technical claims.
-   **Tool:** Use `npx tsx .gemini/v1/cli-tools/ref-tools/verify-references.ts thesis/typst/bibliography.bib` to check for broken links and low-confidence metadata.
-   **Replacement Strategy:** If a source is flagged as non-academic, search for peer-reviewed alternatives in *IEEE Sensors*, *Information Fusion*, *Elsevier Fire Safety Journal*, or *ACM Transactions*.

### 2. Academic Humility
When reporting experimental results:
-   **Avoid Hyperbole:** Avoid terms like "perfect accuracy" or "total success" without qualification.
-   **Controlled Environment Disclaimer:** Always frame high performance (e.g., 100% accuracy) as a **baseline feasibility result achieved in controlled conditions**.
-   **Limitation Awareness:** Explicitly discuss the "Lab-to-Real-World gap," sensor drift, and compound interference scenarios (e.g., simultaneous false alarm sources).
-   **Safety-Critical Verification:** For life-safety systems, emphasize the need for longitudinal analysis, noise-injection, and stress testing in future work sections.
