import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import * as authService from '../../services/authService';
import type { AuthResponse, LoginBody } from '../../types/types';

const getErrorMessage = (err: unknown, fallback: string) =>
  isAxiosError(err) ? (err.response?.data?.error ?? fallback) : fallback;

export const loginUser = createAsyncThunk<AuthResponse, LoginBody, { rejectValue: string }>(
  'auth/login',
  async (body, { rejectWithValue }) => {
    try {
      return await authService.login(body);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Login failed'));
    }
  }
);

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    return await authService.getMe();
  } catch {
    return rejectWithValue(null);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});
