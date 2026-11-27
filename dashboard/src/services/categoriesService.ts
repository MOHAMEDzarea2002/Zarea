import { api } from './api';
import type { Category, CategoryInput } from '../types/types';

export const getCategories = async (): Promise<Category[]> => {
  const res = await api.get('/categories');
  return Array.isArray(res.data) ? res.data : res.data.data;
};

export const createCategory = async (body: CategoryInput) => {
  const res = await api.post('/categories', body);
  return res.data;
};

export const updateCategory = async (id: string, body: Partial<CategoryInput>) => {
  const res = await api.put(`/categories/${id}`, body);
  return res.data;
};

export const deleteCategory = async (id: string) => {
  await api.delete(`/categories/${id}`);
};
