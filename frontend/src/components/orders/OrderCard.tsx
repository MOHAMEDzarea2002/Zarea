import { useState } from 'react';
import { Link } from 'react-router';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { cancelMyOrder } from '../../features/orders/ordersThunk';
import { useFormatPrice } from '../../i18n/useFormatPrice';
import { useLabels } from '../../i18n/useLabels';
import type { Order, OrderStatus } from '../../types/types';

const STATUS_STYLE: Record<OrderStatus, string> = {
  Pending: 'border-accent text-accent',
  Processing: 'border-accent text-accent',
  Shipped: 'border-primary text-primary',
  Delivered: 'border-primary text-primary',
  Cancelled: 'border-red-300 text-red-700',
};

const getProductId = (product: Order['items'][number]['product']) =>
  typeof product === 'string' ? product : product._id;

export default function OrderCard({ order }: { order: Order }) {
  const { t, i18n } = useTranslation();
  const formatPrice = useFormatPrice();
  const { colorName } = useLabels();
  const dispatch = useDispatch<any>();

  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const date = new Date(order.createdAt).toLocaleDateString(
    i18n.language === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  );

  // الإلغاء متاح للطلبات Pending بس (زي ما الـ backend بيشترط)
  const canCancel = order.status === 'Pending';

  const handleCancel = async () => {
    setCancelling(true);
    setError(null);
    const result = await dispatch(cancelMyOrder(order._id));
    setCancelling(false);

    if (cancelMyOrder.rejected.match(result)) {
      setError(result.payload ?? result.error.message ?? null);
    } else {
      setConfirming(false);
    }
  };

  return (
    <li className="border border-primary/10 bg-white p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-heading text-2xl">
            {t('account.orderNumber', { number: order._id.slice(-6).toUpperCase() })}
          </p>
          <p className="mt-1 text-sm text-primary/60">{t('account.placedOn', { date })}</p>
        </div>

        <span
          className={`border px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] ${STATUS_STYLE[order.status]}`}
        >
          {t(`orderStatus.${order.status}`)}
        </span>
      </div>

      {/* Items */}
      <ul className="mt-5 divide-y divide-primary/10 border-y border-primary/10">
        {order.items.map((item) => (
          <li key={item._id ?? `${getProductId(item.product)}-${item.color}-${item.size}`} className="flex gap-4 py-4">
            <Link to={`/products/${getProductId(item.product)}`} className="shrink-0">
              <img src={item.image} alt={item.name} className="h-20 w-16 object-cover object-top" />
            </Link>
            <div className="flex-1 text-sm">
              <p className="font-medium capitalize">{item.name}</p>
              <p className="text-primary/60">
                {colorName(item.color)} / {item.size} × {item.quantity}
              </p>
            </div>
            <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div className="text-sm text-primary/70">
          <p>{t(`checkout.payment.${order.paymentMethod}.label`)}</p>
          <p>{t(`account.paymentStatus.${order.paymentStatus}`)}</p>
        </div>

        <p className="text-base font-medium">
          {t('common.total')}: {formatPrice(order.totalPrice)}
        </p>
      </div>

      {/* Cancel */}
      {canCancel && (
        <div className="mt-5 border-t border-primary/10 pt-4">
          {error && (
            <p role="alert" className="mb-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {!confirming ? (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="text-sm font-medium text-primary/70 underline-offset-4 transition-colors hover:text-red-700 hover:underline"
            >
              {t('account.cancel')}
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span>{t('account.cancelConfirm')}</span>
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                className="bg-primary px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-secondary transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {cancelling ? t('account.cancelling') : t('account.cancelYes')}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={cancelling}
                className="text-primary/70 underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                {t('account.cancelNo')}
              </button>
            </div>
          )}
        </div>
      )}
    </li>
  );
}
