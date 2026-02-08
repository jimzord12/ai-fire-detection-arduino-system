# Thesis Writing Workflow: Typst & Modular Composition

This document explains the technical setup for the Fire Detection System thesis and how to use the iterative workflow.

## 1. Why Typst?
We are using **Typst** instead of LaTeX for several reasons:
- **Performance:** Instant incremental compilation (no more waiting for PDFs to render).
- **Simplicity:** A modern, readable syntax that feels like Markdown but has the power of LaTeX.
- **Modularity:** Excellent support for `#include` which powers our "Section-to-Chapter" workflow.

## 2. The Modular Workflow
To allow for iterative development, the thesis is broken down into three tiers:

### Tier 1: Atomic Sections (`sections/`)
Every sub-heading in your outline is a standalone `.typ` file. 
- **Location:** `thesis/typst/chapters/[chapter_name]/sections/`
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
1. Create or open a section file: `thesis/typst/chapters/01_introduction/sections/1_2_problem_statement.typ`.
2. Write your content using Typst syntax.
3. Ensure the section is included in the chapter's `chapter.typ`.

### Real-time Preview
If you have the Typst CLI installed, run this command in your terminal from the project root:
```bash
typst watch thesis/typst/main.typ
```
This will open/update a PDF every time you save a `.typ` file.

### Citations
Add your sources to `thesis/typst/bibliography.bib` and cite them in your text using `@key`.
Example: `As discussed by @perez2023tinyml...`

---

## 4. Key Formatting Tips (Robotic Framing)
Per the `WRITING_TIPS.md`, remember to use the specific "Robotic" terminology in your sections:
- **Instead of "Detector":** Use *Autonomous Sensing Node* or *Edge Intelligence Unit*.
- **Architecture:** Emphasize the *Asymmetric Multi-Processing* of the Arduino UNO R4 (Renesas + ESP32).

## 5. Progress Tracking
Use `thesis/THESIS_PROGRESS.md` to mark sections as:
- 🔲 **Todo**
- 📝 **Drafting**
- ✅ **Done**

This helps you see the "big picture" while working on tiny, modular pieces.
