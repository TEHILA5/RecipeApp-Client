import { useState } from 'react';
import type { RecipeCreateDto, RecipeUpdateDto, RecipeCategory, DifficultyLevel } from '../types/recipe.types';
import {
  useGetAllIngredientsQuery,
  useCreateIngredientMutation,
} from '../../../api/ingredientApi';
import Modal from '../../../shared/components/UI/Modal';
import Button from '../../../shared/components/UI/Button';
import ErrorMessage from '../../../shared/components/UI/ErrorMessage';
import './RecipeForm.css';

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
  tags: string[];
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

const SUGGESTED_TAGS = [
  'chocolate', 'vanilla', 'fruit', 'frozen', 'no-bake',
  'quick', 'vegan', 'gluten-free', 'dairy-free', 'nut-free',
  'traditional', 'summer', 'winter', 'holiday', 'kids',
];

const UNITS = ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'pieces', 'pinch', 'oz'];

const defaultForm: RecipeFormData = {
  name: '', description: '', category: 'Cakes', instructions: '',
  arrImage: '', servings: 4, level: 1, prepTime: 15, totalTime: 60,
  ingredients: [], tags: [],
};

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return <h3 className="rf-section-title">{icon} {title}</h3>;
}

export default function RecipeForm({ initialData, onSubmit, loading = false, submitLabel = 'Save Recipe' }: RecipeFormProps) {
  const [form, setForm] = useState<RecipeFormData>({
    ...defaultForm,
    ...initialData,
    tags: initialData?.tags ?? [],
    ingredients: initialData?.ingredients ?? [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RecipeFormData, string>>>({});
  const [showNewIngredientModal, setShowNewIngredientModal] = useState(false);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientError, setNewIngredientError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [newIngredient, setNewIngredient] = useState<FormIngredient>({
    ingredientId: 0, ingredientName: '', quantity: 1, unit: 'g', importance: 'Essential',
  });

  const { data: ingredientOptions = [] } = useGetAllIngredientsQuery();
  const [createIngredient, { isLoading: savingNewIngredient }] = useCreateIngredientMutation();

  const set = (field: keyof RecipeFormData, value: unknown) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleAddTag = (tag: string) => {
    const normalized = tag.trim().toLowerCase();
    if (!normalized || form.tags.includes(normalized)) return;
    setForm((f) => ({ ...f, tags: [...f.tags, normalized] }));
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof RecipeFormData, string>> = {};
    if (!form.name.trim())         errs.name = 'Name is required';
    if (!form.description.trim())  errs.description = 'Description is required';
    if (!form.instructions.trim()) errs.instructions = 'Instructions are required';
    if (form.servings < 1)         errs.servings = 'Must be at least 1';
    if (form.prepTime < 1)         errs.prepTime = 'Must be at least 1 minute';
    if (form.totalTime < form.prepTime) errs.totalTime = 'Total time must be >= prep time';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const dto: RecipeCreateDto = {
      name: form.name.trim(), description: form.description.trim(),
      category: form.category, instructions: form.instructions.trim(),
      arrImage: form.arrImage.trim(), servings: form.servings,
      level: form.level, prepTime: form.prepTime, totalTime: form.totalTime,
      tags: form.tags,
      ingredients: form.ingredients.map(({ ingredientId, quantity, unit, importance }) => ({
        ingredientId, quantity, unit, importance,
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
    setNewIngredientError('');
    try {
      const created = await createIngredient({ name: newIngredientName.trim() }).unwrap();
      setNewIngredient((n) => ({ ...n, ingredientId: created.id, ingredientName: created.name }));
      setNewIngredientName('');
      setShowNewIngredientModal(false);
    } catch (err: unknown) {
      setNewIngredientError(err instanceof Error ? err.message : 'Failed to create ingredient');
    }
  };

  return (
    <div className="rf-wrap">

      <section className="rf-section">
        <SectionTitle icon={<img src="/src/assets/icons/content-notes.png" alt="Basic Info" className="rf-section-icon" />} title="Basic Info" />
        <div className="rf-grid">
          <div>
            <label className="rf-label">Recipe Name *</label>
            <input className={`rf-input ${errors.name ? 'rf-input--error' : ''}`}
              value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Chocolate Lava Cake" />
            {errors.name && <p className="rf-field-error">{errors.name}</p>}
          </div>
          <div>
            <label className="rf-label">Description *</label>
            <textarea className={`rf-input rf-textarea ${errors.description ? 'rf-input--error' : ''}`}
              value={form.description} onChange={(e) => set('description', e.target.value)}
              rows={3} placeholder="A short, enticing description..." />
            {errors.description && <p className="rf-field-error">{errors.description}</p>}
          </div>
          <div className="rf-grid-2">
            <div>
              <label className="rf-label">Category *</label>
              <select className="rf-input" value={form.category} onChange={(e) => set('category', e.target.value as RecipeCategory)}>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="rf-label">Difficulty *</label>
              <select className="rf-input" value={form.level} onChange={(e) => set('level', Number(e.target.value) as DifficultyLevel)}>
                <option value={1}>Easy</option>
                <option value={2}>Medium</option>
                <option value={3}>Hard</option>
              </select>
            </div>
          </div>
          <div>
            <label className="rf-label">Image URL</label>
            <input className="rf-input" value={form.arrImage} onChange={(e) => set('arrImage', e.target.value)} placeholder="https://example.com/image.jpg" />
          </div>
        </div>
      </section>

      <section className="rf-section">
        <SectionTitle icon={<img src="/src/assets/icons/recipe-bookmark.png" alt="Tags" className="rf-section-icon" />} title="Tags" />
        <p className="rf-hint">Add tags to help with smart search — e.g. "frozen", "chocolate", "quick"</p>

        {form.tags.length > 0 && (
          <div className="rf-tags">
            {form.tags.map((tag) => (
              <span key={tag} className="rf-tag">
                #{tag}
                <button className="rf-tag-remove" onClick={() => handleRemoveTag(tag)}>x</button>
              </span>
            ))}
          </div>
        )}

        <div className="rf-tag-input-row">
          <input
            type="text" value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(tagInput); } }}
            placeholder="Type a tag and press Enter..."
            className="rf-input rf-tag-input"
          />
          <Button variant="outline" size="sm" onClick={() => handleAddTag(tagInput)} disabled={!tagInput.trim()}>+ Add</Button>
        </div>

        <div>
          <p className="rf-quick-label">Quick add:</p>
          <div className="rf-suggested-tags">
            {SUGGESTED_TAGS.filter((t) => !form.tags.includes(t)).map((tag) => (
              <button key={tag} className="rf-suggested-tag" onClick={() => handleAddTag(tag)}>#{tag}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="rf-section">
        <SectionTitle icon={<img src="/src/assets/icons/meta-time.png" alt="Time & Servings" className="rf-section-icon" />} title="Time & Servings" />
        <div className="rf-grid-3">
          {[
            { label: 'Prep Time (min) *', field: 'prepTime' as const, error: errors.prepTime },
            { label: 'Total Time (min) *', field: 'totalTime' as const, error: errors.totalTime },
            { label: 'Servings *',         field: 'servings' as const,  error: errors.servings },
          ].map(({ label, field, error }) => (
            <div key={field}>
              <label className="rf-label">{label}</label>
              <input type="number" min={1} className={`rf-input ${error ? 'rf-input--error' : ''}`}
                value={form[field] as number} onChange={(e) => set(field, Number(e.target.value))} />
              {error && <p className="rf-field-error">{error}</p>}
            </div>
          ))}
        </div>
      </section>

      <section className="rf-section">
        <div className="rf-section-header">
          <SectionTitle icon={<img src="/src/assets/icons/calc-spoon.png" alt="Ingredients" className="rf-section-icon" />} title="Ingredients" />
          <Button variant="outline" size="sm" onClick={() => { setShowNewIngredientModal(true); setNewIngredientError(''); setNewIngredientName(''); }}>
            New Ingredient
          </Button>
        </div>

        {form.ingredients.length > 0 && (
          <div className="rf-ing-list">
            {form.ingredients.map((ing, i) => (
              <div key={i} className="rf-ing-item">
                <span className="rf-ing-name">{ing.ingredientName}</span>
                <span className="rf-ing-qty">{ing.quantity} {ing.unit}</span>
                <span className="rf-ing-importance">{ing.importance}</span>
                <button className="rf-ing-remove" onClick={() => handleRemoveIngredient(i)}>x</button>
              </div>
            ))}
          </div>
        )}

        <div className="rf-ing-add">
          <div>
            <label className="rf-label">Ingredient</label>
            <select className="rf-input" value={newIngredient.ingredientId}
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
            <label className="rf-label">Quantity</label>
            <input type="number" min={0} step={0.1} className="rf-input" value={newIngredient.quantity}
              onChange={(e) => setNewIngredient((n) => ({ ...n, quantity: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="rf-label">Unit</label>
            <select className="rf-input" value={newIngredient.unit} onChange={(e) => setNewIngredient((n) => ({ ...n, unit: e.target.value }))}>
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="rf-label">Importance</label>
            <select className="rf-input" value={newIngredient.importance} onChange={(e) => setNewIngredient((n) => ({ ...n, importance: e.target.value as FormIngredient['importance'] }))}>
              <option value="Essential">Essential</option>
              <option value="Recommended">Recommended</option>
              <option value="Optional">Optional</option>
            </select>
          </div>
          <Button onClick={handleAddIngredient} disabled={!newIngredient.ingredientId}>+ Add</Button>
        </div>
      </section>

      <section className="rf-section">
        <SectionTitle icon={<img src="/src/assets/icons/content-clipboard.png" alt="Instructions" className="rf-section-icon" />} title="Instructions" />
        <label className="rf-label">Step-by-step instructions *</label>
        <p className="rf-hint rf-hint--tight">Write each step on a new line</p>
        <textarea
          className={`rf-input rf-textarea ${errors.instructions ? 'rf-input--error' : ''}`}
          value={form.instructions} onChange={(e) => set('instructions', e.target.value)}
          rows={8} placeholder="Step 1: Preheat oven to 180 degrees" />
        {errors.instructions && <p className="rf-field-error">{errors.instructions}</p>}
      </section>

      <div className="rf-submit-row">
        <Button onClick={handleSubmit} loading={loading} size="lg">
          <img src="/src/assets/icons/ai-sparkle.png" alt="Submit" className="rf-submit-icon" />
          {submitLabel}
        </Button>
      </div>

      <Modal isOpen={showNewIngredientModal} onClose={() => setShowNewIngredientModal(false)} title="Add New Ingredient">
        <label className="rf-label">Ingredient Name *</label>
        <input
          autoFocus type="text" value={newIngredientName}
          onChange={(e) => { setNewIngredientName(e.target.value); setNewIngredientError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleCreateNewIngredient()}
          placeholder="e.g. Vanilla Extract"
          className={`rf-input ${newIngredientError ? 'rf-input--error' : ''}`}
        />
        <ErrorMessage message={newIngredientError} className="rf-ingredient-error" />
        <div className="rf-modal-actions">
          <Button variant="ghost" onClick={() => setShowNewIngredientModal(false)} fullWidth>Cancel</Button>
          <Button onClick={handleCreateNewIngredient} loading={savingNewIngredient} disabled={!newIngredientName.trim()} fullWidth>✨ Create</Button>
        </div>
      </Modal>
    </div>
  );
}