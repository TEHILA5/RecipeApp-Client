// ===============================================
// IngredientSearch - Filter bar
// ===============================================

interface IngredientSearchProps {
  value: string;
  onChange: (value: string) => void;
  total: number;
  filtered: number;
}

export default function IngredientSearch({ value, onChange, total, filtered }: IngredientSearchProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', flex: 1, maxWidth: '480px' }}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search ingredients..."
          style={{
            width: '100%', padding: '12px 44px 12px 18px',
            border: '2px solid #fce7f3', borderRadius: '999px',
            fontFamily: "'Nunito',sans-serif", fontSize: '0.92rem',
            background: 'white', outline: 'none', boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#d4547a')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#fce7f3')}
        />
        <span style={{
          position: 'absolute', right: '16px', top: '50%',
          transform: 'translateY(-50%)', fontSize: '1rem', pointerEvents: 'none',
        }}>🔍</span>
      </div>

      <span style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600, whiteSpace: 'nowrap' }}>
        {value ? `${filtered} of ${total}` : `${total} ingredients`}
      </span>

      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            padding: '8px 16px', borderRadius: '999px',
            border: '1.5px solid #fce7f3', background: 'white',
            color: '#d4547a', fontFamily: "'Nunito',sans-serif",
            fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
          }}
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}
