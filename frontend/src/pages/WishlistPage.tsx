import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { removeFromWishlist, type WishlistItem } from '../features/wishlist/wishlistSlice';
import { useFormatPrice } from '../i18n/useFormatPrice';

export default function WishlistPage() {
  const { t } = useTranslation();
  const formatPrice = useFormatPrice();
  const dispatch = useDispatch<any>();
  const items: WishlistItem[] = useSelector((state: any) => state.wishlist.items);

  if (items.length === 0) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center font-body text-primary">
        <span aria-hidden="true" className="mb-6 block h-px w-10 bg-accent" />
        <h1 className="font-heading text-5xl font-medium">{t('wishlist.emptyTitle')}</h1>
        <p className="mt-4 text-primary/70">{t('wishlist.emptyText')}</p>
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
      <div className="mx-auto max-w-[1400px]">
        <header className="text-center">
          <span aria-hidden="true" className="mx-auto mb-6 block h-px w-10 bg-accent" />
          <h1 className="font-heading text-5xl font-medium tracking-tight sm:text-6xl">
            <Trans
              i18nKey="wishlist.title"
              components={{ accent: <em className="font-normal italic text-accent" /> }}
            />
          </h1>
        </header>

        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14">
          {items.map((item) => (
            <li key={item._id} className="group relative">
              <Link to={`/products/${item._id}`} className="block">
                <div className="aspect-[3/4] overflow-hidden bg-secondary">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-[1500ms] ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <h2 className="font-heading text-xl capitalize leading-tight transition-colors group-hover:text-accent">
                    {item.name}
                  </h2>
                  <p className="shrink-0 text-sm font-medium">{formatPrice(item.price)}</p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => dispatch(removeFromWishlist(item._id))}
                aria-label={t('wishlist.remove')}
                className="absolute end-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary transition-colors hover:text-accent"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
