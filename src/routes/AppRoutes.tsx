// ===============================================
// App Routes - src/routes/AppRoutes.tsx
// ===============================================

import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.tsx';
import AdminRoute from './AdminRoute.tsx';

// Layout
import Header from '../shared/components/Layout/Header.tsx';
import Footer from '../shared/components/Layout/Footer.tsx';

// Pages
import HomePage from '../features/home/pages/HomePage.tsx';
import LoginPage from '../features/auth/pages/LoginPage.tsx';
import RegisterPage from '../features/auth/pages/RegisterPage.tsx';
import RecipeListPage from '../features/recipe/pages/RecipeListPage.tsx';
import RecipeDetailPage from '../features/recipe/pages/RecipeDetailPage.tsx';
import RecipeCreatePage from '../features/recipe/pages/RecipeCreatePage.tsx';
import RecipeEditPage from '../features/recipe/pages/RecipeEditPage.tsx';
import ProfilePage from '../features/user/pages/ProfilePage.tsx';
import MyRecipesPage from '../features/user/pages/MyRecipesPage.tsx';
import AdminDashboard from '../features/admin/pages/AdminDashboard.tsx';
import SearchPage from '../features/search/pages/SearchPage.tsx';
import SweetieChat from '../features/chat/SweetieChat.tsx';
import IngredientManagePage from '../features/ingredient/pages/IngredientManagePage.tsx';

function AppRoutes() {
  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        <Routes>
          {/* דפים ציבוריים */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ✅ specific routes BEFORE dynamic :id routes */}

          {/* ניהול מתכונים - רק למנהל */}
          <Route path="/recipes/create" element={
            <AdminRoute><RecipeCreatePage /></AdminRoute>
          } />
          <Route path="/recipes/:id/edit" element={
            <AdminRoute><RecipeEditPage /></AdminRoute>
          } />
          <Route path="/admin/ingredients" element={
            <AdminRoute><IngredientManagePage /></AdminRoute>
            } />
          {/* ✅ מתכונים - פתוח לכולם, גם לא מחוברים */}
          <Route path="/recipes" element={<RecipeListPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />

          {/* שאר הדפים - דורשים התחברות */}
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/my-recipes" element={<ProtectedRoute><MyRecipesPage /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><SweetieChat /></ProtectedRoute>} />

          {/* לוח בקרה למנהל */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

export default AppRoutes;
