/**
 * Language-specific configuration types for markdown analysis
 */

export interface LanguageConfig {
  /** Language code (e.g., 'en', 'gr') */
  code: string;

  /** Language display name */
  name: string;

  /** Patterns for sentence-ending punctuation */
  sentenceEndPattern: RegExp;

  /** Pattern for word boundaries/splitting */
  wordSplitPattern: RegExp;

  /**
   * Pattern for parenthetical citation blocks.
   * This matches the entire citation block like (Author, 2020; Other, 2021)
   * Individual citations are extracted separately.
   */
  citationBlockPattern: RegExp;

  /**
   * Pattern to extract individual author-year citations from within a citation block.
   * Applied to the content inside parentheses/brackets.
   */
  individualCitationPattern: RegExp;

  /** Pattern for numbered citations (e.g., [1], [2]) */
  numberedCitationPattern: RegExp;

  /** Pattern for footnotes (e.g., [^1]) */
  footnoteCitationPattern: RegExp;

  /** Pattern for detecting question marks (varies by language) */
  questionMarkPattern: RegExp;

  /** Common abbreviations that don't end sentences */
  abbreviations: string[];

  /** Pattern to detect if text contains this language's characters */
  languageDetectionPattern: RegExp;
}

export type SupportedLanguage = 'en' | 'gr';

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
