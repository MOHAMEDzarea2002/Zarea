import { Link, Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import { Check } from 'lucide-react';
import type { Order } from '../../types/types';

const CURRENCY = 'EGP';

export default function OrderConfirmationPage() {
  const order: Order | null = useSelector((state: any) => state.orders.lastOrder);

  // لو حد فتح الصفحة من غير ما يعمل طلب
  if (!order) return <Navigate to="/shop" replace />;

  const { shippingAddress: a } = order;

  return (
    <section className="bg-white px-6 py-16 font-body text-primary sm:px-12 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center border border-accent text-accent">
          <Check size={26} strokeWidth={1.5} />
        </span>

        <h1 className="mt-8 font-heading text-5xl font-medium tracking-tight sm:text-6xl">
          Thank <em className="font-normal italic text-accent">you</em>
        </h1>
        <p className="mt-4 text-primary/70">
          Your order <strong className="text-primary">#{order._id.slice(-6).toUpperCase()}</strong> has been
          placed. We&apos;ll contact you to confirm delivery.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-2xl bg-secondary p-6 sm:p-8">
        <ul className="divide-y divide-primary/10">
          {order.items.map((item) => (
            <li key={`${item.product}-${item.color}-${item.size}`} className="flex gap-4 py-4">
              <img src={item.image} alt={item.name} className="h-20 w-16 shrink-0 object-cover object-top" />
              <div className="flex-1 text-sm">
                <p className="font-medium capitalize">{item.name}</p>
                <p className="text-primary/60">
                  {item.color} / {item.size} × {item.quantity}
                </p>
              </div>
              <p className="text-sm">
                {(item.price * item.quantity).toLocaleString()} {CURRENCY}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex justify-between border-t border-primary/10 pt-4 text-base font-medium">
          <span>Total</span>
          <span>
            {order.totalPrice.toLocaleString()} {CURRENCY}
          </span>
        </div>

        <dl className="mt-8 grid gap-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Shipping to</dt>
            <dd className="mt-2 leading-relaxed text-primary/80">
              {a.fullName}
              <br />
              {a.street}
              {a.building ? `, ${a.building}` : ''}
              <br />
              {a.city}
              <br />
              {a.phone}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Payment</dt>
            <dd className="mt-2 text-primary/80">Cash on Delivery</dd>
            <dt className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-accent">Status</dt>
            <dd className="mt-2 text-primary/80">{order.status}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/shop"
          className="inline-block bg-primary px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-secondary transition-colors duration-300 hover:bg-accent"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}
