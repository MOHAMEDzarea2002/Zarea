import { createSlice } from '@reduxjs/toolkit';
import { createCategory, deleteCategory, fetchCategories, updateCategory } from './categoriesThunk';
import type { Category } from '../../types/types';

type CategoriesState = {
  items: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  saving: boolean;
  actionError: string | null;
};

const initialState: CategoriesState = {
  items: [],
  status: 'idle',
  error: null,
  saving: false,
  actionError: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryActionError(state) {
      state.actionError = null;
    },
  },
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
        state.error = action.payload ?? 'Failed to load categories';
      })

      .addMatcher(
        (action) =>
          [createCategory.pending, updateCategory.pending, deleteCategory.pending].some((t) =>
            t.match(action)
          ),
        (state) => {
          state.saving = true;
          state.actionError = null;
        }
      )
      .addMatcher(
        (action) =>
          [createCategory.fulfilled, updateCategory.fulfilled, deleteCategory.fulfilled].some((t) =>
            t.match(action)
          ),
        (state) => {
          state.saving = false;
        }
      )
      .addMatcher(
        (action) =>
          [createCategory.rejected, updateCategory.rejected, deleteCategory.rejected].some((t) =>
            t.match(action)
          ),
        (state, action: any) => {
          state.saving = false;
          state.actionError = action.payload ?? 'Something went wrong';
        }
      );
  },
});

export const { clearCategoryActionError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
