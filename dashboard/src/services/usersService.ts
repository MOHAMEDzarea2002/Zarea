import { api } from './api';
import type { Role, User } from '../types/types';

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get<{ data: User[] }>('/users');
  return res.data.data;
};

export const updateUserRole = async (id: string, role: Role): Promise<User> => {
  const res = await api.patch<{ data: User }>(`/users/${id}/role`, { role });
  return res.data.data;
};
