---
model: Claude Sonnet 4.6 (copilot)
description: Collects and organizes all local codebase data needed for a specific thesis section, ready to hand off to a Research Agent.
tools: [vscode, execute, read, agent, edit, search, web, 'web-reader/*', 'web-search-prime/*', todo]
argument-hint: Provide the section index (e.g. "8.7")
name: Collect Section Data
---

Your task is to collect and organize all **local codebase data** relevant to the thesis section identified by the index: **${input:sectionIndex:e.g. 8.7}**

Do **not** write the section. Do **not** offer suggestions or opinions. Only gather, extract, and present raw data from the files listed below.

---

## Step 1 — Resolve Section Metadata

Read `thesis/THESIS_OUTLINE.md`.

Find the entry for section **${input:sectionIndex}** and extract:

- Full section title
- Target word count
- Information source label (`web`, `local`, or `web + local`)
- All subsections defined for this section with their individual word counts and information sources

---

## Step 2 — Resolve Section Status and Notes

Read `thesis/THESIS_PROGRESS.md`.

Find the row for section **${input:sectionIndex}** and extract:

- Current status
- Any notes

---

## Step 3 — Resolve File Paths

From the section index **${input:sectionIndex}**, derive:

- **Chapter number**: the integer before the dot (e.g. `8.7` → chapter `8`)
- **Chapter folder**: match to the correct folder under `thesis/typst/chapters/` (e.g. `08_experimental_results_evaluation`)
- **Section folder**: match to the correct folder under that chapter's `sections/` directory (e.g. `8_7_comparison_with_baseline_approaches`)

Read the file at `thesis/typst/chapters/<chapter_folder>/sections/<section_folder>/content.typ` and include its full contents.

---

## Step 4 — Read Style and Writing Rules

Read `thesis/WRITING_TIPS.md` — extract:

- Academic voice rules
- Tense rules
- Quantification requirements
- Thesis-specific terminology (e.g. "Autonomous Sensing Node")

Read `thesis/AGENTS.md` (section 5 onwards) — extract any formatting or framing tips.

---

## Step 5 — Collect Chapter-Specific Local Data

Based on the chapter number derived in Step 3, read the files listed below for that chapter. For sections that span multiple chapters, read all relevant groups.

### Chapter 1 — Introduction

- `README.md`
- `AGENTS.md`

### Chapter 3 — Theoretical Background

- `data/analysis/DATA_ANALYSIS_REPORT.md`
- `docs/research/firmware-notes.md`
- `docs/research/data-collection/sampling-and-format.md`

### Chapter 4 — Sensor Selection and Characterization

- `docs/research/firmware-notes.md`
- `firmware/diagnostics/verify_all_sensors_operational.ino`
- `firmware/examples/` — list all files and read each

### Chapter 5 — Hardware Platform and System Integration

- `docs/artifacts/fire-detection-main.md`
- `firmware/main/fire-detection-main/fire-detection-main.ino`
- `docs/research/firmware-notes.md`

### Chapter 6 — Data Collection Methodology

- `docs/guides/DATA_COLLECTION_GUIDE.md`
- `docs/research/data-collection/fire.md`
- `docs/research/data-collection/false_alarm.md`
- `docs/research/data-collection/no_fire.md`
- `docs/research/data-collection/sampling-and-format.md`
- `docs/research/data-collection/storage-and-validation.md`
- `docs/research/data-collection/checklist.md`
- `docs/research/automated-data-collection.md`
- List the contents of `data/raw/` (directory tree, no file contents)

### Chapter 7 — Implementation

- `firmware/main/fire-detection-main/fire-detection-main.ino`
- `docs/research/edge-impulse-platform/` — list all files and read each
- `docs/research/ml-model-arduino-deployment.md`
- `model/edge-impulse-model/` — list all files (no binary content)

### Chapter 8 — Experimental Results and Evaluation

- `data/analysis/DATA_ANALYSIS_REPORT.md`
- `data/analysis/analysis_results.json`
- `data/analysis/aggregated_data.csv` — read only the first 5 rows plus the header
- `docs/notes/scenario-a3.md`
- `docs/notes/scenario-c2.md`
- List the contents of `data/figures/` (filenames only)

### Chapter 9 — Discussion

- `data/analysis/DATA_ANALYSIS_REPORT.md` (sections 5 and 9 only — Insights & Conclusion)
- `data/analysis/analysis_results.json`
- `docs/research/discussion-section/better-data-collection-startegy.md`

### Chapter 10 — Conclusion and Future Work

- `data/analysis/DATA_ANALYSIS_REPORT.md` (section 8 — Implications for TinyML Deployment, and section 9 — Conclusion)
- `thesis/FUTURE_PLANS_IDEAS.md`

---

## Step 6 — Output Format

Present all collected data in a single, structured Markdown document using the following structure. Include the raw content, numbers, and quotes from files exactly as found. Do not paraphrase data.

```
## Section Metadata
[from Step 1 and Step 2]

## Existing Section Content
[full content of content.typ]

## Writing Style Rules
[extracted rules from WRITING_TIPS.md and AGENTS.md]

## Local Data
[all file contents collected in Step 5, grouped by source file with clear headings]
```

If a file listed in Step 5 does not exist, note it as "File not found: <path>" and continue.
