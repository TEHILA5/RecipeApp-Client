import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RecipeCategory } from '../../recipe/types/recipe.types';

type SearchMode = 'name' | 'category' | 'ingredients';
type ResultTab = 'results' | 'alternatives';

interface SearchState {
  mode: SearchMode;
  nameInput: string;
  categoryInput: RecipeCategory | '';
  ingredientList: string[];
  activeResultTab: ResultTab;
}

const initialState: SearchState = {
  mode: 'name',
  nameInput: '',
  categoryInput: '',
  ingredientList: [],
  activeResultTab: 'results',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<SearchMode>) => {
      state.mode = action.payload;
      state.nameInput = '';
      state.categoryInput = '';
      state.ingredientList = [];
      state.activeResultTab = 'results';
    },
    setNameInput: (state, action: PayloadAction<string>) => {
      state.nameInput = action.payload;
    },
    setCategoryInput: (state, action: PayloadAction<RecipeCategory | ''>) => {
      state.categoryInput = action.payload;
    },
    addIngredient: (state, action: PayloadAction<string>) => {
      if (!state.ingredientList.includes(action.payload)) {
        state.ingredientList.push(action.payload);
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredientList = state.ingredientList.filter((i) => i !== action.payload);
    },
    clearIngredients: (state) => {
      state.ingredientList = [];
    },
    setActiveResultTab: (state, action: PayloadAction<ResultTab>) => {
      state.activeResultTab = action.payload;
    },
    resetSearch: () => initialState,
  },
});

export const {
  setMode, setNameInput, setCategoryInput,
  addIngredient, removeIngredient, clearIngredients,
  setActiveResultTab, resetSearch,
} = searchSlice.actions;

export default searchSlice.reducer;