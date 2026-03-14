// ===============================================
// Admin Slice - ניהול נתוני Admin ב-Redux
// ===============================================
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosConfig';
import type { ConversionDto } from '../../../api/conversionApi';

interface UserAdminDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
}

interface AdminState {
  conversions: ConversionDto[];
  loadingConversions: boolean;
  conversionsError: string | null;
  users: UserAdminDto[];
  loadingUsers: boolean;
  usersError: string | null;
}

const initialState: AdminState = {
  conversions: [],
  loadingConversions: false,
  conversionsError: null,
  users: [],
  loadingUsers: false,
  usersError: null,
};

// ── Thunks ──

export const fetchConversions = createAsyncThunk(
  'admin/fetchConversions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<ConversionDto[]>('/conversion');
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to load conversions');
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<UserAdminDto[]>('/user');
      return res.data;
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to load users');
    }
  }
);

export const deleteConversionThunk = createAsyncThunk(
  'admin/deleteConversion',
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/conversion/${id}`);
      return id;
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to delete');
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  'admin/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/user/${id}`);
      return id;
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to delete');
    }
  }
);

// ── Slice ──

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    addConversion: (state, action) => {
      state.conversions.push(action.payload);
    },
    updateConversionInState: (state, action) => {
      const idx = state.conversions.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) state.conversions[idx] = action.payload;
    },
    updateUserInState: (state, action) => {
      const idx = state.users.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) state.users[idx] = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchConversions
    builder
      .addCase(fetchConversions.pending, (state) => {
        state.loadingConversions = true;
        state.conversionsError = null;
      })
      .addCase(fetchConversions.fulfilled, (state, action) => {
        state.loadingConversions = false;
        state.conversions = action.payload;
      })
      .addCase(fetchConversions.rejected, (state, action) => {
        state.loadingConversions = false;
        state.conversionsError = action.payload as string;
      });

    // fetchAllUsers
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loadingUsers = true;
        state.usersError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loadingUsers = false;
        state.usersError = action.payload as string;
      });

    // deleteConversion
    builder.addCase(deleteConversionThunk.fulfilled, (state, action) => {
      state.conversions = state.conversions.filter((c) => c.id !== action.payload);
    });

    // deleteUser
    builder.addCase(deleteUserThunk.fulfilled, (state, action) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
    });
  },
});

export const { addConversion, updateConversionInState, updateUserInState } = adminSlice.actions;
export default adminSlice.reducer;