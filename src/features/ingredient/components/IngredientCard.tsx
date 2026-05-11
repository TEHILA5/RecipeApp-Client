import { useState } from 'react';
import IngredientForm from './IngredientForm';
import './IngredientCard.css';

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
      <div className="ingredient-card editing">
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
    <div className="ingredient-card">
      <div className="ingredient-name">
        <span>
          <img src="/src/assets/icons/calc-spoon.png" alt="" style={{ width: '30px', height: '30px', objectFit: 'contain', verticalAlign: 'middle' }} />
        </span>
        <span>{name}</span>
      </div>
      <button className="edit-btn" onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px', }}> 
        <img src="/src/assets/icons/profile-edit.png" alt="" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} />
        {' '}Edit  
      </button>
    </div>
  );
}
