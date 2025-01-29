import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../public/locales/en/translation.json';
import hiTranslation from '../public/locales/hi/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      hi: {
        translation: hiTranslation
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    debug: process.env.NODE_ENV === 'development'
  });

export default i18n; 