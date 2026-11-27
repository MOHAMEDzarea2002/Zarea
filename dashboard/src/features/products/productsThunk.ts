import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import * as productsService from '../../services/productsService';
import type { ProductsQuery, ProductsResponse } from '../../types/types';

const getErrorMessage = (err: unknown, fallback: string) =>
  isAxiosError(err) ? (err.response?.data?.message ?? fallback) : fallback;

export const fetchAdminProducts = createAsyncThunk<
  ProductsResponse,
  ProductsQuery,
  { rejectValue: string }
>('products/fetchAdmin', async (query, { rejectWithValue, signal }) => {
  try {
    return await productsService.getAdminProducts(query, signal);
  } catch (err) {
    if (isAxiosError(err) && err.code === 'ERR_CANCELED') throw err;
    return rejectWithValue(getErrorMessage(err, 'Failed to load products'));
  }
});

export const createAdminProduct = createAsyncThunk<unknown, FormData, { rejectValue: string }>(
  'products/create',
  async (form, { rejectWithValue }) => {
    try {
      return await productsService.createAdminProduct(form);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to create product'));
    }
  }
);

export const updateAdminProduct = createAsyncThunk<
  unknown,
  { id: string; form: FormData },
  { rejectValue: string }
>('products/update', async ({ id, form }, { rejectWithValue }) => {
  try {
    return await productsService.updateAdminProduct(id, form);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, 'Failed to update product'));
  }
});

export const deleteAdminProduct = createAsyncThunk<unknown, string, { rejectValue: string }>(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      return await productsService.deleteAdminProduct(id);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to delete product'));
    }
  }
);
