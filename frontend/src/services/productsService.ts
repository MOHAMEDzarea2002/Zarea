import { api } from './api';
import type { ProductsQuery, ProductsResponse, SingleProductResponse } from '../types/types';

export const getProducts = async (params: ProductsQuery = {}, signal?: AbortSignal) => {
  const response = await api.get<ProductsResponse>('/products', { params, signal });

  return response.data;
};

export const getProductById = async (id: string, signal?: AbortSignal) => {
  const response = await api.get<SingleProductResponse>(`/products/${id}`, { signal });

  return response.data.data; // Product
};
