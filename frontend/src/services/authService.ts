import { api } from './api'; // عدّل المسار حسب مكان ملف الـ axios عندك
import type { AuthResponse, LoginBody, RegisterBody, User } from '../types/types';

// الـ endpoints دي تخمين مني — عدّلها حسب الـ routes عندك
export const register = async (body: RegisterBody) => {
  const response = await api.post<AuthResponse>('/auth/register', body);

  return response.data; // { message, user }
};

export const login = async (body: LoginBody) => {
  const response = await api.post<AuthResponse>('/auth/login', body);

  return response.data; // { message, user }
};

// محتاجين endpoint جديد في الـ backend (شوف الرسالة)
export const logout = async () => {
  await api.post('/auth/logout');
};

// محتاجين endpoint جديد في الـ backend (شوف الرسالة)
export const getMe = async () => {
  const response = await api.get<{ user: User }>('/auth/me');

  return response.data;
};
