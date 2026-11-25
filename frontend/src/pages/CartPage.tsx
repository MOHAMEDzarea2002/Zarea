import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { clearCart, type CartItem } from '../features/cart/cartSlice';
import CartItemRow from '../components/cart/CartItemRow';
import CartSummary from '../components/cart/CartSummary';

export default function CartPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();
  const items: CartItem[] = useSelector((state: any) => state.cart.items);

  const itemsCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center font-body text-primary">
        <span aria-hidden="true" className="mb-6 block h-px w-10 bg-accent" />
        <h1 className="font-heading text-5xl font-medium">{t('cart.emptyTitle')}</h1>
        <p className="mt-4 text-primary/70">{t('cart.emptyText')}</p>
        <Link
          to="/shop"
          className="mt-10 bg-primary px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-secondary transition-colors duration-300 hover:bg-accent"
        >
          {t('cart.startShopping')}
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-white px-6 py-14 font-body text-primary sm:px-12 md:py-20 lg:px-16">
      <div className="mx-auto max-w-[1200px]">
        <header className="flex items-end justify-between gap-4">
          <h1 className="font-heading text-5xl font-medium tracking-tight sm:text-6xl">
            <Trans
              i18nKey="cart.title"
              components={{ accent: <em className="font-normal italic text-accent" /> }}
            />
          </h1>
          <button
            type="button"
            onClick={() => dispatch(clearCart())}
            className="text-sm text-primary/60 underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            {t('cart.clear')}
          </button>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_24rem]">
          <ul className="divide-y divide-primary/10 border-y border-primary/10">
            {items.map((item) => (
              <CartItemRow
                key={`${item.productId}-${item.color}-${item.size}`}
                item={item}
              />
            ))}
          </ul>

          <CartSummary itemsCount={itemsCount} subtotal={subtotal} />
        </div>
      </div>
    </section>
  );
}
