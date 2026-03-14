// ===============================================
// EditProfile - Edit profile form component
// ===============================================
import { useForm } from 'react-hook-form';
import { TextField, Alert } from '@mui/material';
import { useUserProfile } from '../hooks/useUserProfile';

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
    <div style={{
      background: 'white', borderRadius: '20px', padding: '32px',
      boxShadow: '0 4px 20px rgba(212,84,122,0.07)',
    }}>
      <h2 style={{
        fontFamily: "'Dancing Script',cursive", fontSize: '1.8rem',
        color: '#d4547a', marginBottom: '24px',
      }}>
        Edit Profile ✏️
      </h2>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: '12px' }}>
          ✅ Profile updated successfully!
        </Alert>
      )}
      {saveError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
          {saveError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(handleSave)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <TextField
          label="Full Name" fullWidth
          error={!!errors.name} helperText={errors.name?.message}
          {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 chars' } })}
        />
        <TextField
          label="Email" type="email" fullWidth
          error={!!errors.email} helperText={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
          })}
        />
        <TextField
          label="Phone" type="tel" fullWidth
          error={!!errors.phone} helperText={errors.phone?.message}
          {...register('phone', {
            required: 'Phone is required',
            pattern: { value: /^05\d{8}$/, message: 'Israeli format: 05XXXXXXXXX' },
          })}
        />

        <button
          type="submit" disabled={saving}
          style={{
            padding: '14px 32px', borderRadius: '999px', border: 'none',
            background: saving ? '#e5e7eb' : 'linear-gradient(135deg, #e8799a, #d4547a)',
            color: saving ? '#9ca3af' : 'white',
            fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '1rem',
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: saving ? 'none' : '0 4px 14px rgba(212,84,122,0.3)',
            alignSelf: 'flex-start',
          }}
        >
          {saving ? 'Saving...' : '💾 Save Changes'}
        </button>
      </form>
    </div>
  );
}
