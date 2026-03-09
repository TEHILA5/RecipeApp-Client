// ===============================================
// SearchPage - חיפוש מתכונים עם RTK Query + המרות
// ===============================================
import { useState, useEffect } from 'react';
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
import { getAllConversions, getAlternativesForIngredient, type ConversionDto } from '../../../api/conversionApi';

type SearchMode = 'name' | 'category' | 'ingredients';

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

  // ── המרות ──
  const [allConversions, setAllConversions] = useState<ConversionDto[]>([]);
  const [alternativeResults, setAlternativeResults] = useState<{
    recipe: Recipe;
    matchedVia: { original: string; alternative: string }[];
  }[]>([]);
  const [activeResultTab, setActiveResultTab] = useState<'results' | 'alternatives'>('results');
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);

  // טעינת כל ההמרות פעם אחת
  useEffect(() => {
    getAllConversions()
      .then(setAllConversions)
      .catch(() => {});
  }, []);

  const debouncedName = useDebounce(nameInput, 400);

  // ── RTK Query ──
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

  // כל המתכונים לצורך חיפוש חלופות
  const { data: allRecipesForAlt = [] } = useGetRecipesQuery(undefined, {
    skip: mode !== 'ingredients',
  });

  // ── חיפוש חלופות כשאין תוצאות ──
  useEffect(() => {
    // ✅ async כדי למנוע cascading renders מ-setState synchronous
    const run = async () => {
      if (mode !== 'ingredients' || ingredientList.length === 0 || loadingIng) {
        setAlternativeResults([]);
        return;
      }

      if (ingredientResults.length > 0) {
        setAlternativeResults([]);
        setActiveResultTab('results');
        return;
      }

      setLoadingAlternatives(true);
      await Promise.resolve(); // yield לפני חישוב כבד

      const alternativeMap: Record<string, string[]> = {};
      for (const ing of ingredientList) {
        const alts = getAlternativesForIngredient(ing, allConversions);
        if (alts.length > 0) {
          alternativeMap[ing] = alts.map((a) => a.alternativeName.toLowerCase());
        }
      }

      if (Object.keys(alternativeMap).length === 0) {
        setAlternativeResults([]);
        setLoadingAlternatives(false);
        return;
      }

      const matched: { recipe: Recipe; matchedVia: { original: string; alternative: string }[] }[] = [];

      for (const recipe of allRecipesForAlt) {
        const recipeIngredients = recipe.ingredients?.map((i) =>
          (i.ingredientName ?? '').toLowerCase()
        ) ?? [];

        const matchedVia: { original: string; alternative: string }[] = [];

        for (const [original, alternatives] of Object.entries(alternativeMap)) {
          for (const alt of alternatives) {
            if (recipeIngredients.some((ri) => ri.includes(alt))) {
              matchedVia.push({ original, alternative: alt });
              break;
            }
          }
        }

        if (matchedVia.length > 0) {
          matched.push({ recipe, matchedVia });
        }
      }

      setAlternativeResults(matched);
      setLoadingAlternatives(false);

      if (matched.length > 0) {
        setActiveResultTab('alternatives');
      }
    };

    run();
  }, [ingredientResults, ingredientList, loadingIng, allConversions, allRecipesForAlt, mode]);

  const loading = loadingAll || loadingCat || loadingIng;

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
      setActiveResultTab('results');
    }
    setIngredientInput('');
  };

  const RecipeCardMini = ({ recipe }: { recipe: Recipe }) => {
    const emoji = CATEGORY_EMOJIS[recipe.category] ?? '🍰';
    const levelLabel = LEVEL_LABELS[recipe.level as 1 | 2 | 3] ?? 'Easy';
    return (
      <Link to={`/recipes/${recipe.id}`}
        style={{ display: 'block', textDecoration: 'none', background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(212,84,122,0.08)', transition: 'transform 0.2s, box-shadow 0.2s' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(212,84,122,0.15)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(212,84,122,0.08)'; }}
      >
        <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
          {recipe.arrImage
            ? <img src={recipe.arrImage} alt={recipe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #f9e4ec, #e8c49a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>{emoji}</div>
          }
        </div>
        <div style={{ padding: '16px 18px' }}>
          <div style={{ marginBottom: '8px' }}>
            <StarRating rating={recipe.averageRating} showCount={recipe.commentCount} />
          </div>
          <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.25rem', color: '#1f2937', marginBottom: '6px' }}>{recipe.name}</h3>
          <p style={{ fontSize: '0.8rem', color: '#9ca3af', lineHeight: 1.5, marginBottom: '10px' }}>
            {recipe.description.length > 80 ? `${recipe.description.substring(0, 80)}...` : recipe.description}
          </p>
          <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
            <span>⏱️ {recipe.totalTime}m</span>
            <span>👨‍🍳 {levelLabel}</span>
            <span style={{ marginLeft: 'auto', background: '#fce7f3', color: '#d4547a', padding: '2px 10px', borderRadius: '999px' }}>{recipe.category}</span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fdf2f8', paddingTop: 'var(--nav-height, 70px)', fontFamily: "'Nunito', sans-serif" }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(232,121,154,0.08), rgba(232,196,154,0.08))', padding: '48px 24px 36px', borderBottom: '2px solid rgba(232,121,154,0.1)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#d4547a', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>✦ Find Your Recipe</div>
          <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: '#1f2937', marginBottom: '10px', lineHeight: 1.1 }}>
            Search <span style={{ color: '#d4547a' }}>Recipes</span> 🔍
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', fontWeight: 500 }}>Find the perfect dessert by name, category, or ingredients</p>
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Mode Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: '#f3e8ef', borderRadius: '999px', padding: '4px', marginBottom: '28px' }}>
          {([{ key: 'name', label: '🔤 By Name' }, { key: 'category', label: '📂 By Category' }, { key: 'ingredients', label: '🧂 By Ingredients' }] as { key: SearchMode; label: string }[]).map(({ key, label }) => (
            <button key={key} onClick={() => setMode(key)} style={{ flex: 1, padding: '10px 16px', borderRadius: '999px', border: 'none', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s', background: mode === key ? 'white' : 'transparent', color: mode === key ? '#d4547a' : '#9ca3af', boxShadow: mode === key ? '0 2px 10px rgba(212,84,122,0.12)' : 'none' }}>{label}</button>
          ))}
        </div>

        {/* Search Inputs */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(212,84,122,0.07)', marginBottom: '28px' }}>

          {mode === 'name' && (
            <div style={{ position: 'relative' }}>
              <input autoFocus type="text" value={nameInput}
                onChange={(e) => { setNameInput(e.target.value); dispatch(setSearchTerm(e.target.value)); }}
                placeholder="Search for a recipe name or keyword..."
                style={{ width: '100%', padding: '14px 48px 14px 20px', border: '2px solid #fce7f3', borderRadius: '999px', fontFamily: "'Nunito',sans-serif", fontSize: '1rem', background: '#fffbfd', outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#d4547a')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#fce7f3')}
              />
              <span style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', pointerEvents: 'none' }}>🔍</span>
            </div>
          )}

          {mode === 'category' && (
            <div>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600, marginBottom: '14px' }}>Select a category ({ALL_CATEGORIES.length} available):</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {ALL_CATEGORIES.map(({ value, label }) => {
                  const emoji = CATEGORY_EMOJIS[value] ?? '🍰';
                  const selected = categoryInput === value;
                  return (
                    <button key={value} onClick={() => { setCategoryInput(selected ? '' : value); dispatch(setSelectedCategory(selected ? null : value)); }}
                      style={{ padding: '8px 18px', borderRadius: '999px', border: `2px solid ${selected ? '#d4547a' : '#fce7f3'}`, background: selected ? '#fce7f3' : 'white', color: selected ? '#d4547a' : '#6b7280', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                      {emoji} {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {mode === 'ingredients' && (
            <div>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600, marginBottom: '14px' }}>
                Add ingredients one by one and press <strong style={{ color: '#d4547a' }}>+ Add</strong> (or Enter) after each one:
              </p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                <input type="text" value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddIngredient(); }}
                  placeholder="e.g. chocolate, butter, eggs..."
                  style={{ flex: 1, padding: '12px 18px', border: '2px solid #fce7f3', borderRadius: '999px', fontFamily: "'Nunito',sans-serif", fontSize: '0.92rem', background: '#fffbfd', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#d4547a')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#fce7f3')}
                />
                <button onClick={handleAddIngredient} disabled={!ingredientInput.trim()}
                  style={{ padding: '12px 20px', borderRadius: '999px', border: 'none', background: ingredientInput.trim() ? 'linear-gradient(135deg, #e8799a, #d4547a)' : '#e5e7eb', color: ingredientInput.trim() ? 'white' : '#9ca3af', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.85rem', cursor: ingredientInput.trim() ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}>
                  + Add
                </button>
              </div>
              {ingredientList.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {ingredientList.map((ing) => (
                    <span key={ing} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '999px', background: '#fce7f3', color: '#d4547a', fontWeight: 700, fontSize: '0.82rem' }}>
                      🧂 {ing}
                      <button onClick={() => setIngredientList((prev) => prev.filter((i) => i !== ing))}
                        style={{ background: 'none', border: 'none', color: '#d4547a', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: 0 }}>×</button>
                    </span>
                  ))}
                  <button onClick={() => { setIngredientList([]); dispatch(setSearchTerm('')); setAlternativeResults([]); setActiveResultTab('results'); }}
                    style={{ padding: '6px 14px', borderRadius: '999px', border: '1.5px solid #e5e7eb', background: 'white', color: '#9ca3af', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && hasSearched && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #fce7f3', borderTopColor: '#d4547a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            Searching...
          </div>
        )}

        {/* ── תוצאות Ingredients עם טאב חלופות ── */}
        {!loading && hasSearched && mode === 'ingredients' && (results.length > 0 || alternativeResults.length > 0) && (
          <>
            {/* טאבי תוצאות / חלופות */}
            <div style={{ display: 'flex', gap: '4px', background: '#f3e8ef', borderRadius: '999px', padding: '4px', marginBottom: '20px' }}>
              <button onClick={() => setActiveResultTab('results')} style={{ flex: 1, padding: '10px 16px', borderRadius: '999px', border: 'none', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s', background: activeResultTab === 'results' ? 'white' : 'transparent', color: activeResultTab === 'results' ? '#d4547a' : '#9ca3af', boxShadow: activeResultTab === 'results' ? '0 2px 10px rgba(212,84,122,0.12)' : 'none' }}>
                🔍 Results ({results.length})
              </button>
              <button onClick={() => setActiveResultTab('alternatives')} style={{ flex: 1, padding: '10px 16px', borderRadius: '999px', border: 'none', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s', background: activeResultTab === 'alternatives' ? 'white' : 'transparent', color: activeResultTab === 'alternatives' ? '#c4894a' : '#9ca3af', boxShadow: activeResultTab === 'alternatives' ? '0 2px 10px rgba(196,137,74,0.12)' : 'none' }}>
                🔄 Alternatives ({loadingAlternatives ? '...' : alternativeResults.length})
              </button>
            </div>

            {/* תוצאות רגילות */}
            {activeResultTab === 'results' && (
              results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(212,84,122,0.06)' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍰</div>
                  <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.6rem', color: '#d4547a', marginBottom: '8px' }}>No exact matches</h3>
                  <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
                    {alternativeResults.length > 0 ? '✨ But we found recipes using ingredient alternatives!' : 'Try different ingredients'}
                  </p>
                  {alternativeResults.length > 0 && (
                    <button onClick={() => setActiveResultTab('alternatives')}
                      style={{ padding: '10px 24px', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg, #e8c49a, #c4894a)', color: 'white', fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: 'pointer' }}>
                      🔄 See Alternatives
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#6b7280', marginBottom: '16px' }}>Found <span style={{ color: '#d4547a' }}>{results.length}</span> recipe{results.length !== 1 ? 's' : ''}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {results.map((recipe) => <RecipeCardMini key={recipe.id} recipe={recipe} />)}
                  </div>
                </>
              )
            )}

            {/* תוצאות חלופות */}
            {activeResultTab === 'alternatives' && (
              <div>
                <div style={{ background: 'linear-gradient(135deg, rgba(232,196,154,0.2), rgba(196,137,74,0.1))', border: '2px solid rgba(196,137,74,0.2)', borderRadius: '16px', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.5rem' }}>🔄</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: '#92400e', fontSize: '0.9rem' }}>Showing recipes with ingredient alternatives</p>
                    <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '0.8rem' }}>
                      Substitutes for: <strong style={{ color: '#c4894a' }}>{ingredientList.join(', ')}</strong>
                    </p>
                  </div>
                </div>

                {loadingAlternatives ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                    <div style={{ width: '36px', height: '36px', border: '3px solid #fce7f3', borderTopColor: '#c4894a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                    Looking for alternatives...
                  </div>
                ) : alternativeResults.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: '20px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>😔</div>
                    <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.6rem', color: '#d4547a' }}>No alternatives found</h3>
                    <p style={{ color: '#9ca3af' }}>We couldn't find substitutes for these ingredients</p>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#6b7280', marginBottom: '16px' }}>
                      Found <span style={{ color: '#c4894a' }}>{alternativeResults.length}</span> recipe{alternativeResults.length !== 1 ? 's' : ''} with alternatives
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {alternativeResults.map(({ recipe, matchedVia }) => (
                        <div key={recipe.id}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                            {matchedVia.map(({ original, alternative }) => {
                              // מציאת היחס מתוך allConversions
                              // מציאת ה-conv ו-ratio
                              const conv = allConversions.find((c) => {
                                const o = original.toLowerCase();
                                const a = alternative.toLowerCase();
                                const n1 = c.ingredient1Name?.toLowerCase();
                                const n2 = c.ingredient2Name?.toLowerCase();
                                return (n1 === o && n2 === a) || (n2 === o && n1 === a && c.isBidirectional);
                              });
                              const ratio = conv
                                ? conv.ingredient1Name?.toLowerCase() === original.toLowerCase()
                                  ? conv.conversionRatio
                                  : conv.conversionRatio !== 0 ? +(1 / conv.conversionRatio).toFixed(3) : null
                                : null;

                              // כמות מדויקת מתוך המתכון הספציפי
                              const recipeIng = recipe.ingredients?.find((i) =>
                                (i.ingredientName ?? '').toLowerCase().includes(alternative.toLowerCase())
                              );
                              const exactAmount = recipeIng && ratio !== null
                                ? +((recipeIng.quantity ?? 1) * (1 / (ratio as number))).toFixed(3)
                                : null;
                              const unit = recipeIng?.unit ?? '';

                              return (
                                <span key={original} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '999px', background: 'rgba(196,137,74,0.1)', border: '1.5px solid rgba(196,137,74,0.3)', fontSize: '0.78rem', fontWeight: 700, color: '#92400e' }}>
                                  <span style={{ textDecoration: 'line-through', opacity: 0.55 }}>{original}</span>
                                  <span style={{ opacity: 0.5 }}>→</span>
                                  <span style={{ color: '#c4894a' }}>{alternative}</span>
                                  {ratio !== null && (
                                    <>
                                      <span style={{ opacity: 0.35, margin: '0 1px' }}>•</span>
                                      <span style={{ background: 'rgba(196,137,74,0.15)', borderRadius: '6px', padding: '1px 6px', fontSize: '0.72rem', color: '#92400e' }}>×{ratio}</span>
                                    </>
                                  )}
                                  {exactAmount !== null && (
                                    <>
                                      <span style={{ opacity: 0.35, margin: '0 1px' }}>•</span>
                                      <span style={{ background: 'rgba(196,137,74,0.2)', borderRadius: '6px', padding: '1px 8px', fontSize: '0.72rem', color: '#78350f', fontWeight: 800 }}>
                                        {recipeIng!.quantity}{unit ? ' ' + unit : ''} {alternative} = {exactAmount}{unit ? ' ' + unit : ''} {original}
                                      </span>
                                    </>
                                  )}
                                </span>
                              );
                            })}
                          </div>
                          <RecipeCardMini recipe={recipe} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}

        {/* אין תוצאות כלל (ingredients) */}
        {!loading && hasSearched && mode === 'ingredients' && results.length === 0 && alternativeResults.length === 0 && !loadingAlternatives && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(212,84,122,0.06)' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🍰</div>
            <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.8rem', color: '#d4547a', marginBottom: '8px' }}>No recipes found</h3>
            <p style={{ color: '#9ca3af' }}>No recipes or alternatives found for these ingredients</p>
          </div>
        )}

        {/* תוצאות name / category */}
        {!loading && hasSearched && mode !== 'ingredients' && (
          results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(212,84,122,0.06)' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>🍰</div>
              <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.8rem', color: '#d4547a', marginBottom: '8px' }}>No recipes found</h3>
              <p style={{ color: '#9ca3af' }}>Try a different search term or category</p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#6b7280', marginBottom: '16px' }}>Found <span style={{ color: '#d4547a' }}>{results.length}</span> recipe{results.length !== 1 ? 's' : ''}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {results.map((recipe) => <RecipeCardMini key={recipe.id} recipe={recipe} />)}
              </div>
            </>
          )
        )}

        {/* Empty state */}
        {!hasSearched && (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(212,84,122,0.06)' }}>
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
