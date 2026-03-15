// ===============================================
// ProfilePage - פרופיל משתמש
// ===============================================
import { useState } from 'react';
import { useGetRecipesQuery } from '../../recipe/redux/recipeSlice';
import { useUserProfile } from '../hooks/useUserProfile';
import ProfileCard from '../components/ProfileCard';
import EditProfile from '../components/EditProfile';
import Modal from '../../../shared/components/UI/Modal';

type ActiveTab = 'info' | 'stats' | 'danger';

export default function ProfilePage() {
  const { user, deleting, deleteConfirm, setDeleteConfirm, handleDeleteAccount, handleLogout } = useUserProfile();
  const [activeTab, setActiveTab] = useState<ActiveTab>('info');
  const { data: allRecipes = [] } = useGetRecipesQuery();

  const stats = {
    totalRecipes: allRecipes.length,
    topCategory: allRecipes.length > 0
      ? Object.entries(
          allRecipes.reduce((acc, r) => {
            acc[r.category] = (acc[r.category] ?? 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ).sort(([, a], [, b]) => b - a)[0]?.[0] ?? '—'
      : '—',
  };

  if (!user) return null;

  return (
    <div style={{
      minHeight: '100vh', background: '#fdf2f8',
      paddingTop: 'var(--nav-height, 70px)',
      fontFamily: "'Nunito', sans-serif",
    }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(232,121,154,0.08), rgba(232,196,154,0.08))',
        padding: '48px 24px 0',
        borderBottom: '2px solid rgba(232,121,154,0.1)',
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <ProfileCard user={user} />

          <div style={{ display: 'flex', gap: '4px', marginTop: '24px' }}>
            {([
              { key: 'info', label: '👤 My Info' },
              { key: 'stats', label: '📊 Stats' },
              { key: 'danger', label: '⚠️ Account' },
            ] as { key: ActiveTab; label: string }[]).map(({ key, label }) => (
              <button key={key} onClick={() => setActiveTab(key)} style={{
                padding: '12px 24px', borderRadius: '12px 12px 0 0',
                border: 'none', cursor: 'pointer',
                fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.88rem',
                background: activeTab === key ? 'white' : 'transparent',
                color: activeTab === key ? '#d4547a' : '#9ca3af',
                borderBottom: activeTab === key ? '2px solid white' : '2px solid transparent',
                marginBottom: '-2px',
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Info Tab ── */}
        {activeTab === 'info' && <EditProfile />}

        {/* ── Stats Tab ── */}
        {activeTab === 'stats' && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(212,84,122,0.07)' }}>
            <h2 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.8rem', color: '#d4547a', marginBottom: '24px' }}>
              Your Stats 📊
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
              {[
                { label: 'Total Recipes', value: stats.totalRecipes, emoji: '🍰' },
                { label: 'Top Category', value: stats.topCategory, emoji: '🏆' },
                { label: 'Member Since', value: user.createdAt ? new Date(user.createdAt).getFullYear() : '2024', emoji: '📅' },
              ].map(({ label, value, emoji }) => (
                <div key={label} style={{
                  padding: '24px 20px', borderRadius: '16px',
                  background: 'linear-gradient(135deg, #fdf2f8, #fff8f2)',
                  border: '1px solid #fce7f3', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{emoji}</div>
                  <div style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.6rem', fontWeight: 700, color: '#d4547a' }}>{value}</div>
                  <div style={{ fontSize: '0.82rem', color: '#9ca3af', fontWeight: 600, marginTop: '4px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Danger Zone ── */}
        {activeTab === 'danger' && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(212,84,122,0.07)' }}>
            <h2 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.8rem', color: '#d4547a', marginBottom: '24px' }}>
              Account Settings ⚠️
            </h2>

            <div style={{ padding: '20px 24px', borderRadius: '16px', border: '1px solid #e5e7eb', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: 700, color: '#1f2937', marginBottom: '4px' }}>Sign Out</p>
                <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Sign out from this device</p>
              </div>
              <button onClick={handleLogout} style={{
                padding: '10px 24px', borderRadius: '999px',
                border: '2px solid #e5e7eb', background: 'white',
                color: '#6b7280', fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: 'pointer',
              }}>Sign Out</button>
            </div>

            <div style={{ padding: '20px 24px', borderRadius: '16px', border: '1px solid #fee2e2', background: '#fffafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: 700, color: '#991b1b', marginBottom: '4px' }}>Delete Account</p>
                <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Permanently delete your account. This cannot be undone.</p>
              </div>
              <button onClick={() => setDeleteConfirm(true)} style={{
                padding: '10px 24px', borderRadius: '999px', border: 'none',
                background: '#fee2e2', color: '#991b1b',
                fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: 'pointer',
              }}>Delete</button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {/* ✅ Modal */}
      <Modal isOpen={deleteConfirm} onClose={() => setDeleteConfirm(false)} title="😢 Delete Account?">
        <p style={{ color: '#6b7280', marginBottom: '28px', lineHeight: 1.6, textAlign: 'center' }}>
          This will permanently delete your account and all your data. This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => setDeleteConfirm(false)} style={{ padding: '12px 28px', borderRadius: '999px', border: '2px solid #e5e7eb', background: 'white', color: '#6b7280', fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleDeleteAccount} disabled={deleting} style={{ padding: '12px 28px', borderRadius: '999px', border: 'none', background: '#ef4444', color: 'white', fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.7 : 1 }}>
            {deleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
