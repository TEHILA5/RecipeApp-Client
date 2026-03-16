// ===============================================
// SearchPage - חיפוש מתכונים
// ===============================================
import { useState, useEffect, useRef } from 'react';
import {
  useGetRecipesQuery,
  useGetRecipesByCategoryQuery,
  useSearchByIngredientsQuery,
} from '../../recipe/redux/recipeSlice';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { setSearchTerm, setSelectedCategory } from '../../recipe/redux/recipeSlice';
import {
  setMode, setNameInput, setCategoryInput,
  addIngredient, removeIngredient, clearIngredients,
  setActiveResultTab,
} from '../redux/searchSlice';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { type Recipe, type RecipeCategory } from '../../recipe/types/recipe.types';
import { getAllConversions, getAlternativesForIngredient, type ConversionDto } from '../../../api/conversionApi';
import SearchBar from '../components/SearchBar';
import SearchFilters from '../components/SearchFilters';
import SearchResults from '../components/SearchResults';

type SearchMode = 'name' | 'category' | 'ingredients';

export default function SearchPage() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  // ✅ state מגיע מ-Redux searchSlice
  const { mode, nameInput, categoryInput, ingredientList, activeResultTab } =
    useAppSelector((s) => s.search);

  const [ingredientInput, setIngredientInput] = useState('');

  // ✅ useRef מונע את הלולאה האינסופית - reference יציב
  const allConversionsRef = useRef<ConversionDto[]>([]);
  const [allConversions, setAllConversions] = useState<ConversionDto[]>([]);
  const [alternativeResults, setAlternativeResults] = useState<{
    recipe: Recipe;
    matchedVia: { original: string; alternative: string }[];
  }[]>([]);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);

  useEffect(() => {
    getAllConversions().then((data) => {
      allConversionsRef.current = data;
      setAllConversions(data);
    }).catch(() => {});
  }, []);

  const debouncedName = useDebounce(nameInput, 400);

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
  const { data: allRecipesForAlt = [] } = useGetRecipesQuery(undefined, {
    skip: mode !== 'ingredients',
  });

  // ── חיפוש חלופות ──
  useEffect(() => {
    if (mode !== 'ingredients' || ingredientList.length === 0 || loadingIng) {
      setAlternativeResults((prev) => prev.length === 0 ? prev : []);
      return;
    }
    if (ingredientResults.length > 0) {
      setAlternativeResults((prev) => prev.length === 0 ? prev : []);
      dispatch(setActiveResultTab('results'));
      return;
    }

    const run = async () => {
      setLoadingAlternatives(true);
      await Promise.resolve();

      // ✅ משתמשים ב-ref ולא ב-state כדי למנוע dependency שמשתנה כל render
      const conversions = allConversionsRef.current;

      // בניית מפה: לכל רכיב שחיפשנו -> רשימת חלופותיו
      const alternativeMap: Record<string, string[]> = {};
      for (const ing of ingredientList) {
        const alts = getAlternativesForIngredient(ing, conversions);
        alternativeMap[ing] = alts.map((a) => a.alternativeName.toLowerCase());
      }

      const matched: { recipe: Recipe; matchedVia: { original: string; alternative: string }[] }[] = [];

      for (const recipe of allRecipesForAlt) {
        const recipeIngredients = recipe.ingredients?.map((i) =>
          (i.ingredientName ?? '').toLowerCase()
        ) ?? [];

        const matchedVia: { original: string; alternative: string }[] = [];
        let allIngredientsMatched = true; // חייב כל רכיב להיות מכוסה

        for (const ing of ingredientList) {
          const ingLower = ing.toLowerCase();
          const alternatives = alternativeMap[ing] ?? [];

          // בדיקה ישירה
          const directMatch = recipeIngredients.some((ri) => ri.includes(ingLower));
          if (directMatch) continue;

          // בדיקת חלופות
          let foundViaAlternative = false;
          for (const alt of alternatives) {
            if (recipeIngredients.some((ri) => ri.includes(alt))) {
              matchedVia.push({ original: ing, alternative: alt });
              foundViaAlternative = true;
              break;
            }
          }

          if (!foundViaAlternative) {
            // רכיב לא נמצא - פוסל את המתכון
            allIngredientsMatched = false;
            break;
          }
        }

        // מתכון נכנס רק אם כל הרכיבים מכוסים + לפחות חלופה אחת
        if (allIngredientsMatched && matchedVia.length > 0) {
          matched.push({ recipe, matchedVia });
        }
      }

      setAlternativeResults(matched);
      setLoadingAlternatives(false);
      if (matched.length > 0) dispatch(setActiveResultTab('alternatives'));
    };

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredientResults, ingredientList, loadingIng, mode]);

  const isLoading = loadingAll || loadingCat || loadingIng;

  const nameResults: Recipe[] = debouncedName
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

  const handleSetMode = (newMode: SearchMode) => {
    dispatch(setMode(newMode));
    dispatch(setSearchTerm(''));
    dispatch(setSelectedCategory(null));
    setIngredientInput('');
    setAlternativeResults([]);
  };

  const handleAddIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (trimmed) {
      dispatch(addIngredient(trimmed));
      dispatch(setSearchTerm([...ingredientList, trimmed].join(', ')));
      dispatch(setActiveResultTab('results'));
    }
    setIngredientInput('');
  };

  const handleRemoveIngredient = (ing: string) => {
    dispatch(removeIngredient(ing));
    const next = ingredientList.filter((i) => i !== ing);
    dispatch(setSearchTerm(next.join(', ')));
  };

  const handleClearIngredients = () => {
    dispatch(clearIngredients());
    dispatch(setSearchTerm(''));
    setAlternativeResults([]);
    dispatch(setActiveResultTab('results'));
  };

  const handleSetCategory = (cat: RecipeCategory | '') => {
    dispatch(setCategoryInput(cat));
    dispatch(setSelectedCategory(cat || null));
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
            <button key={key} onClick={() => handleSetMode(key)}
              style={{ flex: 1, padding: '10px 16px', borderRadius: '999px', border: 'none', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s', background: mode === key ? 'white' : 'transparent', color: mode === key ? '#d4547a' : '#9ca3af', boxShadow: mode === key ? '0 2px 10px rgba(212,84,122,0.12)' : 'none' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(212,84,122,0.07)', marginBottom: '28px' }}>
          {mode === 'name' && (
            <SearchBar
              value={nameInput}
              onChange={(val) => { dispatch(setNameInput(val)); dispatch(setSearchTerm(val)); }}
              placeholder="Search for a recipe name or keyword..."
            />
          )}
          {(mode === 'category' || mode === 'ingredients') && (
            <SearchFilters
              mode={mode}
              categoryInput={categoryInput}
              onCategoryChange={handleSetCategory}
              ingredientInput={ingredientInput}
              onIngredientInputChange={setIngredientInput}
              ingredientList={ingredientList}
              onAddIngredient={handleAddIngredient}
              onRemoveIngredient={handleRemoveIngredient}
              onClearIngredients={handleClearIngredients}
            />
          )}
        </div>

        {/* Results */}
        <SearchResults
          mode={mode}
          results={results}
          loading={isLoading}
          hasSearched={hasSearched}
          isAuthenticated={isAuthenticated}
          alternativeResults={alternativeResults}
          loadingAlternatives={loadingAlternatives}
          activeResultTab={activeResultTab}
          onTabChange={(tab) => dispatch(setActiveResultTab(tab))}
          ingredientList={ingredientList}
          allConversions={allConversions}
        />
      </div>
    </div>
  );
}
