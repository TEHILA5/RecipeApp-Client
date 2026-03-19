import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/redux/authSlice';
import ingredientReducer from '../features/ingredient/redux/ingredientSlice';
import recipePanelReducer, { recipesApi } from '../features/recipe/redux/recipeSlice';
import uiReducer from '../redux/slices/uiSlice';
import adminReducer from '../features/admin/redux/adminSlice';
import userReducer from '../features/user/redux/userSlice';
import searchReducer from '../features/search/redux/searchSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ingredients: ingredientReducer,
    recipePanel: recipePanelReducer,
    [recipesApi.reducerPath]: recipesApi.reducer,
    ui: uiReducer,
    admin: adminReducer,
    user: userReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['ui/openModal'],
        ignoredPaths: ['ui.modal.onConfirm'],
      },
    }).concat(recipesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;