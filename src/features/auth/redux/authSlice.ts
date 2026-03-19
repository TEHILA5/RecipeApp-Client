/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as authApi from '../../../api/authApi';
import type { LoginPayload, RegisterPayload } from '../../../api/authApi';

interface User {
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null, token: null,
  isAuthenticated: false, isAdmin: false,
  loading: false, error: null,
};

const isAdminFromToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return role === 'Admin';
  } catch { return false; }
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await authApi.login(credentials);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await authApi.register(userData);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) throw new Error('No authentication found');
      return { user: JSON.parse(userStr), token };
    } catch (err: any) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue('Not authenticated: ' + err.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.getMe();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null; state.token = null;
      state.isAuthenticated = false; state.isAdmin = false; state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => { state.error = null; },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user;
        state.token = action.payload.token; state.isAuthenticated = true;
        state.isAdmin = isAdminFromToken(action.payload.token); state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false; state.error = action.payload as string; state.isAuthenticated = false;
      });

    builder
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user;
        state.token = action.payload.token; state.isAuthenticated = true;
        state.isAdmin = isAdminFromToken(action.payload.token); state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false; state.error = action.payload as string; state.isAuthenticated = false;
      });

    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user; state.token = action.payload.token;
        state.isAuthenticated = true; state.isAdmin = isAdminFromToken(action.payload.token);
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null; state.token = null;
        state.isAuthenticated = false; state.isAdmin = false;
      });

    builder
      .addCase(fetchCurrentUser.pending, (state) => { state.loading = true; })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false; state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;