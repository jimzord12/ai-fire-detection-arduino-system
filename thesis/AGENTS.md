# Thesis Writing Workflow: Typst & Modular Composition

This document explains the technical setup for the Fire Detection System thesis and how to use the iterative workflow.

## 0. Source of Truth (Non-Negotiable)

- `thesis/THESIS_OUTLINE.md` is the **table of contents and source of truth**.
- Sections must match the outline headings and scope. Do not invent new sections or reorder content.

## 0.1 Writing order (body first)

- The thesis body chapters/sections are drafted first.
- Front matter and back matter (Abstract, lists, global glossary, appendices formatting) are completed **after** the body is composed.

## 1. Why Typst?

We are using **Typst** instead of LaTeX for several reasons:

- **Performance:** Instant incremental compilation (no more waiting for PDFs to render).
- **Simplicity:** A modern, readable syntax that feels like Markdown but has the power of LaTeX.
- **Modularity:** Excellent support for `#include` which powers our "Section-to-Chapter" workflow.

## 2. The Modular Workflow

To allow for iterative development, the thesis is broken down into three tiers:

### Tier 1: Atomic Sections (`sections/`)

Every sub-heading in your outline is a standalone **section folder**.

- Each section folder contains:
  - `content.typ`: The actual Typst content for the section.
  - `references.bib`: Section-local bibliography (merged into global later).
  - `glossary.md`: (Optional) Terms and definitions for the section.
  - `markdown_ieee_no_glossary.md`: (Internal) The processed IEEE-indexed drafting source.

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

## 3. How to Write and Preview

### Adding Content

1. Create or open the section content file:
   `thesis/typst/chapters/01_introduction/sections/1_2_problem_statement/content.typ`.
2. Write your content using Typst syntax.
3. Ensure the section is included in the chapter's `chapter.typ`.

Optional but recommended:

- Add references for that section in:
  `thesis/typst/chapters/01_introduction/sections/1_2_problem_statement/references.bib`.

### Real-time Preview

If you have the Typst CLI installed, run this command in your terminal from the project root:

```bash
typst watch thesis/typst/main.typ
```

Typst + repo structure guide (standalone Typst document):

- Readable Markdown: `thesis/typst/docs/typst/usage/WORKFLOW_AND_STRUCTURE.md`
- Renderable Typst: `thesis/typst/docs/typst/usage/WORKFLOW_AND_STRUCTURE.typ`

This will open/update a PDF every time you save a `.typ` file.

### Citations

For drafting, keep citations **close to the text**:

- Put new entries in the section-local `.bib` file next to your section `.typ`.
- Periodically merge curated entries into the thesis-wide bibliography: `thesis/typst/bibliography.bib`.

In the `.typ` text, cite sources using `@key`.
Example: `As discussed by @perez2023tinyml...`

### Section-local glossary (when needed)

The main body should not pause to define basic terms (e.g., microcontroller, inference, dataset). Instead:

- Add a short **Glossary** subsection inside the atomic section file **only when new terms are introduced**.
- Keep definitions brief and technical.

Recommended pattern at the end of a section:

- `=== Glossary` (only if needed)
- bullet list: `Term: definition`

For consistency, prefer using the shared Typst helper (available globally in the thesis build):

- Helper: `#section_glossary(( (term: "...", def: "..."), ... ))`
- Defined in: `thesis/typst/common/glossary.typ`
- Imported in: `thesis/typst/main.typ`

---

## 4. Key Formatting Tips (Robotic Framing)

Per the `WRITING_TIPS.md`, remember to use the specific "Robotic" terminology in your sections:

- **Instead of "Detector":** Use _Autonomous Sensing Node_ or _Edge Intelligence Unit_.
- **Architecture:** Emphasize the _Asymmetric Multi-Processing_ of the Arduino UNO R4 (Renesas + ESP32).

## 5. Progress Tracking

Use `thesis/THESIS_PROGRESS.md` to mark sections as:

- 🔲 **Todo**
- 📝 **Drafting**
- ✅ **Done**

This helps you see the "big picture" while working on tiny, modular pieces.

---

## 6. Literature Review Workflow (PRISMA-Inspired Rapid SLR)

This thesis uses a **PRISMA-inspired rapid systematic literature review (SLR)** process. The goal is to be
transparent and repeatable without the overhead of a full degree-level SLR.

### 6.1 Fixed Scope (do not change mid-way)

- **Publication window:** 2015–present (exclude anything before 2015)
- **Domains:** cover **both** (a) indoor/building fire detection and (b) wildland/wildfire detection
- **Methods:** include multi-sensor and sensor-fusion methods aligned with the thesis outline (e.g., Kalman,
  Bayesian, neural networks, and hybrid strategies)

### 6.2 Where the protocol and templates live

All audit artifacts live in `thesis/literature/`:

- `PRISMA_PROTOCOL.md`: protocol (databases, queries, inclusion/exclusion, extraction)
- `PRISMA_FLOW.md`: PRISMA flow template (Mermaid diagram + counts table)
- `screening_log.csv`: title/abstract + full-text screening decisions (with reasons)
- `extraction_table.csv`: data extraction table for included peer-reviewed studies

### 6.3 What counts as a “study”

- **Count in PRISMA:** peer-reviewed conference/journal papers.
- **Do NOT count in PRISMA totals:** standards (e.g., EN 54 / NFPA 72) and datasheets/manuals.
  Track them as supporting technical sources and cite them where needed.

### 6.4 Step-by-step workflow (single-author)

1. Run the two core searches (Indoor query + Wildland query) in the selected databases.
2. Export all results to a reference manager (Zotero/Mendeley/etc.).
3. Deduplicate.
4. Screen titles/abstracts and record decisions in `screening_log.csv`.
5. Retrieve full-text for “include”/“maybe”, then perform full-text screening (log exclusion reasons).
6. For included studies, fill `extraction_table.csv` (sensors, fusion method, classes, metrics, edge constraints).
7. Copy final counts into `PRISMA_FLOW.md` and summarize the process in Chapter 2.

Optional bias-reduction (recommended): do a quick second-pass consistency check on ~10% of title/abstract decisions.

### 6.5 Where it appears in the Typst thesis

The methodology write-up is a dedicated section in the Literature Review chapter:

- `thesis/typst/chapters/02_literature_review/sections/2_0_prisma_method/content.typ`

The chapter controller includes it via `#include`.

---

## 8. External Research Agent (Academic Scholar)

If a separate research agent is used to collect academic material, it must follow the config contract:

- `thesis/research_agent/ACADEMIC_SCHOLAR_AGENT_CONFIG.md`

---

## 7. Style and tone (semester thesis defaults)

- **Language:** English only.
- **Voice:** prefer an **impersonal academic style** (safe default: passive/impersonal phrasing). Avoid first-person narration unless required.
  - Prefer: “The system was evaluated…”, “Data were collected…”, “The model was deployed…”
  - Avoid: “We evaluated…”, “I collected…”
- **Specificity:** when the outline calls for it, be specific (e.g., name the Arduino UNO R4 WiFi and the selected sensors), especially in Chapter 1 framing and Chapters 4–5.
