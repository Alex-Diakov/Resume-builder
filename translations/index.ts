import { SupportedLanguage, LanguageMeta, TranslationSchema } from './types';
import { en } from './en';
import { uk } from './uk';
import { ru } from './ru';

export * from './types';

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    description: 'International Standard',
  },
  {
    code: 'uk',
    name: 'Ukrainian',
    nativeName: 'Українська',
    flag: '🇺🇦',
    description: 'Державна мова України',
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    description: 'Классический интерфейс',
  },
];

export const translations: Record<SupportedLanguage, TranslationSchema> = {
  en,
  uk,
  ru,
};

/**
 * Helper to safely resolve a nested translation key with fallback to English
 */
export function getTranslation(lang: SupportedLanguage = 'en'): TranslationSchema {
  return translations[lang] || translations.en;
}
