// ===============================================
// User Slice - UI state for profile/favorites
// ===============================================
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type ProfileTab = 'info' | 'stats' | 'danger';

interface UserUIState {
  activeProfileTab: ProfileTab;
  favoritesCount: number;
}

const initialState: UserUIState = {
  activeProfileTab: 'info',
  favoritesCount: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setActiveProfileTab: (state, action: PayloadAction<ProfileTab>) => {
      state.activeProfileTab = action.payload;
    },
    setFavoritesCount: (state, action: PayloadAction<number>) => {
      state.favoritesCount = action.payload;
    },
  },
});

export const { setActiveProfileTab, setFavoritesCount } = userSlice.actions;
export default userSlice.reducer;