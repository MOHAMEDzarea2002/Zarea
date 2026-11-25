import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Check, Minus, Plus } from 'lucide-react';
import { addToCart } from '../../features/cart/cartSlice';
import { useFormatPrice } from '../../i18n/useFormatPrice';
import { useLabels } from '../../i18n/useLabels';
import type { Product } from '../../types/types';
import OptionButton from './OptionButton';
import ProductGallery from './ProductGallery';
import WishlistButton from '../wishlist/WishlistButton';

export default function ProductDetails({ product }: { product: Product }) {
  const { t } = useTranslation();
  const formatPrice = useFormatPrice();
  const { categoryName, colorName } = useLabels();
  const dispatch = useDispatch<any>();

  const variants = product.variants ?? [];
  const isActive = product.status === 'active';

  const colors = useMemo(() => [...new Set(variants.map((v) => v.color))], [variants]);
  const sizes = useMemo(() => [...new Set(variants.map((v) => v.size))], [variants]);

  // اختار أول variant متاح كبداية
  const firstAvailable = variants.find((v) => v.stock > 0);
  const [color, setColor] = useState(firstAvailable?.color ?? colors[0] ?? '');
  const [size, setSize] = useState(firstAvailable?.size ?? '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = variants.find((v) => v.color === color && v.size === size);
  const stock = variant?.stock ?? 0;
  const inStock = isActive && stock > 0;
const wishlistItem = {
  _id: product._id,
  name: product.name,
  price: product.price,
  image: product.images?.[0] ?? '',
};
  const isSizeAvailable = (s: string, c: string) =>
    variants.some((v) => v.color === c && v.size === s && v.stock > 0);

  const isColorAvailable = (c: string) => variants.some((v) => v.color === c && v.stock > 0);

  const handleColorChange = (c: string) => {
    setColor(c);
    setQuantity(1);
    setAdded(false);
    // لو المقاس الحالي مش متاح في اللون الجديد، اختار أول مقاس متاح
    if (!isSizeAvailable(size, c)) {
      const next = variants.find((v) => v.color === c && v.stock > 0);
      setSize(next?.size ?? '');
    }
  };

  const handleSizeChange = (s: string) => {
    setSize(s);
    setQuantity(1);
    setAdded(false);
  };

  const handleAddToCart = () => {
    if (!variant || !inStock) return;

    // الإضافة للسلة مفتوحة للكل، وتسجيل الدخول بيتطلب عند الـ Checkout
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] ?? '',
        size,
        color,
        quantity,
        stock: variant.stock,
      })
    );
    setAdded(true);
  };

  return (
    <section className="bg-white px-6 py-14 font-body text-primary sm:px-12 md:py-20 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        {/* Breadcrumb */}
        <nav
          aria-label={t('product.breadcrumb')}
          className="mb-10 text-xs uppercase tracking-[0.2em] text-primary/60"
        >
          <Link to="/shop" className="transition-colors hover:text-accent">
            {t('product.shop')}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-primary">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <ProductGallery images={product.images ?? []} name={product.name} />

          {/* Info */}
          <div className="lg:py-6">
            {product.category?.name && (
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
                {categoryName(product.category.name)}
              </p>
            )}

            <h1 className="mt-4 font-heading text-4xl font-medium capitalize tracking-tight sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 text-2xl">{formatPrice(product.price)}</p>

            {product.description && (
              <p className="mt-6 max-w-lg leading-relaxed text-primary/70">{product.description}</p>
            )}

            {/* Color */}
            {colors.length > 0 && (
              <fieldset className="mt-10">
                <legend className="text-xs font-medium uppercase tracking-[0.2em] text-primary/70">
                  {t('product.color')}: <span className="text-primary">{colorName(color)}</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-3">
                  {colors.map((c) => (
                    <OptionButton
                      key={c}
                      selected={c === color}
                      disabled={!isColorAvailable(c)}
                      onClick={() => handleColorChange(c)}
                    >
                      {colorName(c)}
                    </OptionButton>
                  ))}
                </div>
              </fieldset>
            )}

            {/* Size */}
            {sizes.length > 0 && (
              <fieldset className="mt-8">
                <legend className="text-xs font-medium uppercase tracking-[0.2em] text-primary/70">
                  {t('product.size')}: <span className="text-primary">{size}</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-3">
                  {sizes.map((s) => (
                    <OptionButton
                      key={s}
                      selected={s === size}
                      disabled={!isSizeAvailable(s, color)}
                      onClick={() => handleSizeChange(s)}
                    >
                      {s}
                    </OptionButton>
                  ))}
                </div>
              </fieldset>
            )}

            {/* Stock message */}
            <p className="mt-6 text-sm" aria-live="polite">
              {!isActive ? (
                <span className="text-primary/60">{t('product.unavailableMsg')}</span>
              ) : stock === 0 ? (
                <span className="text-red-700">{t('product.outOfStock')}</span>
              ) : stock <= 5 ? (
                <span className="text-accent">{t('product.onlyLeft', { count: stock })}</span>
              ) : (
                <span className="text-primary/60">{t('product.inStock')}</span>
              )}
            </p>

            {/* Quantity + Add + Wishlist */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <div className="flex h-14 items-center border border-primary/20">
                <button
                  type="button"
                  aria-label={t('product.decrease')}
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => q - 1)}
                  className="flex h-full w-12 items-center justify-center transition-colors hover:text-accent disabled:opacity-30"
                >
                  <Minus size={16} strokeWidth={1.5} />
                </button>
                <span className="w-10 text-center text-sm" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label={t('product.increase')}
                  disabled={quantity >= stock}
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-full w-12 items-center justify-center transition-colors hover:text-accent disabled:opacity-30"
                >
                  <Plus size={16} strokeWidth={1.5} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className="h-14 flex-1 bg-primary px-8 text-sm font-medium uppercase tracking-[0.15em] text-secondary transition-colors duration-300 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                {inStock ? t('product.addToBag') : t('product.unavailable')}
              </button>

              <WishlistButton product={wishlistItem} />
            </div>

            {added && (
              <p role="status" className="mt-5 flex items-center gap-2 text-sm">
                <Check size={16} strokeWidth={1.5} className="text-accent" />
                {t('product.added')}{' '}
                <Link
                  to="/cart"
                  className="font-medium underline underline-offset-4 hover:text-accent"
                >
                  {t('product.viewBag')}
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
