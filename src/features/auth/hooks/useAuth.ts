// ===============================================
// useAuth - Custom hook לגישה למצב ה-Auth
// ===============================================
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { logout, clearError } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, isAdmin, loading, error } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    handleLogout,
    handleClearError,
  };
}