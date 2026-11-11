'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionaries, Language, Translations } from './dictionaries';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
  formatPrice: (amount: number) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ru');

  useEffect(() => {
    const saved = localStorage.getItem('pc_market_lang') as Language;
    if (saved === 'ru' || saved === 'uz') {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('pc_market_lang', newLang);
  };

  const formatPrice = (amount: number) => {
    const formatted = new Intl.NumberFormat('ru-RU').format(amount);
    return `${formatted} ${dictionaries[lang].common.currency}`;
  };

  return (
    <I18nContext.Provider
      value={{
        lang,
        setLang,
        t: dictionaries[lang],
        formatPrice,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
