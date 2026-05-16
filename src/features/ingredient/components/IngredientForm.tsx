import { useState } from 'react';
import './IngredientForm.css';

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

  const canSave = !saving && !!name.trim();

  return (
    <div className="if-wrap">
      <div className="if-field">
        <input
          autoFocus
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') onCancel();
          }}
          placeholder={placeholder}
          className={`if-input ${error ? 'if-input--error' : ''}`}
        />
        {error && <p className="if-error">{error}</p>}
      </div>
      <button onClick={handleSave} disabled={!canSave} className={`if-btn if-btn--save ${canSave ? 'if-btn--save-active' : ''}`}>
        {saving ? '...' : '✓ Save'}
      </button>
      <button onClick={onCancel} className="if-btn if-btn--cancel">Cancel</button>
    </div>
  );
}