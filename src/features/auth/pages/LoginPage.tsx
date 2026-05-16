/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { useLoginMutation } from '../../../api/authApi';
import { clearError } from '../redux/authSlice';
import LoginForm from '../components/LoginForm';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [login, { isLoading, error }] = useLoginMutation();

  useEffect(() => { dispatch(clearError()); }, [dispatch]);
  useEffect(() => { if (isAuthenticated) navigate('/'); }, [isAuthenticated, navigate]);

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      await login(data).unwrap();
      navigate('/');
    } catch { /* empty */ }
  };

  const errorMessage: string | null = (() => {
    if (!error) return null;
    const e = error as any;
    if (e && typeof e === 'object' && 'message' in e && typeof e.message === 'string') {
      return e.message;
    }
    if (typeof e === 'string') return e;
    return 'Login failed';
  })();

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-visual">
          <div className="visual-content">
            <h2 className="visual-title">Welcome Back!</h2>
            <p className="visual-desc">
              Continue your sweet journey with us. Log in to access your
              favorite recipes and discover new delicious creations!
            </p>
            <div className="visual-emoji">
              <img src="/src/assets/images/sweety.png" alt="Logo" className="visual-emoji-img" />
            </div>
          </div>
        </div>
        <div className="login-form-wrapper">
          <LoginForm onSubmit={onSubmit} loading={isLoading} error={errorMessage} />
        </div>
      </div>
    </div>
  );
}