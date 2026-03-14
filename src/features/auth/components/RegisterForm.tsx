// ===============================================
// RegisterForm - טופס הרשמה
// ===============================================
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TextField, Button, Alert, CircularProgress } from '@mui/material';

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export default function RegisterForm({ onSubmit, loading, error }: RegisterFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  const passwordValue = watch('password');

  return (
    <div className="login-form-content">
      <div className="form-logo">
        <span className="logo-text">Sweet&amp;Treat</span>
        <span className="logo-emoji">🍰</span>
      </div>

      <h1 className="form-title">Create Account</h1>
      <p className="form-subtitle">Fill in your details to get started</p>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
        <TextField
          label="Full Name" type="text" fullWidth
          autoComplete="name" placeholder="John Doe"
          error={!!errors.name} helperText={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
        />

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
          label="Phone Number" type="tel" fullWidth
          autoComplete="tel" placeholder="050-1234567"
          error={!!errors.phone} helperText={errors.phone?.message}
          {...register('phone', {
            required: 'Phone is required',
            pattern: {
              value: /^05\d{8}$/,
              message: 'Phone must be Israeli format (05XXXXXXXXX)',
            },
            setValueAs: (v: string) => v.replace(/[-\s]/g, ''),
          })}
        />

        <TextField
          label="Password" type="password" fullWidth
          autoComplete="new-password" placeholder="••••••••"
          error={!!errors.password} helperText={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          })}
        />

        <TextField
          label="Confirm Password" type="password" fullWidth
          autoComplete="new-password" placeholder="••••••••"
          error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (val) => val === passwordValue || 'Passwords do not match',
          })}
        />

        <Button
          type="submit" variant="contained" fullWidth
          disabled={loading} size="large"
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <div className="form-footer">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="link-primary">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
