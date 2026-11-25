import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Trans, useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import ProductCard from '../products/ProductCard';
import type { Product, ProductsResponse } from '../../types/types';

export default function NewArrivalsSection() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<'loading' | 'succeeded' | 'failed'>('loading');

  // طلب مستقل عشان ميأثرش على قايمة صفحة المنتجات في الـ Redux
  useEffect(() => {
    const controller = new AbortController();

    api
      .get<ProductsResponse>('/products', {
        params: { sort: 'newest', limit: 4 },
        signal: controller.signal,
      })
      .then((res) => {
        setProducts(res.data.data);
        setStatus('succeeded');
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('failed');
      });

    return () => controller.abort();
  }, []);

  // لو فشل أو مفيش منتجات، السكشن ببساطة مش بيظهر
  if (status === 'failed' || (status === 'succeeded' && products.length === 0)) return null;

  return (
    <section
      aria-labelledby="new-arrivals-heading"
      className="bg-secondary px-6 py-20 font-body text-primary sm:px-12 md:py-28 lg:px-16"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span aria-hidden="true" className="mb-6 block h-px w-10 bg-accent" />
            <h2
              id="new-arrivals-heading"
              className="font-heading text-4xl font-medium tracking-tight sm:text-5xl"
            >
              <Trans
                i18nKey="home.newArrivals.title"
                components={{ accent: <em className="font-normal italic text-accent" /> }}
              />
            </h2>
            <p className="mt-4 text-primary/70">{t('home.newArrivals.subtitle')}</p>
          </div>

          <Link
            to="/new-arrivals"
            className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-primary transition-colors hover:text-accent"
          >
            {t('home.newArrivals.viewAll')}
            <ArrowRight
              size={16}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
            />
          </Link>
        </header>

        {status === 'loading' ? (
          <ul aria-busy="true" className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i}>
                <div className="aspect-[3/4] animate-pulse bg-white" />
                <div className="mt-4 h-4 w-2/3 animate-pulse bg-white" />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {products.map((product) => (
              <li key={product._id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
