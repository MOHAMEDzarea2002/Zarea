import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react';
import { fetchMyOrders } from '../features/orders/ordersThunk';
import { logoutUser } from '../features/auth/authThunk';
import type { Order } from '../types/types';
import OrderCard from '../components/orders/OrderCard';

export default function AccountPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const user = useSelector((state: any) => state.auth.user);
  const { items, listStatus, listError } = useSelector((state: any) => state.orders);
  const orders: Order[] = items;

  // بنجيب الطلبات في كل مرة الصفحة تفتح عشان تكون محدّثة
  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  const isLoading = listStatus === 'idle' || listStatus === 'loading';

  return (
    <section className="bg-white px-6 py-14 font-body text-primary sm:px-12 md:py-20 lg:px-16">
      <div className="mx-auto max-w-[1000px]">
        <h1 className="font-heading text-5xl font-medium tracking-tight sm:text-6xl">
          <Trans
            i18nKey="account.title"
            components={{ accent: <em className="font-normal italic text-accent" /> }}
          />
        </h1>

        {/* Profile */}
        <div className="mt-12 flex flex-wrap items-start justify-between gap-6 bg-secondary p-6 sm:p-8">
          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
              {t('account.profile')}
            </h2>
            <p className="mt-4 font-heading text-3xl">{user?.name}</p>
            <dl className="mt-4 space-y-1 text-sm text-primary/70">
              <div className="flex gap-2">
                <dt>{t('auth.email')}:</dt>
                <dd dir="ltr">{user?.email}</dd>
              </div>
              <div className="flex gap-2">
                <dt>{t('auth.register.phone')}:</dt>
                <dd dir="ltr">{user?.phone}</dd>
              </div>
            </dl>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-primary/70 transition-colors hover:text-accent"
          >
            <LogOut size={16} strokeWidth={1.5} className="rtl:-scale-x-100" />
            {t('nav.signOut')}
          </button>
        </div>

        {/* Orders */}
        <h2 className="mt-16 font-heading text-4xl">{t('account.ordersTitle')}</h2>

        <div className="mt-8">
          {isLoading && (
            <ul aria-busy="true" className="space-y-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <li key={i} className="h-56 animate-pulse bg-secondary" />
              ))}
            </ul>
          )}

          {listStatus === 'failed' && (
            <div role="alert" className="py-12 text-center">
              <p className="text-primary/70">{listError ?? t('account.error')}</p>
              <button
                type="button"
                onClick={() => dispatch(fetchMyOrders())}
                className="mt-4 text-sm font-medium uppercase tracking-[0.15em] text-accent underline-offset-4 hover:underline"
              >
                {t('account.retry')}
              </button>
            </div>
          )}

          {listStatus === 'succeeded' && orders.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-primary/70">{t('account.noOrders')}</p>
              <Link
                to="/shop"
                className="mt-6 inline-block bg-primary px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-secondary transition-colors duration-300 hover:bg-accent"
              >
                {t('cart.startShopping')}
              </Link>
            </div>
          )}

          {listStatus === 'succeeded' && orders.length > 0 && (
            <ul className="space-y-6">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
