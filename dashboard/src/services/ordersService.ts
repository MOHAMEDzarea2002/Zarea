import { api } from './api';
import type { Order, OrderStatus, OrdersResponse } from '../types/types';

export const getAllOrders = async (): Promise<Order[]> => {
  const res = await api.get<OrdersResponse>('/orders/all');
  return res.data.orders;
};

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  const res = await api.patch(`/orders/${id}/status`, { status });
  return res.data;
};
