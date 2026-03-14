// ===============================================
// SearchResults - תצוגת תוצאות חיפוש + חלופות
// ===============================================
import { Link } from 'react-router-dom';
import { type Recipe, CATEGORY_EMOJIS, LEVEL_LABELS } from '../../recipe/types/recipe.types';
import { type ConversionDto } from '../../../api/conversionApi';
import StarRating from '../../../shared/components/StarRating';

type SearchMode = 'name' | 'category' | 'ingredients';

interface SearchResultsProps {
  mode: SearchMode;
  results: Recipe[];
  loading: boolean;
  hasSearched: boolean;
  isAuthenticated: boolean;
  // Alternatives
  alternativeResults: { recipe: Recipe; matchedVia: { original: string; alternative: string }[] }[];
  loadingAlternatives: boolean;
  activeResultTab: 'results' | 'alternatives';
  onTabChange: (tab: 'results' | 'alternatives') => void;
  ingredientList: string[];
  allConversions: ConversionDto[];
}

function RecipeCardMini({ recipe }: { recipe: Recipe }) {
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
}

export default function SearchResults({
  mode, results, loading, hasSearched, isAuthenticated,
  alternativeResults, loadingAlternatives, activeResultTab, onTabChange,
  ingredientList, allConversions,
}: SearchResultsProps) {

  if (loading && hasSearched) return (
    <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #fce7f3', borderTopColor: '#d4547a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      Searching...
    </div>
  );

  // Empty state
  if (!hasSearched) return (
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
  );

  // Ingredients mode with alternatives
  if (mode === 'ingredients' && (results.length > 0 || alternativeResults.length > 0)) return (
    <>
      <div style={{ display: 'flex', gap: '4px', background: '#f3e8ef', borderRadius: '999px', padding: '4px', marginBottom: '20px' }}>
        <button onClick={() => onTabChange('results')} style={{ flex: 1, padding: '10px 16px', borderRadius: '999px', border: 'none', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s', background: activeResultTab === 'results' ? 'white' : 'transparent', color: activeResultTab === 'results' ? '#d4547a' : '#9ca3af', boxShadow: activeResultTab === 'results' ? '0 2px 10px rgba(212,84,122,0.12)' : 'none' }}>
          🔍 Results ({results.length})
        </button>
        <button onClick={() => onTabChange('alternatives')} style={{ flex: 1, padding: '10px 16px', borderRadius: '999px', border: 'none', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s', background: activeResultTab === 'alternatives' ? 'white' : 'transparent', color: activeResultTab === 'alternatives' ? '#c4894a' : '#9ca3af', boxShadow: activeResultTab === 'alternatives' ? '0 2px 10px rgba(196,137,74,0.12)' : 'none' }}>
          🔄 Alternatives ({loadingAlternatives ? '...' : alternativeResults.length})
        </button>
      </div>

      {activeResultTab === 'results' && (
        results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: 'white', borderRadius: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍰</div>
            <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.6rem', color: '#d4547a', marginBottom: '8px' }}>No exact matches</h3>
            <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
              {alternativeResults.length > 0 ? '✨ But we found recipes using ingredient alternatives!' : 'Try different ingredients'}
            </p>
            {alternativeResults.length > 0 && (
              <button onClick={() => onTabChange('alternatives')} style={{ padding: '10px 24px', borderRadius: '999px', border: 'none', background: 'linear-gradient(135deg, #e8c49a, #c4894a)', color: 'white', fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: 'pointer' }}>
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
              <p style={{ color: '#9ca3af' }}>No alternatives found</p>
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
                          <span key={original} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 14px', borderRadius: '999px', background: 'rgba(196,137,74,0.1)', border: '1.5px solid rgba(196,137,74,0.3)', fontSize: '0.78rem', fontWeight: 700, color: '#92400e' }}>
                            <span style={{ textDecoration: 'line-through', opacity: 0.55 }}>{original}</span>
                            <span style={{ opacity: 0.5 }}>→</span>
                            <span style={{ color: '#c4894a' }}>{alternative}</span>
                            {ratio !== null && (
                              <><span style={{ opacity: 0.35 }}>•</span><span style={{ background: 'rgba(196,137,74,0.15)', borderRadius: '6px', padding: '1px 6px', fontSize: '0.72rem', color: '#92400e' }}>×{ratio}</span></>
                            )}
                            {exactAmount !== null && (
                              <><span style={{ opacity: 0.35 }}>•</span><span style={{ background: 'rgba(196,137,74,0.2)', borderRadius: '6px', padding: '1px 8px', fontSize: '0.72rem', color: '#78350f', fontWeight: 800 }}>
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

  // No results - ingredients
  if (mode === 'ingredients' && results.length === 0 && alternativeResults.length === 0 && !loadingAlternatives) return (
    <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '20px' }}>
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>🍰</div>
      <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.8rem', color: '#d4547a' }}>No recipes found</h3>
      <p style={{ color: '#9ca3af' }}>No recipes or alternatives found for these ingredients</p>
    </div>
  );

  // Name / Category results
  if (mode !== 'ingredients') return (
    results.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '20px' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🍰</div>
        <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.8rem', color: '#d4547a' }}>No recipes found</h3>
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
  );

  return null;
}
