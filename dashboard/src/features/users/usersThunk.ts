import { createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import * as usersService from '../../services/usersService';
import type { Role, User } from '../../types/types';

const getErrorMessage = (err: unknown, fallback: string) =>
  isAxiosError(err) ? (err.response?.data?.message ?? fallback) : fallback;

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await usersService.getUsers();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to load users'));
    }
  }
);

export const changeUserRole = createAsyncThunk<
  User,
  { id: string; role: Role },
  { rejectValue: string }
>('users/changeRole', async ({ id, role }, { rejectWithValue }) => {
  try {
    return await usersService.updateUserRole(id, role);
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, 'Failed to update role'));
  }
});
