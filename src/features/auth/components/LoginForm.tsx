import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Alert, CircularProgress } from '@mui/material';
import FormInput from '../../../shared/components/FormInput';
import { validationRules } from '../../../shared/utils/validation';

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
        <span className="logo-emoji">
          <img src="/src/assets/images/sweety.png" alt="Logo" className="form-logo-img" />
        </span>
      </div>

      <h1 className="form-title">Sign In</h1>
      <p className="form-subtitle">Enter your credentials to continue</p>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
        <FormInput
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register('email', validationRules.email)}
        />

        <FormInput
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register('password', validationRules.password)}
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
  );
}