import { Link } from 'react-router';
import { Trans, useTranslation } from 'react-i18next';

const VALUES = ['quality', 'craft', 'timeless'] as const;

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      <section className="bg-secondary px-6 py-20 font-body text-primary sm:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <span aria-hidden="true" className="mx-auto mb-6 block h-px w-10 bg-accent" />
          <h1 className="font-heading text-5xl font-medium tracking-tight sm:text-6xl">
            <Trans
              i18nKey="about.title"
              components={{ accent: <em className="font-normal italic text-accent" /> }}
            />
          </h1>
          <p className="mt-6 text-base leading-relaxed text-primary/70 sm:text-lg">{t('about.intro')}</p>
        </div>
      </section>

      <section className="bg-white px-6 py-20 font-body text-primary sm:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="font-heading text-4xl">{t('about.storyTitle')}</h2>
            <p className="mt-6 leading-relaxed text-primary/70">{t('about.story')}</p>
          </div>

          <ul className="space-y-8">
            {VALUES.map((v) => (
              <li key={v} className="border-s border-accent ps-6">
                <h3 className="font-heading text-2xl">{t(`about.values.${v}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-primary/70">{t(`about.values.${v}.text`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-secondary px-6 py-20 text-center font-body text-primary sm:px-12 lg:px-16">
        <h2 className="font-heading text-4xl">{t('about.ctaTitle')}</h2>
        <Link
          to="/shop"
          className="mt-8 inline-block bg-primary px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-secondary transition-colors duration-300 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t('about.cta')}
        </Link>
      </section>
    </>
  );
}
