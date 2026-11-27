import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import * as ordersService from '../../services/ordersService';
import type { Order, OrderStatus } from '../../types/types';

const getErrorMessage = (err: unknown, fallback: string) =>
  isAxiosError(err) ? (err.response?.data?.message ?? fallback) : fallback;

export const fetchAllOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await ordersService.getAllOrders();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to load orders'));
    }
  }
);

export const changeOrderStatus = createAsyncThunk<
  unknown,
  { id: string; status: OrderStatus },
  { rejectValue: string }
>('orders/changeStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    return await ordersService.updateOrderStatus(id, status);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, 'Failed to update order status'));
  }
});
