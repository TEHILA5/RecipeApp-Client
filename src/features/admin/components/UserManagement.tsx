import { useState } from 'react';
import { useGetAllUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from '../../../api/adminApi';
import type { UserAdminDto } from '../../../api/adminApi';
import Loading from '../../../shared/components/UI/Loading';
import { formatShortDate } from '../../../shared/utils/formatting';
import ErrorMessage from '../../../shared/components/UI/ErrorMessage';
import './UserManagement.css';

export default function UserManagement() {
  const { data: users = [], isLoading } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<UserAdminDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleUpdate = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      await updateUser({
        id: editingUser.id,
        data: {
          name: editingUser.name,
          email: editingUser.email,
          phone: editingUser.phone,
        },
      }).unwrap();
      setEditingUser(null);
    } catch {
      setError('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteUser(id).unwrap();
    } catch {
      setError('Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <Loading message="Loading users..." size="md" />;

  return (
    <div className="um-wrapper">
      <div className="um-header">
        <h3 className="um-title">All Users ({users.length})</h3>
        <div className="um-search-wrap">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="um-search"
          />
          <span className="um-search-icon">
            <img src="/src/assets/icons/search-icon.png" alt="Search" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
          </span>
        </div>
      </div>

      {error && (
        <div style={{ margin: '16px 24px' }}>
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="um-table-wrap">
        <table className="um-table">
          <thead>
            <tr className="um-thead-row">
              {['User', 'Email', 'Phone', 'Joined', 'Actions'].map((h) => (
                <th key={h} className="um-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, idx) => {
              const isEditing = editingUser?.id === user.id;
              const isDeleting = deletingId === user.id;
              return (
                <tr
                  key={user.id}
                  className={`um-row ${idx % 2 === 0 ? 'um-row-even' : 'um-row-odd'} ${isDeleting ? 'um-row-deleting' : ''}`}
                >
                  <td className="um-td">
                    <div className="um-user-info">
                      <div className="um-avatar">{user.name?.[0]?.toUpperCase() ?? '?'}</div>
                      {isEditing ? (
                        <input
                          value={editingUser.name}
                          onChange={(e) =>
                            setEditingUser((u) => (u ? { ...u, name: e.target.value } : u))
                          }
                          className="um-input um-input-sm"
                        />
                      ) : (
                        <div>
                          <div className="um-user-name">{user.name}</div>
                          <div className="um-user-id">ID: {user.id}</div>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="um-td">
                    {isEditing ? (
                      <input
                        value={editingUser.email}
                        onChange={(e) =>
                          setEditingUser((u) => (u ? { ...u, email: e.target.value } : u))
                        }
                        className="um-input um-input-lg"
                      />
                    ) : (
                      <span className="um-cell-text">{user.email}</span>
                    )}
                  </td>

                  <td className="um-td">
                    {isEditing ? (
                      <input
                        value={editingUser.phone}
                        onChange={(e) =>
                          setEditingUser((u) => (u ? { ...u, phone: e.target.value } : u))
                        }
                        className="um-input um-input-sm"
                      />
                    ) : (
                      <span className="um-cell-text">{user.phone || '—'}</span>
                    )}
                  </td>

                  <td className="um-td um-joined">{formatShortDate(user.createdAt)}</td>

                  <td className="um-td">
                    <div className="um-actions">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleUpdate}
                            disabled={saving}
                            className="um-btn um-btn-save"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', }}>
                            {saving ? '...' : (<>
                              <img src="/src/assets/icons/profile-success.png" alt="" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} />
                              {' '}Save
                            </>)}
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="um-btn um-btn-cancel"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setEditingUser(user)} className="um-btn um-btn-edit" style={{ display: 'flex', alignItems: 'center', gap: '4px', }}>
                            <img src="/src/assets/icons/profile-edit.png" alt="" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} />
                            {' '}Edit
                          </button>
                          <button onClick={() => handleDelete(user.id)} disabled={isDeleting} className={`um-btn um-btn-delete ${isDeleting ? 'um-btn-delete--busy' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', }}>
                            {isDeleting ? '...' : (
                              <>
                                <img src="/src/assets/icons/action-delete.png" alt="" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} />
                                {' '}Delete
                              </>
                            )}
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
          <div className="um-empty">
            {search ? 'No users match your search' : 'No users found'}
          </div>
        )}
      </div>
    </div>
  );
}
