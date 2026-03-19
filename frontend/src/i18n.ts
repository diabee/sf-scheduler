import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en';
import zhTW from './locales/zh-TW';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      'zh-TW': { translation: zhTW },
    },
    lng: 'zh-TW',
    fallbackLng: 'zh-TW',
    supportedLngs: ['zh-TW', 'en'],
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    debug: import.meta.env.DEV,
  });

export default i18n;
