import { Link, Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { useFormatPrice } from '../i18n/useFormatPrice';
import type { Order } from '../types/types';

export default function OrderConfirmationPage() {
  const { t } = useTranslation();
  const formatPrice = useFormatPrice();
  const order: Order | null = useSelector((state: any) => state.orders.lastOrder);

  // لو حد فتح الصفحة من غير ما يعمل طلب
  if (!order) return <Navigate to="/shop" replace />;

  const { shippingAddress: a } = order;
  const isInstaPay = order.paymentMethod === 'InstaPay';

  return (
    <section className="bg-white px-6 py-16 font-body text-primary sm:px-12 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center border border-accent text-accent">
          <Check size={26} strokeWidth={1.5} />
        </span>

        <h1 className="mt-8 font-heading text-5xl font-medium tracking-tight sm:text-6xl">
          <Trans
            i18nKey="confirmation.title"
            components={{ accent: <em className="font-normal italic text-accent" /> }}
          />
        </h1>
        <p className="mt-4 text-primary/70">
          <Trans
            i18nKey="confirmation.message"
            values={{ number: order._id.slice(-6).toUpperCase() }}
            components={{ b: <strong className="text-primary" /> }}
          />
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-2xl bg-secondary p-6 sm:p-8">
        <ul className="divide-y divide-primary/10">
          {order.items.map((item) => (
            <li key={`${item.product}-${item.color}-${item.size}`} className="flex gap-4 py-4">
              <img src={item.image} alt={item.name} className="h-20 w-16 shrink-0 object-cover object-top" />
              <div className="flex-1 text-sm">
                <p className="font-medium capitalize">{item.name}</p>
                <p className="text-primary/60">
                  {item.color} / {item.size} × {item.quantity}
                </p>
              </div>
              <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex justify-between border-t border-primary/10 pt-4 text-base font-medium">
          <span>{t('common.total')}</span>
          <span>{formatPrice(order.totalPrice)}</span>
        </div>

        <dl className="mt-8 grid gap-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {t('confirmation.shippingTo')}
            </dt>
            <dd className="mt-2 leading-relaxed text-primary/80">
              {a.fullName}
              <br />
              {a.street}
              {a.building ? `, ${a.building}` : ''}
              <br />
              {a.city}
              <br />
              <span dir="ltr" className="inline-block">
                {a.phone}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {t('confirmation.payment')}
            </dt>
            <dd className="mt-2 text-primary/80">
              {t(`checkout.payment.${order.paymentMethod}.label`)}
              {isInstaPay && (
                <span className="block text-primary/60">
                  {order.paymentStatus === 'Paid' ? t('confirmation.verified') : t('confirmation.awaiting')}
                </span>
              )}
            </dd>
            <dt className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {t('confirmation.status')}
            </dt>
            <dd className="mt-2 text-primary/80">{t(`orderStatus.${order.status}`)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/shop"
          className="inline-block bg-primary px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-secondary transition-colors duration-300 hover:bg-accent"
        >
          {t('confirmation.continueShopping')}
        </Link>
      </div>
    </section>
  );
}
