import { useState } from 'react';
import { useGetRecipesQuery } from '../../recipe/redux/recipeSlice';
import { useUserProfile } from '../hooks/useUserProfile';
import ProfileCard from '../components/ProfileCard';
import EditProfile from '../components/EditProfile';
import Modal from '../../../shared/components/UI/Modal';
import './ProfilePage.css';

import avatarIcon  from '../../../assets/icons/profile-avatar.png';
import statsIcon   from '../../../assets/icons/profile-stats.png';
import accountIcon from '../../../assets/icons/profile-account.png';
import trophyIcon  from '../../../assets/icons/profile-trophy.png';
import calendarIcon from '../../../assets/icons/profile-calendar.png';
import totalRecipesIcon from '../../../assets/icons/profile-total-recipes.png';
import deleteIcon  from '../../../assets/icons/profile-delete.png';
import warningIcon from '../../../assets/icons/profile-warning.png';

type ActiveTab = 'info' | 'stats' | 'danger';

const TABS: { key: ActiveTab; label: string; icon: string }[] = [
  { key: 'info',   label: 'My Info',  icon: avatarIcon  },
  { key: 'stats',  label: 'Stats',    icon: statsIcon   },
  { key: 'danger', label: 'Account',  icon: accountIcon },
];

export default function ProfilePage() {
  const { user, deleting, deleteConfirm, setDeleteConfirm, handleDeleteAccount, handleLogout } = useUserProfile();
  const [activeTab, setActiveTab] = useState<ActiveTab>('info');
  const { data: allRecipes = [] } = useGetRecipesQuery();

  const topCategory = allRecipes.length > 0
    ? Object.entries(
        allRecipes.reduce((acc, r) => { acc[r.category] = (acc[r.category] ?? 0) + 1; return acc; }, {} as Record<string, number>)
      ).sort(([, a], [, b]) => b - a)[0]?.[0] ?? '—'
    : '—';

  const stats = [
    { label: 'Total Recipes', value: allRecipes.length,                                                 icon: totalRecipesIcon },
    { label: 'Top Category',  value: topCategory,                                                       icon: trophyIcon       },
    { label: 'Member Since',  value: user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024', icon: calendarIcon     },
  ];

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-page-header">
        <div className="profile-page-header-inner">
          <ProfileCard user={user} />
          <div className="profile-tabs">
            {TABS.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`profile-tab ${activeTab === key ? 'active' : ''}`}
              >
                <img src={icon} alt={label} style={{ width: '18px', height: '18px', objectFit: 'contain', marginRight: '6px', verticalAlign: 'middle' }} />
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
            <h2>
              <img src={statsIcon} alt="Stats" style={{ width: '28px', height: '28px', objectFit: 'contain', marginRight: '8px', verticalAlign: 'middle' }} />
              Your Stats
            </h2>
            <div className="stats-grid">
              {stats.map(({ label, value, icon }) => (
                <div key={label} className="stat-item">
                  <img src={icon} alt={label} className="stat-emoji" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                  <div className="stat-value">{value}</div>
                  <div className="stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'danger' && (
          <div className="danger-card">
            <h2>
              <img src={warningIcon} alt="Warning" style={{ width: '28px', height: '28px', objectFit: 'contain', marginRight: '8px', verticalAlign: 'middle' }} />
              Account Settings
            </h2>

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
              <button className="delete-btn" onClick={() => setDeleteConfirm(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', }}>
                <img src={deleteIcon} alt="Delete" style={{ width: '25px', height: '25px', objectFit: 'contain', marginRight: '6px', verticalAlign: 'middle' }} />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={deleteConfirm} onClose={() => setDeleteConfirm(false)} title="Delete Account?">
        <p className="modal-desc">
          This will permanently delete your account and all your data. This cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={() => setDeleteConfirm(false)}>Cancel</button>
          <button className={`modal-confirm ${deleting ? 'loading' : ''}`} onClick={handleDeleteAccount} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
