import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  const toggle = () => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('language.switchAria')}
      className="inline-flex h-10 items-center px-2 text-[13px] font-medium text-primary transition-colors hover:text-accent"
    >
      {t('language.switchTo')}
    </button>
  );
}
