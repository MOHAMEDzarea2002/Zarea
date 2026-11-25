import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormatPrice } from '../../i18n/useFormatPrice';
import { useLabels } from '../../i18n/useLabels';

// عدّل الحد الأقصى للسعر حسب أغلى منتج عندك
export const PRICE_MIN = 0;
export const PRICE_MAX = 5000;
const STEP = 50;

type Props = {
  categories: { _id: string; name: string }[];
  category: string;
  minPrice?: number;
  maxPrice?: number;
  hasActive: boolean;
  onChange: (changes: Record<string, string | undefined>) => void;
  onClear: () => void;
};

export default function ProductFilters({
  categories,
  category,
  minPrice,
  maxPrice,
  hasActive,
  onChange,
  onClear,
}: Props) {
  const { t } = useTranslation();
  const { categoryName } = useLabels();

  return (
    <div className="space-y-10">
      {/* Category */}
      <div>
        <h3 className="text-xs font-medium uppercase tracking-[0.25em] text-accent">{t('shop.category')}</h3>
        <ul className="mt-4 space-y-1">
          <CategoryButton active={category === ''} onClick={() => onChange({ category: undefined })}>
            {t('shop.all')}
          </CategoryButton>
          {categories.map((c) => (
            <CategoryButton
              key={c._id}
              active={category === c._id}
              onClick={() => onChange({ category: c._id })}
            >
              {categoryName(c.name)}
            </CategoryButton>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-xs font-medium uppercase tracking-[0.25em] text-accent">{t('shop.price')}</h3>
        <PriceRange
          min={minPrice ?? PRICE_MIN}
          max={maxPrice ?? PRICE_MAX}
          onCommit={(lo, hi) =>
            onChange({
              minPrice: lo > PRICE_MIN ? String(lo) : undefined,
              maxPrice: hi < PRICE_MAX ? String(hi) : undefined,
            })
          }
        />
      </div>

      {hasActive && (
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium uppercase tracking-[0.15em] text-primary underline-offset-4 transition-colors hover:text-accent hover:underline"
        >
          {t('shop.clearAll')}
        </button>
      )}
    </div>
  );
}

function CategoryButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`w-full py-1.5 text-start text-sm transition-colors duration-300 ${
          active ? 'font-medium text-primary' : 'text-primary/60 hover:text-accent'
        }`}
      >
        <span className={`border-b pb-0.5 ${active ? 'border-accent' : 'border-transparent'}`}>
          {children}
        </span>
      </button>
    </li>
  );
}

/* ---------- Dual price slider ---------- */

function PriceRange({
  min,
  max,
  onCommit,
}: {
  min: number;
  max: number;
  onCommit: (lo: number, hi: number) => void;
}) {
  const { t } = useTranslation();
  const formatPrice = useFormatPrice();
  const [lo, setLo] = useState(min);
  const [hi, setHi] = useState(max);

  // لما الـ URL يتغير (مثلًا Clear all) حدّث المؤشرات
  useEffect(() => {
    setLo(min);
    setHi(max);
  }, [min, max]);

  // ابعت القيمة بعد ما العميل يسيب المؤشر بنص ثانية
  useEffect(() => {
    if (lo === min && hi === max) return;
    const timer = setTimeout(() => onCommit(lo, hi), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lo, hi]);

  const range = PRICE_MAX - PRICE_MIN;
  const left = ((lo - PRICE_MIN) / range) * 100;
  const right = 100 - ((hi - PRICE_MIN) / range) * 100;

  const thumb =
    'pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent ' +
    '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 ' +
    '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none ' +
    '[&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-accent [&::-webkit-slider-thumb]:bg-primary ' +
    '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 ' +
    '[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-none ' +
    '[&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-accent [&::-moz-range-thumb]:bg-primary';

  return (
    // dir="ltr": الـ slider بيتحسب بـ left/right فبنثبّته حتى في العربي
    <div dir="ltr" className="mt-6">
      <div className="relative h-5">
        {/* track */}
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-primary/20" />
        {/* selected range */}
        <div
          className="absolute top-1/2 h-px -translate-y-1/2 bg-accent"
          style={{ left: `${left}%`, right: `${right}%` }}
        />

        <input
          type="range"
          aria-label={t('shop.minPrice')}
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={STEP}
          value={lo}
          onChange={(e) => setLo(Math.min(Number(e.target.value), hi - STEP))}
          className={thumb}
          style={{ zIndex: lo > PRICE_MAX - STEP * 5 ? 5 : 3 }}
        />
        <input
          type="range"
          aria-label={t('shop.maxPrice')}
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={STEP}
          value={hi}
          onChange={(e) => setHi(Math.max(Number(e.target.value), lo + STEP))}
          className={thumb}
          style={{ zIndex: 4 }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-primary/70">
        <span>{formatPrice(lo)}</span>
        <span>{formatPrice(hi)}</span>
      </div>
    </div>
  );
}
