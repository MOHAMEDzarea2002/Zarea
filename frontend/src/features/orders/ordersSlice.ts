import { createSlice } from '@reduxjs/toolkit';
import { cancelMyOrder, fetchMyOrders, placeOrder } from './ordersThunk';
import type { Order } from '../../types/types';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

type OrdersState = {
  // إنشاء طلب
  lastOrder: Order | null; // آخر طلب اتعمل (لصفحة التأكيد)
  createStatus: Status;
  createError: string | null;
  // طلباتي
  items: Order[];
  listStatus: Status;
  listError: string | null;
};

const initialState: OrdersState = {
  lastOrder: null,
  createStatus: 'idle',
  createError: null,
  items: [],
  listStatus: 'idle',
  listError: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError(state) {
      state.createError = null;
      state.createStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // ---- إنشاء طلب ----
      .addCase(placeOrder.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.lastOrder = action.payload.order;
        // لو قايمة الطلبات متحملة، ضيف الطلب الجديد في الأول
        if (state.listStatus === 'succeeded') state.items.unshift(action.payload.order);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload ?? action.error.message ?? 'Failed to place order';
      })

      // ---- طلباتي ----
      .addCase(fetchMyOrders.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.listStatus = 'failed';
        state.listError = action.payload ?? action.error.message ?? 'Failed to load orders';
      })

      // ---- إلغاء طلب ----
      // بنغيّر الحالة بس، عشان الطلب في القايمة فيه بيانات المنتجات populated
      .addCase(cancelMyOrder.fulfilled, (state, action) => {
        const order = state.items.find((o) => o._id === action.payload._id);
        if (order) order.status = action.payload.status;
        if (state.lastOrder?._id === action.payload._id) {
          state.lastOrder.status = action.payload.status;
        }
      });
  },
});

export const { clearOrderError } = ordersSlice.actions;
export default ordersSlice.reducer;
