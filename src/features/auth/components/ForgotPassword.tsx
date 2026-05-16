import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useResetPasswordMutation } from '../../../api/authApi';
import './ForgotPassword.css';

type Step = 'email' | 'password' | 'success';

interface EmailForm { email: string; }
interface PasswordForm { newPassword: string; confirmPassword: string; }

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [serverError, setServerError] = useState('');

  const [resetPassword] = useResetPasswordMutation();

  const {
    register: regEmail,
    handleSubmit: handleEmail,
    formState: { errors: emailErrors, isSubmitting: emailSubmitting },
  } = useForm<EmailForm>();

  const {
    register: regPassword,
    handleSubmit: handlePassword,
    watch,
    formState: { errors: passErrors, isSubmitting: passSubmitting },
  } = useForm<PasswordForm>();

  const passwordValue = watch('newPassword');

  const onEmailSubmit = (data: EmailForm) => {
    setEmail(data.email);
    setServerError('');
    setStep('password');
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    setServerError('');
    try {
      await resetPassword({ email, newPassword: data.newPassword }).unwrap();
      setStep('success');
    } catch {
      setServerError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">

        {step === 'email' && (
          <>
            <div className="forgot-icon">
              <img src="/src/assets/icons/page-privacy.png" alt="" className="forgot-icon-img forgot-icon-img--lg" />
            </div>
            <h1 className="forgot-title">Reset <span>Password</span></h1>
            <p className="forgot-subtitle">Enter the email address linked to your account</p>

            {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

            <form onSubmit={handleEmail(onEmailSubmit)} className="forgot-form" noValidate>
              <TextField
                label="Email Address" type="email" fullWidth
                placeholder="your@email.com" autoFocus
                error={!!emailErrors.email}
                helperText={emailErrors.email?.message}
                {...regEmail('email', {
                  required: 'Email is required',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'Please enter a valid email' },
                })}
              />
              <Button type="submit" variant="contained" fullWidth size="large" disabled={emailSubmitting}
                startIcon={emailSubmitting ? <CircularProgress size={18} color="inherit" /> : null}>
                Continue →
              </Button>
            </form>

            <div className="forgot-back">
              <Link to="/login">← Back to Login</Link>
            </div>
          </>
        )}

        {step === 'password' && (
          <>
            <div className="forgot-icon">
              <img src="/src/assets/icons/page-privacy.png" alt="" className="forgot-icon-img forgot-icon-img--md" />
            </div>
            <h1 className="forgot-title">New <span>Password</span></h1>
            <p className="forgot-subtitle">Choose a strong password for <strong>{email}</strong></p>

            {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

            <form onSubmit={handlePassword(onPasswordSubmit)} className="forgot-form" noValidate>
              <TextField
                label="New Password" type="password" fullWidth
                placeholder="At least 6 characters" autoFocus
                error={!!passErrors.newPassword}
                helperText={passErrors.newPassword?.message}
                {...regPassword('newPassword', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'At least 6 characters' },
                })}
              />
              <TextField
                label="Confirm Password" type="password" fullWidth
                placeholder="Repeat your password"
                error={!!passErrors.confirmPassword}
                helperText={passErrors.confirmPassword?.message}
                {...regPassword('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === passwordValue || 'Passwords do not match',
                })}
              />
              <Button type="submit" variant="contained" fullWidth size="large" disabled={passSubmitting}
                startIcon={passSubmitting ? <CircularProgress size={18} color="inherit" /> : null}>
                {passSubmitting ? 'Saving...' : (
                  <>
                    <img src="/src/assets/icons/ai-sparkle.png" alt="" className="forgot-btn-icon" />
                    Set New Password
                  </>
                )}
              </Button>
            </form>

            <div className="forgot-back">
              <button onClick={() => { setStep('email'); setServerError(''); }}>← Change Email</button>
            </div>
          </>
        )}

        {step === 'success' && (
          <div className="forgot-success">
            <div className="forgot-icon">
              <img src="/src/assets/icons/newsletter-celebrate.png" alt="" className="forgot-icon-img forgot-icon-img--md" />
            </div>
            <h1 className="forgot-title">Password <span>Reset!</span></h1>
            <p className="forgot-subtitle">
              Your password has been updated successfully. You can now log in with your new password.
            </p>
            <Button variant="contained" fullWidth size="large" onClick={() => navigate('/login')}>
              Go to Login →
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}