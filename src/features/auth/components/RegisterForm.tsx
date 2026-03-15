// ===============================================
// RegisterForm - טופס הרשמה
// ===============================================
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, Alert, CircularProgress } from '@mui/material';
import FormInput from '../../../shared/components/FormInput';
import { validationRules } from '../../../shared/utils/validation';

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
        <FormInput
          label="Full Name" type="text"
          autoComplete="name" placeholder="John Doe"
          error={!!errors.name} helperText={errors.name?.message}
          {...register('name', validationRules.name)}
        />

        <FormInput
          label="Email Address" type="email"
          autoComplete="email" placeholder="you@example.com"
          error={!!errors.email} helperText={errors.email?.message}
          {...register('email', validationRules.email)}
        />

        <FormInput
          label="Phone Number" type="tel"
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

        <FormInput
          label="Password" type="password"
          autoComplete="new-password" placeholder="••••••••"
          error={!!errors.password} helperText={errors.password?.message}
          {...register('password', validationRules.password)}
        />

        <FormInput
          label="Confirm Password" type="password"
          autoComplete="new-password" placeholder="••••••••"
          error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message}
          {...register('confirmPassword', validationRules.confirmPassword(passwordValue))}
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
