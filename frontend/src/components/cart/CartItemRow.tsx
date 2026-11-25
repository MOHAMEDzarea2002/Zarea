import { Link } from 'react-router';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, X } from 'lucide-react';
import { removeFromCart, updateQuantity, type CartItem } from '../../features/cart/cartSlice';
import { useFormatPrice } from '../../i18n/useFormatPrice';
import { useLabels } from '../../i18n/useLabels';

export default function CartItemRow({ item }: { item: CartItem }) {
  const { t } = useTranslation();
  const formatPrice = useFormatPrice();
  const { colorName } = useLabels();
  const dispatch = useDispatch<any>();
  const key = { productId: item.productId, size: item.size, color: item.color };

  return (
    <li className="flex gap-4 py-6 sm:gap-6">
      <Link
        to={`/products/${item.productId}`}
        className="block h-32 w-24 shrink-0 overflow-hidden bg-secondary sm:h-40 sm:w-32"
      >
        <img src={item.image} alt={item.name} className="h-full w-full object-cover object-top" />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              to={`/products/${item.productId}`}
              className="font-heading text-xl capitalize leading-tight transition-colors hover:text-accent sm:text-2xl"
            >
              {item.name}
            </Link>
            <p className="mt-1 text-sm text-primary/60">
              {colorName(item.color)} / {item.size}
            </p>
            <p className="mt-2 text-sm">{formatPrice(item.price)}</p>
          </div>

          <button
            type="button"
            aria-label={t('cart.remove', { name: item.name })}
            onClick={() => dispatch(removeFromCart(key))}
            className="text-primary/40 transition-colors hover:text-accent"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div className="flex h-10 items-center border border-primary/20">
            <button
              type="button"
              aria-label={t('product.decrease')}
              disabled={item.quantity <= 1}
              onClick={() => dispatch(updateQuantity({ ...key, quantity: item.quantity - 1 }))}
              className="flex h-full w-10 items-center justify-center transition-colors hover:text-accent disabled:opacity-30"
            >
              <Minus size={14} strokeWidth={1.5} />
            </button>
            <span className="w-8 text-center text-sm" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label={t('product.increase')}
              disabled={item.quantity >= item.stock}
              onClick={() => dispatch(updateQuantity({ ...key, quantity: item.quantity + 1 }))}
              className="flex h-full w-10 items-center justify-center transition-colors hover:text-accent disabled:opacity-30"
            >
              <Plus size={14} strokeWidth={1.5} />
            </button>
          </div>

          <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
        </div>
      </div>
    </li>
  );
}
