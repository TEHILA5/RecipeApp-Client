/* eslint-disable @typescript-eslint/no-explicit-any */
// ===============================================
// Auth Slice - ניהול התחברות ב-Redux (FIXED)
// ===============================================
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as authApi from '../../../api/authApi';
import type { LoginPayload, RegisterPayload } from '../../../api/authApi';

// Types
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
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  error: null,
};
 
const isAdminFromToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // השרת שם את ה-role ב-claim בשם "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return role === 'Admin';
  } catch {
    return false;
  }
};

// ===============================================
// Async Thunks
// ===============================================

/**
 * התחברות למערכת
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);

      // שמירה ב-localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

/**
 * הרשמה למערכת
 */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);

      // שמירה ב-localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

/**
 * בדיקה אם המשתמש כבר מחובר (מ-localStorage)
 */
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (!token || !userStr) {
        throw new Error('No authentication found');
      }

      const user = JSON.parse(userStr);

      return { user, token };
    } catch (error: any) {
      // ניקוי localStorage אם יש בעיה
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue('Not authenticated: ' + error.message);
    }
  }
);

/**
 * קבלת פרטי משתמש מהשרת
 */
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authApi.getMe();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user');
    }
  }
);

// ===============================================
// Slice
// ===============================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // התנתקות
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.error = null;

      // ניקוי localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    // ניקוי שגיאות
    clearError: (state) => {
      state.error = null;
    },

    // עדכון פרטי משתמש
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    // ── Login ──
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // ✅ בדיקת isAdmin מתוך ה-token
      state.isAdmin = isAdminFromToken(action.payload.token);
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });

    // ── Register ──
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // ✅ בדיקת isAdmin מתוך ה-token
      state.isAdmin = isAdminFromToken(action.payload.token);
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
    });

    // ── Check Auth ──
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // ✅ בדיקת isAdmin מתוך ה-token
      state.isAdmin = isAdminFromToken(action.payload.token);
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
    });

    // ── Fetch Current User ──
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      // isAdmin נשאר כמו שהוא (מה-token)
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;