// ===============================================
// LoginForm - טופס התחברות
// ===============================================
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TextField, Button, Alert, CircularProgress } from '@mui/material';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export default function LoginForm({ onSubmit, loading, error }: LoginFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  return (
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
          label="Email Address" type="email" fullWidth
          autoComplete="email" placeholder="you@example.com"
          error={!!errors.email} helperText={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Email is invalid' },
          })}
        />

        <TextField
          label="Password" type="password" fullWidth
          autoComplete="current-password" placeholder="••••••••"
          error={!!errors.password} helperText={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          })}
        />

        <div className="forgot-link">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <Button
          type="submit" variant="contained" fullWidth
          disabled={loading} size="large"
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
  );
}
