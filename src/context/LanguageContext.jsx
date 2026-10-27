import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../data/translations/en.js';
import { ur } from '../data/translations/ur.js';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('royal_clinic_lang');
      return saved === 'ur' ? 'ur' : 'en';
    } catch {
      return 'en';
    }
  });

  const isRTL = language === 'ur';

  // Apply dir and lang attribute to html root on change
  useEffect(() => {
    try {
      localStorage.setItem('royal_clinic_lang', language);
    } catch (e) {
      console.warn('Unable to persist language preference', e);
    }

    const htmlEl = document.documentElement;
    if (language === 'ur') {
      htmlEl.setAttribute('dir', 'rtl');
      htmlEl.setAttribute('lang', 'ur');
      htmlEl.classList.add('rtl');
    } else {
      htmlEl.setAttribute('dir', 'ltr');
      htmlEl.setAttribute('lang', 'en');
      htmlEl.classList.remove('rtl');
    }
  }, [language]);

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'ur') {
      setLanguageState(lang);
    }
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'en' ? 'ur' : 'en'));
  };

  // Helper to resolve translation string
  const t = (path, fallback = '') => {
    const dict = language === 'ur' ? ur : en;
    const keys = path.split('.');
    let curr = dict;
    for (const key of keys) {
      if (curr && typeof curr === 'object' && key in curr) {
        curr = curr[key];
      } else {
        // Fallback to English if Urdu is missing
        let enCurr = en;
        for (const k of keys) {
          if (enCurr && typeof enCurr === 'object' && k in enCurr) {
            enCurr = enCurr[k];
          } else {
            return fallback || path;
          }
        }
        return enCurr || fallback || path;
      }
    }
    return curr ?? fallback ?? path;
  };

  // Helper to get localized value from object with { en: "...", ur: "..." }
  const getLocalized = (obj) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[language] || obj['en'] || Object.values(obj)[0] || '';
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    isRTL,
    t,
    getLocalized
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
