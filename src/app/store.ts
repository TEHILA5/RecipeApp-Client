// ===============================================
// Redux Store - src/app/store.ts
// ===============================================

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/redux/authSlice.ts';
import ingredientReducer from '../features/ingredient/redux/ingredientSlice';
import recipeReducer from '../features/recipe/redux/recipeSlice.ts';
import uiReducer from '../redux/slices/uiSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ingredients: ingredientReducer,
    recipes: recipeReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // התעלם מ-functions ב-Redux (למשל ב-modal)
        ignoredActions: ['ui/openModal'],
        ignoredPaths: ['ui.modal.onConfirm'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;