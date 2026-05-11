import { Link } from 'react-router-dom';
import { type Recipe, CATEGORY_IMAGES, LEVEL_LABELS } from '../../recipe/types/recipe.types';
import { type ConversionDto } from '../../../api/adminApi';
import StarRating from '../../../shared/components/StarRating';
import Button from '../../../shared/components/UI/Button';
import './SearchResults.css';

type SearchMode = 'name' | 'category' | 'ingredients';
type ResultTab = 'results' | 'alternatives';

interface SearchResultsProps {
  mode: SearchMode;
  results: Recipe[];
  loading: boolean;
  hasSearched: boolean;
  isAuthenticated: boolean;
  alternativeResults: { recipe: Recipe; matchedVia: { original: string; alternative: string }[] }[];
  loadingAlternatives: boolean;
  activeResultTab: ResultTab;
  onTabChange: (tab: ResultTab) => void;
  ingredientList: string[];
  allConversions: ConversionDto[];
}

function RecipeCardMini({ recipe }: { recipe: Recipe }) {
  const img = CATEGORY_IMAGES[recipe.category];
  const level = LEVEL_LABELS[recipe.level as 1 | 2 | 3] ?? 'Easy';
  const levelIcon = recipe.level === 2
    ? '/src/assets/icons/meta-level-medium.png'
    : recipe.level === 3
      ? '/src/assets/icons/meta-level-hard.png'
      : '/src/assets/icons/meta-level-easy.png';
  const levelAlt = recipe.level === 2 ? 'Medium' : recipe.level === 3 ? 'Hard' : 'Easy';
  const desc = recipe.description.length > 80
    ? `${recipe.description.substring(0, 80)}...`
    : recipe.description;

  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe-card-mini">
      <div className="mini-img">
        {recipe.arrImage
          ? <img src={recipe.arrImage} alt={recipe.name} />
          : img
            ? <img src={img} alt={recipe.category} style={{ width: '30px', height: '30px', objectFit: 'contain', verticalAlign: 'middle' }}/>
            : <div className="mini-img-fallback">🍰</div>
        }
      </div>
      <div className="mini-body">
        <StarRating rating={recipe.averageRating} showCount={recipe.commentCount} />
        <h3>{recipe.name}</h3>
        <p>{desc}</p>
        <div className="mini-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', }}><img src="/src/assets/icons/meta-time.png" alt="Time" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} /> {recipe.totalTime}m</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', }}><img src={levelIcon} alt={levelAlt} style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} /> {level}</span>
          <span className="mini-category">{recipe.category}</span>
        </div>
      </div>
    </Link>
  );
}

function ResultsGrid({ results }: { results: Recipe[] }) {
  return (
    <div className="results-grid">
      {results.map((r) => <RecipeCardMini key={r.id} recipe={r} />)}
    </div>
  );
}

function ResultCount({ count, color }: { count: number; color?: string }) {
  return (
    <p className="result-count">
      Found <span style={{ color: color ?? '#d4547a' }}>{count}</span> recipe{count !== 1 ? 's' : ''}
    </p>
  );
}

function EmptyState({ emoji, title, subtitle, action }: {
  emoji: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-emoji">{emoji}</div>
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
      {action}
    </div>
  );
}

export default function SearchResults({
  mode, results, loading, hasSearched, isAuthenticated,
  alternativeResults, loadingAlternatives, activeResultTab, onTabChange,
  ingredientList, allConversions,
}: SearchResultsProps) {

  if (loading && hasSearched) return (
    <div className="search-loading">
      <div className="spinner" />
      Searching...
    </div>
  );

  if (!hasSearched) return (
    <EmptyState
      emoji={mode === 'name' ? 
        <img src="/src/assets/icons/search-icon.png" alt="Search" style={{ width: '30px', height: '30px', objectFit: 'contain', verticalAlign: 'middle', placeSelf: 'center' }} />
        : mode === 'category' ? 
        <img src="/src/assets/icons/content-folder.png" alt="Category" style={{ width: '30px', height: '30px', objectFit: 'contain', verticalAlign: 'middle', placeSelf: 'center' }} />
        : <img src="/src/assets/icons/calc-spoon.png" alt="Ingredient" style={{ width: '30px', height: '30px', objectFit: 'contain', verticalAlign: 'middle', placeSelf: 'center' }} />}
      title={mode === 'name' ? 'Type to search...' : mode === 'category' ? 'Select a category' : 'Add ingredients'}
      subtitle={
        mode === 'name' ? 'Start typing to find your favorite dessert' :
        mode === 'category' ? 'Choose a category to browse recipes' :
        'Add ingredients one by one and press + Add after each one'
      }
      action={!isAuthenticated && (
        <p className="sign-in-prompt">
          <Link to="/login">Sign in</Link> to get personalized recommendations
        </p>
      )}
    />
  );

  if (mode === 'ingredients' && results.length === 0 && alternativeResults.length === 0 && !loadingAlternatives) return (
    <EmptyState emoji="🍰" title="No recipes found" subtitle="No recipes or alternatives found for these ingredients" />
  );

  if (mode === 'ingredients' && (results.length > 0 || alternativeResults.length > 0)) return (
    <>
      <div className="result-tabs">
        <button
          onClick={() => onTabChange('results')}
          className={`tab-btn ${activeResultTab === 'results' ? 'active' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '4px', }}> 
          <img src="/src/assets/icons/search-icon.png" alt="" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} />
          {' '}Results
          ({results.length})
        </button>
        <button
          onClick={() => onTabChange('alternatives')}
          className={`tab-btn alt ${activeResultTab === 'alternatives' ? 'active' : ''}`}
        style={{ display: 'flex', alignItems: 'center', gap: '4px', }}> 
          <img src="/src/assets/icons/action-refresh.png" alt="" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} />
          {' '}Alternatives 
          ({loadingAlternatives ? '...' : alternativeResults.length})
        </button>
      </div>

      {activeResultTab === 'results' && (
        results.length === 0 ? (
          <EmptyState
            emoji="🍰"
            title="No exact matches"
            subtitle={alternativeResults.length > 0 ? ' But we found recipes using ingredient alternatives!' : 'Try different ingredients'}
            action={alternativeResults.length > 0 && (
              <Button onClick={() => onTabChange('alternatives')} style={{ background: 'linear-gradient(135deg, #e8c49a, #c4894a)',display: 'flex', alignItems: 'center', gap: '4px', }}>
                <img src="/src/assets/icons/action-refresh.png" alt="" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} />
                {' '} See Alternatives
              </Button>
            )}
          />
        ) : (
          <>
            <ResultCount count={results.length} />
            <ResultsGrid results={results} />
          </>
        )
      )}

      {activeResultTab === 'alternatives' && (
        <div>
          <div className="alt-banner">
            <span>
              <img src="/src/assets/icons/action-refresh.png" alt="Info" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} />
            </span>
            <div>
              <p>Showing recipes with ingredient alternatives</p>
              <p>Substitutes for: <strong>{ingredientList.join(', ')}</strong></p>
            </div>
          </div>

          {loadingAlternatives ? (
            <div className="search-loading">
              <div className="spinner alt" />
              Looking for alternatives...
            </div>
          ) : alternativeResults.length === 0 ? (
            <EmptyState  emoji={<div style={{ display: 'flex', alignItems: 'center', gap: '4px',placeSelf: 'center' }}><img src="/src/assets/icons/page-about.png" alt="Info" style={{ width: '50px', height: '50px', objectFit: 'contain', verticalAlign: 'middle' }} /></div>} title="No alternatives found" />
          ) : (
            <>
              <ResultCount count={alternativeResults.length} color="#c4894a" />
              <div className="alt-results">
                {alternativeResults.map(({ recipe, matchedVia }) => (
                  <div key={recipe.id}>
                    <div className="match-tags">
                      {matchedVia.map(({ original, alternative }) => {
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
                        const recipeIng = recipe.ingredients?.find((i) =>
                          (i.ingredientName ?? '').toLowerCase().includes(alternative.toLowerCase())
                        );
                        const exactAmount = recipeIng && ratio !== null
                          ? +((recipeIng.quantity ?? 1) * (1 / (ratio as number))).toFixed(3)
                          : null;
                        const unit = recipeIng?.unit ?? '';

                        return (
                          <span key={original} className="match-tag">
                            <span className="crossed">{original}</span>
                            <span className="arrow">→</span>
                            <span className="alt-name">{alternative}</span>
                            {ratio !== null && (
                              <><span className="dot">•</span><span className="ratio-badge">×{ratio}</span></>
                            )}
                            {exactAmount !== null && (
                              <><span className="dot">•</span><span className="amount-badge">
                                {recipeIng!.quantity}{unit ? ' ' + unit : ''} {alternative} = {exactAmount}{unit ? ' ' + unit : ''} {original}
                              </span></>
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
  );

  if (mode !== 'ingredients') return (
    results.length === 0 ? (
      <EmptyState emoji={<img src="/src/assets/icons/page-about.png" alt="Info" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} />} title="No recipes found" subtitle="Try a different search term or category" />
    ) : (
      <>
        <ResultCount count={results.length} />
        <ResultsGrid results={results} />
      </>
    )
  );

  return null;
}
