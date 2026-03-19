import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { loginUser, clearError } from '../redux/authSlice';
import LoginForm from '../components/LoginForm';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => { dispatch(clearError()); }, [dispatch]);
  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      navigate('/');
    } catch {
      // handled by redux error state
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-visual">
          <div className="visual-content">
            <h2 className="visual-title">Welcome Back!</h2>
            <p className="visual-desc">
              Continue your sweet journey with us. Log in to access your
              favorite recipes and discover new delicious creations! 🍰
            </p>
            <div className="visual-emoji">🧁✨🍪</div>
          </div>
        </div>
        <div className="login-form-wrapper">
          <LoginForm onSubmit={onSubmit} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}
