// ===============================================
// AdminDashboard - עם RTK Query + ניהול המרות
// ===============================================
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
} from '../redux/adminSlice';

type ActiveTab = 'overview' | 'recipes' | 'ingredients' | 'conversions' | 'users';

// ── Conversion API helpers (Admin only) ──
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

// ── Ingredient search helper ──
interface IngredientOption { id: number; name: string; }
const fetchAllIngredients = async (): Promise<IngredientOption[]> => {
  try {
    const res = await axiosInstance.get<IngredientOption[]>('/ingredient');
    return res.data;
  } catch { return []; }
};

export default function AdminDashboard() {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  // ✅ conversions מגיעים מ-Redux adminSlice
  const conversions = useAppSelector((s) => s.admin.conversions);
  const loadingConversions = useAppSelector((s) => s.admin.loadingConversions);

  const { data: recipes = [] } = useGetRecipesQuery();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  const [convSearch, setConvSearch] = useState('');
  const [convError, setConvError] = useState('');
  const [deletingConvId, setDeletingConvId] = useState<number | null>(null);
  const [editingConv, setEditingConv] = useState<ConversionDto | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // form state
  const [form, setForm] = useState({
    ingredient1Query: '', ingredient1Id: 0, ingredient1Name: '',
    ingredient2Query: '', ingredient2Id: 0, ingredient2Name: '',
    conversionRatio: '', isBidirectional: true,
  });
  const [allIngredients, setAllIngredients] = useState<IngredientOption[]>([]);
  const [ing1Options, setIng1Options] = useState<IngredientOption[]>([]);
  const [ing2Options, setIng2Options] = useState<IngredientOption[]>([]);
  const [savingConv, setSavingConv] = useState(false);

  useEffect(() => {
    if (activeTab === 'conversions') {
      // ✅ dispatch ל-adminSlice במקום axios ישיר
      dispatch(fetchConversions());
      fetchAllIngredients().then(setAllIngredients);
    }
  }, [activeTab, dispatch]);

  // ✅ סינון client-side - ללא קריאות API נוספות
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
    try {
      // ✅ dispatch ל-adminSlice
      await dispatch(deleteConversionThunk(id)).unwrap();
    } catch { setConvError('Failed to delete'); }
    finally { setDeletingConvId(null); }
  };

  const handleSaveConversion = async () => {
    setConvError('');
    if (!form.ingredient1Id || !form.ingredient2Id) {
      setConvError('Please select both ingredients');
      return;
    }
    const ratio = parseFloat(form.conversionRatio);
    if (!ratio || ratio <= 0) {
      setConvError('Please enter a valid ratio');
      return;
    }
    setSavingConv(true);
    try {
      const created = await createConversion({
        ingredientId1: form.ingredient1Id,
        ingredientId2: form.ingredient2Id,
        conversionRatio: ratio,
        isBidirectional: form.isBidirectional,
      });
      dispatch(addConversion(created)); // ✅ מעדכן את Redux
      setShowAddForm(false);
      setForm({ ingredient1Query: '', ingredient1Id: 0, ingredient1Name: '', ingredient2Query: '', ingredient2Id: 0, ingredient2Name: '', conversionRatio: '', isBidirectional: true });
    } catch (err: unknown) {
      setConvError(getErrorMessage(err));
    } finally { setSavingConv(false); }
  };

  const handleUpdateConversion = async () => {
    if (!editingConv) return;
    setSavingConv(true);
    try {
      const updated = await updateConversion(editingConv.id, {
        conversionRatio: editingConv.conversionRatio ?? undefined,
        isBidirectional: editingConv.isBidirectional ?? undefined,
      });
      dispatch(updateConversionInState(updated)); // ✅ מעדכן את Redux
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

  // ── shared styles ──
  const tabBtn = (key: ActiveTab) => ({
    padding: '12px 24px', borderRadius: '12px 12px 0 0', border: 'none',
    cursor: 'pointer', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.88rem',
    background: activeTab === key ? 'white' : 'rgba(255,255,255,0.1)',
    color: activeTab === key ? '#d4547a' : 'rgba(255,255,255,0.7)',
    borderBottom: activeTab === key ? '2px solid white' : '2px solid transparent',
    marginBottom: '-2px', transition: 'all 0.2s',
  } as React.CSSProperties);

  return (
    <div style={{ minHeight: '100vh', background: '#fdf2f8', paddingTop: 'var(--nav-height, 70px)', fontFamily: "'Nunito', sans-serif" }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #4a2c3a, #6b3d52)', padding: '48px 24px 0', color: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '8px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7 }}>🛠️ Admin Panel</div>
          <h1 style={{ fontFamily: "'Dancing Script',cursive", fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '8px', color: 'white' }}>
            Welcome back, <span style={{ color: '#e8799a' }}>{user?.name}</span>! 👑
          </h1>
          <p style={{ opacity: 0.7, fontSize: '0.95rem', marginBottom: '28px' }}>Manage your Sweet&Treat platform</p>

          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('overview')} style={tabBtn('overview')}>📊 Overview</button>
            <button onClick={() => setActiveTab('recipes')} style={tabBtn('recipes')}>🍰 Recipes</button>
            <button onClick={() => setActiveTab('ingredients')} style={tabBtn('ingredients')}>🧂 Ingredients</button>
            <button onClick={() => setActiveTab('conversions')} style={tabBtn('conversions')}>🔄 Conversions</button>
            <button onClick={() => setActiveTab('users')} style={tabBtn('users')}>👤 Users</button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <StatsCard emoji="🍰" value={stats.totalRecipes} label="Total Recipes" color="#d4547a" />
              <StatsCard emoji="🏆" value={stats.topCategory} label="Top Category" color="#c4894a" />
              <StatsCard emoji="⭐" value={stats.avgRating} label="Avg Rating" color="#f59e0b" />
              <StatsCard emoji="🔄" value={conversions.length || '—'} label="Conversions" color="#7c3aed" />
            </div>

            <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(212,84,122,0.07)' }}>
              <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.5rem', color: '#d4547a', marginBottom: '20px' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <Link to="/recipes/create" style={{ padding: '12px 24px', borderRadius: '999px', textDecoration: 'none', background: 'linear-gradient(135deg, #e8799a, #d4547a)', color: 'white', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(212,84,122,0.3)' }}>
                  ➕ Add New Recipe
                </Link>
                <button onClick={() => setActiveTab('ingredients')} style={{ padding: '12px 24px', borderRadius: '999px', border: '2px solid #fce7f3', background: 'white', color: '#d4547a', fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                  🧂 Manage Ingredients
                </button>
                <button onClick={() => setActiveTab('conversions')} style={{ padding: '12px 24px', borderRadius: '999px', border: '2px solid #e9d5ff', background: 'white', color: '#7c3aed', fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                  🔄 Manage Conversions
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Recipes Tab ── */}
        {activeTab === 'recipes' && <RecipeModeration />}

        {/* ── Ingredients Tab ── */}
        {activeTab === 'ingredients' && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 20px rgba(212,84,122,0.07)' }}>
            <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.5rem', color: '#d4547a', marginBottom: '16px' }}>Manage Ingredients 🧂</h3>
            <p style={{ color: '#9ca3af', marginBottom: '24px' }}>Add, edit, or remove ingredients from the system.</p>
            <Link to="/admin/ingredients" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '999px', textDecoration: 'none', background: 'linear-gradient(135deg, #e8799a, #d4547a)', color: 'white', fontFamily: "'Nunito',sans-serif", fontWeight: 700, boxShadow: '0 4px 12px rgba(212,84,122,0.3)' }}>
              🧂 Go to Ingredients Manager
            </Link>
          </div>
        )}

        {/* ── Users Tab ── */}
        {activeTab === 'users' && <UserManagement />}

        {/* ── Conversions Tab ── */}
        {activeTab === 'conversions' && (
          <div>
            {/* header row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.8rem', color: '#7c3aed' }}>
                Ingredient Conversions 🔄
              </h3>
              <button
                onClick={() => { setShowAddForm((v) => !v); setConvError(''); }}
                style={{ padding: '10px 24px', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', color: 'white', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(124,58,237,0.25)' }}>
                {showAddForm ? '✕ Cancel' : '➕ Add Conversion'}
              </button>
            </div>

            {/* ── Add Form ── */}
            {showAddForm && (
              <div style={{ background: 'white', borderRadius: '20px', padding: '28px', boxShadow: '0 4px 20px rgba(124,58,237,0.1)', border: '2px solid #ede9fe', marginBottom: '24px' }}>
                <h4 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.4rem', color: '#7c3aed', marginBottom: '20px' }}>New Conversion</h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  {/* Ingredient 1 */}
                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>Ingredient 1</label>
                    <input
                      type="text"
                      value={form.ingredient1Name || form.ingredient1Query}
                      onChange={(e) => setForm((f) => ({ ...f, ingredient1Query: e.target.value, ingredient1Name: '', ingredient1Id: 0 }))}
                      placeholder="Search ingredient..."
                      style={{ width: '100%', padding: '10px 14px', border: '2px solid #ede9fe', borderRadius: '12px', fontFamily: "'Nunito',sans-serif", fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                    {ing1Options.length > 0 && !form.ingredient1Id && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '2px solid #ede9fe', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', zIndex: 10, maxHeight: '180px', overflowY: 'auto' }}>
                        {ing1Options.map((ing) => (
                          <div key={ing.id} onClick={() => { setForm((f) => ({ ...f, ingredient1Id: ing.id, ingredient1Name: ing.name, ingredient1Query: ing.name })); setIng1Options([]); }}
                            style={{ padding: '10px 14px', cursor: 'pointer', fontSize: '0.88rem', borderBottom: '1px solid #f3f4f6' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f3ff')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}>
                            {ing.name} <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>#{ing.id}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {form.ingredient1Id > 0 && (
                      <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f5f3ff', padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, color: '#7c3aed' }}>
                        ✅ {form.ingredient1Name}
                        <button onClick={() => setForm((f) => ({ ...f, ingredient1Id: 0, ingredient1Name: '', ingredient1Query: '' }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', fontSize: '1rem', padding: 0, lineHeight: 1 }}>×</button>
                      </div>
                    )}
                  </div>

                  {/* Ingredient 2 */}
                  <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>Ingredient 2</label>
                    <input
                      type="text"
                      value={form.ingredient2Name || form.ingredient2Query}
                      onChange={(e) => setForm((f) => ({ ...f, ingredient2Query: e.target.value, ingredient2Name: '', ingredient2Id: 0 }))}
                      placeholder="Search ingredient..."
                      style={{ width: '100%', padding: '10px 14px', border: '2px solid #ede9fe', borderRadius: '12px', fontFamily: "'Nunito',sans-serif", fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                    {ing2Options.length > 0 && !form.ingredient2Id && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '2px solid #ede9fe', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', zIndex: 10, maxHeight: '180px', overflowY: 'auto' }}>
                        {ing2Options.map((ing) => (
                          <div key={ing.id} onClick={() => { setForm((f) => ({ ...f, ingredient2Id: ing.id, ingredient2Name: ing.name, ingredient2Query: ing.name })); setIng2Options([]); }}
                            style={{ padding: '10px 14px', cursor: 'pointer', fontSize: '0.88rem', borderBottom: '1px solid #f3f4f6' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f3ff')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}>
                            {ing.name} <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>#{ing.id}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {form.ingredient2Id > 0 && (
                      <div style={{ marginTop: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f5f3ff', padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, color: '#7c3aed' }}>
                        ✅ {form.ingredient2Name}
                        <button onClick={() => setForm((f) => ({ ...f, ingredient2Id: 0, ingredient2Name: '', ingredient2Query: '' }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c3aed', fontSize: '1rem', padding: 0, lineHeight: 1 }}>×</button>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>
                      Conversion Ratio
                      <span style={{ fontWeight: 400, marginLeft: '6px', color: '#9ca3af' }}>(1 unit of ing1 = ? units of ing2)</span>
                    </label>
                    <input type="number" step="0.01" min="0.01" value={form.conversionRatio}
                      onChange={(e) => setForm((f) => ({ ...f, conversionRatio: e.target.value }))}
                      placeholder="e.g. 0.75"
                      style={{ width: '100%', padding: '10px 14px', border: '2px solid #ede9fe', borderRadius: '12px', fontFamily: "'Nunito',sans-serif", fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '26px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                      <div
                        onClick={() => setForm((f) => ({ ...f, isBidirectional: !f.isBidirectional }))}
                        style={{ width: '48px', height: '26px', borderRadius: '999px', background: form.isBidirectional ? '#7c3aed' : '#d1d5db', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
                        <div style={{ position: 'absolute', top: '3px', left: form.isBidirectional ? '25px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6b7280' }}>
                        Bidirectional {form.isBidirectional ? '↔️' : '→'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Ratio preview */}
                {form.ingredient1Name && form.ingredient2Name && form.conversionRatio && (
                  <div style={{ background: '#f5f3ff', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.85rem', color: '#7c3aed', fontWeight: 600 }}>
                    📐 Preview: 1 {form.ingredient1Name} = {form.conversionRatio} {form.ingredient2Name}
                    {form.isBidirectional && ` / 1 ${form.ingredient2Name} = ${(1 / parseFloat(form.conversionRatio || '1')).toFixed(3)} ${form.ingredient1Name}`}
                  </div>
                )}

                {convError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '12px' }}>{convError}</p>}

                <button onClick={handleSaveConversion} disabled={savingConv}
                  style={{ padding: '12px 32px', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', color: 'white', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.9rem', cursor: savingConv ? 'not-allowed' : 'pointer', opacity: savingConv ? 0.7 : 1 }}>
                  {savingConv ? 'Saving...' : '✅ Save Conversion'}
                </button>
              </div>
            )}

            {/* ── Conversions Table ── */}
            <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(124,58,237,0.08)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#6b7280' }}>
                  {filteredConversions.length} conversion{filteredConversions.length !== 1 ? 's' : ''}
                </span>
                <div style={{ position: 'relative' }}>
                  <input type="text" value={convSearch} onChange={(e) => setConvSearch(e.target.value)} placeholder="Search ingredients..."
                    style={{ padding: '8px 34px 8px 14px', border: '2px solid #ede9fe', borderRadius: '999px', fontFamily: "'Nunito',sans-serif", fontSize: '0.85rem', outline: 'none', width: '200px' }} />
                  <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>🔍</span>
                </div>
              </div>

              {loadingConversions ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
                  <div style={{ width: '36px', height: '36px', border: '3px solid #ede9fe', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  Loading conversions...
                </div>
              ) : filteredConversions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔄</div>
                  <p style={{ fontWeight: 600 }}>{convSearch ? 'No results' : 'No conversions yet'}</p>
                  {!convSearch && <p style={{ fontSize: '0.85rem' }}>Add your first conversion using the button above</p>}
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f5f3ff' }}>
                        {['Ingredient 1', '', 'Ingredient 2', 'Ratio', 'Direction', 'Actions'].map((h) => (
                          <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredConversions.map((conv, idx) => (
                        <tr key={conv.id} style={{ borderTop: '1px solid #ede9fe', background: idx % 2 === 0 ? 'white' : '#faf8ff' }}>
                          <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1f2937' }}>{conv.ingredient1Name}</td>
                          <td style={{ padding: '14px 8px', color: '#7c3aed', fontWeight: 700, fontSize: '1.1rem' }}>
                            {conv.isBidirectional ? '↔' : '→'}
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1f2937' }}>{conv.ingredient2Name}</td>
                          <td style={{ padding: '14px 16px' }}>
                            {editingConv?.id === conv.id ? (
                              <input type="number" step="0.01" min="0.01"
                                value={editingConv.conversionRatio ?? ''}
                                onChange={(e) => setEditingConv((c) => c ? { ...c, conversionRatio: parseFloat(e.target.value) } : c)}
                                style={{ width: '80px', padding: '6px 10px', border: '2px solid #a78bfa', borderRadius: '8px', fontFamily: "'Nunito',sans-serif", fontSize: '0.9rem', outline: 'none' }}
                              />
                            ) : (
                              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#4b5563', background: '#f3f4f6', padding: '3px 10px', borderRadius: '8px' }}>
                                {conv.conversionRatio}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            {editingConv?.id === conv.id ? (
                              <div onClick={() => setEditingConv((c) => c ? { ...c, isBidirectional: !c.isBidirectional } : c)}
                                style={{ width: '42px', height: '24px', borderRadius: '999px', background: editingConv.isBidirectional ? '#7c3aed' : '#d1d5db', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
                                <div style={{ position: 'absolute', top: '2px', left: editingConv.isBidirectional ? '20px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', background: conv.isBidirectional ? '#ede9fe' : '#f3f4f6', color: conv.isBidirectional ? '#7c3aed' : '#6b7280' }}>
                                {conv.isBidirectional ? '↔ Both' : '→ One-way'}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {editingConv?.id === conv.id ? (
                                <>
                                  <button onClick={handleUpdateConversion} disabled={savingConv}
                                    style={{ padding: '6px 16px', borderRadius: '999px', border: 'none', background: '#7c3aed', color: 'white', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                                    {savingConv ? '...' : '✅ Save'}
                                  </button>
                                  <button onClick={() => setEditingConv(null)}
                                    style={{ padding: '6px 16px', borderRadius: '999px', border: '2px solid #ede9fe', background: 'white', color: '#7c3aed', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => setEditingConv(conv)}
                                    style={{ padding: '6px 16px', borderRadius: '999px', border: '2px solid #ede9fe', background: 'white', color: '#7c3aed', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                                    ✏️ Edit
                                  </button>
                                  <button onClick={() => handleDeleteConversion(conv.id)} disabled={deletingConvId === conv.id}
                                    style={{ padding: '6px 16px', borderRadius: '999px', border: 'none', background: '#fee2e2', color: '#991b1b', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
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
