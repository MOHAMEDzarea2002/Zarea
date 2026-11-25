import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useFormatPrice } from '../../i18n/useFormatPrice';

type CartSummaryProps = {
  itemsCount: number;
  subtotal: number;
};

export default function CartSummary({ itemsCount, subtotal }: CartSummaryProps) {
  const { t } = useTranslation();
  const formatPrice = useFormatPrice();

  return (
    <aside className="h-fit bg-secondary p-6 sm:p-8">
      <h2 className="font-heading text-3xl">{t('cart.summary')}</h2>

      <dl className="mt-8 space-y-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-primary/70">{t('cart.subtotal', { count: itemsCount })}</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-primary/70">{t('cart.shipping')}</dt>
          <dd className="text-primary/70">{t('cart.shippingAtCheckout')}</dd>
        </div>
        <div className="flex justify-between border-t border-primary/10 pt-4 text-base font-medium">
          <dt>{t('common.total')}</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
      </dl>

      <Link
        to="/checkout"
        className="mt-8 block w-full bg-primary px-8 py-4 text-center text-sm font-medium uppercase tracking-[0.15em] text-secondary transition-colors duration-300 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {t('cart.proceed')}
      </Link>

      <Link
        to="/shop"
        className="mt-4 block text-center text-sm text-primary/70 underline-offset-4 transition-colors hover:text-accent hover:underline"
      >
        {t('cart.continue')}
      </Link>

      <p className="mt-6 text-xs text-primary/50">{t('cart.finalNote')}</p>
    </aside>
  );
}
