import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetRecipesQuery } from '../../recipe/redux/recipeSlice';
import StatsCard from '../components/StatsCard';
import UserManagement from '../components/UserManagement';
import RecipeModeration from '../components/RecipeModeration';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { type ConversionDto } from '../../../api/conversionApi';
import axiosInstance from '../../../api/axiosConfig';
import { getErrorMessage } from '../../../shared/utils/helpers';
import {
  fetchConversions,
  deleteConversionThunk,
  addConversion,
  updateConversionInState,
  fetchWeeklyStats,
  type WeeklyCategoryStats,
} from '../redux/adminSlice';
import { CATEGORY_EMOJIS, type RecipeCategory } from '../../recipe/types/recipe.types';
import './AdminDashboard.css';

type ActiveTab = 'overview' | 'recipes' | 'ingredients' | 'conversions' | 'users' | 'analytics';

const createConversion = async (data: {
  ingredientId1: number;
  ingredientId2: number;
  conversionRatio: number;
  isBidirectional: boolean;
}): Promise<ConversionDto> => {
  const res = await axiosInstance.post<ConversionDto>('/conversion', data);
  return res.data;
};

const updateConversion = async (
  id: number,
  data: { conversionRatio?: number; isBidirectional?: boolean }
): Promise<ConversionDto> => {
  const res = await axiosInstance.patch<ConversionDto>(`/conversion/${id}`, data);
  return res.data;
};

interface IngredientOption { id: number; name: string; }

const fetchAllIngredients = async (): Promise<IngredientOption[]> => {
  try {
    const res = await axiosInstance.get<IngredientOption[]>('/ingredient');
    return res.data;
  } catch { return []; }
};

const CATEGORY_COLORS: Record<string, string> = {
  Cakes: '#d4547a', Cookies: '#f59e0b', IceCream: '#3b82f6',
  Brownies: '#92400e', Cupcakes: '#ec4899', Cheesecakes: '#8b5cf6',
  Pies: '#10b981', Tarts: '#06b6d4', Donuts: '#f97316',
  Waffles: '#84cc16', Crepes: '#6366f1', Truffles: '#be123c',
  Pastries: '#0891b2', Mousse: '#7c3aed', Puddings: '#ca8a04',
};

const getColor = (cat: string) => CATEGORY_COLORS[cat] ?? '#9ca3af';

// ── Analytics ──

function AnalyticsTab({ weeklyStats, loading }: { weeklyStats: WeeklyCategoryStats[]; loading: boolean }) {
  const [selectedWeek, setSelectedWeek] = useState<string>('');

  const weeks = [...new Set(weeklyStats.map((s) => s.week))].sort();
  const categories = [...new Set(weeklyStats.map((s) => s.categoryName))];
  const activeWeek = selectedWeek || weeks[weeks.length - 1] || '';
  const weekData = weeklyStats.filter((s) => s.week === activeWeek).sort((a, b) => b.viewCount - a.viewCount);
  const weekLabel = weekData[0]?.weekLabel ?? activeWeek;
  const maxCount = Math.max(...weekData.map((s) => s.viewCount), 1);

  if (loading) {
    return (
      <div className="at-loading">
        <div className="at-spinner" />
        Loading analytics...
      </div>
    );
  }

  if (weeklyStats.length === 0) {
    return (
      <div className="at-empty">
        <div className="at-empty-icon">📊</div>
        <h3 className="at-empty-title">No data yet</h3>
        <p className="at-empty-text">Category views will appear here once users start browsing recipes.</p>
      </div>
    );
  }

  return (
    <div className="at-wrap">
      <div className="at-header">
        <div>
          <h3 className="at-title">📈 Weekly Category Views</h3>
          <p className="at-subtitle">
            Showing <strong>{weekLabel}</strong> — {weekData.reduce((s, d) => s + d.viewCount, 0)} total views
          </p>
        </div>
        <div className="at-weeks">
          {weeks.map((w) => {
            const label = weeklyStats.find((s) => s.week === w)?.weekLabel ?? w;
            return (
              <button
                key={w}
                onClick={() => setSelectedWeek(w)}
                className={`at-week-btn ${w === activeWeek ? 'at-week-btn--active' : ''}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="at-chart-wrap">
        <div className="at-chart">
          {weekData.map((item) => {
            const pct = (item.viewCount / maxCount) * 100;
            const color = getColor(item.categoryName);
            const emoji = CATEGORY_EMOJIS[item.categoryName as RecipeCategory] ?? '🍬';
            return (
              <div key={item.categoryName} className="at-bar-col">
                <span className="at-bar-count">{item.viewCount}</span>
                <div className="at-bar-track">
                  <div
                    className="at-bar"
                    style={{ height: `${pct}%`, background: `linear-gradient(to top, ${color}, ${color}99)`, boxShadow: `0 4px 12px ${color}40` }}
                    title={`${item.categoryName}: ${item.viewCount} views`}
                  />
                </div>
                <div className="at-bar-label">
                  <div>{emoji}</div>
                  <div className="at-bar-name">{item.categoryName}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="at-top5">
        <h4 className="at-section-title">🏆 Top Categories — {weekLabel}</h4>
        <div className="at-top5-list">
          {weekData.slice(0, 5).map((item, idx) => {
            const pct = Math.round((item.viewCount / maxCount) * 100);
            const color = getColor(item.categoryName);
            const emoji = CATEGORY_EMOJIS[item.categoryName as RecipeCategory] ?? '🍬';
            const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
            return (
              <div key={item.categoryName} className="at-top5-row">
                <span className="at-medal">{medals[idx]}</span>
                <span>{emoji}</span>
                <div className="at-top5-info">
                  <div className="at-top5-meta">
                    <span className="at-top5-name">{item.categoryName}</span>
                    <span className="at-top5-views" style={{ color }}>{item.viewCount} views</span>
                  </div>
                  <div className="at-progress-track">
                    <div className="at-progress-bar" style={{ width: `${pct}%`, background: `linear-gradient(to right, ${color}, ${color}99)` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {weeks.length > 1 && (
        <div className="at-trend">
          <h4 className="at-section-title">📊 Trend Overview — All Weeks</h4>
          <div className="at-trend-wrap">
            <table className="at-trend-table">
              <thead>
                <tr className="at-trend-thead">
                  <th className="at-trend-th at-trend-th--cat">Category</th>
                  {weeks.map((w) => {
                    const lbl = weeklyStats.find((s) => s.week === w)?.weekLabel ?? w;
                    return <th key={w} className="at-trend-th">{lbl}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr key={cat} className={`at-trend-row ${idx % 2 === 0 ? '' : 'at-trend-row--odd'}`}>
                    <td className="at-trend-cat">
                      <span>{CATEGORY_EMOJIS[cat as RecipeCategory] ?? '🍬'}</span>
                      <span style={{ color: getColor(cat) }}>{cat}</span>
                    </td>
                    {weeks.map((w) => {
                      const val = weeklyStats.find((s) => s.week === w && s.categoryName === cat)?.viewCount ?? 0;
                      return (
                        <td key={w} className="at-trend-val" style={{ fontWeight: val > 0 ? 700 : 400, color: val > 0 ? getColor(cat) : '#d1d5db' }}>
                          {val > 0 ? val : '—'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── AdminDashboard ──

export default function AdminDashboard() {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  const conversions = useAppSelector((s) => s.admin.conversions);
  const loadingConversions = useAppSelector((s) => s.admin.loadingConversions);
  const weeklyStats = useAppSelector((s) => s.admin.weeklyStats);
  const loadingWeeklyStats = useAppSelector((s) => s.admin.loadingWeeklyStats);

  const { data: recipes = [] } = useGetRecipesQuery();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  const [convSearch, setConvSearch] = useState('');
  const [convError, setConvError] = useState('');
  const [deletingConvId, setDeletingConvId] = useState<number | null>(null);
  const [editingConv, setEditingConv] = useState<ConversionDto | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [savingConv, setSavingConv] = useState(false);

  const [form, setForm] = useState({
    ingredient1Query: '', ingredient1Id: 0, ingredient1Name: '',
    ingredient2Query: '', ingredient2Id: 0, ingredient2Name: '',
    conversionRatio: '', isBidirectional: true,
  });
  const [allIngredients, setAllIngredients] = useState<IngredientOption[]>([]);
  const [ing1Options, setIng1Options] = useState<IngredientOption[]>([]);
  const [ing2Options, setIng2Options] = useState<IngredientOption[]>([]);

  useEffect(() => { dispatch(fetchConversions()); }, [dispatch]);

  useEffect(() => {
    if (activeTab === 'conversions') fetchAllIngredients().then(setAllIngredients);
    if (activeTab === 'analytics') dispatch(fetchWeeklyStats());
  }, [activeTab, dispatch]);

  useEffect(() => {
    if (form.ingredient1Query.length < 1) { setIng1Options([]); return; }
    const q = form.ingredient1Query.toLowerCase();
    setIng1Options(allIngredients.filter((i) => i.name.toLowerCase().includes(q)).slice(0, 8));
  }, [form.ingredient1Query, allIngredients]);

  useEffect(() => {
    if (form.ingredient2Query.length < 1) { setIng2Options([]); return; }
    const q = form.ingredient2Query.toLowerCase();
    setIng2Options(allIngredients.filter((i) => i.name.toLowerCase().includes(q)).slice(0, 8));
  }, [form.ingredient2Query, allIngredients]);

  const handleDeleteConversion = async (id: number) => {
    if (!confirm('Delete this conversion?')) return;
    setDeletingConvId(id);
    try { await dispatch(deleteConversionThunk(id)).unwrap(); }
    catch { setConvError('Failed to delete'); }
    finally { setDeletingConvId(null); }
  };

  const handleSaveConversion = async () => {
    setConvError('');
    if (!form.ingredient1Id || !form.ingredient2Id) { setConvError('Please select both ingredients'); return; }
    const ratio = parseFloat(form.conversionRatio);
    if (!ratio || ratio <= 0) { setConvError('Please enter a valid ratio'); return; }
    setSavingConv(true);
    try {
      const created = await createConversion({ ingredientId1: form.ingredient1Id, ingredientId2: form.ingredient2Id, conversionRatio: ratio, isBidirectional: form.isBidirectional });
      dispatch(addConversion(created));
      setShowAddForm(false);
      setForm({ ingredient1Query: '', ingredient1Id: 0, ingredient1Name: '', ingredient2Query: '', ingredient2Id: 0, ingredient2Name: '', conversionRatio: '', isBidirectional: true });
    } catch (err: unknown) { setConvError(getErrorMessage(err)); }
    finally { setSavingConv(false); }
  };

  const handleUpdateConversion = async () => {
    if (!editingConv) return;
    setSavingConv(true);
    try {
      const updated = await updateConversion(editingConv.id, { conversionRatio: editingConv.conversionRatio ?? undefined, isBidirectional: editingConv.isBidirectional ?? undefined });
      dispatch(updateConversionInState(updated));
      setEditingConv(null);
    } catch { setConvError('Failed to update'); }
    finally { setSavingConv(false); }
  };

  const filteredConversions = conversions.filter((c) =>
    c.ingredient1Name?.toLowerCase().includes(convSearch.toLowerCase()) ||
    c.ingredient2Name?.toLowerCase().includes(convSearch.toLowerCase())
  );

  const stats = {
    totalRecipes: recipes.length,
    topCategory: recipes.length > 0
      ? Object.entries(recipes.reduce((acc, r) => { acc[r.category] = (acc[r.category] ?? 0) + 1; return acc; }, {} as Record<string, number>))
          .sort(([, a], [, b]) => b - a)[0]?.[0] ?? '—'
      : '—',
    avgRating: recipes.length > 0
      ? (recipes.reduce((sum, r) => sum + (r.averageRating || 0), 0) / recipes.length).toFixed(1)
      : '—',
  };

  const TABS: { key: ActiveTab; label: string }[] = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'recipes', label: '🍰 Recipes' },
    { key: 'ingredients', label: '🧂 Ingredients' },
    { key: 'conversions', label: '🔄 Conversions' },
    { key: 'users', label: '👤 Users' },
    { key: 'analytics', label: '📈 Analytics' },
  ];

  return (
    <div className="ad-page">
      <div className="ad-hero">
        <div className="ad-hero-inner">
          <div className="ad-breadcrumb">🛠️ Admin Panel</div>
          <h1 className="ad-welcome">Welcome back, <span className="ad-name">{user?.name}</span>! 👑</h1>
          <p className="ad-subtitle">Manage your Sweet&Treat platform</p>
          <div className="ad-tabs">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`ad-tab ${activeTab === key ? 'ad-tab--active' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="ad-content">

        {activeTab === 'overview' && (
          <div>
            <div className="ad-stats-grid">
              <StatsCard emoji="🍰" value={stats.totalRecipes} label="Total Recipes" color="#d4547a" />
              <StatsCard emoji="🏆" value={stats.topCategory} label="Top Category" color="#c4894a" />
              <StatsCard emoji="⭐" value={stats.avgRating} label="Avg Rating" color="#f59e0b" />
              <StatsCard emoji="🔄" value={conversions.length || '—'} label="Conversions" color="#7c3aed" />
            </div>
            <div className="ad-card">
              <h3 className="ad-card-title">Quick Actions</h3>
              <div className="ad-quick-actions">
                <Link to="/recipes/create" className="ad-btn ad-btn--primary">➕ Add New Recipe</Link>
                <button onClick={() => setActiveTab('ingredients')} className="ad-btn ad-btn--outline">🧂 Manage Ingredients</button>
                <button onClick={() => setActiveTab('analytics')} className="ad-btn ad-btn--outline">📈 View Analytics</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recipes' && <RecipeModeration />}

        {activeTab === 'ingredients' && (
          <div className="ad-card">
            <h3 className="ad-card-title">Manage Ingredients 🧂</h3>
            <p className="ad-card-desc">Add, edit, or remove ingredients from the system.</p>
            <Link to="/admin/ingredients" className="ad-btn ad-btn--primary">🧂 Go to Ingredients Manager</Link>
          </div>
        )}

        {activeTab === 'users' && <UserManagement />}

        {activeTab === 'analytics' && <AnalyticsTab weeklyStats={weeklyStats} loading={loadingWeeklyStats} />}

        {activeTab === 'conversions' && (
          <div>
            <div className="cv-header">
              <h3 className="cv-title">Ingredient Conversions 🔄</h3>
              <button onClick={() => { setShowAddForm((v) => !v); setConvError(''); }} className="cv-add-btn">
                {showAddForm ? '✕ Cancel' : '➕ Add Conversion'}
              </button>
            </div>

            {showAddForm && (
              <div className="cv-form">
                <h4 className="cv-form-title">New Conversion</h4>
                <div className="cv-form-grid">
                  {([1, 2] as const).map((n) => {
                    const idKey = `ingredient${n}Id` as const;
                    const nameKey = `ingredient${n}Name` as const;
                    const queryKey = `ingredient${n}Query` as const;
                    const options = n === 1 ? ing1Options : ing2Options;
                    const setOptions = n === 1 ? setIng1Options : setIng2Options;
                    return (
                      <div key={n} className="cv-field-wrap">
                        <label className="cv-label">Ingredient {n}</label>
                        <input
                          type="text"
                          value={form[nameKey] || form[queryKey]}
                          onChange={(e) => setForm((f) => ({ ...f, [queryKey]: e.target.value, [nameKey]: '', [idKey]: 0 }))}
                          placeholder="Search ingredient..."
                          className="cv-input"
                        />
                        {options.length > 0 && !form[idKey] && (
                          <div className="cv-dropdown">
                            {options.map((ing) => (
                              <div
                                key={ing.id}
                                className="cv-dropdown-item"
                                onClick={() => { setForm((f) => ({ ...f, [idKey]: ing.id, [nameKey]: ing.name, [queryKey]: ing.name })); setOptions([]); }}
                              >
                                {ing.name} <span className="cv-dropdown-id">#{ing.id}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {form[idKey] > 0 && (
                          <div className="cv-selected">
                            ✅ {form[nameKey]}
                            <button className="cv-clear-btn" onClick={() => setForm((f) => ({ ...f, [idKey]: 0, [nameKey]: '', [queryKey]: '' }))}>×</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="cv-form-grid cv-form-grid--bottom">
                  <div>
                    <label className="cv-label">Conversion Ratio</label>
                    <input
                      type="number" step="0.01" min="0.01"
                      value={form.conversionRatio}
                      onChange={(e) => setForm((f) => ({ ...f, conversionRatio: e.target.value }))}
                      placeholder="e.g. 0.75"
                      className="cv-input"
                    />
                  </div>
                  <div className="cv-toggle-wrap">
                    <div className={`cv-toggle ${form.isBidirectional ? 'cv-toggle--on' : ''}`} onClick={() => setForm((f) => ({ ...f, isBidirectional: !f.isBidirectional }))}>
                      <div className="cv-toggle-thumb" />
                    </div>
                    <span className="cv-toggle-label">Bidirectional {form.isBidirectional ? '↔️' : '→'}</span>
                  </div>
                </div>
                {form.ingredient1Name && form.ingredient2Name && form.conversionRatio && (
                  <div className="cv-preview">
                    📐 Preview: 1 {form.ingredient1Name} = {form.conversionRatio} {form.ingredient2Name}
                  </div>
                )}
                {convError && <p className="cv-error">{convError}</p>}
                <button onClick={handleSaveConversion} disabled={savingConv} className={`cv-save-btn ${savingConv ? 'cv-save-btn--busy' : ''}`}>
                  {savingConv ? 'Saving...' : '✅ Save Conversion'}
                </button>
              </div>
            )}

            <div className="cv-table-wrap">
              <div className="cv-table-header">
                <span className="cv-count">{filteredConversions.length} conversion{filteredConversions.length !== 1 ? 's' : ''}</span>
                <div className="cv-search-wrap">
                  <input type="text" value={convSearch} onChange={(e) => setConvSearch(e.target.value)} placeholder="Search ingredients..." className="cv-search" />
                  <span className="cv-search-icon">🔍</span>
                </div>
              </div>

              {loadingConversions ? (
                <div className="cv-state">Loading...</div>
              ) : filteredConversions.length === 0 ? (
                <div className="cv-state">
                  <div className="cv-state-icon">🔄</div>
                  <p>{convSearch ? 'No results' : 'No conversions yet'}</p>
                </div>
              ) : (
                <div className="cv-overflow">
                  <table className="cv-table">
                    <thead>
                      <tr className="cv-thead-row">
                        {['Ingredient 1', '', 'Ingredient 2', 'Ratio', 'Direction', 'Actions'].map((h) => (
                          <th key={h} className="cv-th">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredConversions.map((conv, idx) => (
                        <tr key={conv.id} className={`cv-row ${idx % 2 === 0 ? '' : 'cv-row--odd'}`}>
                          <td className="cv-td cv-td--bold">{conv.ingredient1Name}</td>
                          <td className="cv-td cv-td--arrow">{conv.isBidirectional ? '↔' : '→'}</td>
                          <td className="cv-td cv-td--bold">{conv.ingredient2Name}</td>
                          <td className="cv-td">
                            {editingConv?.id === conv.id ? (
                              <input
                                type="number" step="0.01"
                                value={editingConv.conversionRatio ?? ''}
                                onChange={(e) => setEditingConv((c) => c ? { ...c, conversionRatio: parseFloat(e.target.value) } : c)}
                                className="cv-ratio-input"
                              />
                            ) : (
                              <span className="cv-ratio">{conv.conversionRatio}</span>
                            )}
                          </td>
                          <td className="cv-td">
                            {editingConv?.id === conv.id ? (
                              <div
                                className={`cv-toggle ${editingConv.isBidirectional ? 'cv-toggle--on' : ''}`}
                                onClick={() => setEditingConv((c) => c ? { ...c, isBidirectional: !c.isBidirectional } : c)}
                              >
                                <div className="cv-toggle-thumb" />
                              </div>
                            ) : (
                              <span className={`cv-direction-badge ${conv.isBidirectional ? 'cv-direction-badge--bi' : ''}`}>
                                {conv.isBidirectional ? '↔ Both' : '→ One-way'}
                              </span>
                            )}
                          </td>
                          <td className="cv-td">
                            <div className="cv-actions">
                              {editingConv?.id === conv.id ? (
                                <>
                                  <button onClick={handleUpdateConversion} disabled={savingConv} className="cv-btn cv-btn--save">{savingConv ? '...' : '✅ Save'}</button>
                                  <button onClick={() => setEditingConv(null)} className="cv-btn cv-btn--cancel">Cancel</button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => setEditingConv(conv)} className="cv-btn cv-btn--edit">✏️ Edit</button>
                                  <button onClick={() => handleDeleteConversion(conv.id)} disabled={deletingConvId === conv.id} className="cv-btn cv-btn--delete">
                                    {deletingConvId === conv.id ? '...' : '🗑️ Delete'}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
