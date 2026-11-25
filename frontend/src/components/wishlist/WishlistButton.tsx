import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import { toggleWishlist, type WishlistItem } from '../../features/wishlist/wishlistSlice';

type WishlistButtonProps = {
  product: WishlistItem;
  className?: string;
  size?: number;
};

export default function WishlistButton({ product, className = '', size = 20 }: WishlistButtonProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();

  const isSaved = useSelector((state: any) =>
    state.wishlist.items.some((i: WishlistItem) => i._id === product._id),
  );

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleWishlist(product))}
      aria-label={isSaved ? t('wishlist.remove') : t('wishlist.add')}
      aria-pressed={isSaved}
      className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary transition-colors duration-300 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      <Heart
        size={size}
        strokeWidth={1.5}
        fill={isSaved ? 'currentColor' : 'none'}
        className={isSaved ? 'text-accent' : ''}
      />
    </button>
  );
}
