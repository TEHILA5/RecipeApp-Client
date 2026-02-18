// ===============================================
// Protected Route - src/routes/ProtectedRoute.tsx
// ===============================================

import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks.ts';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route מוגן - דורש התחברות
 * אם המשתמש לא מחובר, מפנה לדף התחברות
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
