// ===============================================
// ConversionsPage - דף ציבורי לצפייה בהמרות
// ===============================================
import { useState, useEffect, useMemo } from 'react';
import { getAllConversions, type ConversionDto } from '../../../api/conversionApi';
import Loading from '../../../shared/components/UI/Loading';

export default function ConversionsPage() {
  const [conversions, setConversions] = useState<ConversionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [calcFrom, setCalcFrom] = useState('');
  const [calcAmount, setCalcAmount] = useState('');

  useEffect(() => {
    getAllConversions()
      .then(setConversions)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return conversions.filter(
      (c) =>
        c.ingredient1Name?.toLowerCase().includes(q) ||
        c.ingredient2Name?.toLowerCase().includes(q)
    );
  }, [conversions, search]);

  // ── Calculator: מציאת כל ההמרות עבור מרכיב נבחר ──
  const calcResults = useMemo(() => {
    if (!calcFrom.trim() || !calcAmount) return [];
    const amount = parseFloat(calcAmount);
    if (!amount || amount <= 0) return [];

    const name = calcFrom.toLowerCase();
    const results: { to: string; amount: number; ratio: number; bidirectional: boolean }[] = [];

    for (const conv of conversions) {
      const n1 = conv.ingredient1Name?.toLowerCase();
      const n2 = conv.ingredient2Name?.toLowerCase();
      const ratio = conv.conversionRatio ?? 1;

      if (n1 === name) {
        results.push({ to: conv.ingredient2Name, amount: +(amount * ratio).toFixed(3), ratio, bidirectional: !!conv.isBidirectional });
      } else if (n2 === name && conv.isBidirectional) {
        const invRatio = ratio !== 0 ? 1 / ratio : 1;
        results.push({ to: conv.ingredient1Name, amount: +(amount * invRatio).toFixed(3), ratio: +invRatio.toFixed(4), bidirectional: true });
      }
    }

    return results;
  }, [calcFrom, calcAmount, conversions]);

  // רשימת שמות מרכיבים ייחודיים לdatalist
  const ingredientNames = useMemo(() => {
    const names = new Set<string>();
    conversions.forEach((c) => {
      if (c.ingredient1Name) names.add(c.ingredient1Name);
      if (c.ingredient2Name) names.add(c.ingredient2Name);
    });
    return Array.from(names).sort();
  }, [conversions]);

  return (
    <div style={{ minHeight: '100vh', background: '#fdf2f8', paddingTop: 'var(--nav-height, 70px)', fontFamily: "'Nunito', sans-serif" }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(167,139,250,0.08))', padding: '48px 24px 36px', borderBottom: '2px solid rgba(124,58,237,0.1)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7c3aed', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>✦ Ingredient Conversions</div>
          <h1 style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: '#1f2937', marginBottom: '10px', lineHeight: 1.1 }}>
            Substitution <span style={{ color: '#7c3aed' }}>Guide</span> 🔄
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', fontWeight: 500 }}>
            Find ingredient substitutes and calculate exact amounts
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Calculator ── */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 4px 24px rgba(124,58,237,0.1)', border: '2px solid #ede9fe', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.6rem', color: '#7c3aed', marginBottom: '6px' }}>
            🧮 Quick Calculator
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '20px' }}>
            Enter an ingredient and amount to see all its substitutes
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <div style={{ flex: '1 1 80px', minWidth: '80px', maxWidth: '120px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>Amount</label>
              <input
                type="number" min="0.01" step="0.1" value={calcAmount}
                onChange={(e) => setCalcAmount(e.target.value)}
                placeholder="1.5"
                style={{ width: '100%', padding: '11px 14px', border: '2px solid #ede9fe', borderRadius: '12px', fontFamily: "'Nunito',sans-serif", fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#7c3aed')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#ede9fe')}
              />
            </div>
            <div style={{ flex: '2 1 200px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>Ingredient</label>
              <input
                type="text" list="ingredient-names" value={calcFrom}
                onChange={(e) => setCalcFrom(e.target.value)}
                placeholder="e.g. honey, butter, sugar..."
                style={{ width: '100%', padding: '11px 14px', border: '2px solid #ede9fe', borderRadius: '12px', fontFamily: "'Nunito',sans-serif", fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#7c3aed')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#ede9fe')}
              />
              <datalist id="ingredient-names">
                {ingredientNames.map((n) => <option key={n} value={n} />)}
              </datalist>
            </div>
          </div>

          {/* Calculator Results */}
          {calcFrom && calcAmount && calcResults.length === 0 && (
            <div style={{ padding: '16px', background: '#f5f3ff', borderRadius: '12px', color: '#7c3aed', fontSize: '0.88rem', fontWeight: 600 }}>
              😔 No conversions found for "{calcFrom}"
            </div>
          )}

          {calcResults.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {calcResults.map(({ to, amount, ratio }) => (
                <div key={to} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#f5f3ff', borderRadius: '14px', border: '1.5px solid #ede9fe' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.3rem' }}>🔄</span>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1f2937' }}>{calcAmount} </span>
                      <span style={{ fontWeight: 600, color: '#7c3aed' }}>{calcFrom}</span>
                      <span style={{ color: '#9ca3af', margin: '0 8px' }}>→</span>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1f2937' }}>{amount} </span>
                      <span style={{ fontWeight: 600, color: '#7c3aed' }}>{to}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af', background: 'white', padding: '3px 10px', borderRadius: '8px', border: '1px solid #ede9fe' }}>
                    ×{ratio}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Conversion Table ── */}
        <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 4px 20px rgba(124,58,237,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '2px solid #f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.5rem', color: '#7c3aed' }}>
              All Conversions ({conversions.length})
            </h2>
            <div style={{ position: 'relative' }}>
              <input
                type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ingredient..."
                style={{ padding: '9px 36px 9px 14px', border: '2px solid #ede9fe', borderRadius: '999px', fontFamily: "'Nunito',sans-serif", fontSize: '0.85rem', outline: 'none', width: '200px' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#7c3aed')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#ede9fe')}
              />
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>🔍</span>
            </div>
          </div>

          {loading ? (
            <Loading message="Loading..." color="#7c3aed" />
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔄</div>
              <p style={{ fontWeight: 600 }}>{search ? 'No results found' : 'No conversions available yet'}</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f3ff' }}>
                    {['Ingredient', '', 'Substitute', 'Ratio', 'Direction'].map((h) => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((conv, idx) => (
                    <tr key={conv.id} style={{ borderTop: '1px solid #f5f3ff', background: idx % 2 === 0 ? 'white' : '#faf8ff', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f3ff')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? 'white' : '#faf8ff')}
                    >
                      <td style={{ padding: '16px 20px', fontWeight: 700, color: '#1f2937', fontSize: '0.95rem' }}>
                        {conv.ingredient1Name}
                      </td>
                      <td style={{ padding: '16px 8px', color: '#7c3aed', fontWeight: 700, fontSize: '1.2rem' }}>
                        {conv.isBidirectional ? '↔' : '→'}
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: 700, color: '#1f2937', fontSize: '0.95rem' }}>
                        {conv.ingredient2Name}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#4b5563', background: '#f3f4f6', padding: '4px 12px', borderRadius: '8px', fontSize: '0.9rem' }}>
                          ×{conv.conversionRatio}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, padding: '4px 12px', borderRadius: '999px', background: conv.isBidirectional ? '#ede9fe' : '#f3f4f6', color: conv.isBidirectional ? '#7c3aed' : '#6b7280' }}>
                          {conv.isBidirectional ? '↔ Both ways' : '→ One-way'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
