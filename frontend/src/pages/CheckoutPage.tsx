import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { Check, Copy } from 'lucide-react';
import { placeOrder } from '../features/orders/ordersThunk';
import { clearOrderError } from '../features/orders/ordersSlice';
import { clearCart, type CartItem } from '../features/cart/cartSlice';
import { useFormatPrice } from '../i18n/useFormatPrice';
import type { PaymentMethod } from '../types/types';

// غيّر ده لعنوان InstaPay بتاع المتجر
const INSTAPAY_ADDRESS = 'zarea@instapay';

const PAYMENT_METHODS: PaymentMethod[] = ['COD', 'InstaPay'];

const inputClass =
  'mt-2 w-full border border-primary/20 bg-white px-4 py-3 text-sm transition-colors focus:border-accent focus:outline-none';
const labelClass = 'text-xs font-medium uppercase tracking-[0.2em] text-primary/70';

export default function CheckoutPage() {
  const { t } = useTranslation();
  const formatPrice = useFormatPrice();
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const items: CartItem[] = useSelector((state: any) => state.cart.items);
  const user = useSelector((state: any) => state.auth.user);
  const { createStatus, createError } = useSelector((state: any) => state.orders);

  const [form, setForm] = useState({
    fullName: user?.name ?? '',
    phone: user?.phone ?? '',
    city: '',
    street: '',
    building: '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [paymentReference, setPaymentReference] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    dispatch(clearOrderError());
  }, [dispatch]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const isLoading = createStatus === 'loading';
  const isInstaPay = paymentMethod === 'InstaPay';

  const canSubmit =
    form.fullName.trim() &&
    form.phone.trim() &&
    form.city.trim() &&
    form.street.trim() &&
    (!isInstaPay || paymentReference.trim());

  // مفيش حاجة في الـ cart
  if (items.length === 0) return <Navigate to="/cart" replace />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(INSTAPAY_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* المتصفح منع النسخ — العميل يقدر ينسخ يدوي */
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isLoading) return;

    const result = await dispatch(
      placeOrder({
        // بنبعت المنتج والمقاس واللون والكمية بس — الـ backend بيحسب السعر
        items: items.map((i) => ({
          product: i.productId,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
        })),
        shippingAddress: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          street: form.street.trim(),
          building: form.building.trim() || undefined,
          notes: form.notes.trim() || undefined,
        },
        paymentMethod,
        paymentReference: isInstaPay ? paymentReference.trim() : undefined,
      }),
    );

    if (placeOrder.fulfilled.match(result)) {
      // روح لصفحة التأكيد الأول، وبعدين فضّي الـ cart
      navigate('/order-confirmation', { replace: true });
      dispatch(clearCart());
    }
  };

  const optional = (
    <span className="normal-case tracking-normal text-primary/40">({t('common.optional')})</span>
  );

  return (
    <section className="bg-white px-6 py-14 font-body text-primary sm:px-12 md:py-20 lg:px-16">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="font-heading text-5xl font-medium tracking-tight sm:text-6xl">
          <Trans
            i18nKey="checkout.title"
            components={{ accent: <em className="font-normal italic text-accent" /> }}
          />
        </h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_24rem]">
          {/* Shipping + payment form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <h2 className="font-heading text-3xl">{t('checkout.shippingDetails')}</h2>

            {createError && (
              <p role="alert" className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {createError}
              </p>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className={labelClass}>
                  {t('checkout.fullName')}
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>
                  {t('checkout.phone')}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  dir="ltr"
                  autoComplete="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  className={`${inputClass} text-start`}
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="city" className={labelClass}>
                  {t('checkout.city')}
                </label>
                <input
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  required
                  value={form.city}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="street" className={labelClass}>
                  {t('checkout.street')}
                </label>
                <input
                  id="street"
                  name="street"
                  autoComplete="address-line1"
                  required
                  value={form.street}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="building" className={labelClass}>
                {t('checkout.building')} {optional}
              </label>
              <input
                id="building"
                name="building"
                autoComplete="address-line2"
                value={form.building}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="notes" className={labelClass}>
                {t('checkout.notes')} {optional}
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={form.notes}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Payment */}
            <fieldset className="pt-4">
              <legend className="font-heading text-3xl">{t('checkout.paymentTitle')}</legend>

              <div className="mt-4 space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method}
                    className={`flex cursor-pointer items-start gap-3 border px-4 py-4 text-sm transition-colors ${
                      paymentMethod === method ? 'border-accent' : 'border-primary/20 hover:border-primary/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="mt-0.5 accent-accent"
                    />
                    <span>
                      <span className="block font-medium">{t(`checkout.payment.${method}.label`)}</span>
                      <span className="block text-primary/60">{t(`checkout.payment.${method}.hint`)}</span>
                    </span>
                  </label>
                ))}
              </div>

              {isInstaPay && (
                <div className="mt-6 space-y-5 bg-secondary p-5 text-sm">
                  <ol className="list-inside list-decimal space-y-2 text-primary/80">
                    <li>
                      <Trans
                        i18nKey="checkout.instapay.step1"
                        values={{ amount: formatPrice(subtotal) }}
                        components={{ b: <strong className="text-primary" /> }}
                      />
                    </li>
                    <li>{t('checkout.instapay.step2')}</li>
                    <li>{t('checkout.instapay.step3')}</li>
                  </ol>

                  <div className="flex items-center justify-between gap-4 border border-primary/20 bg-white px-4 py-3">
                    <span dir="ltr" className="font-medium">
                      {INSTAPAY_ADDRESS}
                    </span>
                    <button
                      type="button"
                      onClick={copyAddress}
                      aria-label={t('checkout.instapay.copyAria')}
                      className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-primary/70 transition-colors hover:text-accent"
                    >
                      {copied ? <Check size={15} strokeWidth={1.5} /> : <Copy size={15} strokeWidth={1.5} />}
                      {copied ? t('checkout.instapay.copied') : t('checkout.instapay.copy')}
                    </button>
                  </div>

                  <div>
                    <label htmlFor="paymentReference" className={labelClass}>
                      {t('checkout.instapay.reference')}
                    </label>
                    <input
                      id="paymentReference"
                      dir="ltr"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      required
                      className={`${inputClass} text-start`}
                    />
                  </div>
                </div>
              )}
            </fieldset>

            <button
              type="submit"
              disabled={!canSubmit || isLoading}
              className="w-full bg-primary px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-secondary transition-colors duration-300 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? t('checkout.placing') : t('checkout.placeOrder')}
            </button>
          </form>

          {/* Summary */}
          <aside className="h-fit bg-secondary p-6 sm:p-8">
            <h2 className="font-heading text-3xl">{t('checkout.yourOrder')}</h2>

            <ul className="mt-6 divide-y divide-primary/10">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.color}-${item.size}`}
                  className="flex gap-4 py-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-16 shrink-0 object-cover object-top"
                  />
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
              <span>{formatPrice(subtotal)}</span>
            </div>

            <Link
              to="/cart"
              className="mt-6 block text-center text-sm text-primary/70 underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              {t('checkout.editBag')}
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
