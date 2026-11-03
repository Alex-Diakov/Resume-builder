import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { SupportedLanguage, TranslationSchema, LanguageMeta, SUPPORTED_LANGUAGES, getTranslation } from '../translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationSchema;
  languages: LanguageMeta[];
  currentLanguageMeta: LanguageMeta;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'app_language_v1';

function getInitialLanguage(): SupportedLanguage {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'uk' || saved === 'ru') {
      return saved;
    }
    // Detect browser locale
    if (typeof navigator !== 'undefined' && navigator.language) {
      const code = navigator.language.toLowerCase();
      if (code.startsWith('uk')) return 'uk';
      if (code.startsWith('ru')) return 'ru';
    }
  } catch (e) {
    // Fallback if localStorage unavailable
  }
  return 'en';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(getInitialLanguage);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Failed to save language to localStorage:', e);
    }
  }, []);

  const t = useMemo(() => {
    return getTranslation(language);
  }, [language]);

  const currentLanguageMeta = useMemo(() => {
    return SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];
  }, [language]);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      languages: SUPPORTED_LANGUAGES,
      currentLanguageMeta,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
