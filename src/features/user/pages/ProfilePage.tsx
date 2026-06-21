import { useState } from 'react';
import { useGetRecipesQuery } from '../../recipe/redux/recipeSlice';
import { useUserProfile } from '../hooks/useUserProfile';
import ProfileCard from '../components/ProfileCard';
import EditProfile from '../components/EditProfile';
import Modal from '../../../shared/components/UI/Modal';
import PageHeader from '../../../shared/components/UI/PageHeader';
import StatDisplay from '../../../shared/components/UI/StatDisplay';
import ModalActions from '../../../shared/components/UI/ModalActions';
import './ProfilePage.css';

import avatarIcon       from '../../../assets/icons/profile-avatar.png';
import statsIcon        from '../../../assets/icons/profile-stats.png';
import accountIcon      from '../../../assets/icons/profile-account.png';
import trophyIcon       from '../../../assets/icons/profile-trophy.png';
import calendarIcon     from '../../../assets/icons/profile-calendar.png';
import totalRecipesIcon from '../../../assets/icons/profile-total-recipes.png';
import deleteIcon       from '../../../assets/icons/profile-delete.png';
import warningIcon      from '../../../assets/icons/profile-warning.png';

type ActiveTab = 'info' | 'stats' | 'danger';

const TABS: { key: ActiveTab; label: string; icon: string }[] = [
  { key: 'info',   label: 'My Info', icon: avatarIcon  },
  { key: 'stats',  label: 'Stats',   icon: statsIcon   },
  { key: 'danger', label: 'Account', icon: accountIcon },
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
      <PageHeader layout="custom" size="md" padding="flush" align="left">
          <ProfileCard user={user} />
          <div className="profile-tabs">
            {TABS.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`profile-tab ${activeTab === key ? 'active' : ''}`}
              >
                <img src={icon} alt={label} className="profile-tab-icon" />
                {label}
              </button>
            ))}
          </div>
      </PageHeader>

      <div className="profile-page-body">
        {activeTab === 'info' && <EditProfile />}

        {activeTab === 'stats' && (
          <section className="stats-card">
            <h2>
              <img src={statsIcon} alt="Stats" className="section-heading-icon" />
              Your Stats
            </h2>
            <div className="stats-grid">
              {stats.map(({ label, value, icon }) => (
                <StatDisplay
                  key={label}
                  variant="profile"
                  icon={<img src={icon} alt={label} />}
                  value={value}
                  label={label}
                />
              ))}
            </div>
          </section>
        )}

        {activeTab === 'danger' && (
          <section className="danger-card">
            <h2>
              <img src={warningIcon} alt="Warning" className="section-heading-icon" />
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
              <button className="delete-btn" onClick={() => setDeleteConfirm(true)}>
                <img src={deleteIcon} alt="Delete" className="delete-btn-icon" />
                Delete
              </button>
            </div>
          </section>
        )}
      </div>

      <Modal isOpen={deleteConfirm} onClose={() => setDeleteConfirm(false)} title="Delete Account?">
        <p className="modal-desc">
          This will permanently delete your account and all your data. This cannot be undone.
        </p>
        <ModalActions
          className="modal-actions--flush"
          onCancel={() => setDeleteConfirm(false)}
          onConfirm={handleDeleteAccount}
          confirmLabel="Yes, Delete"
          confirmLoadingLabel="Deleting..."
          confirmLoading={deleting}
          danger
        />
      </Modal>
    </div>
  );
}