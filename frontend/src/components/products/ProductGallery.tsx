import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {images.length > 1 && (
        <ul className="flex gap-3 sm:flex-col">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={t('product.showImage', { n: i + 1 })}
                aria-current={i === active}
                className={`block h-20 w-16 overflow-hidden border bg-secondary transition-colors ${
                  i === active ? 'border-accent' : 'border-transparent hover:border-primary/30'
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="group aspect-[3/4] flex-1 overflow-hidden bg-secondary">
        <img
          src={images[active]}
          alt={name}
          className="h-full w-full object-cover object-top transition-transform duration-[1500ms] ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
    </div>
  );
}
