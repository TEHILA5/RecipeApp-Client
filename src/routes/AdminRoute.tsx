// ===============================================
// Admin Route - src/routes/AdminRoute.tsx
// ===============================================

import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks.ts';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * Route למנהל בלבד
 * אם המשתמש לא מנהל, מפנה לדף הבית
 */
function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, isAdmin } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default AdminRoute;
