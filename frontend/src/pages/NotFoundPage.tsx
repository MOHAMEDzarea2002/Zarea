import { Link } from 'react-router';
import { Trans, useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center bg-white px-6 py-20 text-center font-body text-primary">
      <p className="font-heading text-8xl font-light text-accent">404</p>

      <h1 className="mt-4 font-heading text-4xl font-medium sm:text-5xl">
        <Trans
          i18nKey="notFound.title"
          components={{ accent: <em className="font-normal italic text-accent" /> }}
        />
      </h1>

      <p className="mt-4 max-w-md text-primary/70">{t('notFound.text')}</p>

      <Link
        to="/"
        className="mt-10 bg-primary px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-secondary transition-colors duration-300 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {t('notFound.back')}
      </Link>
    </section>
  );
}
