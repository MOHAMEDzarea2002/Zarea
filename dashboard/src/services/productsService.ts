import { api } from './api';
import type { ProductsQuery, ProductsResponse } from '../types/types';

// الأدمن بيطلب status=all عشان يشوف كل المنتجات
export const getAdminProducts = async (params: ProductsQuery, signal?: AbortSignal) => {
  const res = await api.get<ProductsResponse>('/products', {
    params: { status: 'all', ...params },
    signal,
  });
  return res.data;
};

export const createAdminProduct = async (form: FormData) => {
  const res = await api.post('/products', form);
  return res.data;
};

export const updateAdminProduct = async (id: string, form: FormData) => {
  const res = await api.patch(`/products/${id}`, form);
  return res.data;
};

export const deleteAdminProduct = async (id: string) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};
