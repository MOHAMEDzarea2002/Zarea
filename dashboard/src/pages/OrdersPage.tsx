import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { changeOrderStatus, fetchAllOrders } from '../features/orders/ordersThunk';
import type { Order, OrderStatus } from '../types/types';

const STATUSES: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: 'bg-status-pending/10 text-status-pending',
  Processing: 'bg-status-processing/10 text-status-processing',
  Shipped: 'bg-status-shipped/10 text-status-shipped',
  Delivered: 'bg-status-delivered/10 text-status-delivered',
  Cancelled: 'bg-status-cancelled/10 text-status-cancelled',
};

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { items, status, error, updatingId } = useAppSelector((s) => s.orders);

  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const visible = filter === 'All' ? items : items.filter((o) => o.status === filter);

  const countFor = (s: OrderStatus) => items.filter((o) => o.status === s).length;

  const handleStatusChange = async (order: Order, next: OrderStatus) => {
    setActionError(null);
    const result = await dispatch(changeOrderStatus({ id: order._id, status: next }));

    if (changeOrderStatus.rejected.match(result)) {
      setActionError(result.payload ?? 'Failed to update order status');
      return;
    }
    dispatch(fetchAllOrders());
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-muted">{items.length} orders in total</p>
      </header>

      {/* فلتر الحالات */}
      <div className="flex flex-wrap gap-2">
        {(['All', ...STATUSES] as const).map((s) => {
          const count = s === 'All' ? items.length : countFor(s);
          const active = filter === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                active
                  ? 'border-brand bg-brand text-white'
                  : 'border-border bg-surface text-muted hover:text-ink'
              }`}
            >
              {s} <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {actionError && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-status-cancelled">
          {actionError}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-canvas text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {status === 'loading' && items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">
                  Loading orders...
                </td>
              </tr>
            )}

            {status === 'failed' && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-status-cancelled">
                  {error}
                </td>
              </tr>
            )}

            {status !== 'loading' && status !== 'failed' && visible.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">
                  No orders found.
                </td>
              </tr>
            )}

            {visible.map((order) => (
              <tr
                key={order._id}
                className="border-b border-border last:border-0 hover:bg-canvas/60"
              >
                <td className="px-4 py-3 font-mono text-xs">
                  #{order._id.slice(-6).toUpperCase()}
                </td>

                <td className="px-4 py-3">
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p className="text-xs text-muted">
                    {order.shippingAddress.phone} · {order.shippingAddress.city}
                  </p>
                </td>

                <td className="px-4 py-3">{order.items.reduce((sum, i) => sum + i.quantity, 0)}</td>

                <td className="px-4 py-3">{order.totalPrice} EGP</td>

                <td className="px-4 py-3">
                  <p>{order.paymentMethod === 'COD' ? 'Cash on delivery' : 'InstaPay'}</p>
                  <p className="text-xs text-muted">
                    {order.paymentStatus}
                    {order.paymentReference && (
                      <span className="ms-2 font-mono">{order.paymentReference}</span>
                    )}
                  </p>
                </td>

                <td className="px-4 py-3 text-muted">
                  {new Date(order.createdAt).toLocaleDateString('en-GB')}
                </td>

                <td className="px-4 py-3">
                  <select
                    aria-label={`Status for order ${order._id.slice(-6)}`}
                    value={order.status}
                    disabled={order.status === 'Cancelled' || updatingId === order._id}
                    onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                    className={`rounded-full border-0 px-3 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-70 ${STATUS_STYLES[order.status]}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
