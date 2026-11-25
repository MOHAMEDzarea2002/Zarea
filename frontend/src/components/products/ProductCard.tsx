import { Link } from 'react-router';
import { useFormatPrice } from '../../i18n/useFormatPrice';
import type { Product } from '../../types/types';
import WishlistButton from '../wishlist/WishlistButton';

export default function ProductCard({ product }: { product: Product }) {
  const formatPrice = useFormatPrice();
  const image = product.images?.[0] ?? '';

  return (
    <div className="group relative">
      <Link
        to={`/products/${product._id}`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-[1500ms] ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>

        <div className="mt-4 flex items-start justify-between gap-4">
          <h3 className="font-heading text-xl capitalize leading-tight text-primary transition-colors duration-300 group-hover:text-accent">
            {product.name}
          </h3>
          <p className="shrink-0 text-sm font-medium text-primary">{formatPrice(Number(product.price))}</p>
        </div>
      </Link>

      {/* الزرار برّه اللينك عشان ميبقاش <button> جوه <a> */}
      <WishlistButton
        product={{ _id: product._id, name: product.name, price: product.price, image }}
        className="absolute end-3 top-3"
      />
    </div>
  );
}
