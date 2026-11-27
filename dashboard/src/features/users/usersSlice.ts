import { createSlice } from '@reduxjs/toolkit';
import { changeUserRole, fetchUsers } from './usersThunk';
import type { User } from '../../types/types';

type UsersState = {
  items: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  actionError: string | null;
};

const initialState: UsersState = {
  items: [],
  status: 'idle',
  error: null,
  actionError: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersActionError(state) {
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load users';
      })

      .addCase(changeUserRole.pending, (state) => {
        state.actionError = null;
      })
      .addCase(changeUserRole.fulfilled, (state, action) => {
  
        const index = state.items.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(changeUserRole.rejected, (state, action) => {
        state.actionError = action.payload ?? 'Failed to update role';
      });
  },
});

export const { clearUsersActionError } = usersSlice.actions;
export default usersSlice.reducer;
