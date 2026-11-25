import { createSlice } from '@reduxjs/toolkit';
import { fetchMe, loginUser, logoutUser, registerUser } from './authThunk';
import type { User } from '../../types/types';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

type AuthState = {
  user: User | null;
  status: Status; // حالة login / register
  error: string | null;
  initialized: boolean; // اتأكدنا من السيرفر (fetchMe خلص) ولا لسه
};

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // ---- login + register ----
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Registration failed';
      })

      // ---- fetchMe (أول ما الموقع يفتح) ----
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        // مش داخل (401) — ده طبيعي ومش خطأ نعرضه
        state.user = null;
        state.initialized = true;
      })

      // ---- logout ----
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
