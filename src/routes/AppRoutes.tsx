import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

import Header from '../shared/components/Layout/Header';
import Footer from '../shared/components/Layout/Footer';

import HomePage from '../features/home/pages/HomePage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import RecipeListPage from '../features/recipe/pages/RecipeListPage';
import RecipeDetailPage from '../features/recipe/pages/RecipeDetailPage';
import RecipeCreatePage from '../features/recipe/pages/RecipeCreatePage';
import RecipeEditPage from '../features/recipe/pages/RecipeEditPage';
import ProfilePage from '../features/user/pages/ProfilePage';
import MyRecipesPage from '../features/user/pages/MyRecipesPage';
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import SearchPage from '../features/search/pages/SearchPage';
import Chat from '../features/chat/ChatPage';
import SweetieChat from '../features/chat/SweetieChat';
import IngredientManagePage from '../features/ingredient/pages/IngredientManagePage';
import ForgotPassword from '../features/auth/components/ForgotPassword';
import ConversionsPage from '../features/conversions/pages/ConversionsPage';
import AboutPage from '../features/static/pages/AboutPage';
import FAQPage from '../features/static/pages/FAQPage';
import ContactPage from '../features/static/pages/ContactPage';
import PrivacyPage from '../features/static/pages/PrivacyPage';
import BakingTipsPage from '../features/static/pages/BakingTipsPage';
import IngredientGuidePage from '../features/static/pages/IngredientGuidePage';
import NewsletterPage from '../features/static/pages/NewsletterPage';
import ToolsWeLovePage from '../features/static/pages/ToolsWeLovePage';
import { useScrollToTop } from '../shared/hooks/useScrollToTop';
import AdminReplyPage from '../features/admin/pages/AdminReplyPage';

function AppRoutes() {
  useScrollToTop();

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <Routes>
          {/* ── Public ── */}
          <Route path="/"                element={<HomePage />} />
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/register"        element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/conversions"     element={<ConversionsPage />} />
          <Route path="/recipes"         element={<RecipeListPage />} />
          <Route path="/recipes/:id"     element={<RecipeDetailPage />} />

          {/* ── Static Pages ── */}
          <Route path="/about"            element={<AboutPage />} />
          <Route path="/faq"              element={<FAQPage />} />
          <Route path="/contact"          element={<ContactPage />} />
          <Route path="/privacy"          element={<PrivacyPage />} />
          <Route path="/baking-tips"      element={<BakingTipsPage />} />
          <Route path="/ingredient-guide" element={<IngredientGuidePage />} />
          <Route path="/tools" element={<ToolsWeLovePage />} />
          <Route path="/newsletter" element={<NewsletterPage />} />

          {/* ── Admin ── */}
          <Route path="/recipes/create"    element={<AdminRoute><RecipeCreatePage /></AdminRoute>} />
          <Route path="/recipes/:id/edit"  element={<AdminRoute><RecipeEditPage /></AdminRoute>} />
          <Route path="/admin"             element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/ingredients" element={<AdminRoute><IngredientManagePage /></AdminRoute>} />
          <Route path="/admin/reply" element={<AdminRoute><AdminReplyPage /></AdminRoute>} />

          {/* ── Protected ── */}
          <Route path="/search"     element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/profile"    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/my-recipes" element={<ProtectedRoute><MyRecipesPage /></ProtectedRoute>} />
          <Route path="/chat"       element={<ProtectedRoute><SweetieChat /></ProtectedRoute>} />
          <Route path="/newchat"    element={<ProtectedRoute><Chat /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default AppRoutes;
