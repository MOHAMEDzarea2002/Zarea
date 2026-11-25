import { useTranslation } from 'react-i18next';

// أسماء الأقسام والألوان جاية من الـ API (إنجليزي).
// لو ليها ترجمة في en.json/ar.json بنستخدمها، وإلا بنعرض الاسم زي ما هو.
export function useLabels() {
  const { t } = useTranslation();

  const categoryName = (name: string) =>
    t(`categoryNames.${name.toLowerCase()}`, { defaultValue: name });

  const colorName = (name: string) => t(`colors.${name.toLowerCase()}`, { defaultValue: name });

  return { categoryName, colorName };
}
