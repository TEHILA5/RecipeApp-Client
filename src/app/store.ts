import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../api/baseApi';
import authReducer from '../features/auth/redux/authSlice';
import ingredientReducer from '../features/ingredient/redux/ingredientSlice';
import recipePanelReducer from '../features/recipe/redux/recipeSlice';
import uiReducer from '../redux/slices/uiSlice';
import adminReducer from '../features/admin/redux/adminSlice';
import userReducer from '../features/user/redux/userSlice';
import searchReducer from '../features/search/redux/searchSlice'; 

export const store = configureStore({
  reducer: { 
    [baseApi.reducerPath]: baseApi.reducer,
 
    auth: authReducer,
    ingredients: ingredientReducer,
    recipePanel: recipePanelReducer,
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
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;