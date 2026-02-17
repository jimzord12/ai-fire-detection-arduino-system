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

### Post-Writing Steps

#### Reference Verification

Verify all references in the bibliography file are valid and accessible.

**Run the tool:**

```bash
cd .gemini/v1/cli-tools
npx tsx ref-tools/verify-references.ts ../../thesis/typst/bibliography.bib
```

**Understanding the report:**

- Report is generated in the same directory as the input file
- Format: `{input_basename}-validation-report-{timestamp}.md`
- Contains: Summary stats, confidence levels, detailed findings per reference

**Status icons:**

- ✅ Verified - High confidence match found in database
- ⚠️ Suspicious - Partial match or title discrepancy
- ❌ Broken Link - URL/DOI unreachable or returns 404

**Workflow for fixing references:**

1. Review all `broken_link` and `suspicious` entries in the report
2. Find appropriate replacements for invalid DOIs (check Crossref, Semantic Scholar)
3. Ensure all references have either a `doi` or `url` field
4. Delete the previous report before re-running: `rm thesis/typst/bibliography-validation-report-*.md`
5. Re-run the verification tool
6. Repeat until no `broken_link` or `suspicious` entries remain

**Common issues:**

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
