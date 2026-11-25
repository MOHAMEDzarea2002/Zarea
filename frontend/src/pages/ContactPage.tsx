import { useTranslation } from 'react-i18next';
import { Clock, Mail, MapPin, Phone, type LucideIcon } from 'lucide-react';

// ← عدّل البيانات دي لبيانات المتجر الحقيقية
const CONTACT = {
  email: 'hello@zarea.com',
  phone: '+20 100 000 0000',
};

type Card = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  ltr?: boolean;
};

export default function ContactPage() {
  const { t } = useTranslation();

  const cards: Card[] = [
    {
      icon: Mail,
      label: t('contact.email'),
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      ltr: true,
    },
    {
      icon: Phone,
      label: t('contact.phone'),
      value: CONTACT.phone,
      href: `tel:${CONTACT.phone.replace(/\s/g, '')}`,
      ltr: true,
    },
    { icon: MapPin, label: t('contact.address'), value: t('contact.addressValue') },
    { icon: Clock, label: t('contact.hours'), value: t('contact.hoursValue') },
  ];

  return (
    <section className="bg-white px-6 py-20 font-body text-primary sm:px-12 md:py-28 lg:px-16">
      <div className="mx-auto max-w-[1000px]">
        <header className="mx-auto max-w-2xl text-center">
          <span aria-hidden="true" className="mx-auto mb-6 block h-px w-10 bg-accent" />
          <h1 className="font-heading text-5xl font-medium tracking-tight sm:text-6xl">
            {t('contact.title')}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-primary/70 sm:text-lg">{t('contact.subtitle')}</p>
        </header>

        <ul className="mt-16 grid gap-px bg-primary/10 sm:grid-cols-2">
          {cards.map(({ icon: Icon, label, value, href, ltr }) => (
            <li key={label} className="bg-white p-8 sm:p-10">
              <Icon size={22} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.25em] text-primary/60">{label}</p>
              {href ? (
                <a
                  href={href}
                  dir={ltr ? 'ltr' : undefined}
                  className="mt-2 inline-block font-heading text-2xl transition-colors hover:text-accent"
                >
                  {value}
                </a>
              ) : (
                <p dir={ltr ? 'ltr' : undefined} className="mt-2 font-heading text-2xl">
                  {value}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
