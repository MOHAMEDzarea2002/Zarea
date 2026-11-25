import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { fetchCategories } from '../../features/categories/categoriesThunk';
import { useLabels } from '../../i18n/useLabels';

// الشكل اللي راجع من الـ API
type ApiCategory = {
  _id: string;
  name: string;
  image: string;
  alt: string;
};

// أول 3 كروت صغيرة، والباقي أعرض
const getLayout = (index: number) =>
  index < 3
    ? 'col-span-1 md:col-span-2 aspect-[3/4]'
    : 'col-span-1 md:col-span-3 aspect-[3/4] md:aspect-[4/3]';

export default function CategoriesSection() {
  const { t } = useTranslation();
  const { categoryName } = useLabels();
  const dispatch = useDispatch<any>();
  const { items, status, error } = useSelector((state: any) => state.categories);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchCategories());
  }, [status, dispatch]);

  const categories: ApiCategory[] = items;

  return (
    <section
      aria-labelledby="categories-heading"
      className="bg-white px-6 py-20 font-body text-primary sm:px-12 md:py-28 lg:px-16"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Heading */}
        <header className="mx-auto max-w-2xl text-center">
          <span aria-hidden="true" className="mx-auto mb-6 block h-px w-10 bg-accent" />
          <h2
            id="categories-heading"
            className="font-heading text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl"
          >
            <Trans
              i18nKey="categoriesSection.title"
              components={{ accent: <em className="font-normal italic text-accent" /> }}
            />
          </h2>
          <p className="mt-5 text-base text-primary/70 sm:text-lg">{t('categoriesSection.subtitle')}</p>
        </header>

        {/* Loading */}
        {(status === 'idle' || status === 'loading') && (
          <ul
            aria-busy="true"
            className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:mt-20 md:grid-cols-6 md:gap-6"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className={`${getLayout(i)} animate-pulse bg-secondary`} />
            ))}
          </ul>
        )}

        {/* Error */}
        {status === 'failed' && (
          <div role="alert" className="mt-14 text-center md:mt-20">
            <p className="text-primary/70">{error ?? t('categoriesSection.error')}</p>
            <button
              type="button"
              onClick={() => dispatch(fetchCategories())}
              className="mt-4 text-sm font-medium uppercase tracking-[0.15em] text-accent underline-offset-4 hover:underline"
            >
              {t('categoriesSection.retry')}
            </button>
          </div>
        )}

        {/* Grid */}
        {status === 'succeeded' && (
          <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:mt-20 md:grid-cols-6 md:gap-6">
            {categories.map((cat, i) => {
              // on mobile (2 columns) the last odd card spans full width
              const isLastOdd = i === categories.length - 1 && categories.length % 2 === 1;
              return (
                <li
                  key={cat._id}
                  className={`${getLayout(i)} ${isLastOdd ? 'max-md:col-span-2 max-md:aspect-[16/10]' : ''}`}
                >
                  <Link
                    to={`/shop?category=${cat._id}`}
                    className="group relative block h-full w-full overflow-hidden bg-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    <img
                      src={cat.image}
                      alt={cat.alt}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-[1500ms] ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />

                    {/* Overlay */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-primary/0 transition-colors duration-500 group-hover:from-primary/80"
                    />

                    {/* Text */}
                    <div className="absolute inset-x-0 bottom-0 p-4 text-secondary sm:p-6 lg:p-8">
                      <h3 className="font-heading text-2xl font-medium sm:text-3xl lg:text-4xl">
                        {categoryName(cat.name)}
                      </h3>
                      <span className="mt-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-secondary/80 transition-all duration-500 group-hover:gap-3 group-hover:text-accent sm:text-xs">
                        {t('categoriesSection.explore')}
                        <ArrowRight
                          size={15}
                          strokeWidth={1.5}
                          className="transition-transform duration-500 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                        />
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-4 block h-px w-0 bg-accent transition-all duration-500 group-hover:w-12"
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
