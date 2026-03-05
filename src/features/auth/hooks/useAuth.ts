// ===============================================
// useAuth - Custom hook for auth state
// ===============================================
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { logout, clearError } from '../redux/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isAdmin, loading, error } = useAppSelector((s) => s.auth);

  return {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
  };
};

export default useAuth;