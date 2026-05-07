import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// ingredientSlice now only manages local UI state.
// All API calls are handled via ingredientApi (RTK Query):
//   useGetAllIngredientsQuery, useCreateIngredientMutation, useUpdateIngredientMutation, etc.

interface IngredientUIState {
  searchTerm: string;
  selectedIngredientId: number | null;
  saveError: string | null;
}

const initialState: IngredientUIState = {
  searchTerm: '',
  selectedIngredientId: null,
  saveError: null,
};

const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredientSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedIngredient: (state, action: PayloadAction<number | null>) => {
      state.selectedIngredientId = action.payload;
    },
    clearSaveError: (state) => {
      state.saveError = null;
    },
    setSaveError: (state, action: PayloadAction<string>) => {
      state.saveError = action.payload;
    },
  },
});

export const {
  setIngredientSearchTerm,
  setSelectedIngredient,
  clearSaveError,
  setSaveError,
} = ingredientSlice.actions;

export default ingredientSlice.reducer;