// ===============================================
// ForgotPassword - Sweet&Treat
// ===============================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance, { handleApiError } from '../../../api/axiosConfig';

type Step = 'email' | 'password' | 'success';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    border: '2px solid #fce7f3', borderRadius: '12px',
    fontFamily: "'Nunito',sans-serif", fontSize: '0.92rem',
    background: '#fdf2f8', outline: 'none',
    boxSizing: 'border-box', color: '#1f2937',
  };

  const handleEmailSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) { setError('Please enter your email'); return; }
    if (!emailRegex.test(email)) { setError('Please enter a valid email'); return; }
    setError('');
    setStep('password');
  };

  const handleReset = async () => {
    if (!newPassword) { setError('Please enter a new password'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }

    setLoading(true);
    setError('');
    try {
      await axiosInstance.post('/user/reset-password', { email, newPassword });
      setStep('success');
    } catch (err: unknown) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#fdf2f8',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Nunito',sans-serif", padding: '24px',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Nunito:wght@400;600;700;800&display=swap');
        .fp-input:focus { border-color: #d4547a !important; box-shadow: 0 0 0 3px rgba(212,84,122,0.12); }
      `}</style>

      <div style={{
        background: 'white', borderRadius: '28px', padding: '48px 40px',
        boxShadow: '0 8px 40px rgba(212,84,122,0.12)',
        maxWidth: 440, width: '100%',
      }}>

        {/* Step 1 — Email */}
        {step === 'email' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>🔑</div>
              <h1 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '2.2rem', color: '#1f2937', marginBottom: '8px' }}>
                Reset <span style={{ color: '#d4547a' }}>Password</span>
              </h1>
              <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Enter the email address linked to your account
              </p>
            </div>

            {error && (
              <div style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', background: '#fee2e2', color: '#991b1b', fontWeight: 600, fontSize: '0.85rem' }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Email Address
              </label>
              <input
                className="fp-input"
                type="email"
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
                placeholder="your@email.com"
                autoFocus
              />
            </div>

            <button onClick={handleEmailSubmit} style={{
              width: '100%', padding: '14px', borderRadius: '999px', border: 'none',
              background: 'linear-gradient(135deg, #e8799a, #d4547a)',
              color: 'white', fontFamily: "'Nunito',sans-serif",
              fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(212,84,122,0.3)', marginBottom: '16px',
            }}>
              Continue →
            </button>

            <div style={{ textAlign: 'center' }}>
              <Link to="/login" style={{ color: '#d4547a', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
                ← Back to Login
              </Link>
            </div>
          </>
        )}

        {/* Step 2 — New Password */}
        {step === 'password' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '52px', marginBottom: '12px' }}>🔒</div>
              <h1 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '2.2rem', color: '#1f2937', marginBottom: '8px' }}>
                New <span style={{ color: '#d4547a' }}>Password</span>
              </h1>
              <p style={{ color: '#9ca3af', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Choose a strong password for <strong>{email}</strong>
              </p>
            </div>

            {error && (
              <div style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', background: '#fee2e2', color: '#991b1b', fontWeight: 600, fontSize: '0.85rem' }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  New Password
                </label>
                <input
                  className="fp-input"
                  type="password"
                  style={inputStyle}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoFocus
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Confirm Password
                </label>
                <input
                  className="fp-input"
                  type="password"
                  style={inputStyle}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleReset()}
                  placeholder="Repeat your password"
                />
              </div>
            </div>

            <button onClick={handleReset} disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: '999px', border: 'none',
              background: loading ? '#e5e7eb' : 'linear-gradient(135deg, #e8799a, #d4547a)',
              color: loading ? '#9ca3af' : 'white', fontFamily: "'Nunito',sans-serif",
              fontWeight: 700, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(212,84,122,0.3)',
              marginBottom: '16px',
            }}>
              {loading ? 'Saving...' : '✨ Set New Password'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button onClick={() => { setStep('email'); setError(''); }} style={{
                background: 'none', border: 'none', color: '#d4547a',
                fontFamily: "'Nunito',sans-serif", fontWeight: 700,
                fontSize: '0.85rem', cursor: 'pointer',
              }}>
                ← Change Email
              </button>
            </div>
          </>
        )}

        {/* Step 3 — Success */}
        {step === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
            <h1 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '2.2rem', color: '#1f2937', marginBottom: '8px' }}>
              Password <span style={{ color: '#d4547a' }}>Reset!</span>
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '28px' }}>
              Your password has been updated successfully. You can now log in with your new password.
            </p>
            <button onClick={() => navigate('/login')} style={{
              width: '100%', padding: '14px', borderRadius: '999px', border: 'none',
              background: 'linear-gradient(135deg, #e8799a, #d4547a)',
              color: 'white', fontFamily: "'Nunito',sans-serif",
              fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(212,84,122,0.3)',
            }}>
              Go to Login →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
