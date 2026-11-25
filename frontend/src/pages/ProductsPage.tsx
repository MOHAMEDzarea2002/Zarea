import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { fetchProducts } from '../features/products/productsThunk';
import { fetchCategories } from '../features/categories/categoriesThunk';
import type { Product, ProductsQuery, SortOption } from '../types/types';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import { useLabels } from '../i18n/useLabels'; // عدّل المسار لو مكانه مختلف

const LIMIT = 12;

const SORT_OPTIONS: { value: SortOption; key: string }[] = [
  { value: 'newest', key: 'shop.sort.newest' },
  { value: 'price_asc', key: 'shop.sort.priceAsc' },
  { value: 'price_desc', key: 'shop.sort.priceDesc' },
];

const SORT_VALUES = SORT_OPTIONS.map((o) => o.value);

export default function ProductsPage() {
  const { t } = useTranslation();
  const { categoryName } = useLabels();
  const dispatch = useDispatch<any>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { items, pagination, status, error } = useSelector((s: any) => s.products);
  const categories = useSelector((s: any) => s.categories.items);
  const categoriesStatus = useSelector((s: any) => s.categories.status);

  // ---- قراءة الفلاتر من الـ URL ----
  const rawSort = searchParams.get('sort') as SortOption;
  const sort: SortOption = SORT_VALUES.includes(rawSort) ? rawSort : 'newest';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const category = searchParams.get('category') ?? '';
  const searchTerm = searchParams.get('q')?.trim() ?? '';
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

  const query: ProductsQuery = useMemo(
    () => ({
      page,
      limit: LIMIT,
      sort,
      category: category || undefined,
      search: searchTerm || undefined,
      minPrice,
      maxPrice,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams],
  );

  // ---- جلب الداتا كل ما الفلاتر تتغير ----
  useEffect(() => {
    const request = dispatch(fetchProducts(query));
    return () => request.abort(); // الغي الطلب القديم لو الفلتر اتغير
  }, [dispatch, query]);

  useEffect(() => {
    if (categoriesStatus === 'idle') dispatch(fetchCategories());
  }, [categoriesStatus, dispatch]);

  // ---- تحديث الـ URL ----
  const updateParams = (changes: Record<string, string | undefined>, resetPage = true) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === undefined || value === '') next.delete(key);
      else next.set(key, value);
    });
    if (resetPage) next.delete('page');
    setSearchParams(next);
  };

  const goToPage = (p: number) => {
    updateParams({ page: p === 1 ? undefined : String(p) }, false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAll = () => setSearchParams({});

  const hasActive = Boolean(
    category || searchTerm || minPrice !== undefined || maxPrice !== undefined,
  );
  const isLoading = status === 'idle' || status === 'loading';

  // ---- عنوان الصفحة حسب البحث أو القسم ----
  const activeCategory = categories.find((c: any) => c._id === category);
  const accent = { accent: <em className="font-normal italic text-accent" /> };

  const heading = searchTerm ? (
    <Trans i18nKey="shop.titleSearch" values={{ query: searchTerm }} components={accent} />
  ) : activeCategory ? (
    <Trans
      i18nKey="shop.titleCategory"
      values={{ name: categoryName(activeCategory.name) }}
      components={accent}
    />
  ) : (
    <Trans i18nKey="shop.title" components={accent} />
  );

  return (
    <section className="bg-white px-6 py-14 font-body text-primary sm:px-12 md:py-20 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <header className="text-center">
          <span aria-hidden="true" className="mx-auto mb-6 block h-px w-10 bg-accent" />
          <h1 className="font-heading text-5xl font-medium tracking-tight sm:text-6xl">
            {heading}
          </h1>
        </header>

        {/* Toolbar */}
        <div className="mt-12 flex items-center justify-between gap-4 border-b border-primary/10 pb-5">
          <p className="text-sm text-primary/70">
            {pagination ? t('shop.productsCount', { count: pagination.total }) : ' '}
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              aria-expanded={filtersOpen}
              className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] lg:hidden"
            >
              <SlidersHorizontal size={16} strokeWidth={1.5} />
              {t('shop.filters')}
            </button>

            <label className="flex items-center gap-2 text-sm">
              <span className="sr-only">{t('shop.sortBy')}</span>
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="border border-primary/20 bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {t(o.key)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[16rem_1fr]">
          {/* Filters */}
          <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="lg:sticky lg:top-28">
              <ProductFilters
                categories={categories}
                category={category}
                minPrice={minPrice}
                maxPrice={maxPrice}
                hasActive={hasActive}
                onChange={updateParams}
                onClear={clearAll}
              />
            </div>
          </aside>

          {/* Products */}
          <div>
            {isLoading && (
              <ul
                aria-busy="true"
                className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <li key={i}>
                    <div className="aspect-[3/4] animate-pulse bg-secondary" />
                    <div className="mt-4 h-4 w-2/3 animate-pulse bg-secondary" />
                  </li>
                ))}
              </ul>
            )}

            {status === 'failed' && (
              <div role="alert" className="py-20 text-center">
                <p className="text-primary/70">{error ?? t('shop.error')}</p>
                <button
                  type="button"
                  onClick={() => dispatch(fetchProducts(query))}
                  className="mt-4 text-sm font-medium uppercase tracking-[0.15em] text-accent underline-offset-4 hover:underline"
                >
                  {t('shop.retry')}
                </button>
              </div>
            )}

            {status === 'succeeded' && items.length === 0 && (
              <div className="py-20 text-center">
                <p className="font-heading text-3xl">{t('shop.noProducts')}</p>
                <p className="mt-2 text-primary/70">{t('shop.adjust')}</p>
                {hasActive && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-6 text-sm font-medium uppercase tracking-[0.15em] text-accent underline-offset-4 hover:underline"
                  >
                    {t('shop.clearAll')}
                  </button>
                )}
              </div>
            )}

            {status === 'succeeded' && items.length > 0 && (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14">
                {items.map((product: Product) => (
                  <li key={product._id}>
                    <ProductCard product={product} />
                  </li>
                ))}
              </ul>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPage > 1 && (
              <nav
                aria-label={t('shop.pagination')}
                className="mt-16 flex items-center justify-center gap-1"
              >
                <PageButton
                  label={t('shop.previous')}
                  disabled={pagination.page <= 1}
                  onClick={() => goToPage(pagination.page - 1)}
                >
                  <ChevronLeft size={18} strokeWidth={1.5} className="rtl:rotate-180" />
                </PageButton>

                {getPages(pagination.page, pagination.totalPage).map((p, i) =>
                  p === '…' ? (
                    <span key={`dots-${i}`} className="px-2 text-primary/40">
                      …
                    </span>
                  ) : (
                    <PageButton
                      key={p}
                      label={t('shop.page', { n: p })}
                      active={p === pagination.page}
                      onClick={() => goToPage(p)}
                    >
                      {p}
                    </PageButton>
                  ),
                )}

                <PageButton
                  label={t('shop.next')}
                  disabled={pagination.page >= pagination.totalPage}
                  onClick={() => goToPage(pagination.page + 1)}
                >
                  <ChevronRight size={18} strokeWidth={1.5} className="rtl:rotate-180" />
                </PageButton>
              </nav>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- helpers ---------- */

function PageButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-10 min-w-10 items-center justify-center px-2 text-sm transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-30 ${
        active
          ? 'border-b border-accent font-medium text-primary'
          : 'text-primary/60 hover:text-accent'
      }`}
    >
      {children}
    </button>
  );
}

// 1 … 4 5 6 … 20
function getPages(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '…')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push('…');
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push('…');
  pages.push(total);

  return pages;
}
