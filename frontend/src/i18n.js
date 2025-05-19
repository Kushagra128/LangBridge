import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import pt from './locales/pt.json';
import fr from './locales/fr.json';
import ja from './locales/ja.json';
// Add more imports as needed

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  pt: { translation: pt },
  fr: { translation: fr },
  ja: { translation: ja },
  // Add more languages here
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: (JSON.parse(localStorage.getItem('authUser'))?.language) || localStorage.getItem('app-language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
