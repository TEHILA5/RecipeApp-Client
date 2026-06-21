import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetRecipesQuery } from '../../recipe/redux/recipeSlice';
import StatsCard from '../components/StatsCard';
import UserManagement from '../components/UserManagement';
import RecipeModeration from '../components/RecipeModeration';
import AnalyticsTab from '../components/AnalyticsTab';
import ConversionsTab from '../components/ConversionsTab';
import { useAppSelector } from '../../../redux/hooks';
import {
  useGetAllConversionsQuery,
  useGetWeeklyStatsQuery,
  useGetAllIngredientsAdminQuery,
} from '../../../api/adminApi';
import './AdminDashboard.css';

type ActiveTab = 'overview' | 'recipes' | 'ingredients' | 'conversions' | 'users' | 'analytics';

const TABS: { key: ActiveTab; label: string; icon: string }[] = [
  { key: 'overview',    label: 'Overview',    icon: '/src/assets/icons/rank-chart.png' },
  { key: 'recipes',     label: 'Recipes',     icon: '/src/assets/icons/page-about.png' },
  { key: 'ingredients', label: 'Ingredients', icon: '/src/assets/icons/calc-spoon.png' },
  { key: 'conversions', label: 'Conversions', icon: '/src/assets/icons/action-refresh.png' },
  { key: 'users',       label: 'Users',       icon: '/src/assets/icons/profile-avatar.png' },
  { key: 'analytics',  label: 'Analytics',   icon: '/src/assets/icons/rank-chart.png' },
];

export default function AdminDashboard() {
  const { user } = useAppSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  const { data: recipes = [] } = useGetRecipesQuery();
  const { data: conversions = [] } = useGetAllConversionsQuery();
  const { data: weeklyStats = [], isLoading: loadingWeeklyStats } = useGetWeeklyStatsQuery(
    undefined,
    { skip: activeTab !== 'analytics' }
  );
  const { data: allIngredients = [] } = useGetAllIngredientsAdminQuery(
    undefined,
    { skip: activeTab !== 'conversions' }
  );

  const stats = {
    totalRecipes: recipes.length,
    topCategory:
      recipes.length > 0
        ? Object.entries(
            recipes.reduce((acc, r) => {
              acc[r.category] = (acc[r.category] ?? 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).sort(([, a], [, b]) => b - a)[0]?.[0] ?? '—'
        : '—',
    avgRating:
      recipes.length > 0
        ? (recipes.reduce((sum, r) => sum + (r.averageRating || 0), 0) / recipes.length).toFixed(1)
        : '—',
  };

  return (
    <div className="ad-page">
      <header className="ad-hero">
        <div className="ad-hero-inner">
          <div className="ad-breadcrumb">
            <img src="/src/assets/icons/nav-admin.png" alt="" className="ad-breadcrumb-icon" />
            Admin Panel
          </div>
          <h1 className="ad-welcome">
            Welcome back, <span className="ad-name">{user?.name}</span>!{' '}
            <img src="/src/assets/icons/rank-crown.png" alt="" className="ad-crown-icon" />
          </h1>
          <p className="ad-subtitle">Manage your Sweet&amp;Treat platform</p>
          <div className="ad-tabs">
            {TABS.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`ad-tab ${activeTab === key ? 'ad-tab--active' : ''}`}
              >
                <img src={icon} alt="" className="ad-tab-icon" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="ad-content">

        {activeTab === 'overview' && (
          <>
            <div className="ad-stats-grid">
              <StatsCard icon="/src/assets/icons/page-about.png"     value={stats.totalRecipes}        label="Total Recipes" color="#d4547a" />
              <StatsCard icon="/src/assets/icons/profile-trophy.png" value={stats.topCategory}         label="Top Category"  color="#c4894a" />
              <StatsCard icon="/src/assets/icons/rank-star.png"      value={stats.avgRating}           label="Avg Rating"    color="#f59e0b" />
              <StatsCard icon="/src/assets/icons/action-refresh.png" value={conversions.length || '—'} label="Conversions"   color="#7c3aed" />
            </div>
            <div className="ad-card">
              <h3 className="ad-card-title">Quick Actions</h3>
              <div className="ad-quick-actions">
                <Link to="/recipes/create" className="ad-btn ad-btn--primary">
                  <img src="/src/assets/icons/action-add.png" alt="" className="ad-action-icon" />
                  Add New Recipe
                </Link>
                <button onClick={() => setActiveTab('ingredients')} className="ad-btn ad-btn--outline">
                  <img src="/src/assets/icons/tip-salt.png" alt="" className="ad-action-icon--lg" />
                  Manage Ingredients
                </button>
                <button onClick={() => setActiveTab('analytics')} className="ad-btn ad-btn--outline">
                  <img src="/src/assets/icons/rank-chart.png" alt="" className="ad-action-icon--lg" />
                  View Analytics
                </button>
                <Link to="/admin/reply" className="ad-btn ad-btn--outline">
                  <img src="/src/assets/icons/page-contact.png" alt="" className="ad-action-icon--lg" />
                  Reply to Contact
                </Link>
              </div>
            </div>
          </>
        )}

        {activeTab === 'recipes' && <RecipeModeration />}

        {activeTab === 'ingredients' && (
          <div className="ad-card">
            <h3 className="ad-card-title ad-card-title--row">
              Manage Ingredients
              <img src="/src/assets/icons/tip-salt.png" alt="" className="ad-action-icon--lg" />
            </h3>
            <p className="ad-card-desc">Add, edit, or remove ingredients from the system.</p>
            <Link to="/admin/ingredients" className="ad-btn ad-btn--primary">
              <img src="/src/assets/icons/tip-salt.png" alt="" className="ad-action-icon--lg" />
              Go to Ingredients Manager
            </Link>
          </div>
        )}

        {activeTab === 'users' && <UserManagement />}

        {activeTab === 'analytics' && (
          <AnalyticsTab weeklyStats={weeklyStats} loading={loadingWeeklyStats} />
        )}

        {activeTab === 'conversions' && (
          <ConversionsTab allIngredients={allIngredients} />
        )}

      </div>
    </div>
  );
}