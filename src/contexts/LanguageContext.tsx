import { createContext, useContext, useState, ReactNode } from 'react';
import deTranslations from '../locales/de.json';
import enTranslations from '../locales/en.json';

export type Language = 'de' | 'en';

const translations = {
  de: deTranslations,
  en: enTranslations,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateStatus: (status: string) => string;
  translatePriority: (priority: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language-preference');
    return (stored as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language-preference', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };
  
  // Helper function to translate status values (handles underscores)
  const translateStatus = (status: string): string => {
    const statusKey = status === 'in_progress' ? 'inProgress' : status;
    return t(`status.${statusKey}`);
  };
  
  // Helper function to translate priority values
  const translatePriority = (priority: string): string => {
    if (!priority) return t('priority.none');
    return t(`priority.${priority}`);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translateStatus,
        translatePriority,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

