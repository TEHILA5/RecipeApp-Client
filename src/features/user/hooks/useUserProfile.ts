import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { logout, updateUser } from '../../auth/redux/authSlice';
import { useUpdateMeMutation, useDeleteMeMutation } from '../../../api/userApi';
import type { UpdateUserData } from '../../auth/types/auth.types';

export function useUserProfile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const [updateMe] = useUpdateMeMutation();
  const [deleteMe] = useDeleteMeMutation();

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleSave = async (data: UpdateUserData) => {
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      const changed: UpdateUserData = {};
      if (data.name  !== user?.name)  changed.name  = data.name;
      if (data.phone !== user?.phone) changed.phone = data.phone;
      if (data.email !== user?.email) changed.email = data.email;

      if (Object.keys(changed).length > 0) {
        const updated = await updateMe(changed).unwrap();
        dispatch(updateUser({ name: updated.name, email: updated.email, phone: updated.phone }));
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteMe().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Failed to delete account');
      setDeleting(false);
      setDeleteConfirm(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return {
    user,
    saving, saveSuccess, saveError,
    deleting, deleteConfirm, setDeleteConfirm,
    handleSave, handleDeleteAccount, handleLogout,
  };
}