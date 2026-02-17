/**
 * Language configuration loader and utilities
 */

import { englishConfig } from './en.ts';
import { greekConfig } from './gr.ts';
import type { LanguageConfig, SupportedLanguage } from './types.ts';

export { DEFAULT_LANGUAGE } from './types.ts';
export type { LanguageConfig, SupportedLanguage } from './types.ts';

/**
 * Map of all supported language configurations
 */
export const languageConfigs: Record<SupportedLanguage, LanguageConfig> = {
  en: englishConfig,
  gr: greekConfig,
};

/**
 * Get language configuration by code
 */
export function getLanguageConfig(code: string): LanguageConfig {
  const normalized = code.toLowerCase().trim();

  // Handle common aliases
  const aliases: Record<string, SupportedLanguage> = {
    en: 'en',
    english: 'en',
    eng: 'en',
    gr: 'gr',
    greek: 'gr',
    el: 'gr', // ISO 639-1 code for Greek
    ell: 'gr', // ISO 639-2 code for Greek
    ελληνικά: 'gr',
  };

  const langCode = aliases[normalized];
  if (!langCode) {
    const supported = Object.keys(aliases).join(', ');
    throw new Error(`Unsupported language: "${code}". Supported: ${supported}`);
  }

  const config = languageConfigs[langCode];
  if (!config) {
    throw new Error(`Language configuration not found for: ${langCode}`);
  }

  return config;
}

/**
 * List all supported languages
 */
export function listSupportedLanguages(): Array<{ code: SupportedLanguage; name: string }> {
  return Object.values(languageConfigs).map(config => ({
    code: config.code as SupportedLanguage,
    name: config.name,
  }));
}

/**
 * Auto-detect language from text content
 */
export function detectLanguage(text: string): SupportedLanguage {
  // Count matches for each language's detection pattern
  const greekMatches = (text.match(greekConfig.languageDetectionPattern) || []).length;
  const englishMatches = (text.match(englishConfig.languageDetectionPattern) || []).length;

  // If significant Greek content found, assume Greek
  // Greek documents often have some English (citations, technical terms)
  // so we check if Greek is at least 10% of the detected words
  if (greekMatches > 0 && greekMatches / (greekMatches + englishMatches) > 0.1) {
    return 'gr';
  }

  return 'en';
}
