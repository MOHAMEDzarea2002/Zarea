import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import * as categoriesService from '../../services/categoriesService';
import type { Category, CategoryInput } from '../../types/types';

const getErrorMessage = (err: unknown, fallback: string) =>
  isAxiosError(err) ? (err.response?.data?.message ?? fallback) : fallback;

export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  'categories/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await categoriesService.getCategories();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to load categories'));
    }
  }
);

export const createCategory = createAsyncThunk<unknown, CategoryInput, { rejectValue: string }>(
  'categories/create',
  async (body, { rejectWithValue }) => {
    try {
      return await categoriesService.createCategory(body);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to create category'));
    }
  }
);

export const updateCategory = createAsyncThunk<
  unknown,
  { id: string; body: Partial<CategoryInput> },
  { rejectValue: string }
>('categories/update', async ({ id, body }, { rejectWithValue }) => {
  try {
    return await categoriesService.updateCategory(id, body);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, 'Failed to update category'));
  }
});

export const deleteCategory = createAsyncThunk<unknown, string, { rejectValue: string }>(
  'categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      return await categoriesService.deleteCategory(id);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to delete category'));
    }
  }
);
