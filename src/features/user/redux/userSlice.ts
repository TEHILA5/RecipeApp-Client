import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserActionDto } from '../../recipe/types/userAction.types';

interface UserUIState {
  optimisticBookmarks: number[];
}

const initialState: UserUIState = {
  optimisticBookmarks: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addOptimisticBookmark: (state, action: PayloadAction<number>) => {
      if (!state.optimisticBookmarks.includes(action.payload)) {
        state.optimisticBookmarks.push(action.payload);
      }
    },
    removeOptimisticBookmark: (state, action: PayloadAction<number>) => {
      state.optimisticBookmarks = state.optimisticBookmarks.filter((id) => id !== action.payload);
    },
    clearOptimisticBookmarks: (state) => {
      state.optimisticBookmarks = [];
    },
  },
});

export const {
  addOptimisticBookmark,
  removeOptimisticBookmark,
  clearOptimisticBookmarks,
} = userSlice.actions;

export default userSlice.reducer;

export type { UserActionDto };