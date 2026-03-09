// ===============================================
// Login Page - Sweet&Treat | React Hook Form + MUI
// ===============================================
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { loginUser, clearError } from '../redux/authSlice';
import './LoginPage.css';

interface LoginFormData {
  email: string;
  password: string;
}

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      navigate('/');
    } catch {
      // שגיאה מטופלת ב-Redux
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left Side - Visual */}
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

        {/* Right Side - Form */}
        <div className="login-form-wrapper">
          <div className="login-form-content">

            <div className="form-logo">
              <span className="logo-text">Sweet&amp;Treat</span>
              <span className="logo-emoji">🍰</span>
            </div>

            <h1 className="form-title">Sign In</h1>
            <p className="form-subtitle">Enter your credentials to continue</p>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>

              <TextField
                label="Email Address"
                type="email"
                fullWidth
                autoComplete="email"
                placeholder="you@example.com"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Email is invalid',
                  },
                })}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                autoComplete="current-password"
                placeholder="••••••••"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />

              <div className="forgot-link">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                size="large"
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="form-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="link-primary">Sign up now</Link>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
