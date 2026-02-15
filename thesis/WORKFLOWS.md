# Workflows for Thesis Writing

## 1. Per Section Workflow

1. Create the Section using the gemini's custom command: `/sections:create <SECTION-ID>`. The ID is retrieved from `thesis/THESIS_OUTLINE.md` (e.g., `3_7_overview_of_edge_impulse_platform_pipeline`). This will generate a markdown file in the relevant `thesis/sections/<chapter_name>/<section_name>/markdown.md`.

2. We need to add IEEE citation. For this use gemini's custom command: `/ieee-cite <path-to-markdown-file>`. This will create a new file with the same name but with `_ieee` suffix (e.g., `markdown_ieee.md`) in the same folder. It will then remove the original markdown file and replace it with the new one. The new file will have IEEE formatted citations.

3. Extract the bibliography from the IEEE formatted markdown (`thesis/typst/chapters/<chapter_name>/sections/<section_name>/markdown_ieee.md`) file and insert it into the Section's `references.bib` file (`thesis/typst/chapters/<chapter_name>/sections/<section_name>/references.bib`). This file is located in the same folder as the markdown file. Be sure to use the BibTeX format for the references.

4. If there are any glossary terms in the section, extract them and insert them into the Section's `glossary.md` file (`thesis/typst/chapters/<chapter_name>/sections/<section_name>/glossary.md`). Use this custom gemini command: `/sections:utils:extract-glossary <markdown-file-path>`. This file is located in the same folder as the markdown file. Be sure to use the format: `**Term**: Definition` for each glossary entry. Once done, modify the `markdown_ieee.md` file to remove the glossary sub-section. Also update the file's name to `markdown_ieee_no_glossary.md` to reflect the change.

5. Now we are ready to create/populate the `content.typ` file (`thesis/typst/chapters/<chapter_name>/sections/<section_name>/content.typ`). This file should contain the actual content of the section, formatted in Typst. The markdown content from the `markdown_ieee.md` file should be converted to Typst format and inserted into this file. Be sure to maintain the structure of the section, including headings, subheadings, and any other formatting.

## 2. Per Chapter Workflow

1. Combine all the sections' `content.typ` files into a single `chapter_content.typ` file (`thesis/typst/chapters/<chapter_name>/chapter.typ`). This file should contain the entire content of the chapter, formatted in Typst. Be sure to maintain the structure of the chapter, including headings, subheadings, and any other formatting.

2. Update the global `bibliography.bib` file (`thesis/typst/bibliography.bib`) with the references from the chapter's sections. This can be done automatically by running the synchronization script:
   ```bash
   ./tools/utils/sync-bib.sh
   ```
   This ensures that all references are consolidated in a single file for the entire thesis. Do not worry about de-duplication as it is automatically handled by the Typst bibliography management system.

3. Run the typst compiler to generate the PDF for the chapter. This will allow us to review the chapter in its final format, make any necessary adjustments and verify that everything is correctly formatted.
