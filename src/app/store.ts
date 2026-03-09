// ===============================================
// Redux Store - src/app/store.ts
// ===============================================

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/redux/authSlice';
import ingredientReducer from '../features/ingredient/redux/ingredientSlice';
import recipePanelReducer, { recipesApi } from '../features/recipe/redux/recipeSlice';
import uiReducer from '../redux/slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ingredients: ingredientReducer,

    // ✅ סטייט גלובלי לפילטרים/עמודים (לא קשור לשרת)
    recipePanel: recipePanelReducer,

    // ✅ RTK Query cache - חובה!
    [recipesApi.reducerPath]: recipesApi.reducer,

    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['ui/openModal'],
        ignoredPaths: ['ui.modal.onConfirm'],
      },
    }).concat(recipesApi.middleware), // ✅ חובה! בלי זה RTK Query לא עובד
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;