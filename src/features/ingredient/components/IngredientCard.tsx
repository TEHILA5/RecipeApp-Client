// ===============================================
// IngredientCard - Single ingredient row
// ===============================================
import { useState } from 'react';
import IngredientForm from './IngredientForm';

interface IngredientCardProps {
  id: number;
  name: string;
  onUpdate: (id: number, name: string) => Promise<void>;
}

export default function IngredientCard({ id, name, onUpdate }: IngredientCardProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (newName: string) => {
    if (newName === name) { setEditing(false); return; }
    setSaving(true);
    try {
      await onUpdate(id, newName);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div style={{
        padding: '14px 18px', borderRadius: '14px',
        background: '#fdf2f8', border: '2px solid #e8799a',
      }}>
        <IngredientForm
          initialName={name}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
          saving={saving}
        />
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 18px', borderRadius: '14px',
      background: 'white', border: '1px solid #fce7f3',
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,84,122,0.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '1.1rem' }}>🧂</span>
        <span style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.95rem' }}>{name}</span>
      </div>

      <button
        onClick={() => setEditing(true)}
        style={{
          padding: '6px 16px', borderRadius: '999px',
          border: '2px solid #fce7f3', background: 'white',
          color: '#d4547a', fontFamily: "'Nunito',sans-serif",
          fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = '#fce7f3';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'white';
        }}
      >
        ✏️ Edit
      </button>
    </div>
  );
}
