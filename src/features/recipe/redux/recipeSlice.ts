/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ===============================================
// Recipe Slice - ניהול מתכונים ב-Redux
// ===============================================
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as recipeApi from '../../../api/recipeApi';
import { Recipe, RecipeCreateDto, RecipeUpdateDto, RecipeCategory } from '../types/recipe.types';

interface RecipeState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  filteredRecipes: Recipe[];
  recommendedRecipes: Recipe[];
  searchResults: Recipe[];
  selectedCategory: RecipeCategory | null;
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

const initialState: RecipeState = {
  recipes: [],
  currentRecipe: null,
  filteredRecipes: [],
  recommendedRecipes: [],
  searchResults: [],
  selectedCategory: null,
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  pageSize: 12,
};

// ===============================================
// Async Thunks
// ===============================================

// קבלת כל המתכונים
export const fetchAllRecipes = createAsyncThunk(
  'recipes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const recipes = await recipeApi.getAllRecipes();
      return recipes;
    } catch (_error: any) {
      return rejectWithValue(_error.message);
    }
  }
);

// קבלת מתכון לפי ID
export const fetchRecipeById = createAsyncThunk(
  'recipes/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const recipe = await recipeApi.getRecipeById(id);
      return recipe;
    } catch (_error: any) {
      return rejectWithValue(_error.message);
    }
  }
);

// יצירת מתכון חדש
export const createNewRecipe = createAsyncThunk(
  'recipes/create',
  async (recipeData: RecipeCreateDto, { rejectWithValue }) => {
    try {
      const recipe = await recipeApi.createRecipe(recipeData);
      return recipe;
    } catch (_error: any) {
      return rejectWithValue(_error.message);
    }
  }
);

// עדכון מתכון
export const updateExistingRecipe = createAsyncThunk(
  'recipes/update',
  async ({ id, data }: { id: number; data: RecipeUpdateDto }, { rejectWithValue }) => {
    try {
      const recipe = await recipeApi.updateRecipe(id, data);
      return recipe;
    } catch (_error: any) {
      return rejectWithValue(_error.message);
    }
  }
);

// מחיקת מתכון
export const deleteExistingRecipe = createAsyncThunk(
  'recipes/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await recipeApi.deleteRecipe(id);
      return id;
    } catch (_error: any) {
      return rejectWithValue(_error.message);
    }
  }
);

// חיפוש לפי קטגוריה
export const searchByCategory = createAsyncThunk(
  'recipes/searchByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      const recipes = await recipeApi.searchRecipesByCategory(category);
      return recipes;
    } catch (_error: any) {
      return rejectWithValue(_error.message);
    }
  }
);

// חיפוש לפי מרכיבים
export const searchByIngredients = createAsyncThunk(
  'recipes/searchByIngredients',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const recipes = await recipeApi.searchRecipesByIngredients(ingredients);
      return recipes;
    } catch (_error: any) {
      return rejectWithValue(_error.message);
    }
  }
);

// קבלת המלצות אישיות
export const fetchRecommendedRecipes = createAsyncThunk(
  'recipes/fetchRecommended',
  async (_, { rejectWithValue }) => {
    try {
      const recipes = await recipeApi.getRecommendedRecipes();
      return recipes;
    } catch (_error: any) {
      return rejectWithValue(_error.message);
    }
  }
);

// ===============================================
// Slice
// ===============================================

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    // סינון מתכונים לפי קטגוריה (client-side)
    filterByCategory: (state, action: PayloadAction<RecipeCategory | null>) => {
      state.selectedCategory = action.payload;
      if (action.payload === null) {
        state.filteredRecipes = state.recipes;
      } else {
        state.filteredRecipes = state.recipes.filter(
          (recipe) => recipe.category === action.payload
        );
      }
    },
    // חיפוש מתכונים לפי שם (client-side)
    searchRecipes: (state, action: PayloadAction<string>) => {
      const searchTerm = action.payload.toLowerCase();
      if (!searchTerm) {
        state.searchResults = [];
      } else {
        state.searchResults = state.recipes.filter((recipe) =>
          recipe.name.toLowerCase().includes(searchTerm)
        );
      }
    },
    // ניקוי מתכון נוכחי
    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
    },
    // ניקוי שגיאות
    clearError: (state) => {
      state.error = null;
    },
    // עמוד הבא
    nextPage: (state) => {
      state.currentPage += 1;
    },
    // עמוד קודם
    previousPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
    // שינוי גודל עמוד
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Recipes
    builder.addCase(fetchAllRecipes.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllRecipes.fulfilled, (state, action) => {
      state.loading = false;
      state.recipes = action.payload;
      state.filteredRecipes = action.payload;
      state.totalCount = action.payload.length;
    });
    builder.addCase(fetchAllRecipes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Recipe By ID
    builder.addCase(fetchRecipeById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRecipeById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentRecipe = action.payload;
    });
    builder.addCase(fetchRecipeById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Recipe
    builder.addCase(createNewRecipe.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createNewRecipe.fulfilled, (state, action) => {
      state.loading = false;
      state.recipes.unshift(action.payload);
      state.totalCount += 1;
    });
    builder.addCase(createNewRecipe.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Recipe
    builder.addCase(updateExistingRecipe.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateExistingRecipe.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.recipes.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.recipes[index] = action.payload;
      }
      if (state.currentRecipe?.id === action.payload.id) {
        state.currentRecipe = action.payload;
      }
    });
    builder.addCase(updateExistingRecipe.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Recipe
    builder.addCase(deleteExistingRecipe.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteExistingRecipe.fulfilled, (state, action) => {
      state.loading = false;
      state.recipes = state.recipes.filter((r) => r.id !== action.payload);
      state.totalCount -= 1;
    });
    builder.addCase(deleteExistingRecipe.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Search By Category
    builder.addCase(searchByCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(searchByCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.searchResults = action.payload;
    });
    builder.addCase(searchByCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Search By Ingredients
    builder.addCase(searchByIngredients.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(searchByIngredients.fulfilled, (state, action) => {
      state.loading = false;
      state.searchResults = action.payload;
    });
    builder.addCase(searchByIngredients.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Recommended
    builder.addCase(fetchRecommendedRecipes.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRecommendedRecipes.fulfilled, (state, action) => {
      state.loading = false;
      state.recommendedRecipes = action.payload;
    });
    builder.addCase(fetchRecommendedRecipes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  filterByCategory,
  searchRecipes,
  clearCurrentRecipe,
  clearError,
  nextPage,
  previousPage,
  setPageSize,
} = recipeSlice.actions;

export default recipeSlice.reducer;