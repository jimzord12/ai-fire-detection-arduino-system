/**
 * CSL (Citation Style Language) JSON Data Model
 *
 * This interface represents a single bibliographic reference in CSL JSON format.
 * While generic, this structure supports all fields necessary for APA 7th Edition.
 *
 * @see https://github.com/citation-style-language/schema
 */
export interface CSLReference {
  /**
   * Unique identifier for the item (required).
   */
  id: string | number;

  /**
   * The type of the item (required).
   * APA 7 Common Types: 'article-journal', 'book', 'chapter', 'webpage', 'report'.
   */
  type: CSLItemType;

  // --- Title & Origin ---

  /**
   * Primary title of the item.
   * Note: For APA 7, input titles should generally be in sentence case.
   */
  title?: string;

  /**
   * Title of the container (e.g., Journal Name, Book Title, Website Name).
   */
  'container-title'?: string;

  /**
   * Short title (often used in running heads or specific styles).
   */
  'title-short'?: string;

  /**
   * Original publication title (for translations).
   */
  'original-title'?: string;

  // --- Contributors ---

  /**
   * Primary authors.
   * APA 7 requires listing up to 20 authors; CSL processors handle the truncation.
   */
  author?: CSLName[];

  /**
   * Editors (common for books/chapters).
   */
  editor?: CSLName[];

  /**
   * Translators.
   */
  translator?: CSLName[];

  /**
   * Recipient of a letter or communication.
   */
  recipient?: CSLName[];

  /**
   * Interviewer.
   */
  interviewer?: CSLName[];

  /**
   * Composer (for music).
   */
  composer?: CSLName[];

  /**
   * Director (for films).
   */
  director?: CSLName[];

  // --- Dates ---

  /**
   * Date the item was issued/published.
   * Essential for APA (Year, or Year-Month-Day).
   */
  issued?: CSLDate;

  /**
   * Date the item was originally published (for republished works).
   * APA 7 Example: (Original work published 1990)
   */
  'original-date'?: CSLDate;

  /**
   * Date the item was accessed.
   * APA 7: Only required if the work is unarchived and designed to change (e.g., unstable websites).
   */
  accessed?: CSLDate;

  // --- Locators & Numbers ---

  /**
   * Volume number (Journals, Books).
   */
  volume?: string | number;

  /**
   * Issue number (Journals).
   */
  issue?: string | number;

  /**
   * Page range or specific page.
   * Example: "10-15"
   */
  page?: string;

  /**
   * Number of pages (for books).
   */
  'number-of-pages'?: string | number;

  /**
   * Edition number (e.g., "2" for 2nd edition).
   */
  edition?: string | number;

  /**
   * Chapter number.
   */
  'chapter-number'?: string | number;

  /**
   * Report number or Issue number for non-journals.
   */
  number?: string | number;

  // --- Publishing Info ---

  /**
   * Publisher name.
   * APA 7: Required for books/reports. Omit "Inc.", "Ltd.", etc.
   */
  publisher?: string;

  /**
   * Geographic location of publisher.
   * Note: APA 7th Edition REMOVED the requirement for publisher location (city/state).
   * It is still part of the CSL spec but typically ignored by APA 7 styles.
   */
  'publisher-place'?: string;

  // --- Identification & Links ---

  /**
   * Digital Object Identifier.
   * APA 7: Preferred over URL. Should be entered as "10.xxxx/xxxx" or full URL.
   */
  DOI?: string;

  /**
   * URL to the item.
   * APA 7: Required if no DOI is available and the item is online.
   */
  URL?: string;

  /**
   * International Standard Book Number.
   */
  ISBN?: string;

  /**
   * International Standard Serial Number.
   */
  ISSN?: string;

  /**
   * PubMed ID.
   */
  PMID?: string;

  /**
   * PubMed Central ID.
   */
  PMCID?: string;

  // --- Classification & Extra ---

  /**
   * Medium or Format (e.g., "Film", "Podcast", "Data set").
   * Important for non-text APA citations.
   */
  medium?: string;

  /**
   * Genre (e.g., "Ph.D. dissertation", "Master's thesis", "Tech. Rep.").
   */
  genre?: string;

  /**
   * Abstract of the item (usually not rendered in citations).
   */
  abstract?: string;

  /**
   * Language code (e.g., "en-US").
   */
  language?: string;

  /**
   * Short text note.
   */
  note?: string;

  /**
   * Archive storing the item.
   */
  archive?: string;

  /**
   * Location within the archive.
   */
  archive_location?: string;

  /**
   * Call number in library.
   */
  callNumber?: string;
}

// ----------------------------------------------------------------------
// Supporting Interfaces
// ----------------------------------------------------------------------

/**
 * CSL Name Variable
 * Represents an author, editor, etc.
 */
export interface CSLName {
  /**
   * Family name (Surname).
   */
  family?: string;

  /**
   * Given name (First name + Middle initial).
   */
  given?: string;

  /**
   * Suffix (e.g., "Jr.", "III").
   */
  suffix?: string;

  /**
   * Non-dropping particle (e.g., "de", "van" when they are part of the surname).
   */
  'non-dropping-particle'?: string;

  /**
   * Dropping particle (e.g., "van" when it is NOT part of the sort order).
   */
  'dropping-particle'?: string;

  /**
   * For institutional authors (e.g., "World Health Organization").
   * Use this instead of family/given if it is a single string.
   */
  literal?: string;

  /**
   * Comma separation setting (optional).
   */
  'comma-suffix'?: boolean | number;

  /**
   * Static ordering (optional).
   */
  'static-ordering'?: boolean | number;
}

/**
 * CSL Date Variable
 * Dates in CSL are typically arrays of [Year, Month, Day].
 */
export interface CSLDate {
  /**
   * Array of date parts.
   * Structure: [ [Year, Month, Day], [Year, Month, Day] ]
   * Single date: [ [2023, 5, 21] ]
   * Range: [ [2023, 5, 21], [2023, 6, 10] ]
   *
   * Note: Month and Day are optional.
   * [2023] = Year only.
   * [2023, 5] = Year and Month.
   */
  'date-parts': (string | number)[][];

  /**
   * Unstructured string representation (optional fallback).
   */
  raw?: string;

  /**
   * Circa / approximate date.
   */
  circa?: boolean | number;

  /**
   * Literal string (e.g. "Spring 2024").
   */
  literal?: string;
}

/**
 * Valid CSL Item Types
 */
export type CSLItemType =
  | 'article'
  | 'article-journal'
  | 'article-magazine'
  | 'article-newspaper'
  | 'bill'
  | 'book'
  | 'broadcast'
  | 'chapter'
  | 'dataset'
  | 'entry'
  | 'entry-dictionary'
  | 'entry-encyclopedia'
  | 'figure'
  | 'graphic'
  | 'interview'
  | 'legal_case'
  | 'legislation'
  | 'manuscript'
  | 'map'
  | 'motion_picture'
  | 'musical_score'
  | 'pamphlet'
  | 'paper-conference'
  | 'patent'
  | 'personal_communication'
  | 'post'
  | 'post-weblog'
  | 'report'
  | 'review'
  | 'review-book'
  | 'song'
  | 'speech'
  | 'thesis'
  | 'treaty'
  | 'webpage';
