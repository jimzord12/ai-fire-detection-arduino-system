# Comprehensive Guide to Setting Up and Customizing the ls1intum Typst Thesis Template

The **ls1intum/thesis-template-typst** repository (https://github.com/ls1intum/thesis-template-typst) is an excellent, highly structured choice for your thesis—especially with an AI agent doing most of the writing. As of January 2026 (latest release v1.0.26 from November 2025), it's actively maintained and provides rich boilerplate: placeholder chapters, modular layout/utils, bibliography support, and even a proposal template. This gives your AI agent plenty of high-quality examples to reference, reducing hallucinations when generating or editing content.

The template is originally for Technical University of Munich (TUM) Informatics theses, using a classic serif style (New Computer Modern fonts). We'll cover setup, then enhancements for **modularity** (to make it even more AI-friendly) and a **modern, professional, "chill" aesthetic**—think clean sans-serif typography, subtle colors, generous spacing, and minimalist vibes (inspired by templates like elegant-polimi-thesis or modern-uit-thesis, but built on this repo's strong structure).

## Step 1: Creating and Cloning the Repository

1. Go to https://github.com/ls1intum/thesis-template-typst.
2. Click **"Use this template"** → **"Create a new repository"** (name it something like `my-greek-thesis-typst`).
3. Clone it locally:
   ```bash
   git clone https://github.com/yourusername/my-greek-thesis-typst.git
   cd my-greek-thesis-typst
   ```
4. (Optional but recommended) Create a `.gitignore` if not present, adding `*.pdf` to avoid committing large outputs.

This gives you a clean starting point with version control—perfect for iterating with your AI agent.

## Step 2: Initial Setup and Compilation Test

1. Ensure Typst is installed (from previous guide: snap, binary, or cargo).
2. **Fonts**: The template uses custom New Computer Modern fonts in `/fonts/newComputerModern`. For initial testing:
   - Install them system-wide (copy to `~/.local/share/fonts/` on Linux, then run `fc-cache -fv`).
   - But we'll replace these later for a modern look—skip heavy installation if you plan changes.
3. Test compilation:
   ```bash
   typst compile thesis.typ thesis.pdf
   ```
   - For live updates (great while AI edits): `typst watch thesis.typ thesis.pdf`
   - Also test `proposal.typ` if needed.

You should get a PDF with placeholder content (abstract, chapters, bibliography).

## Step 3: Understanding the File Structure

Key directories/files (ideal for AI modularity):

- `/content/` → Your main writing goes here. Subfiles like `abstract.typ`, `introduction.typ`, etc., with placeholders. AI can target specific files.
- `/figures/` → For images/diagrams (AI can suggest CeTZ code here).
- `/fonts/` → Custom fonts (we'll minimize reliance).
- `/layout/` → Styling: page setup, headings, title page, etc. Great for tweaks.
- `/utils/` → Helper functions (e.g., for figures, tables).
- Root files:
  - `thesis.typ` → Main entrypoint (imports metadata, layout, includes content).
  - `proposal.typ` → Separate for proposals.
  - `metadata.typ` → All your personal/thesis info.
  - `thesis.yml` (recommended) or `thesis.bib` → Bibliography.

This multi-file setup is already AI-friendly—your agent can edit isolated chapters without breaking the whole document.

## Step 4: Basic Customization for Your Greek Thesis

Edit `metadata.typ` (it's a Typst struct—easy to read/modify):

```typst
#let metadata = (
  degree: "Master's Thesis",  // or "Diploma Thesis", "Bachelor's"
  program: "Electrical and Computer Engineering",  // your department
  title: (
    english: "Your English Title",
    german: none,  // remove German if not needed
  ),
  author: "Your Name",
  supervisor: ("Prof. Supervisor Name", "Advisor Title"),
  examiner: none,  // remove TUM-specific if not required
  start-date: datetime(year: 2026, month: 1, day: 1),
  submission-date: datetime.today(),
  university: "National Technical University of Athens",  // or your uni
  faculty: "School of Electrical and Computer Engineering",
  // Add custom fields if needed, e.g., declaration: true
)
```

- Remove TUM-specific pages: In `thesis.typ` or `/layout/`, comment out includes for registration certificate or similar.
- Add Greek elements: If your university requires a declaration page, add a new file `/content/declaration.typ` and `#include` it.
- Bibliography: Stick with `thesis.yml` (Hayagriva format—easier for AI to generate entries).

## Step 5: Enhancing Modularity (AI-Agent Friendly)

The repo is already modular, but to make it **even more flexible**:

1. **Split settings further**:
   - Create `config.typ` in root:
     ```typst
     #let config = (
       fonts: (main: "Inter", heading: "Inter", mono: "Fira Code"),
       colors: (accent: rgb("#0066cc"), background: rgb("#f8f9fa")),
       margins: (left: 3cm, right: 2.5cm, top: 2.5cm, bottom: 2.5cm),
       spacing: 1.5,
     )
     ```
   - Import this in `layout/` files and `thesis.typ`.
   - Bonus: Separate `titlepage-config.typ` for title-specific options.

2. **Chapter management**: Keep `/content/` as-is, but add a `chapters.typ` file listing includes:
   ```typst
   #include "content/abstract.typ"
   #include "content/introduction.typ"
   // AI can append new ones here dynamically
   ```

3. **Utils expansion**: Add `/utils/modern-elements.typ` for reusable modern components (e.g., custom blocks, cards).

This way, your AI agent can tweak one config file for global changes, or focus on content files without touching layout.

## Step 6: Making It Feel Modern, Professional, and "Chill"

The original is strict/classic (serif, dense). To transform it into a **modern, relaxed yet professional** vibe (clean lines, breathing room, subtle personality—think Apple/Google docs meets academic):

1. **Fonts (Biggest Impact)**:
   - Ditch New Computer Modern. Use modern sans-serif system fonts (no embedding needed):
     In a new `/layout/fonts.typ` or directly in `thesis.typ`:
     ```typst
     #set text(font: "Inter", size: 11pt, lang: "en")  // Download Inter if needed
     #set heading(font: "Inter", weight: "semibold")
     #set strong(font: "Inter")
     #set raw(font: "Fira Code")  // for code
     ```
     - Alternatives: "Roboto", "Helvetica", "Arial" (widely available), or "Libre Franklin".
     - For Greek support: Add `"TeX Gyre Heros"` or ensure your font has polytonic Greek.

2. **Colors and Accents**:
   - Add subtle color:
     ```typst
     #let accent = rgb("#2e86ab")  // calm blue
     #show heading: it => text(fill: accent, it)
     #show link: it => underline(text(fill: accent, it))
     ```

3. **Spacing and Layout**:
   - Generous, airy feel:
     ```typst
     #set page(margin: (x: 2.5cm, y: 3cm), paper: "a4")
     #set par(justify: true, leading: 1em)  // taller line spacing
     ```
   - Modern headings: Add underlines or blocks:
     ```typst
     #show heading.where(level: 1): it => block(above: 2em, below: 1.5em, text(size: 1.8em, it))
     ```

4. **Title Page Redesign**:
   - Simplify `/layout/titlepage.typ`: Center vertically, larger title, subtle university logo if allowed.
   - Inspiration: Look at elegant-polimi-thesis for clean centering.

5. **Other Touches**:
   - Use `@preview/cetz` or `@preview/polylux` for modern diagrams/slides.
   - Block quotes/alerts with soft backgrounds.
   - TOC with dotted leaders but sans font.

Result: Professional (meets academic standards) but chill (not intimidating—inviting to read).

## Final Tips for AI-Assisted Workflow

- Feed your AI the full structure/README snippets as context.
- Have it generate new chapters in `/content/` matching existing style.
- Commit often: `git add . && git commit -m "AI draft: Chapter 3"`.
- If you want even more modern starters, glance at Universe packages like `modern-uit-thesis` or `elegant-polimi-thesis` for code snippets to port.

This setup will give you a robust, beautiful thesis. If you share your university's guidelines PDF/link or preferred fonts/colors, I can provide exact code snippets! Enjoy—Typst makes this fun.