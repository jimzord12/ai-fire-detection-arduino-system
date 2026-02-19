# Workflows for Thesis Writing

The workflows are divided into two main categories: per section and per chapter.

Each workflow outlines the steps to be followed to ensure that the content is properly formatted, cited, and organized for the final thesis document.

## 1. Section Workflow

### What you should already exist in the section's folder:

If the section required external research, you should find a `thesis\typst\chapters\<chapter_name>\sections\<section_name>\research` folder containing the following files:

- `XXX_research.md` - The section's research in markdown format. Usually 2-3 files.
- `research_query.md` - The original research query used to gather information for the section. Do **NOT** use this file for the section's content. It is internal, and only exists for reference to understand the research process.

if the section did not require external research, you should **NOT** find a `thesis\typst\chapters\<chapter_name>\sections\<section_name>\research` folder.

### Steps to create a section:

1. Create the Section using the gemini's custom command: `/sections:create <SECTION-ID>`. The ID is retrieved from `thesis/THESIS_OUTLINE.md` (e.g., `3_7_overview_of_edge_impulse_platform_pipeline`). This will generate a markdown file in the relevant `thesis/sections/<chapter_name>/<section_name>/content.md`.

2. We need to add IEEE citations. For this use gemini's custom command: `/ieee-cite <path-to-markdown-file>`. This will create a new file with the same name but with `_ieee` suffix (e.g., `content_ieee.md`) in the same folder. It will then remove the original markdown file and replace it with the new one. The new file will have IEEE formatted citations.

3. Extract the bibliography from the IEEE formatted markdown (`thesis/typst/chapters/<chapter_name>/sections/<section_name>/content_ieee.md`) file and insert it into the Section's `references.bib` file (`thesis/typst/chapters/<chapter_name>/sections/<section_name>/references.bib`). This file is located in the same folder as the markdown file. Be sure to use the BibTeX format for the references.

4. If there are any glossary terms in the section, extract them and insert them into the Section's `glossary.md` file (`thesis/typst/chapters/<chapter_name>/sections/<section_name>/glossary.md`). Use this custom gemini command: `/sections:utils:extract-glossary <markdown-file-path>`. This file should be located in the root of the section folder. Be sure to use the format: `**Term**: Definition` for each glossary entry. Once done, modify the `content_ieee.md` file to remove the glossary sub-section. Also update the file's name to `content_ieee_no_glossary.md` to reflect the change.

5. Now we are ready to create/populate the `content.typ` file (`thesis/typst/chapters/<chapter_name>/sections/<section_name>/content.typ`). This file should contain the actual content of the section, formatted in Typst. The markdown content from the `content_ieee.md` or `content_ieee_no_glossary.md` file should be converted to Typst format and inserted into this file. Be sure to maintain the structure of the section, including headings, subheadings, and any other formatting.

### Post-Writing Steps

All of the following steps should be completed after the `content.typ` file has been created and populated with the section's content.

Do NOT stop until all the checks have been completed.

Checklist:

- [ ] Verify that all references in the `references.bib` file are valid and accessible. Use the reference verification tool as described in the "Post-Writing Steps" section of the "Per Chapter Workflow".
- [ ] Ensure that all glossary terms are correctly formatted and defined in the `glossary.md` file.
- [ ] Run the typst compiler to generate the PDF for the section. This will allow us to verify if there are any syntax or type errors in the `content.typ` file and to review the section in its final format.

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
