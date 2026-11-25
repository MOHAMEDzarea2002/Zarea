import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories } from '../../services/categoryService';
import type { Category } from '../../types/types';

export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await getCategories();
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Something went wrong');
    }
  }
);
