import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { cancelOrder, createOrder, getMyOrders } from '../../services/orderService';
import type { CreateOrderBody, CreateOrderResponse, Order } from '../../types/types';

// أخطاء الـ orders جاية في message (مش error زي الـ auth)
const getErrorMessage = (err: unknown) => {
  if (isAxiosError(err)) {
    return err.response?.data?.message ?? err.response?.data?.error ?? err.message;
  }
  return err instanceof Error ? err.message : 'Something went wrong';
};

export const placeOrder = createAsyncThunk<
  CreateOrderResponse,
  CreateOrderBody,
  { rejectValue: string }
>('orders/create', async (body, { rejectWithValue }) => {
  try {
    return await createOrder(body);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const fetchMyOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
  'orders/fetchMine',
  async (_, { signal, rejectWithValue }) => {
    try {
      return await getMyOrders(signal);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const cancelMyOrder = createAsyncThunk<Order, string, { rejectValue: string }>(
  'orders/cancel',
  async (id, { rejectWithValue }) => {
    try {
      return await cancelOrder(id);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);
