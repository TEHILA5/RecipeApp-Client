// ===============================================
// SearchPage - חיפוש מתכונים עם RTK Query
// ===============================================
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetRecipesQuery,
  useGetRecipesByCategoryQuery,
  useSearchByIngredientsQuery,
} from '../../recipe/redux/recipeSlice';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { setSearchTerm, setSelectedCategory } from '../../recipe/redux/recipeSlice';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { type Recipe, type RecipeCategory, CATEGORY_EMOJIS, LEVEL_LABELS } from '../../recipe/types/recipe.types';
import StarRating from '../../../shared/components/StarRating';

type SearchMode = 'name' | 'category' | 'ingredients';

// ✅ רשימה מלאה - תואמת לשרת
const ALL_CATEGORIES: { value: RecipeCategory; label: string }[] = [
  { value: 'Sweats',              label: 'Sweets' },
  { value: 'Cakes',               label: 'Cakes' },
  { value: 'Cupcakes',            label: 'Cupcakes' },
  { value: 'Cheesecakes',         label: 'Cheesecakes' },
  { value: 'BundtCakes',          label: 'Bundt Cakes' },
  { value: 'Brownies',            label: 'Brownies' },
  { value: 'Cookies',             label: 'Cookies' },
  { value: 'Bars',                label: 'Bars' },
  { value: 'IceCream',            label: 'Ice Cream' },
  { value: 'Mousse',              label: 'Mousse' },
  { value: 'Puddings',            label: 'Puddings' },
  { value: 'Panna',               label: 'Panna Cotta' },
  { value: 'Tiramisu',            label: 'Tiramisu' },
  { value: 'FrozenDesserts',      label: 'Frozen Desserts' },
  { value: 'Pies',                label: 'Pies' },
  { value: 'Tarts',               label: 'Tarts' },
  { value: 'Crumbles',            label: 'Crumbles' },
  { value: 'FruitSalads',         label: 'Fruit Salads' },
  { value: 'Pastries',            label: 'Pastries' },
  { value: 'Donuts',              label: 'Donuts' },
  { value: 'Churros',             label: 'Churros' },
  { value: 'Crepes',              label: 'Crepes' },
  { value: 'Waffles',             label: 'Waffles' },
  { value: 'NoBakeCakes',         label: 'No-Bake Cakes' },
  { value: 'Truffles',            label: 'Truffles' },
  { value: 'EnergyBalls',         label: 'Energy Balls' },
  { value: 'SoufleeAndCustard',   label: 'Souflee & Custard' },
  { value: 'MilkDesserts',        label: 'Milk Desserts' },
  { value: 'JellyAndGelatin',     label: 'Jelly & Gelatin' },
  { value: 'TraditionalDesserts', label: 'Traditional Desserts' },
];

export default function SearchPage() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const [mode, setMode] = useState<SearchMode>('name');
  const [nameInput, setNameInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<RecipeCategory | ''>('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredientList, setIngredientList] = useState<string[]>([]);

  // Debounce שם מתכון
  const debouncedName = useDebounce(nameInput, 400);

  // ── RTK Query ──────────────────────────────────────────
  const { data: allRecipes = [], isLoading: loadingAll } = useGetRecipesQuery(undefined, {
    skip: mode !== 'name',
  });

  const { data: categoryResults = [], isLoading: loadingCat } = useGetRecipesByCategoryQuery(
    categoryInput as string,
    { skip: mode !== 'category' || !categoryInput }
  );

  const { data: ingredientResults = [], isLoading: loadingIng } = useSearchByIngredientsQuery(
    ingredientList,
    { skip: mode !== 'ingredients' || ingredientList.length === 0 }
  );

  const loading = loadingAll || loadingCat || loadingIng;

  // סינון לפי שם (client-side מהקאש)
  const nameResults = debouncedName
    ? allRecipes.filter((r) =>
        r.name.toLowerCase().includes(debouncedName.toLowerCase()) ||
        r.description.toLowerCase().includes(debouncedName.toLowerCase())
      )
    : [];

  const results: Recipe[] =
    mode === 'name' ? nameResults :
    mode === 'category' ? categoryResults :
    ingredientResults;

  const hasSearched =
    (mode === 'name' && debouncedName.length > 0) ||
    (mode === 'category' && !!categoryInput) ||
    (mode === 'ingredients' && ingredientList.length > 0);

  const handleAddIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (trimmed && !ingredientList.includes(trimmed)) {
      const next = [...ingredientList, trimmed];
      setIngredientList(next);
      dispatch(setSearchTerm(next.join(', ')));
    }
    setIngredientInput('');
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#fdf2f8',
      paddingTop: 'var(--nav-height, 70px)',
      fontFamily: "'Nunito', sans-serif",
    }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(232,121,154,0.08), rgba(232,196,154,0.08))',
        padding: '48px 24px 36px',
        borderBottom: '2px solid rgba(232,121,154,0.1)',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#d4547a', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
            ✦ Find Your Recipe
          </div>
          <h1 style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            color: '#1f2937', marginBottom: '10px', lineHeight: 1.1,
          }}>
            Search <span style={{ color: '#d4547a' }}>Recipes</span> 🔍
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', fontWeight: 500 }}>
            Find the perfect dessert by name, category, or ingredients
          </p>
        </div>
      </div>

      {/* Search Box */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Mode Tabs */}
        <div style={{
          display: 'flex', gap: '4px', background: '#f3e8ef',
          borderRadius: '999px', padding: '4px', marginBottom: '28px',
        }}>
          {([
            { key: 'name', label: '🔤 By Name' },
            { key: 'category', label: '📂 By Category' },
            { key: 'ingredients', label: '🧂 By Ingredients' },
          ] as { key: SearchMode; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: '999px', border: 'none',
                fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.88rem',
                cursor: 'pointer', transition: 'all 0.2s',
                background: mode === key ? 'white' : 'transparent',
                color: mode === key ? '#d4547a' : '#9ca3af',
                boxShadow: mode === key ? '0 2px 10px rgba(212,84,122,0.12)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Search Inputs ── */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: '24px',
          boxShadow: '0 4px 20px rgba(212,84,122,0.07)', marginBottom: '28px',
        }}>

          {/* Name Search */}
          {mode === 'name' && (
            <div style={{ position: 'relative' }}>
              <input
                autoFocus
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  dispatch(setSearchTerm(e.target.value));
                }}
                placeholder="Search for a recipe name or keyword..."
                style={{
                  width: '100%', padding: '14px 48px 14px 20px',
                  border: '2px solid #fce7f3', borderRadius: '999px',
                  fontFamily: "'Nunito',sans-serif", fontSize: '1rem',
                  background: '#fffbfd', outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#d4547a')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#fce7f3')}
              />
              <span style={{
                position: 'absolute', right: '18px', top: '50%',
                transform: 'translateY(-50%)', fontSize: '1.2rem', pointerEvents: 'none',
              }}>🔍</span>
            </div>
          )}

          {/* Category Search - ✅ רשימה מלאה */}
          {mode === 'category' && (
            <div>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600, marginBottom: '14px' }}>
                Select a category ({ALL_CATEGORIES.length} available):
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {ALL_CATEGORIES.map(({ value, label }) => {
                  const emoji = CATEGORY_EMOJIS[value] ?? '🍰';
                  const selected = categoryInput === value;
                  return (
                    <button
                      key={value}
                      onClick={() => {
                        setCategoryInput(selected ? '' : value);
                        dispatch(setSelectedCategory(selected ? null : value));
                      }}
                      style={{
                        padding: '8px 18px', borderRadius: '999px',
                        border: `2px solid ${selected ? '#d4547a' : '#fce7f3'}`,
                        background: selected ? '#fce7f3' : 'white',
                        color: selected ? '#d4547a' : '#6b7280',
                        fontFamily: "'Nunito',sans-serif", fontWeight: 700,
                        fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      {emoji} {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ingredients Search - ✅ הסבר מדויק */}
          {mode === 'ingredients' && (
            <div>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600, marginBottom: '14px' }}>
                Add ingredients one by one and press <strong style={{ color: '#d4547a' }}>+ Add</strong> (or Enter) after each one:
              </p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                <input
                  type="text"
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddIngredient(); }}
                  placeholder="e.g. chocolate, butter, eggs..."
                  style={{
                    flex: 1, padding: '12px 18px', border: '2px solid #fce7f3',
                    borderRadius: '999px', fontFamily: "'Nunito',sans-serif",
                    fontSize: '0.92rem', background: '#fffbfd', outline: 'none',
                    transition: 'border-color 0.2s', boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#d4547a')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#fce7f3')}
                />
                <button
                  onClick={handleAddIngredient}
                  disabled={!ingredientInput.trim()}
                  style={{
                    padding: '12px 20px', borderRadius: '999px', border: 'none',
                    background: ingredientInput.trim()
                      ? 'linear-gradient(135deg, #e8799a, #d4547a)'
                      : '#e5e7eb',
                    color: ingredientInput.trim() ? 'white' : '#9ca3af',
                    fontFamily: "'Nunito',sans-serif", fontWeight: 700,
                    fontSize: '0.85rem', cursor: ingredientInput.trim() ? 'pointer' : 'not-allowed',
                    whiteSpace: 'nowrap',
                  }}
                >
                  + Add
                </button>
              </div>

              {ingredientList.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {ingredientList.map((ing) => (
                    <span
                      key={ing}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        padding: '6px 14px', borderRadius: '999px',
                        background: '#fce7f3', color: '#d4547a',
                        fontWeight: 700, fontSize: '0.82rem',
                      }}
                    >
                      🧂 {ing}
                      <button
                        onClick={() => setIngredientList((prev) => prev.filter((i) => i !== ing))}
                        style={{
                          background: 'none', border: 'none', color: '#d4547a',
                          cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: 0,
                        }}
                      >×</button>
                    </span>
                  ))}
                  <button
                    onClick={() => { setIngredientList([]); dispatch(setSearchTerm('')); }}
                    style={{
                      padding: '6px 14px', borderRadius: '999px',
                      border: '1.5px solid #e5e7eb', background: 'white',
                      color: '#9ca3af', fontSize: '0.78rem', fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Results ── */}
        {loading && hasSearched && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
            <div style={{
              width: '40px', height: '40px', border: '3px solid #fce7f3',
              borderTopColor: '#d4547a', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            Searching...
          </div>
        )}

        {!loading && hasSearched && results.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: 'white', borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(212,84,122,0.06)',
          }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🍰</div>
            <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.8rem', color: '#d4547a', marginBottom: '8px' }}>
              No recipes found
            </h3>
            <p style={{ color: '#9ca3af' }}>Try a different search term or category</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#6b7280' }}>
                Found <span style={{ color: '#d4547a' }}>{results.length}</span> recipe{results.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}>
              {results.map((recipe) => {
                const emoji = CATEGORY_EMOJIS[recipe.category] ?? '🍰';
                const levelLabel = LEVEL_LABELS[recipe.level as 1 | 2 | 3] ?? 'Easy';
                return (
                  <Link
                    key={recipe.id}
                    to={`/recipes/${recipe.id}`}
                    style={{
                      display: 'block', textDecoration: 'none',
                      background: 'white', borderRadius: '20px', overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(212,84,122,0.08)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(212,84,122,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'none';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(212,84,122,0.08)';
                    }}
                  >
                    {/* Image */}
                    <div style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}>
                      {recipe.arrImage ? (
                        <img
                          src={recipe.arrImage} alt={recipe.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          background: 'linear-gradient(135deg, #f9e4ec, #e8c49a)',
                          display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '64px',
                        }}>
                          {emoji}
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div style={{ padding: '16px 18px' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <StarRating rating={recipe.averageRating} showCount={recipe.commentCount} />
                      </div>
                      <h3 style={{
                        fontFamily: "'Dancing Script',cursive", fontSize: '1.25rem',
                        color: '#1f2937', marginBottom: '6px', lineHeight: 1.2,
                      }}>
                        {recipe.name}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: '#9ca3af', lineHeight: 1.5, marginBottom: '10px' }}>
                        {recipe.description.length > 80
                          ? `${recipe.description.substring(0, 80)}...`
                          : recipe.description}
                      </p>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
                        <span>⏱️ {recipe.totalTime}m</span>
                        <span>👨‍🍳 {levelLabel}</span>
                        <span style={{
                          marginLeft: 'auto', background: '#fce7f3',
                          color: '#d4547a', padding: '2px 10px', borderRadius: '999px',
                        }}>
                          {recipe.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {!hasSearched && (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: 'white', borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(212,84,122,0.06)',
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>
              {mode === 'name' ? '🔍' : mode === 'category' ? '📂' : '🧂'}
            </div>
            <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.8rem', color: '#d4547a', marginBottom: '8px' }}>
              {mode === 'name' && 'Type to search...'}
              {mode === 'category' && 'Select a category'}
              {mode === 'ingredients' && 'Add ingredients'}
            </h3>
            <p style={{ color: '#9ca3af' }}>
              {mode === 'name' && 'Start typing to find your favorite dessert'}
              {mode === 'category' && 'Choose a category to browse recipes'}
              {mode === 'ingredients' && 'Add ingredients one by one and press + Add after each one'}
            </p>
            {!isAuthenticated && (
              <p style={{ marginTop: '16px', color: '#d4547a', fontWeight: 600, fontSize: '0.88rem' }}>
                <Link to="/login" style={{ color: '#d4547a' }}>Sign in</Link> to get personalized recommendations
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
