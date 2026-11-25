import { useEffect } from 'react';
import { Link, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchProductById } from '../features/products/productsThunk';
import type { Product } from '../types/types';
import ProductDetails from '../components/products/ProductDetails';

// الصفحة مسؤولة عن جلب الداتا وحالات التحميل والخطأ بس
export default function ProductDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<any>();

  const { selected, detailStatus, detailError } = useSelector((s: any) => s.products);
  // متعرضش منتج قديم لو العميل راح لمنتج تاني
  const product: Product | null = selected?._id === id ? selected : null;

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (detailStatus === 'failed' && !product) {
    return (
      <section className="px-6 py-24 text-center font-body text-primary">
        <p className="font-heading text-4xl">{t('product.notFound')}</p>
        <p className="mt-3 text-primary/70">{detailError}</p>
        <Link
          to="/shop"
          className="mt-8 inline-block text-sm font-medium uppercase tracking-[0.15em] text-accent underline-offset-4 hover:underline"
        >
          {t('product.backToShop')}
        </Link>
      </section>
    );
  }

  if (!product) {
    return (
      <section
        aria-busy="true"
        className="mx-auto grid max-w-[1400px] gap-12 px-6 py-14 sm:px-12 lg:grid-cols-2 lg:px-16"
      >
        <div className="aspect-[3/4] animate-pulse bg-secondary" />
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse bg-secondary" />
          <div className="h-12 w-2/3 animate-pulse bg-secondary" />
          <div className="h-6 w-32 animate-pulse bg-secondary" />
        </div>
      </section>
    );
  }

  // key: بيصفّر اختيارات المقاس واللون لما المنتج يتغير
  return <ProductDetails key={product._id} product={product} />;
}
