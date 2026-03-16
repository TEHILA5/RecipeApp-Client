import { useState } from 'react';
import { useAnalyzeAndSearchQuery } from '../../recipe/redux/recipeSlice';
import RecipeCard from '../../recipe/components/RecipeCard'; 

export default function AdvancedSearch() {
  const [inputText, setInputText] = useState('');
  const [submittedText, setSubmittedText] = useState('');

  const { data, isLoading, isError } = useAnalyzeAndSearchQuery(submittedText, {
    skip: !submittedText,
  });

  const handleSearch = () => {
    const trimmed = inputText.trim();
    if (trimmed) setSubmittedText(trimmed);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fdf2f8',
      paddingTop: 'var(--nav-height, 70px)', fontFamily: "'Nunito', sans-serif" }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(232,121,154,0.08), rgba(232,196,154,0.08))',
        padding: '48px 24px 36px', borderBottom: '2px solid rgba(232,121,154,0.1)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#d4547a',
            letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>
            ✦ NLP-Powered Search
          </div>
          <h1 style={{ fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: '#1f2937', marginBottom: '10px' }}>
            Advanced <span style={{ color: '#d4547a' }}>Search</span> 🤖
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', fontWeight: 500 }}>
            Describe what you're looking for in plain English
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Input */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px',
          boxShadow: '0 4px 20px rgba(212,84,122,0.07)', marginBottom: '28px' }}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSearch()}
            placeholder='Try: "I want a light and festive chocolate cake"'
            rows={3}
            style={{ width: '100%', border: '2px solid rgba(212,84,122,0.2)', borderRadius: '12px',
              padding: '14px 16px', fontFamily: "'Nunito', sans-serif", fontSize: '1rem',
              resize: 'none', outline: 'none', color: '#374151', boxSizing: 'border-box' }}
          />
          <button onClick={handleSearch} disabled={!inputText.trim() || isLoading}
            style={{ marginTop: '12px', width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #d4547a, #e8779a)',
              color: 'white', border: 'none', borderRadius: '12px',
              fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '1rem',
              cursor: inputText.trim() ? 'pointer' : 'not-allowed',
              opacity: !inputText.trim() || isLoading ? 0.6 : 1 }}>
            {isLoading ? '🔍 Analyzing...' : '✨ Search'}
          </button>
        </div>

        {/* Intent Badge */}
        {data?.intent && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '16px 20px',
            marginBottom: '24px', boxShadow: '0 2px 12px rgba(212,84,122,0.07)',
            display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', marginRight: '4px' }}>Detected:</span>
            {data.intent.category && (
              <Chip label={`📂 ${data.intent.category}`} color="#e8f4fd" textColor="#1d6fa4" />
            )}
            {data.intent.difficultyLevel && (
              <Chip label={`⭐ ${{ 1: 'Easy', 2: 'Medium', 3: 'Hard' }[data.intent.difficultyLevel]}`}
                color="#f0fdf4" textColor="#16a34a" />
            )}
            {data.intent.maxPrepTime && (
              <Chip label={`⏱ Max ${data.intent.maxPrepTime} min`} color="#fff7ed" textColor="#c2410c" />
            )}
            {data.intent.tags.map((tag) => (
              <Chip key={tag} label={`🏷 ${tag}`} color="#fdf2f8" textColor="#d4547a" />
            ))}
          </div>
        )}

        {/* Results */}
        {isError && (
          <p style={{ textAlign: 'center', color: '#ef4444' }}>Something went wrong. Try again.</p>
        )}
        {data && data.results.length === 0 && !isLoading && (
          <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '32px' }}>
            No recipes found for "{submittedText}" 😔
          </p>
        )}
        {data && data.results.length > 0 && (
          <>
            <p style={{ color: '#9ca3af', fontSize: '0.88rem', marginBottom: '16px' }}>
              {data.results.length} recipe{data.results.length !== 1 ? 's' : ''} found
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
              {data.results.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Helper Component ──
function Chip({ label, color, textColor }: { label: string; color: string; textColor: string }) {
  return (
    <span style={{ background: color, color: textColor, padding: '4px 12px',
      borderRadius: '999px', fontSize: '0.82rem', fontWeight: 700 }}>
      {label}
    </span>
  );
}