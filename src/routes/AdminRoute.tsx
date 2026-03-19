import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';

interface AdminRouteProps {
  children: React.ReactNode;
}

function AdminRoute({ children }: AdminRouteProps) {
  const { isAuthenticated, isAdmin } = useAppSelector((s) => s.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin)         return <Navigate to="/" replace />;

  return <>{children}</>;
}

export default AdminRoute;
