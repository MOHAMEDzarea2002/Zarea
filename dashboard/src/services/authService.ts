import { api } from './api';
import type { AuthResponse, LoginBody, User } from '../types/types';

export const login = async (body: LoginBody) => {
  const res = await api.post<AuthResponse>('/auth/login', body);
  return res.data;
};

export const getMe = async (): Promise<User> => {
  const res = await api.get<{ user: User }>('/auth/me');
  return res.data.user;
};

export const logout = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};
