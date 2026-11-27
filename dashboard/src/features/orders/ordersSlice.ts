import { createSlice } from '@reduxjs/toolkit';
import { changeOrderStatus, fetchAllOrders } from './ordersThunk';
import type { Order } from '../../types/types';

type OrdersState = {
  items: Order[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  updatingId: string | null;
};

const initialState: OrdersState = {
  items: [],
  status: 'idle',
  error: null,
  updatingId: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load orders';
      })

      .addCase(changeOrderStatus.pending, (state, action) => {
        state.updatingId = action.meta.arg.id;
      })
      .addCase(changeOrderStatus.fulfilled, (state) => {
        state.updatingId = null;
      })
      .addCase(changeOrderStatus.rejected, (state) => {
        state.updatingId = null;
      });
  },
});

export default ordersSlice.reducer;
