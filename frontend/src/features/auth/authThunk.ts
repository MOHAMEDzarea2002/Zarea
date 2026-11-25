import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { getMe, login, logout, register } from '../../services/authService';
import type { AuthResponse, LoginBody, RegisterBody, User } from '../../types/types';

// بيطلّع رسالة الـ backend ({ error: "..." }) لو موجودة
const getErrorMessage = (err: unknown) => {
  if (isAxiosError(err)) {
    return err.response?.data?.error ?? err.message;
  }
  return err instanceof Error ? err.message : 'Something went wrong';
};

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginBody,
  { rejectValue: string }
>('auth/login', async (body, { rejectWithValue }) => {
  try {
    return await login(body);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterBody,
  { rejectValue: string }
>('auth/register', async (body, { rejectWithValue }) => {
  try {
    return await register(body);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

// بيتنادى مرة واحدة أول ما الموقع يفتح (يعرف العميل داخل ولا لأ)
export const fetchMe = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const { user } = await getMe();
      return user;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logout();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  },
);
