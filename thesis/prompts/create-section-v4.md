## Goal

Create a Section draft for the assigned section, following the structure in `SECTION_TEMPLATE.md` and using only the PRISMA-Satisfiant Papers the follow the `PRISMA_PROTOCOL.md`.

## Non‑negotiable rules

- Provide all citations in-text.
- Use **APA 7th edition** in-text citations (author–date).
- Include a complete **APA 7th edition References** list for **all** sources you used.
- Follow the **PRISMA-inspired protocol** for searching and screening.
- Output must follow the structure in the uploaded `SECTION_TEMPLATE.md` exactly.
- You **MUST ONLY** use **academic sources**, no industry blogs, news articles, or non-peer-reviewed sources.
- Sources/references Amount: 3-5
- The Section must contain **only** a single "References" subsection at the end, with **all** references used in the section. As shown in the `SECTION_TEMPLATE.md`, do not include per-subsection references.

Quality gates (mandatory):

- **Cite close to the claim.** Place the APA in-text citation immediately after the specific fact/claim it supports (often mid-paragraph, not just at the end).
- **No hyperlinks as citations in the body.** Do not use Markdown links (or bare URLs) as in-text citations.
- **References must be complete.** Do not output references with missing authors/venue/DOI (no “details not available”). If metadata is missing, find the publisher record/DOI or replace the source.
- **Citation integrity:** every reference listed must be cited in the body at least once, and every key factual claim should have an APA in-text citation.

## Deliverable

Return the completed section in Markdown, matching `SECTION_TEMPLATE.md`:

- A single top-level section heading: `<SECTION_ID> <SECTION_TITLE>`
- Subsections as defined in the `THESIS_OUTLINE.md` (for the specified section)
- Subsections must contain **only subsection content** (no per-subsection references/glossary)
- After all subsections, include exactly:
    - one section-level `References` subsection containing **all APA 7th edition references used anywhere in this section**
    - one optional section-level `Glossary` subsection (only if needed, ~80% of the time it is NOT needed)

Use APA 7th edition formatting for:

- in-text citations (author–date)
- the `References` subsection entries

## Section Type

There are 3 types of Section in this Thesis:

- Web: All required information should be fetched from the Web (Academic soruces only).
- Local: All required information should be fetched from the local repo/codebase.
- Web + Local: The combination of the upper two.

If the Section is label as `local` or `Web + Local` you MUST demand information derived from the codebase. This information must explicitly labels as coming from the codebase using these 2 semantic symbols: `<localData>` and `</localData>`.

## Section Selection

- **Target Chapter:** 9
- **Target Section:** 9.4

---

<localData>

</localData>
