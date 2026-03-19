import { useState } from 'react';
import { useAnalyzeAndSearchQuery } from '../../recipe/redux/recipeSlice';
import RecipeCard from '../../recipe/components/RecipeCard';
import './AdvancedSearch.css';

const LEVEL_LABELS: Record<number, string> = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };

function Chip({ label, color, textColor }: { label: string; color: string; textColor: string }) {
  return (
    <span className="as-chip" style={{ background: color, color: textColor }}>{label}</span>
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
          <h1 className="as-title">Advanced <span>Search</span> 🤖</h1>
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
            {isLoading ? '🔍 Analyzing...' : '✨ Search'}
          </button>
        </div>

        {data?.intent && (
          <div className="as-intent">
            <span className="as-intent-label">Detected:</span>
            {data.intent.category && <Chip label={`📂 ${data.intent.category}`} color="#e8f4fd" textColor="#1d6fa4" />}
            {data.intent.difficultyLevel && <Chip label={`⭐ ${LEVEL_LABELS[data.intent.difficultyLevel]}`} color="#f0fdf4" textColor="#16a34a" />}
            {data.intent.maxPrepTime && <Chip label={`⏱ Max ${data.intent.maxPrepTime} min`} color="#fff7ed" textColor="#c2410c" />}
            {data.intent.tags.map((tag) => <Chip key={tag} label={`🏷 ${tag}`} color="#fdf2f8" textColor="#d4547a" />)}
          </div>
        )}

        {isError && <p className="as-error">Something went wrong. Try again.</p>}

        {data && data.results.length === 0 && !isLoading && (
          <p className="as-no-results">No recipes found for "{submittedText}" 😔</p>
        )}

        {data && data.results.length > 0 && (
          <>
            <p className="as-count">{data.results.length} recipe{data.results.length !== 1 ? 's' : ''} found</p>
            <div className="as-grid">
              {data.results.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
