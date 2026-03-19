import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMySavedRecipes, getMyComments } from '../../../api/userActionApi';
import type { UserActionDto } from '../../recipe/types/userAction.types';

interface UserState {
  savedRecipes: UserActionDto[];
  loadingSaved: boolean;
  savedError: string | null;
  myComments: UserActionDto[];
  loadingComments: boolean;
  commentsError: string | null;
}

const initialState: UserState = {
  savedRecipes: [],
  loadingSaved: false,
  savedError: null,
  myComments: [],
  loadingComments: false,
  commentsError: null,
};

const rejectMsg = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

export const fetchSavedRecipes = createAsyncThunk(
  'user/fetchSavedRecipes',
  async (_, { rejectWithValue }) => {
    try {
      return await getMySavedRecipes();
    } catch (err) {
      return rejectWithValue(rejectMsg(err, 'Failed to load saved recipes'));
    }
  }
);

export const fetchMyComments = createAsyncThunk(
  'user/fetchMyComments',
  async (_, { rejectWithValue }) => {
    try {
      return await getMyComments();
    } catch (err) {
      return rejectWithValue(rejectMsg(err, 'Failed to load comments'));
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    removeSavedRecipe: (state, action) => {
      state.savedRecipes = state.savedRecipes.filter((s) => s.recipeId !== action.payload);
    },
    addSavedRecipe: (state, action) => {
      state.savedRecipes.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedRecipes.pending, (state) => {
        state.loadingSaved = true;
        state.savedError = null;
      })
      .addCase(fetchSavedRecipes.fulfilled, (state, action) => {
        state.loadingSaved = false;
        state.savedRecipes = action.payload;
      })
      .addCase(fetchSavedRecipes.rejected, (state, action) => {
        state.loadingSaved = false;
        state.savedError = action.payload as string;
      })

      .addCase(fetchMyComments.pending, (state) => {
        state.loadingComments = true;
        state.commentsError = null;
      })
      .addCase(fetchMyComments.fulfilled, (state, action) => {
        state.loadingComments = false;
        state.myComments = action.payload;
      })
      .addCase(fetchMyComments.rejected, (state, action) => {
        state.loadingComments = false;
        state.commentsError = action.payload as string;
      });
  },
});

export const { removeSavedRecipe, addSavedRecipe } = userSlice.actions;
export default userSlice.reducer;