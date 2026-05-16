import { useState } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { updateUser } from '../../auth/redux/authSlice';
import { useUpdateMeMutation } from '../../../api/userApi';
import type { UserDto, UserUpdateDto } from '../../../api/userApi';
import './ProfileCard.css';

import avatarIcon   from '../../../assets/icons/profile-avatar.png';
import editIcon     from '../../../assets/icons/profile-edit.png';
import successIcon  from '../../../assets/icons/profile-success.png';
import warningIcon  from '../../../assets/icons/profile-warning.png';
import saveIcon     from '../../../assets/icons/profile-save.png';
import calendarIcon from '../../../assets/icons/profile-calendar.png';

interface ProfileCardProps {
  user: UserDto;
}

const FIELDS = [
  { key: 'name',  label: 'Full Name',     type: 'text',  placeholder: 'Your name'      },
  { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
  { key: 'phone', label: 'Phone Number',  type: 'tel',   placeholder: '050-000-0000'   },
] as const;

export default function ProfileCard({ user }: ProfileCardProps) {
  const dispatch = useAppDispatch();
  const [updateMe, { isLoading: saving }] = useUpdateMeMutation();

  const [editing, setEditing] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm]       = useState<UserUpdateDto>({ name: user.name, email: user.email, phone: user.phone });

  const handleSave = async () => {
    if (!form.name?.trim())  { setError('Name is required'); return; }
    if (!form.email?.trim()) { setError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Please enter a valid email address'); return; }
    if (form.phone && !/^[\d\-+() ]{7,15}$/.test(form.phone)) { setError('Please enter a valid phone number'); return; }

    setError('');
    try {
      const updated = await updateMe(form).unwrap();
      dispatch(updateUser({ name: updated.name, email: updated.email, phone: updated.phone }));
      setSuccess('Profile updated!');
      setEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
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
        <img src={avatarIcon} alt="Avatar" className="avatar" />
        <div>
          <h2>{user.name}</h2>
          {joinDate && (
            <p className="profile-join-date">
              <img src={calendarIcon} alt="Member since" className="profile-join-date__icon" />
              Member since {joinDate}
            </p>
          )}
        </div>
        {!editing && (
          <button className="edit-btn" onClick={() => setEditing(true)}>
            <img src={editIcon} alt="Edit" className="edit-btn__icon" />
            Edit Profile
          </button>
        )}
      </div>

      {success && (
        <div className="alert success">
          <img src={successIcon} alt="Success" className="alert__icon" />
          {success}
        </div>
      )}
      {error && (
        <div className="alert error">
          <img src={warningIcon} alt="Warning" className="alert__icon" />
          {error}
        </div>
      )}

      <div className="profile-fields">
        {FIELDS.map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label>{label}</label>
            {editing ? (
              <input type={type} value={form[key] || ''} placeholder={placeholder} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
            ) : (
              <div className="field-value">{user[key] || <span className="not-provided">Not provided</span>}</div>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <div className="profile-actions">
          <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          <button className={`save-btn ${saving ? 'saving' : ''}`} onClick={handleSave} disabled={saving}>
            <img src={saveIcon} alt="Save" className="save-btn__icon" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}