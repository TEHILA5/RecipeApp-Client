// ===============================================
// UserManagement - ניהול משתמשים (Admin)
// ===============================================
import { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import Loading from '../../../shared/components/UI/Loading';
import { formatShortDate } from '../../../shared/utils/formatting';
import ErrorMessage from '../../../shared/components/UI/ErrorMessage';
import {
  fetchAllUsers,
  deleteUserThunk,
  updateUserInState,
} from '../redux/adminSlice';

interface UserAdminDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
}

const updateUserApi = async (id: number, data: Partial<UserAdminDto>): Promise<UserAdminDto> => {
  const res = await axiosInstance.patch<UserAdminDto>(`/user/${id}`, data);
  return res.data;
};

export default function UserManagement() {
  const dispatch = useAppDispatch();

  // ✅ משתמשים מגיעים מ-Redux adminSlice
  const users = useAppSelector((s) => s.admin.users);
  const loading = useAppSelector((s) => s.admin.loadingUsers);

  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<UserAdminDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    // ✅ dispatch ל-adminSlice במקום axios ישיר
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleUpdate = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      const updated = await updateUserApi(editingUser.id, {
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
      });
      dispatch(updateUserInState(updated)); // ✅ מעדכן את Redux
      setEditingUser(null);
    } catch {
      setError('Failed to update user');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await dispatch(deleteUserThunk(id)).unwrap(); // ✅ dispatch ל-adminSlice
    } catch {
      setError('Failed to delete user');
    } finally { setDeletingId(null); }
  };

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loading message="Loading users..." size="md" />;

  return (
    <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(212,84,122,0.07)', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.5rem', color: '#d4547a' }}>
          All Users ({users.length})
        </h3>
        <div style={{ position: 'relative' }}>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..."
            style={{ padding: '9px 36px 9px 14px', border: '2px solid #fce7f3', borderRadius: '999px', fontFamily: "'Nunito',sans-serif", fontSize: '0.85rem', outline: 'none', width: '240px' }} />
          <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>🔍</span>
        </div>
      </div>

      {error && <ErrorMessage message={error} style={{ margin: '16px 24px' }} />}

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fdf2f8' }}>
              {['User', 'Email', 'Phone', 'Joined', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, idx) => {
              const isEditing = editingUser?.id === user.id;
              const isDeleting = deletingId === user.id;
              return (
                <tr key={user.id} style={{ borderTop: '1px solid #fce7f3', background: idx % 2 === 0 ? 'white' : '#fffbfd', opacity: isDeleting ? 0.5 : 1, transition: 'opacity 0.2s' }}>

                  {/* Name */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #e8799a, #d4547a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                        {user.name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      {isEditing ? (
                        <input value={editingUser.name} onChange={(e) => setEditingUser((u) => u ? { ...u, name: e.target.value } : u)}
                          style={{ padding: '6px 10px', border: '2px solid #fce7f3', borderRadius: '8px', fontFamily: "'Nunito',sans-serif", fontSize: '0.88rem', outline: 'none', width: '130px' }} />
                      ) : (
                        <div>
                          <div style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.9rem' }}>{user.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>ID: {user.id}</div>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Email */}
                  <td style={{ padding: '14px 16px' }}>
                    {isEditing ? (
                      <input value={editingUser.email} onChange={(e) => setEditingUser((u) => u ? { ...u, email: e.target.value } : u)}
                        style={{ padding: '6px 10px', border: '2px solid #fce7f3', borderRadius: '8px', fontFamily: "'Nunito',sans-serif", fontSize: '0.88rem', outline: 'none', width: '180px' }} />
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{user.email}</span>
                    )}
                  </td>

                  {/* Phone */}
                  <td style={{ padding: '14px 16px' }}>
                    {isEditing ? (
                      <input value={editingUser.phone} onChange={(e) => setEditingUser((u) => u ? { ...u, phone: e.target.value } : u)}
                        style={{ padding: '6px 10px', border: '2px solid #fce7f3', borderRadius: '8px', fontFamily: "'Nunito',sans-serif", fontSize: '0.88rem', outline: 'none', width: '130px' }} />
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{user.phone || '—'}</span>
                    )}
                  </td>

                  {/* Joined */}
                  <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: '#9ca3af' }}>
                    {formatShortDate(user.createdAt)}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {isEditing ? (
                        <>
                          <button onClick={handleUpdate} disabled={saving}
                            style={{ padding: '6px 16px', borderRadius: '999px', border: 'none', background: '#d4547a', color: 'white', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                            {saving ? '...' : '✅ Save'}
                          </button>
                          <button onClick={() => setEditingUser(null)}
                            style={{ padding: '6px 16px', borderRadius: '999px', border: '2px solid #fce7f3', background: 'white', color: '#6b7280', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setEditingUser(user)}
                            style={{ padding: '6px 16px', borderRadius: '999px', border: '2px solid #fce7f3', background: 'white', color: '#d4547a', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                            ✏️ Edit
                          </button>
                          <button onClick={() => handleDelete(user.id)} disabled={isDeleting}
                            style={{ padding: '6px 16px', borderRadius: '999px', border: 'none', background: '#fee2e2', color: '#991b1b', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.78rem', cursor: isDeleting ? 'not-allowed' : 'pointer' }}>
                            {isDeleting ? '...' : '🗑️ Delete'}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
            {search ? 'No users match your search' : 'No users found'}
          </div>
        )}
      </div>
    </div>
  );
}
