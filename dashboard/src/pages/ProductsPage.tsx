import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { deleteAdminProduct, fetchAdminProducts } from '../features/products/productsThunk';
import Modal from '../components/common/Modal';
import ProductForm from '../components/products/ProductForm';
import type { Product } from '../types/types';

const LIMIT = 10;

type Dialog =
  | { type: 'form'; product: Product | null }
  | { type: 'delete'; product: Product }
  | null;

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { items, pagination, status, error } = useAppSelector((s) => s.products);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState<Dialog>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // البحث بعد 300ms من آخر كتابة
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const load = () =>
    dispatch(fetchAdminProducts({ page, limit: LIMIT, search: search || undefined }));

  useEffect(() => {
    const request = load();
    return () => request.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page, search]);

  const totalStock = (variants: { stock: number }[]) =>
    variants.reduce((sum, v) => sum + v.stock, 0);

  const handleDelete = async () => {
    if (dialog?.type !== 'delete') return;
    setDeleting(true);
    setActionError(null);

    const result = await dispatch(deleteAdminProduct(dialog.product._id));

    setDeleting(false);
    setDialog(null);

    if (result.meta.requestStatus === 'rejected') {
      setActionError((result.payload as string) ?? 'Failed to delete product.');
      return;
    }
    load();
  };

  const handleSaved = () => {
    setDialog(null);
    load();
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          {pagination && <p className="text-sm text-muted">{pagination.total} products in total</p>}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or description"
            className="w-56 rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          <button
            type="button"
            onClick={() => setDialog({ type: 'form', product: null })}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover"
          >
            <Plus size={16} strokeWidth={1.5} />
            New product
          </button>
        </div>
      </header>

      {actionError && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-status-cancelled">
          {actionError}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-canvas text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {status === 'loading' &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td colSpan={6} className="px-4 py-4">
                    <div className="h-4 w-full animate-pulse rounded bg-canvas" />
                  </td>
                </tr>
              ))}

            {status === 'failed' && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-status-cancelled">
                  {error}
                </td>
              </tr>
            )}

            {status === 'succeeded' && items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  No products found.
                </td>
              </tr>
            )}

            {status === 'succeeded' &&
              items.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-border last:border-0 hover:bg-canvas/60"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt=""
                          loading="lazy"
                          className="h-12 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-12 w-10 rounded bg-canvas" />
                      )}
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{product.category?.name ?? '—'}</td>
                  <td className="px-4 py-3">{product.price} EGP</td>
                  <td className="px-4 py-3">{totalStock(product.variants ?? [])}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        product.status === 'active'
                          ? 'bg-status-delivered/10 text-status-delivered'
                          : 'bg-canvas text-muted'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        aria-label={`Edit ${product.name}`}
                        onClick={() => setDialog({ type: 'form', product })}
                        className="rounded-lg p-2 text-muted hover:bg-canvas hover:text-ink"
                      >
                        <Pencil size={16} strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${product.name}`}
                        onClick={() => setDialog({ type: 'delete', product })}
                        className="rounded-lg p-2 text-muted hover:bg-canvas hover:text-status-cancelled"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPage > 1 && (
        <nav className="flex items-center justify-end gap-3 text-sm">
          <button
            type="button"
            disabled={pagination.page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-canvas disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-muted">
            Page {pagination.page} of {pagination.totalPage}
          </span>
          <button
            type="button"
            disabled={pagination.page >= pagination.totalPage}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-canvas disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}

      {/* نافذة الإضافة والتعديل */}
      {dialog?.type === 'form' && (
        <Modal
          title={dialog.product ? 'Edit product' : 'New product'}
          size="lg"
          onClose={() => setDialog(null)}
        >
          <ProductForm
            product={dialog.product}
            onClose={() => setDialog(null)}
            onSaved={handleSaved}
          />
        </Modal>
      )}

      {/* تأكيد الحذف */}
      {dialog?.type === 'delete' && (
        <Modal title="Delete product" onClose={() => setDialog(null)}>
          <p className="text-sm text-muted">
            Are you sure you want to delete{' '}
            <span className="font-medium text-ink">{dialog.product.name}</span>? This can't be
            undone.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setDialog(null)}
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg bg-status-cancelled px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
