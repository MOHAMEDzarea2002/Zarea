import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
// ← عدّل روابط السوشيال لحسابات المتجر الحقيقية
const SOCIALS = [
  { icon: FaInstagram, label: 'Instagram', href: 'https://instagram.com/' },
  { icon: FaFacebookF, label: 'Facebook', href: 'https://facebook.com/' },
];

const SHOP_LINKS = [
  { key: 'newArrivals', to: '/new-arrivals' },
  { key: 'shop', to: '/shop' },
  { key: 'categories', to: '/categories' },
];

const HELP_LINKS = [
  { key: 'about', to: '/about' },
  { key: 'contact', to: '/contact' },
  { key: 'account', to: '/account' },
];

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary font-body text-secondary">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 sm:px-12 md:grid-cols-4 lg:px-16">
        {/* Brand */}
        <div className="md:col-span-2">
          <Link to="/" className="font-heading text-3xl font-semibold tracking-[0.12em]">
            Zarea
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-secondary/70">{t('footer.tagline')}</p>

          <ul className="mt-6 flex gap-3">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary/20 transition-colors duration-300 hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <Icon size={18} strokeWidth={1.5} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Shop */}
        <FooterColumn
          title={t('footer.shop')}
          links={SHOP_LINKS.map((l) => ({ to: l.to, label: t(`nav.${l.key}`) }))}
        />

        {/* Help */}
        <FooterColumn
          title={t('footer.help')}
          links={HELP_LINKS.map((l) => ({ to: l.to, label: t(`nav.${l.key}`) }))}
        />
      </div>

      {/* Bottom bar */}
      <div className="border-t border-secondary/10">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 py-6 text-xs text-secondary/60 sm:flex-row sm:items-center sm:justify-between sm:px-12 lg:px-16">
          <p>{t('footer.rights', { year })}</p>
          <p>{t('footer.payments')}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <nav aria-label={title}>
      <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-accent">{title}</h2>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="text-sm text-secondary/80 transition-colors duration-300 hover:text-accent">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
