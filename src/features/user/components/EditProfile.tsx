import { useForm } from 'react-hook-form';
import { TextField, Alert } from '@mui/material';
import { useUserProfile } from '../hooks/useUserProfile';
import './EditProfile.css';

interface ProfileFormData {
  name: string;
  phone: string;
  email: string;
}

export default function EditProfile() {
  const { user, saving, saveSuccess, saveError, handleSave } = useUserProfile();

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      email: user?.email ?? '',
    },
  });

  return (
    <div className="edit-profile-card">
      <h2 className="edit-profile-heading">
        <img src="/src/assets/icons/profile-edit.png" alt="" className="edit-profile-heading__icon" />
        Edit Profile
      </h2>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: '12px' }} className="edit-profile-alert">
          <img src="/src/assets/icons/profile-success.png" alt="" className="edit-profile-alert__icon" />
          Profile updated successfully!
        </Alert>
      )}
      {saveError && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{saveError}</Alert>}

      <form onSubmit={handleSubmit(handleSave)} className="edit-profile-form">
        <TextField
          label="Full Name"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 chars' } })}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
          })}
        />
        <TextField
          label="Phone"
          type="tel"
          fullWidth
          error={!!errors.phone}
          helperText={errors.phone?.message}
          {...register('phone', {
            required: 'Phone is required',
            pattern: { value: /^05\d{8}$/, message: 'Israeli format: 05XXXXXXXXX' },
          })}
        />

        <button type="submit" disabled={saving} className={`save-btn ${saving ? 'saving' : ''}`}>
          {saving ? 'Saving...' : (
            <>
              <img src="/src/assets/icons/profile-save.png" alt="" className="save-btn__icon" />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}