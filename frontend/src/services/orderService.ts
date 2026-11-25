import { api } from './api'; // عدّل المسار حسب مكان ملف الـ axios عندك
import type {
  CancelOrderResponse,
  CreateOrderBody,
  CreateOrderResponse,
  MyOrdersResponse,
} from '../types';

// افترضت إن الـ router متركّب على /orders — عدّله لو مختلف
export const createOrder = async (body: CreateOrderBody) => {
  const response = await api.post<CreateOrderResponse>('/orders', body);

  return response.data; // { message, order }
};

export const getMyOrders = async (signal?: AbortSignal) => {
  const response = await api.get<MyOrdersResponse>('/orders', { signal });

  return response.data.orders;
};

export const cancelOrder = async (id: string) => {
  const response = await api.patch<CancelOrderResponse>(`/orders/${id}/cancel`);

  return response.data.order;
};
