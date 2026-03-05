// ===============================================
// ProfileCard - User info display + edit
// ===============================================
import { useState } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { updateUser } from '../../auth/redux/authSlice';
import { updateMe } from '../../../api/userApi';
import type { UserDto, UserUpdateDto } from '../../../api/userApi';

interface ProfileCardProps {
  user: UserDto;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 16px',
  border: '2px solid #fce7f3', borderRadius: '12px',
  fontFamily: "'Nunito',sans-serif", fontSize: '0.92rem',
  background: '#fdf2f8', outline: 'none', boxSizing: 'border-box',
  color: '#1f2937', transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af',
  letterSpacing: '0.07em', textTransform: 'uppercase',
  display: 'block', marginBottom: '6px',
};

export default function ProfileCard({ user }: ProfileCardProps) {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState<UserUpdateDto>({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  const handleSave = async () => {
    if (!form.name?.trim()) { setError('Name is required'); return; }
    if (!form.email?.trim()) { setError('Email is required'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) { setError('Please enter a valid email address'); return; }
    if (form.phone && !/^[\d\-+() ]{7,15}$/.test(form.phone)) { setError('Please enter a valid phone number'); return; }
    setSaving(true); setError('');
    try {
      const updated = await updateMe(form);
      dispatch(updateUser({ name: updated.name, email: updated.email, phone: updated.phone }));
      setSuccess('Profile updated! ✅');
      setEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: user.name, email: user.email, phone: user.phone });
    setError(''); setEditing(false);
  };

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : null;

  return (
    <div style={{
      background: 'white', borderRadius: '24px', padding: '36px',
      boxShadow: '0 4px 24px rgba(212,84,122,0.09)',
    }}>

      {/* Avatar + name header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #e8799a, #d4547a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', flexShrink: 0,
          boxShadow: '0 4px 16px rgba(212,84,122,0.3)',
        }}>👤</div>
        <div>
          <h2 style={{
            fontFamily: "'Dancing Script',cursive", fontSize: '1.8rem',
            color: '#1f2937', marginBottom: '2px', lineHeight: 1,
          }}>{user.name}</h2>
          {joinDate && (
            <p style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 600 }}>
              Member since {joinDate}
            </p>
          )}
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} style={{
            marginLeft: 'auto', padding: '9px 22px', borderRadius: '999px',
            border: '2px solid #fce7f3', background: 'white',
            color: '#d4547a', fontFamily: "'Nunito',sans-serif",
            fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#fce7f3')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {/* Alerts */}
      {success && (
        <div style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', background: '#dcfce7', border: '1px solid #86efac', color: '#166534', fontWeight: 600, fontSize: '0.88rem' }}>
          {success}
        </div>
      )}
      {error && (
        <div style={{ padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', fontWeight: 600, fontSize: '0.88rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {[
          { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
          { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
          { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '050-000-0000' },
        ].map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label style={labelStyle}>{label}</label>
            {editing ? (
              <input
                type={type}
                style={inputStyle}
                value={form[key as keyof UserUpdateDto] || ''}
                placeholder={placeholder}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#d4547a')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#fce7f3')}
              />
            ) : (
              <div style={{ padding: '11px 0', fontSize: '0.95rem', color: '#1f2937', fontWeight: 600, borderBottom: '1px solid #fce7f3' }}>
                {user[key as keyof UserDto] || <span style={{ color: '#d1d5db' }}>Not provided</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit action buttons */}
      {editing && (
        <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
          <button onClick={handleCancel} style={{
            flex: 1, padding: '12px', borderRadius: '999px',
            border: '2px solid #e5e7eb', background: 'white', color: '#6b7280',
            fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 2, padding: '12px', borderRadius: '999px', border: 'none',
            background: saving ? '#e5e7eb' : 'linear-gradient(135deg, #e8799a, #d4547a)',
            color: saving ? '#9ca3af' : 'white', fontFamily: "'Nunito',sans-serif",
            fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.9rem',
            boxShadow: saving ? 'none' : '0 4px 14px rgba(212,84,122,0.3)',
          }}>
            {saving ? 'Saving...' : '✨ Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}
