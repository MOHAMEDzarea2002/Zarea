import { useEffect, useState, type FormEvent } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { createAdminProduct, updateAdminProduct } from '../../features/products/productsThunk';
import * as categoriesService from '../../services/categoriesService';
import type { Product, ProductCategory } from '../../types/types';

const MAX_GALLERY = 3;

type VariantRow = { id: string; color: string; size: string; stock: string };

const newRow = (): VariantRow => ({
  id: crypto.randomUUID(),
  color: '',
  size: '',
  stock: '0',
});

type ProductFormProps = {
  product: Product | null; // null = إضافة جديدة
  onClose: () => void;
  onSaved: () => void;
};

const inputClass =
  'mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20';

export default function ProductForm({ product, onClose, onSaved }: ProductFormProps) {
  const dispatch = useAppDispatch();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [category, setCategory] = useState(product?.category?._id ?? '');
  const [status, setStatus] = useState(product?.status ?? 'active');
  const [variants, setVariants] = useState<VariantRow[]>(
    product?.variants.length
      ? product.variants.map((v) => ({
          id: v._id,
          color: v.color,
          size: v.size,
          stock: String(v.stock),
        }))
      : [newRow()]
  );
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    categoriesService
      .getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const updateRow = (id: string, field: 'color' | 'size' | 'stock', value: string) =>
    setVariants((rows) => rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const removeRow = (id: string) => setVariants((rows) => rows.filter((r) => r.id !== id));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isEdit && !mainFile) {
      setError('Main image is required.');
      return;
    }

    const cleanVariants = variants
      .filter((v) => v.color.trim() && v.size.trim())
      .map((v) => ({
        color: v.color.trim(),
        size: v.size.trim(),
        stock: Number(v.stock) || 0,
      }));

    if (cleanVariants.length === 0) {
      setError('Add at least one variant with color and size.');
      return;
    }

    const form = new FormData();
    form.append('name', name.trim());
    form.append('price', price);
    form.append('description', description.trim());
    if (category) form.append('category', category);
    form.append('status', status);
    form.append('variants', JSON.stringify(cleanVariants));
    if (mainFile) form.append('mainImage', mainFile);
    galleryFiles.slice(0, MAX_GALLERY).forEach((file) => form.append('gallery', file));

    setSubmitting(true);
    const result = product
      ? await dispatch(updateAdminProduct({ id: product._id, form }))
      : await dispatch(createAdminProduct(form));
    setSubmitting(false);

    if (result.meta.requestStatus === 'rejected') {
      setError((result.payload as string) ?? 'Something went wrong.');
      return;
    }

    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Price (EGP)</span>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium">Description</span>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      {/* الصور */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">
            Main image {isEdit && <span className="text-muted">(leave empty to keep current)</span>}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMainFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Gallery (up to {MAX_GALLERY})</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setGalleryFiles(Array.from(e.target.files ?? []).slice(0, MAX_GALLERY))
            }
            className="mt-1 block w-full text-sm"
          />
        </label>
      </div>

      {isEdit && product!.images.length > 0 && (
        <div className="flex gap-2">
          {product!.images.map((src, i) => (
            <img key={i} src={src} alt="" className="h-16 w-12 rounded object-cover" />
          ))}
        </div>
      )}

      {/* الـ variants */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Variants</legend>

        {variants.map((row) => (
          <div key={row.id} className="grid grid-cols-[1fr_1fr_6rem_auto] items-center gap-2">
            <input
              placeholder="Color"
              value={row.color}
              onChange={(e) => updateRow(row.id, 'color', e.target.value)}
              className={inputClass.replace('mt-1 ', '')}
            />
            <input
              placeholder="Size"
              value={row.size}
              onChange={(e) => updateRow(row.id, 'size', e.target.value)}
              className={inputClass.replace('mt-1 ', '')}
            />
            <input
              type="number"
              min="0"
              aria-label="Stock"
              value={row.stock}
              onChange={(e) => updateRow(row.id, 'stock', e.target.value)}
              className={inputClass.replace('mt-1 ', '')}
            />
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              className="rounded-lg px-3 py-2 text-sm text-status-cancelled hover:bg-canvas"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setVariants((rows) => [...rows, newRow()])}
          className="text-sm font-medium text-brand hover:text-brand-hover"
        >
          + Add variant
        </button>
      </fieldset>

      {error && (
        <p role="alert" className="text-sm text-status-cancelled">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3 border-t border-border pt-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-canvas"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
        >
          {submitting ? 'Saving...' : isEdit ? 'Save changes' : 'Create product'}
        </button>
      </div>
    </form>
  );
}
