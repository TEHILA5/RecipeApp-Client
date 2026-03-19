import { useState } from 'react';
import { useGetRecipesQuery } from '../../recipe/redux/recipeSlice';
import { useUserProfile } from '../hooks/useUserProfile';
import ProfileCard from '../components/ProfileCard';
import EditProfile from '../components/EditProfile';
import Modal from '../../../shared/components/UI/Modal';
import './ProfilePage.css';

type ActiveTab = 'info' | 'stats' | 'danger';

const TABS: { key: ActiveTab; label: string }[] = [
  { key: 'info',   label: '👤 My Info' },
  { key: 'stats',  label: '📊 Stats' },
  { key: 'danger', label: '⚠️ Account' },
];

export default function ProfilePage() {
  const { user, deleting, deleteConfirm, setDeleteConfirm, handleDeleteAccount, handleLogout } = useUserProfile();
  const [activeTab, setActiveTab] = useState<ActiveTab>('info');
  const { data: allRecipes = [] } = useGetRecipesQuery();

  const topCategory = allRecipes.length > 0
    ? Object.entries(
        allRecipes.reduce((acc, r) => {
          acc[r.category] = (acc[r.category] ?? 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).sort(([, a], [, b]) => b - a)[0]?.[0] ?? '—'
    : '—';

  const stats = [
    { label: 'Total Recipes', value: allRecipes.length,                                                 emoji: '🍰' },
    { label: 'Top Category',  value: topCategory,                                                       emoji: '🏆' },
    { label: 'Member Since',  value: user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024', emoji: '📅' },
  ];

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-page-header">
        <div className="profile-page-header-inner">
          <ProfileCard user={user} />
          <div className="profile-tabs">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`profile-tab ${activeTab === key ? 'active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="profile-page-body">
        {activeTab === 'info' && <EditProfile />}

        {activeTab === 'stats' && (
          <div className="stats-card">
            <h2>Your Stats 📊</h2>
            <div className="stats-grid">
              {stats.map(({ label, value, emoji }) => (
                <div key={label} className="stat-item">
                  <div className="stat-emoji">{emoji}</div>
                  <div className="stat-value">{value}</div>
                  <div className="stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'danger' && (
          <div className="danger-card">
            <h2>Account Settings ⚠️</h2>

            <div className="danger-row">
              <div>
                <p className="danger-title">Sign Out</p>
                <p className="danger-desc">Sign out from this device</p>
              </div>
              <button className="signout-btn" onClick={handleLogout}>Sign Out</button>
            </div>

            <div className="danger-row red">
              <div>
                <p className="danger-title red">Delete Account</p>
                <p className="danger-desc">Permanently delete your account. This cannot be undone.</p>
              </div>
              <button className="delete-btn" onClick={() => setDeleteConfirm(true)}>Delete</button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={deleteConfirm} onClose={() => setDeleteConfirm(false)} title="😢 Delete Account?">
        <p className="modal-desc">
          This will permanently delete your account and all your data. This cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={() => setDeleteConfirm(false)}>Cancel</button>
          <button
            className={`modal-confirm ${deleting ? 'loading' : ''}`}
            onClick={handleDeleteAccount}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
