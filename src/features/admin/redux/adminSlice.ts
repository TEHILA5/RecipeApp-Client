import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// adminSlice manages local UI state only.
// All API calls are handled via adminApi (RTK Query) in src/api/adminApi.ts:
//   useGetAllConversionsQuery, useGetAllUsersQuery, useGetWeeklyStatsQuery
//   useCreateConversionMutation, useUpdateConversionMutation, useDeleteConversionMutation
//   useGetAllUsersQuery, useUpdateUserMutation, useDeleteUserMutation

interface AdminUIState {
  selectedConversionId: number | null;
  selectedUserId: number | null;
}

const initialState: AdminUIState = {
  selectedConversionId: null,
  selectedUserId: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setSelectedConversion: (state, action: PayloadAction<number | null>) => {
      state.selectedConversionId = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<number | null>) => {
      state.selectedUserId = action.payload;
    },
    clearSelections: (state) => {
      state.selectedConversionId = null;
      state.selectedUserId = null;
    },
  },
});

export const { setSelectedConversion, setSelectedUser, clearSelections } = adminSlice.actions;
export default adminSlice.reducer;