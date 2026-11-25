import { createSlice } from '@reduxjs/toolkit';
import { fetchCategories } from './categoriesThunk';
import type { Category } from '../../types/types';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

type CategoriesState = {
  items: Category[];
  status: Status;
  error: string | null;
};

const initialState: CategoriesState = {
  items: [],
  status: 'idle',
  error: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Failed to load categories';
      });
  },
});

export default categoriesSlice.reducer;
