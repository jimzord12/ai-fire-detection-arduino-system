/**
 * English language configuration for markdown analysis
 */

import type { LanguageConfig } from './types.ts';

export const englishConfig: LanguageConfig = {
  code: 'en',
  name: 'English',

  // Sentences end with . ! ?
  sentenceEndPattern: /[.!?]+(?:\s|$)/g,

  // Words are separated by whitespace
  wordSplitPattern: /\s+/,

  // Citation block pattern: matches (Author, 2020) or (Author, 2020; Other, 2021)
  // Also matches [Author, 2020] style
  citationBlockPattern: /[\(\[]([^)\]]*(?:19|20)\d{2}[^)\]]*)[\)\]]/g,

  // Individual citation pattern: extracts "Author et al., 2020" or "Author & Other, 2020" from within a block
  // Handles: Author, 2020 | Author et al., 2020 | Author & Other, 2020 | Author and Other, 2020
  individualCitationPattern:
    /([A-Z][a-zA-Z'-]+(?:\s+(?:et\s+al\.?|&|and)\s+[A-Z][a-zA-Z'-]+)?)\s*,?\s*((?:19|20)\d{2}[a-z]?)/g,

  // Numbered citations: [1], [2], [1-3], [1,2,3]
  numberedCitationPattern: /\[(\d+(?:[-,]\d+)*)\]/g,

  // Footnotes: [^1], [^note]
  footnoteCitationPattern: /\[\^([^\]]+)\]/g,

  // Question marks in English
  questionMarkPattern: /\?/g,

  // Common English abbreviations that don't end sentences
  abbreviations: [
    'Dr.',
    'Mr.',
    'Mrs.',
    'Ms.',
    'Prof.',
    'Sr.',
    'Jr.',
    'vs.',
    'etc.',
    'i.e.',
    'e.g.',
    'al.',
    'Fig.',
    'fig.',
    'Vol.',
    'vol.',
    'No.',
    'no.',
    'pp.',
    'p.',
    'ed.',
    'eds.',
    'Inc.',
    'Corp.',
    'Ltd.',
    'Co.',
    'St.',
    'Ave.',
    'Blvd.',
  ],

  // Detect English text (Latin alphabet with common English patterns)
  languageDetectionPattern: /[a-zA-Z]{3,}/,
};
