import { useTranslation } from 'react-i18next';

// true = أرقام عربية (٥٠٠) — false = أرقام إنجليزية (500) حتى في العربي
const USE_ARABIC_DIGITS = false;

export function useFormatPrice() {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === 'ar';
  const locale = isArabic ? (USE_ARABIC_DIGITS ? 'ar-EG' : 'ar-EG-u-nu-latn') : 'en-US';

  return (amount: number) => `${amount.toLocaleString(locale)} ${t('common.currency')}`;
}
