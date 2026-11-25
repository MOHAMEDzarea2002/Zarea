import { Link } from 'react-router';
import { Trans, useTranslation } from 'react-i18next';

type EditorialBandProps = {
  /** صورة editorial عريضة، حطها في public/images/ */
  imageSrc?: string;
};

export default function EditorialBand({
  imageSrc = 'https://res.cloudinary.com/dvvfnrprr/image/upload/v1795526142/hero-model_flkemj.jpg',
}: EditorialBandProps) {
  const { t } = useTranslation();

  return (
    <section className="grid bg-primary font-body text-secondary lg:grid-cols-2">
      <div className="group relative min-h-[24rem] overflow-hidden lg:min-h-[32rem]">
        <img
          src={imageSrc}
          alt={t('home.editorial.imageAlt')}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1500ms] ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>

      <div className="flex items-center px-6 py-16 sm:px-12 lg:px-20">
        <div className="max-w-md">
          <span aria-hidden="true" className="block h-px w-10 bg-accent" />

          <blockquote className="mt-8 font-heading text-4xl leading-tight sm:text-5xl">
            <Trans
              i18nKey="home.editorial.quote"
              components={{ accent: <em className="font-normal italic text-accent" /> }}
            />
          </blockquote>

          <Link
            to="/about"
            className="mt-10 inline-block text-sm font-medium uppercase tracking-[0.15em] text-accent underline-offset-4 transition-colors hover:text-secondary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {t('home.editorial.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
