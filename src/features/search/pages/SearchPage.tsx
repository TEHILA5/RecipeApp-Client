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
import { useGetAllConversionsQuery } from '../../../api/adminApi';
import { getAlternativesForIngredient } from '../utils/conversionUtils';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import { type Recipe } from '../../recipe/types/recipe.types';
import SearchBar from '../components/SearchBar';
import SearchFilters from '../components/SearchFilters';
import SearchResults from '../components/SearchResults';
import AdvancedSearch from '../components/AdvancedSearch';
import './SearchPage.css';

type SearchMode = 'name' | 'category' | 'ingredients' | 'advanced';
type BaseSearchMode = 'name' | 'category' | 'ingredients';

const TABS: { key: SearchMode; label: string; emoji: React.ReactNode }[] = [
  { key: 'name',        label: 'By Name',        emoji: <img src="/src/assets/icons/content-text.png" alt="Name" className="tab-icon" /> },
  { key: 'category',    label: 'By Category',    emoji: <img src="/src/assets/icons/content-folder.png" alt="Category" className="tab-icon" /> },
  { key: 'ingredients', label: 'By Ingredients', emoji: <img src="/src/assets/icons/calc-spoon.png" alt="Ingredients" className="tab-icon" /> },
  { key: 'advanced',    label: 'Smart Search',   emoji: <img src="/src/assets/icons/ai-crystal-ball.png" alt="Advanced" className="tab-icon" /> },
];

export default function SearchPage() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { mode, nameInput, categoryInput, ingredientList, activeResultTab } = useAppSelector((s) => s.search);

  const [activeTab, setActiveTab] = useState<SearchMode>(mode);
  const [ingredientInput, setIngredientInput] = useState('');
  const [alternativeResults, setAlternativeResults] = useState<{
    recipe: Recipe;
    matchedVia: { original: string; alternative: string }[];
  }[]>([]);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);

  const { data: allConversions = [] } = useGetAllConversionsQuery();

  const conversionsRef = useRef(allConversions);
  useEffect(() => { conversionsRef.current = allConversions; }, [allConversions]);

  const debouncedName = useDebounce(nameInput, 400);

  const { data: allRecipes = [], isLoading: loadingAll } = useGetRecipesQuery(undefined, { skip: mode !== 'name' });
  const { data: categoryResults = [], isLoading: loadingCat } = useGetRecipesByCategoryQuery(
    categoryInput as string,
    { skip: mode !== 'category' || !categoryInput }
  );
  const { data: ingredientResults = [], isLoading: loadingIng } = useSearchByIngredientsQuery(
    ingredientList,
    { skip: mode !== 'ingredients' || ingredientList.length === 0 }
  );
  const { data: allRecipesForAlt = [] } = useGetRecipesQuery(undefined, { skip: mode !== 'ingredients' });

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

      const conversions = conversionsRef.current;

      const altMap: Record<string, string[]> = {};
      for (const ing of ingredientList) {
        const alts = getAlternativesForIngredient(ing, conversions);
        altMap[ing] = alts.map((a) => a.alternativeName.toLowerCase());
      }

      const matched: typeof alternativeResults = [];
      for (const recipe of allRecipesForAlt) {
        const recipeIngs = recipe.ingredients?.map((i) => (i.ingredientName ?? '').toLowerCase()) ?? [];
        const matchedVia: { original: string; alternative: string }[] = [];
        let allMatched = true;

        for (const ing of ingredientList) {
          const ingLower = ing.toLowerCase();
          if (recipeIngs.some((ri) => ri.includes(ingLower))) continue;

          const alt = (altMap[ing] ?? []).find((a) => recipeIngs.some((ri) => ri.includes(a)));
          if (alt) {
            matchedVia.push({ original: ing, alternative: alt });
          } else {
            allMatched = false;
            break;
          }
        }

        if (allMatched && matchedVia.length > 0) matched.push({ recipe, matchedVia });
      }

      setAlternativeResults(matched);
      setLoadingAlternatives(false);
      if (matched.length > 0) dispatch(setActiveResultTab('alternatives'));
    };

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredientResults, ingredientList, loadingIng, mode]);

  const nameResults: Recipe[] = debouncedName
    ? allRecipes.filter((r) => r.name.toLowerCase().includes(debouncedName.toLowerCase()))
    : [];

  const results =
    mode === 'name'        ? nameResults :
    mode === 'category'    ? categoryResults :
    ingredientResults;

  const hasSearched =
    (mode === 'name'        && debouncedName.length > 0) ||
    (mode === 'category'    && !!categoryInput) ||
    (mode === 'ingredients' && ingredientList.length > 0);

  const handleSetMode = (newMode: SearchMode) => {
    setActiveTab(newMode);
    if (newMode !== 'advanced') {
      dispatch(setMode(newMode as BaseSearchMode));
    }
    dispatch(setSearchTerm(''));
    dispatch(setSelectedCategory(null));
    setIngredientInput('');
    setAlternativeResults([]);
  };

  const handleAddIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (!trimmed) return;
    dispatch(addIngredient(trimmed));
    dispatch(setSearchTerm([...ingredientList, trimmed].join(', ')));
    dispatch(setActiveResultTab('results'));
    setIngredientInput('');
  };

  const handleRemoveIngredient = (ing: string) => {
    dispatch(removeIngredient(ing));
    dispatch(setSearchTerm(ingredientList.filter((i) => i !== ing).join(', ')));
  };

  const handleClearIngredients = () => {
    dispatch(clearIngredients());
    dispatch(setSearchTerm(''));
    setAlternativeResults([]);
    dispatch(setActiveResultTab('results'));
  };

  return (
    <div className="search-page">
      <header className="search-header">
        <div className="search-header-inner">
          <div className="header-eyebrow">✦ Find Your Recipe</div>
          <h1>Search <span>Recipes</span> 🔍</h1>
          <p>
            {activeTab === 'advanced'
              ? 'Describe what you want in plain English — let AI do the rest'
              : 'Find the perfect dessert by name, category, or ingredients'}
          </p>
        </div>
      </header>

      <div className="search-body">
        <div className="search-tabs">
          {TABS.map(({ key, label, emoji }) => (
            <button
              key={key}
              onClick={() => handleSetMode(key)}
              className={`search-tab ${activeTab === key ? 'active' : ''} ${key === 'advanced' ? 'ai' : ''}`}
            >
              {emoji} {label}
            </button>
          ))}
        </div>

        {activeTab === 'advanced' ? (
          <AdvancedSearch />
        ) : (
          <>
            <div className="search-input-card">
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
                  onCategoryChange={(cat) => {
                    dispatch(setCategoryInput(cat));
                    dispatch(setSelectedCategory(cat || null));
                  }}
                  ingredientInput={ingredientInput}
                  onIngredientInputChange={setIngredientInput}
                  ingredientList={ingredientList}
                  onAddIngredient={handleAddIngredient}
                  onRemoveIngredient={handleRemoveIngredient}
                  onClearIngredients={handleClearIngredients}
                />
              )}
            </div>

            <SearchResults
              mode={mode}
              results={results}
              loading={loadingAll || loadingCat || loadingIng}
              hasSearched={hasSearched}
              isAuthenticated={isAuthenticated}
              alternativeResults={alternativeResults}
              loadingAlternatives={loadingAlternatives}
              activeResultTab={activeResultTab}
              onTabChange={(tab) => dispatch(setActiveResultTab(tab))}
              ingredientList={ingredientList}
              allConversions={allConversions}
            />
          </>
        )}
      </div>
    </div>
  );
}