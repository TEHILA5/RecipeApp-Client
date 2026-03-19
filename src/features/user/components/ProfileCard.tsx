import { useState } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { updateUser } from '../../auth/redux/authSlice';
import { updateMe } from '../../../api/userApi';
import type { UserDto, UserUpdateDto } from '../../../api/userApi';
import './ProfileCard.css';

interface ProfileCardProps {
  user: UserDto;
}

const FIELDS = [
  { key: 'name',  label: 'Full Name',      type: 'text',  placeholder: 'Your name' },
  { key: 'email', label: 'Email Address',  type: 'email', placeholder: 'your@email.com' },
  { key: 'phone', label: 'Phone Number',   type: 'tel',   placeholder: '050-000-0000' },
] as const;

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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Please enter a valid email address'); return; }
    if (form.phone && !/^[\d\-+() ]{7,15}$/.test(form.phone)) { setError('Please enter a valid phone number'); return; }

    setSaving(true);
    setError('');
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
    setError('');
    setEditing(false);
  };

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : null;

  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="avatar">👤</div>
        <div>
          <h2>{user.name}</h2>
          {joinDate && <p>Member since {joinDate}</p>}
        </div>
        {!editing && (
          <button className="edit-btn" onClick={() => setEditing(true)}>✏️ Edit Profile</button>
        )}
      </div>

      {success && <div className="alert success">{success}</div>}
      {error   && <div className="alert error">⚠️ {error}</div>}

      <div className="profile-fields">
        {FIELDS.map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label>{label}</label>
            {editing ? (
              <input
                type={type}
                value={form[key] || ''}
                placeholder={placeholder}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              />
            ) : (
              <div className="field-value">
                {user[key] || <span className="not-provided">Not provided</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <div className="profile-actions">
          <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          <button
            className={`save-btn ${saving ? 'saving' : ''}`}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : '✨ Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}
