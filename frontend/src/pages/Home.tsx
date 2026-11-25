import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HeroSection from '../components/Home/HeroSection';
import CategoriesSection from '../components/Home/CategoriesSection';
import NewArrivalsSection from '../components/Home/NewArrivalsSection';
import EditorialBand from '../components/Home/EditorialBand';

export default function Home() {
  const { t } = useTranslation();

  // عنوان الصفحة في تاب المتصفح
  useEffect(() => {
    document.title = t('home.docTitle');
  }, [t]);

  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <NewArrivalsSection />
      <EditorialBand />
    </>
  );
}
