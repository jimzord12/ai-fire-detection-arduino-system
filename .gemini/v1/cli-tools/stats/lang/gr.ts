/**
 * Greek language configuration for markdown analysis
 */

import type { LanguageConfig } from './types.ts';

export const greekConfig: LanguageConfig = {
  code: 'gr',
  name: 'Ελληνικά (Greek)',

  // Greek sentences end with . ! ; (note: ; is the Greek question mark, · is the ano teleia/semicolon)
  // Also handles the rare use of ? in mixed texts
  sentenceEndPattern: /[.!;?]+(?:\s|$)/g,

  // Words are separated by whitespace (same as English)
  wordSplitPattern: /\s+/,

  // Citation block pattern: matches parenthetical citations that contain years
  // Handles: (Lin et al., 2010; Xylouris et al., 2024) or (Ghafoor & Koo, 2020)
  // Also handles Greek text inside parentheses with years
  citationBlockPattern: /[\(\[]([^)\]]*(?:19|20)\d{2}[^)\]]*)[\)\]]/g,

  // Individual citation pattern for Greek academic texts:
  // Handles both Greek and Latin author names with various connectors
  // Examples:
  //   - Lin et al., 2010
  //   - Xylouris et al., 2024
  //   - Ghafoor & Koo, 2020
  //   - Jung et al., 2023
  //   - Παπαδόπουλος κ.α., 2020
  //   - βάσει των Lin et al., 2010
  // The pattern extracts: AuthorName (with optional et al./κ.α./& SecondAuthor), Year
  individualCitationPattern:
    /([A-ZΑ-Ω][a-zA-Zα-ωάέήίόύώΆΈΉΊΌΎΏ'-]+(?:\s+(?:et\s+al\.?|κ\.?\s*α\.?|&|και|and)\s*(?:[A-ZΑ-Ω][a-zA-Zα-ωάέήίόύώΆΈΉΊΌΎΏ'-]+)?)?)\s*,?\s*((?:19|20)\d{2}[a-zα-ω]?)/g,

  // Numbered citations: [1], [2], [1-3], [1,2,3] (same as English)
  numberedCitationPattern: /\[(\d+(?:[-,]\d+)*)\]/g,

  // Footnotes: [^1], [^note] (same as English)
  footnoteCitationPattern: /\[\^([^\]]+)\]/g,

  // Greek question mark is ; (semicolon), but ? may also appear in mixed texts
  questionMarkPattern: /[;?]/g,

  // Common Greek abbreviations that don't end sentences
  abbreviations: [
    // Academic/Professional titles
    'Δρ.',
    'Καθ.',
    'κ.',
    'κα.',
    'Αρχ.',
    'Μηχ.',
    'Δικ.',
    // Common abbreviations
    'π.χ.',
    'δηλ.',
    'κ.λπ.',
    'κ.α.',
    'κ.ο.κ.',
    'βλ.',
    'σελ.',
    'σσ.',
    'αρ.',
    'τόμ.',
    'τεύχ.',
    'έκδ.',
    'εκδ.',
    // Mixed with English abbreviations often seen in academic Greek texts
    'et al.',
    'Fig.',
    'fig.',
    'Vol.',
    'vol.',
    'No.',
    'no.',
    'pp.',
    'p.',
    // Organizations
    'Α.Ε.',
    'Ε.Π.Ε.',
    'Ο.Ε.',
  ],

  // Detect Greek text (Greek alphabet characters)
  languageDetectionPattern: /[Α-Ωα-ωάέήίόύώΆΈΉΊΌΎΏ]{2,}/,
};
