// ===============================================
// IngredientForm - Inline edit/create row
// ===============================================
import { useState } from 'react';

interface IngredientFormProps {
  initialName?: string;
  onSave: (name: string) => Promise<void>;
  onCancel: () => void;
  saving?: boolean;
  placeholder?: string;
}

export default function IngredientForm({
  initialName = '',
  onSave,
  onCancel,
  saving = false,
  placeholder = 'Ingredient name...',
}: IngredientFormProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!name.trim()) { setError('Name is required'); return; }
    setError('');
    await onSave(name.trim());
  };

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', width: '100%' }}>
      <div style={{ flex: 1 }}>
        <input
          autoFocus
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') onCancel();
          }}
          placeholder={placeholder}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: '10px',
            border: `2px solid ${error ? '#ef4444' : '#fce7f3'}`,
            fontFamily: "'Nunito',sans-serif", fontSize: '0.9rem',
            boxSizing: 'border-box', outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />
        {error && <p style={{ color: '#ef4444', fontSize: '0.78rem', margin: '4px 0 0' }}>{error}</p>}
      </div>

      <button
        onClick={handleSave}
        disabled={saving || !name.trim()}
        style={{
          padding: '10px 20px', borderRadius: '999px', border: 'none',
          background: saving || !name.trim() ? '#e5e7eb' : 'linear-gradient(135deg, #e8799a, #d4547a)',
          color: saving || !name.trim() ? '#9ca3af' : 'white',
          fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.85rem',
          cursor: saving || !name.trim() ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap', transition: 'all 0.2s',
          boxShadow: saving || !name.trim() ? 'none' : '0 3px 10px rgba(212,84,122,0.3)',
        }}
      >
        {saving ? '...' : '✓ Save'}
      </button>

      <button
        onClick={onCancel}
        style={{
          padding: '10px 16px', borderRadius: '999px',
          border: '2px solid #e5e7eb', background: 'white',
          color: '#6b7280', fontFamily: "'Nunito',sans-serif",
          fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Cancel
      </button>
    </div>
  );
}
