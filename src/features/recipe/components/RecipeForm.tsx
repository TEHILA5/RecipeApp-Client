// ===============================================
// RecipeForm - Shared Create & Edit Form
// ===============================================
import { useState, useEffect } from 'react';
import type { RecipeCreateDto, RecipeUpdateDto, RecipeCategory, DifficultyLevel } from '../types/recipe.types';
import * as ingredientApi from '../../../api/ingredientApi';
import Modal from '../../../shared/components/UI/Modal';
import Button from '../../../shared/components/UI/Button';
import ErrorMessage from '../../../shared/components/UI/ErrorMessage';

interface IngredientOption { id: number; name: string; }

interface FormIngredient {
  ingredientId: number;
  ingredientName: string;
  quantity: number;
  unit: string;
  importance: 'Essential' | 'Recommended' | 'Optional';
}

interface RecipeFormData {
  name: string;
  description: string;
  category: RecipeCategory;
  instructions: string;
  arrImage: string;
  servings: number;
  level: DifficultyLevel;
  prepTime: number;
  totalTime: number;
  ingredients: FormIngredient[];
}

interface RecipeFormProps {
  initialData?: Partial<RecipeFormData>;
  onSubmit: (data: RecipeCreateDto | RecipeUpdateDto) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

const CATEGORIES: RecipeCategory[] = [
  'Sweats', 'Cakes', 'Cupcakes', 'Cheesecakes', 'BundtCakes',
  'Brownies', 'Cookies', 'Bars', 'IceCream', 'Mousse',
  'Puddings', 'Panna', 'Tiramisu', 'FrozenDesserts', 'Pies',
  'Tarts', 'Crumbles', 'FruitSalads', 'Pastries', 'Donuts',
  'Churros', 'Crepes', 'Waffles', 'NoBakeCakes', 'Truffles',
  'EnergyBalls', 'SoufleeAndCustard', 'MilkDesserts',
  'JellyAndGelatin', 'TraditionalDesserts',
];

const UNITS = ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'pieces', 'pinch', 'oz'];

const defaultForm: RecipeFormData = {
  name: '', description: '', category: 'Cakes', instructions: '',
  arrImage: '', servings: 4, level: 1, prepTime: 15, totalTime: 60, ingredients: [],
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: '12px',
  border: '2px solid #fce7f3', fontFamily: "'Nunito',sans-serif",
  fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
  background: 'white', color: '#1f2937', transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontWeight: 700, color: '#6b7280',
  fontSize: '0.8rem', letterSpacing: '0.07em',
  textTransform: 'uppercase', marginBottom: '6px',
};

export default function RecipeForm({ initialData, onSubmit, loading = false, submitLabel = 'Save Recipe' }: RecipeFormProps) {
  const [form, setForm] = useState<RecipeFormData>({ ...defaultForm, ...initialData });
  const [errors, setErrors] = useState<Partial<Record<keyof RecipeFormData, string>>>({});
  const [ingredientOptions, setIngredientOptions] = useState<IngredientOption[]>([]);
  const [showNewIngredientModal, setShowNewIngredientModal] = useState(false);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [savingNewIngredient, setSavingNewIngredient] = useState(false);
  const [newIngredientError, setNewIngredientError] = useState('');
  const [newIngredient, setNewIngredient] = useState<FormIngredient>({
    ingredientId: 0, ingredientName: '', quantity: 1, unit: 'g', importance: 'Essential',
  });

  useEffect(() => {
    ingredientApi.getAllIngredients()
      .then((data: IngredientOption[]) => setIngredientOptions(data))
      .catch(() => {});
  }, []);

  const set = (field: keyof RecipeFormData, value: unknown) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RecipeFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.instructions.trim()) newErrors.instructions = 'Instructions are required';
    if (form.servings < 1) newErrors.servings = 'Must be at least 1';
    if (form.prepTime < 1) newErrors.prepTime = 'Must be at least 1 minute';
    if (form.totalTime < form.prepTime) newErrors.totalTime = 'Total time must be ≥ prep time';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const dto: RecipeCreateDto = {
      name: form.name.trim(), description: form.description.trim(),
      category: form.category, instructions: form.instructions.trim(),
      arrImage: form.arrImage.trim(), servings: form.servings,
      level: form.level, prepTime: form.prepTime, totalTime: form.totalTime,
      ingredients: form.ingredients.map((ing) => ({
        ingredientId: ing.ingredientId, quantity: ing.quantity,
        unit: ing.unit, importance: ing.importance,
      })),
    };
    await onSubmit(dto);
  };

  const handleAddIngredient = () => {
    if (!newIngredient.ingredientId) return;
    setForm((f) => ({ ...f, ingredients: [...f.ingredients, { ...newIngredient }] }));
    setNewIngredient({ ingredientId: 0, ingredientName: '', quantity: 1, unit: 'g', importance: 'Essential' });
  };

  const handleRemoveIngredient = (index: number) => {
    setForm((f) => ({ ...f, ingredients: f.ingredients.filter((_, i) => i !== index) }));
  };

  const handleCreateNewIngredient = async () => {
    if (!newIngredientName.trim()) { setNewIngredientError('Ingredient name is required'); return; }
    setSavingNewIngredient(true);
    setNewIngredientError('');
    try {
      const created = await ingredientApi.createIngredient({ name: newIngredientName.trim() });
      setIngredientOptions((prev) => [...prev, { id: created.id, name: created.name }]);
      setNewIngredient((n) => ({ ...n, ingredientId: created.id, ingredientName: created.name }));
      setNewIngredientName('');
      setShowNewIngredientModal(false);
    } catch (err: unknown) {
      setNewIngredientError(err instanceof Error ? err.message : 'Failed to create ingredient');
    } finally { setSavingNewIngredient(false); }
  };

  const sectionStyle: React.CSSProperties = {
    background: 'white', borderRadius: '20px', padding: '24px 28px',
    boxShadow: '0 4px 20px rgba(212,84,122,0.07)', marginBottom: '20px',
  };

  const sectionTitle = (icon: string, title: string) => (
    <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.4rem', color: '#d4547a', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      {icon} {title}
    </h3>
  );

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', fontFamily: "'Nunito',sans-serif" }}>

      {/* Basic Info */}
      <div style={sectionStyle}>
        {sectionTitle('📝', 'Basic Info')}
        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Recipe Name *</label>
            <input style={{ ...inputStyle, borderColor: errors.name ? '#ef4444' : '#fce7f3' }}
              value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Chocolate Lava Cake" />
            {errors.name && <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '4px 0 0' }}>{errors.name}</p>}
          </div>

          <div>
            <label style={labelStyle}>Description *</label>
            <textarea style={{ ...inputStyle, borderColor: errors.description ? '#ef4444' : '#fce7f3', resize: 'vertical' }}
              value={form.description} onChange={(e) => set('description', e.target.value)}
              rows={3} placeholder="A short, enticing description..." />
            {errors.description && <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '4px 0 0' }}>{errors.description}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Category *</label>
              <select style={inputStyle} value={form.category} onChange={(e) => set('category', e.target.value as RecipeCategory)}>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Difficulty *</label>
              <select style={inputStyle} value={form.level} onChange={(e) => set('level', Number(e.target.value) as DifficultyLevel)}>
                <option value={1}>Easy</option>
                <option value={2}>Medium</option>
                <option value={3}>Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Image URL</label>
            <input style={inputStyle} value={form.arrImage} onChange={(e) => set('arrImage', e.target.value)} placeholder="https://example.com/image.jpg" />
          </div>
        </div>
      </div>

      {/* Time & Servings */}
      <div style={sectionStyle}>
        {sectionTitle('⏱️', 'Time & Servings')}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: 'Prep Time (min) *', field: 'prepTime' as const, error: errors.prepTime },
            { label: 'Total Time (min) *', field: 'totalTime' as const, error: errors.totalTime },
            { label: 'Servings *', field: 'servings' as const, error: errors.servings },
          ].map(({ label, field, error }) => (
            <div key={field}>
              <label style={labelStyle}>{label}</label>
              <input type="number" min={1}
                style={{ ...inputStyle, borderColor: error ? '#ef4444' : '#fce7f3' }}
                value={form[field] as number}
                onChange={(e) => set(field, Number(e.target.value))} />
              {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '4px 0 0' }}>{error}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Ingredients */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          {sectionTitle('🧂', 'Ingredients')}
          <Button variant="outline" size="sm"
            onClick={() => { setShowNewIngredientModal(true); setNewIngredientError(''); setNewIngredientName(''); }}>
            ➕ New Ingredient
          </Button>
        </div>

        {form.ingredients.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {form.ingredients.map((ing, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', background: '#fdf2f8', borderRadius: '12px', border: '1px solid #fce7f3' }}>
                <span style={{ flex: 1, fontWeight: 600, color: '#1f2937' }}>{ing.ingredientName}</span>
                <span style={{ color: '#d4547a', fontWeight: 700 }}>{ing.quantity} {ing.unit}</span>
                <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{ing.importance}</span>
                <button onClick={() => handleRemoveIngredient(i)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '1.1rem' }}>×</button>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr auto', gap: '10px', alignItems: 'end' }}>
          <div>
            <label style={labelStyle}>Ingredient</label>
            <select style={inputStyle} value={newIngredient.ingredientId}
              onChange={(e) => {
                const id = Number(e.target.value);
                const found = ingredientOptions.find((o) => o.id === id);
                setNewIngredient((n) => ({ ...n, ingredientId: id, ingredientName: found?.name ?? '' }));
              }}>
              <option value={0}>Select...</option>
              {ingredientOptions.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Quantity</label>
            <input type="number" min={0} step={0.1} style={inputStyle} value={newIngredient.quantity}
              onChange={(e) => setNewIngredient((n) => ({ ...n, quantity: Number(e.target.value) }))} />
          </div>
          <div>
            <label style={labelStyle}>Unit</label>
            <select style={inputStyle} value={newIngredient.unit}
              onChange={(e) => setNewIngredient((n) => ({ ...n, unit: e.target.value }))}>
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Importance</label>
            <select style={inputStyle} value={newIngredient.importance}
              onChange={(e) => setNewIngredient((n) => ({ ...n, importance: e.target.value as FormIngredient['importance'] }))}>
              <option value="Essential">Essential</option>
              <option value="Recommended">Recommended</option>
              <option value="Optional">Optional</option>
            </select>
          </div>
          <Button onClick={handleAddIngredient} disabled={!newIngredient.ingredientId}>+ Add</Button>
        </div>
      </div>

      {/* Instructions */}
      <div style={sectionStyle}>
        {sectionTitle('📋', 'Instructions')}
        <label style={labelStyle}>Step-by-step instructions *</label>
        <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0 0 8px' }}>Write each step on a new line</p>
        <textarea
          style={{ ...inputStyle, borderColor: errors.instructions ? '#ef4444' : '#fce7f3', resize: 'vertical' }}
          value={form.instructions} onChange={(e) => set('instructions', e.target.value)}
          rows={8} placeholder={`Step 1: Preheat oven to 180°C\nStep 2: Mix flour and sugar\nStep 3: ...`} />
        {errors.instructions && <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '4px 0 0' }}>{errors.instructions}</p>}
      </div>

      {/* Submit */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '40px' }}>
        <Button onClick={handleSubmit} loading={loading} size="lg">
          ✨ {submitLabel}
        </Button>
      </div>

      {/* ── New Ingredient Modal ✅ Modal component ── */}
      <Modal isOpen={showNewIngredientModal} onClose={() => setShowNewIngredientModal(false)} title="🧂 Add New Ingredient">
        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6b7280', display: 'block', marginBottom: '8px' }}>
          Ingredient Name *
        </label>
        <input
          autoFocus type="text" value={newIngredientName}
          onChange={(e) => { setNewIngredientName(e.target.value); setNewIngredientError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleCreateNewIngredient()}
          placeholder="e.g. Vanilla Extract"
          style={{
            width: '100%', padding: '12px 16px', borderRadius: '12px',
            border: `2px solid ${newIngredientError ? '#ef4444' : '#fce7f3'}`,
            fontFamily: "'Nunito',sans-serif", fontSize: '0.95rem',
            boxSizing: 'border-box', outline: 'none',
          }}
        />
        <ErrorMessage message={newIngredientError} style={{ marginTop: '8px' }} />

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <Button variant="ghost" onClick={() => setShowNewIngredientModal(false)} fullWidth>Cancel</Button>
          <Button onClick={handleCreateNewIngredient} loading={savingNewIngredient}
            disabled={!newIngredientName.trim()} fullWidth>
            ✨ Create
          </Button>
        </div>
      </Modal>
    </div>
  );
}
