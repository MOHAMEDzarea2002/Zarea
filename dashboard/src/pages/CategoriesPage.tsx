import { useEffect, useState, type FormEvent } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from '../features/categories/categoriesThunk';
import { clearCategoryActionError } from '../features/categories/categoriesSlice';
import Modal from '../components/common/Modal';
import type { Category, CategoryInput } from '../types/types';

type Dialog =
  | { type: 'form'; category: Category | null }
  | { type: 'delete'; category: Category }
  | null;

const inputClass =
  'mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20';

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { items, status, error, saving, actionError } = useAppSelector((s) => s.categories);
  const [dialog, setDialog] = useState<Dialog>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const openDialog = (next: Dialog) => {
    dispatch(clearCategoryActionError());
    setDialog(next);
  };

  const handleSave = async (values: CategoryInput) => {
    const result =
      dialog?.type === 'form' && dialog.category
        ? await dispatch(updateCategory({ id: dialog.category._id, body: values }))
        : await dispatch(createCategory(values));

    if (result.meta.requestStatus === 'fulfilled') {
      setDialog(null);
      dispatch(fetchCategories());
    }
  };

  const handleDelete = async (category: Category) => {
    const result = await dispatch(deleteCategory(category._id));
    if (result.meta.requestStatus === 'fulfilled') {
      setDialog(null);
      dispatch(fetchCategories());
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted">{items.length} categories</p>
        </div>
        <button
          type="button"
          onClick={() => openDialog({ type: 'form', category: null })}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover"
        >
          <Plus size={16} strokeWidth={1.5} />
          New category
        </button>
      </header>

      {/* خطأ من الحذف أو الحفظ، زي "القسم فيه منتجات" */}
      {actionError && !dialog && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-status-cancelled">
          {actionError}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-canvas text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Alt text</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {status === 'loading' && items.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-muted">
                  Loading...
                </td>
              </tr>
            )}

            {status === 'failed' && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-status-cancelled">
                  {error}
                </td>
              </tr>
            )}

            {status === 'succeeded' && items.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-muted">
                  No categories yet.
                </td>
              </tr>
            )}

            {items.map((category) => (
              <tr
                key={category._id}
                className="border-b border-border last:border-0 hover:bg-canvas/60"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt=""
                        loading="lazy"
                        className="h-12 w-12 rounded object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded bg-canvas" />
                    )}
                    <span className="font-medium">{category.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{category.alt || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      aria-label={`Edit ${category.name}`}
                      onClick={() => openDialog({ type: 'form', category })}
                      className="rounded-lg p-2 text-muted hover:bg-canvas hover:text-ink"
                    >
                      <Pencil size={16} strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${category.name}`}
                      onClick={() => openDialog({ type: 'delete', category })}
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

      {dialog?.type === 'form' && (
        <Modal
          title={dialog.category ? 'Edit category' : 'New category'}
          onClose={() => setDialog(null)}
        >
          <CategoryForm
            category={dialog.category}
            saving={saving}
            error={actionError}
            onSubmit={handleSave}
            onCancel={() => setDialog(null)}
          />
        </Modal>
      )}

      {dialog?.type === 'delete' && (
        <Modal title="Delete category" onClose={() => setDialog(null)}>
          <p className="text-sm text-muted">
            Delete <span className="font-medium text-ink">{dialog.category.name}</span>? This can't
            be undone.
          </p>
          {actionError && (
            <p role="alert" className="mt-4 text-sm text-status-cancelled">
              {actionError}
            </p>
          )}
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
              onClick={() => handleDelete(dialog.category)}
              disabled={saving}
              className="rounded-lg bg-status-cancelled px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {saving ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}

type CategoryFormProps = {
  category: Category | null;
  saving: boolean;
  error: string | null;
  onSubmit: (values: CategoryInput) => void;
  onCancel: () => void;
};

function CategoryForm({ category, saving, error, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(category?.name ?? '');
  const [image, setImage] = useState(category?.image ?? '');
  const [alt, setAlt] = useState(category?.alt ?? '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name: name.trim(), image: image.trim(), alt: alt.trim() || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium">Name</span>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Image URL</span>
        <input
          required
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://res.cloudinary.com/..."
          className={inputClass}
        />
      </label>

      {image && <img src={image} alt="" className="h-32 w-32 rounded-lg object-cover" />}

      <label className="block">
        <span className="text-sm font-medium">Alt text</span>
        <input value={alt} onChange={(e) => setAlt(e.target.value)} className={inputClass} />
      </label>

      {error && (
        <p role="alert" className="text-sm text-status-cancelled">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3 border-t border-border pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-canvas"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
        >
          {saving ? 'Saving...' : category ? 'Save changes' : 'Create category'}
        </button>
      </div>
    </form>
  );
}
