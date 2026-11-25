import { Link } from 'react-router';
import { Trans, useTranslation } from 'react-i18next';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

type HeroSectionProps = {
  /** Editorial fashion photograph (portrait orientation works best) */
  imageSrc?: string;
  primaryHref?: string;
  secondaryHref?: string;
  cardHref?: string;
};

export default function HeroSection({
  imageSrc = 'https://res.cloudinary.com/dvvfnrprr/image/upload/v1795526925/hero-model-2_swe1yc.jpg',
  primaryHref = '/shop',
  secondaryHref = '/categories',
  cardHref = '/new-arrivals',
}: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="hero-heading" className="bg-secondary font-body text-primary">
      <div className="mx-auto grid max-w-[1600px] lg:min-h-[calc(100vh-5rem)] lg:grid-cols-2">
        {/* ---------- Content ---------- */}
        <div className="flex items-center px-6 py-16 sm:px-12 md:py-24 lg:px-16 xl:px-24">
          <div className="max-w-xl">
            <p className="mb-8 flex items-center gap-4 text-xs font-medium uppercase tracking-[0.3em] text-accent">
              <span aria-hidden="true" className="h-px w-10 bg-accent" />
              {t('hero.label')}
            </p>

            <h1
              id="hero-heading"
              className="font-heading text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl 2xl:text-8xl"
            >
              <Trans
                i18nKey="hero.title"
                components={{ accent: <em className="font-normal italic text-accent" /> }}
              />
            </h1>

            <p className="mt-8 max-w-md text-base leading-relaxed text-primary/70 sm:text-lg">
              {t('hero.description')}
            </p>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Link
                to={primaryHref}
                className="group inline-flex items-center justify-center gap-3 bg-primary px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-secondary transition-colors duration-300 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t('hero.shop')}
                <ArrowRight
                  size={18}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                />
              </Link>

              <Link
                to={secondaryHref}
                className="inline-flex items-center justify-center border border-primary px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-primary transition-colors duration-300 hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t('hero.explore')}
              </Link>
            </div>
          </div>
        </div>

        {/* ---------- Image ---------- */}
        <div className="relative min-h-[28rem] sm:min-h-[36rem] lg:min-h-0">
          <figure className="group absolute inset-0 overflow-hidden bg-primary/5">
            <img
              src={imageSrc}
              alt={t('hero.imageAlt')}
              loading="eager"
              fetchPriority="high"
              className="h-full w-full object-cover object-top transition-transform duration-[1500ms] ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent"
            />
          </figure>

          {/* Floating info card */}
          <Link
            to={cardHref}
            className="group/card absolute bottom-0 start-0 end-0 flex items-center justify-between gap-6 bg-white px-6 py-5 transition-colors duration-300 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:end-auto sm:min-w-72 lg:bottom-10 lg:min-w-80 lg:-translate-x-1/2 rtl:lg:translate-x-1/2"
          >
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
                {t('hero.cardLabel')}
              </p>
              <p className="mt-1 font-heading text-xl text-primary">{t('hero.cardTitle')}</p>
            </div>
            <ArrowUpRight
              size={22}
              strokeWidth={1.5}
              className="shrink-0 text-primary transition-transform duration-300 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:text-accent rtl:-scale-x-100 rtl:group-hover/card:-translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
