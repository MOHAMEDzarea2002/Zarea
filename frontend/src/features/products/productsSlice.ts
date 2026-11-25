import { createSlice } from '@reduxjs/toolkit';
import { fetchProductById, fetchProducts } from './productsThunk';
import type { Pagination, Product } from '../../types/types';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

type ProductsState = {
  // القائمة
  items: Product[];
  pagination: Pagination | null;
  status: Status;
  error: string | null;
  // منتج واحد (صفحة التفاصيل)
  selected: Product | null;
  detailStatus: Status;
  detailError: string | null;
};

const initialState: ProductsState = {
  items: [],
  pagination: null,
  status: 'idle',
  error: null,
  selected: null,
  detailStatus: 'idle',
  detailError: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ---- القائمة ----
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Failed to load products';
      })

      // ---- منتج واحد ----
      .addCase(fetchProductById.pending, (state) => {
        state.detailStatus = 'loading';
        state.detailError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.selected = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.detailStatus = 'failed';
        state.detailError = action.payload ?? action.error.message ?? 'Failed to load product';
      });
  },
});

export default productsSlice.reducer;
