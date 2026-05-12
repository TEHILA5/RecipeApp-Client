import { useState } from 'react';
import { useAnalyzeAndSearchQuery } from '../../recipe/redux/recipeSlice';
import RecipeCard from '../../recipe/components/RecipeCard';
import './AdvancedSearch.css';

const LEVEL_LABELS: Record<number, string> = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };

function Chip({ label, color, textColor }: { label: React.ReactNode; color: string; textColor: string }) {
  return (
    <span className="as-chip" style={{ background: color, color: textColor , display: 'flex', alignItems: 'center', gap: '4px',}}>{label}</span>
  );
}

export default function AdvancedSearch() {
  const [inputText, setInputText] = useState('');
  const [submittedText, setSubmittedText] = useState('');

  const { data, isLoading, isError } = useAnalyzeAndSearchQuery(submittedText, { skip: !submittedText });

  const handleSearch = () => {
    const trimmed = inputText.trim();
    if (trimmed) setSubmittedText(trimmed);
  };

  const canSearch = !!inputText.trim() && !isLoading;

  return (
    <div className="as-page">
      <div className="as-hero">
        <div className="as-hero-inner">
          <div className="as-eyebrow">✦ NLP-Powered Search</div>
          <h1 className="as-title" style={{ display: 'flex', alignItems: 'center', gap: '4px',placeSelf: 'center', }}>
            Advanced <span>Search</span> 
          <img src="/src/assets/icons/nav-sweetie.png" alt="Sparkle" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
          </h1>
          <p className="as-subtitle">Describe what you're looking for in plain English</p>
        </div>
      </div>

      <div className="as-content">
        <div className="as-input-card">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSearch()}
            placeholder='Try: "I want a light and festive chocolate cake"'
            rows={3}
            className="as-textarea"
          />
          <button onClick={handleSearch} disabled={!canSearch} className={`as-search-btn ${canSearch ? '' : 'as-search-btn--disabled'}`}>
            {isLoading ? 
             <div style={{ display: 'flex', alignItems: 'center', gap: '4px', }}>
             <img src="/src/assets/icons/search-icon.png" alt="" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} />
              {' '}Analyzing...
              </div>
             : <div style={{ display: 'flex', alignItems: 'center', gap: '4px', }}>
             <img src="/src/assets/icons/ai-sparkle.png" alt="" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} />
              {' '}Search
              </div>
             }
          </button>
        </div>

        {data?.intent && (
          <div className="as-intent">
            <span className="as-intent-label">Detected:</span>
            {data.intent.category && <Chip label={<> <img src="/src/assets/icons/content-folder.png" alt="Category" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} /> {' '} {data.intent.category} </>} color="#e8f4fd" textColor="#1d6fa4" />}
            {data.intent.difficultyLevel && <Chip label={<> <img src="/src/assets/icons/rank-star.png" alt="Difficulty" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} /> {' '} {LEVEL_LABELS[data.intent.difficultyLevel]} </>} color="#f0fdf4" textColor="#16a34a" />}
            {data.intent.maxPrepTime && <Chip label={<> <img src="/src/assets/icons/meta-time.png" alt="Prep Time" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} /> {' '} ⏱ Max {data.intent.maxPrepTime} min </>} color="#fff7ed" textColor="#c2410c" />}
            {data.intent.tags.map((tag) => <Chip key={tag} label={<> <img src="/src/assets/icons/recipe-bookmark.png" alt="Tag" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} /> {' '} 🏷 {tag} </>} color="#fdf2f8" textColor="#d4547a" />)}
          </div>
        )}

        {isError && <p className="as-error">Something went wrong. Try again.</p>}

        {data && data.results.length === 0 && !isLoading && (
          <p className="as-no-results" style={{ display: 'flex', alignItems: 'center', gap: '4px', }}>No recipes found for "{submittedText}" <img src="/src/assets/icons/state-empty.png" alt="Sad" style={{ width: '40px', height: '40px', objectFit: 'contain', verticalAlign: 'middle' }} /></p>
        )}

        {data && data.results.length > 0 && (
          <>
            <p className="as-count">
              {data.results.length} recipe{data.results.length !== 1 ? 's' : ''} found
            </p>
            <div className="as-ranked-list">
              {data.results.map(({ recipe, matchLabel, matchedCriteria, missedCriteria }) => (
                <div key={recipe.id} className="as-ranked-item">
                  <div className="as-match-header">
                    <span className="as-match-label">{matchLabel}</span>
                    <div className="as-criteria">
                      {matchedCriteria.map(c => (
                        <span key={c} className="as-criteria-hit">✔ {c}</span>
                      ))}
                      {missedCriteria.map(c => (
                        <span key={c} className="as-criteria-miss">✘ {c}</span>
                      ))}
                    </div>
                  </div>
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
