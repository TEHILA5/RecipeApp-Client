// ===============================================
// Ingredient Slice - Redux
// ===============================================
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as ingredientApi from '../../../api/ingredientApi';
import type { Ingredient } from '../types/ingredient.types';

interface IngredientState {
  ingredients: Ingredient[];
  loading: boolean;
  error: string | null;
  saving: boolean;
  saveError: string | null;
}

const initialState: IngredientState = {
  ingredients: [],
  loading: false,
  error: null,
  saving: false,
  saveError: null,
};

// Thunks
export const fetchAllIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await ingredientApi.getAllIngredients();
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to load ingredients');
    }
  }
);

export const createNewIngredient = createAsyncThunk(
  'ingredients/create',
  async (name: string, { rejectWithValue }) => {
    try {
      return await ingredientApi.createIngredient({ name });
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to create ingredient');
    }
  }
);

export const updateExistingIngredient = createAsyncThunk(
  'ingredients/update',
  async ({ id, name }: { id: number; name: string }, { rejectWithValue }) => {
    try {
      return await ingredientApi.updateIngredient(id, { name });
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to update ingredient');
    }
  }
);

const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    clearSaveError(state) {
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {
    // fetchAll
    builder
      .addCase(fetchAllIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchAllIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // create
    builder
      .addCase(createNewIngredient.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(createNewIngredient.fulfilled, (state, action) => {
        state.saving = false;
        state.ingredients.push(action.payload);
      })
      .addCase(createNewIngredient.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload as string;
      });

    // update
    builder
      .addCase(updateExistingIngredient.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(updateExistingIngredient.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.ingredients.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.ingredients[idx] = action.payload;
      })
      .addCase(updateExistingIngredient.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload as string;
      });
  },
});

export const { clearSaveError } = ingredientSlice.actions;
export default ingredientSlice.reducer;