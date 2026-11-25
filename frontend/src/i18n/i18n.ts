import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ar from './ar.json';

const STORAGE_KEY = 'zarea-lang';
export type Language = 'en' | 'ar';

const getSavedLanguage = (): Language => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'ar' || saved === 'en' ? saved : 'en';
  } catch {
    return 'en';
  }
};

// بيظبط اتجاه الصفحة واللغة على <html>
const applyDirection = (lng: string) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
};

const initial = getSavedLanguage();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: initial,
  fallbackLng: 'en',
  interpolation: { escapeValue: false }, // React بيحمي من XSS لوحده
});

applyDirection(initial);

i18n.on('languageChanged', (lng) => {
  applyDirection(lng);
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    /* localStorage مقفول */
  }
});

export default i18n;
