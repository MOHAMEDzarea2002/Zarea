import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { getProductById, getProducts } from '../../services/productsService';
import type { Product, ProductsQuery, ProductsResponse } from '../../types/types';

const getErrorMessage = (err: unknown) => {
  if (isAxiosError(err)) return err.response?.data?.message ?? err.message;
  return err instanceof Error ? err.message : 'Something went wrong';
};

export const fetchProducts = createAsyncThunk<
  ProductsResponse,
  ProductsQuery,
  { rejectValue: string }
>('products/fetchAll', async (query, { signal, rejectWithValue }) => {
  try {
    return await getProducts(query, signal);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const fetchProductById = createAsyncThunk<Product, string, { rejectValue: string }>(
  'products/fetchById',
  async (id, { signal, rejectWithValue }) => {
    try {
      return await getProductById(id, signal);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);
