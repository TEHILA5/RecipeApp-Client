import { useState } from 'react';
import {
  useGetAllConversionsQuery,
  useCreateConversionMutation,
  useUpdateConversionMutation,
  useDeleteConversionMutation,
  type ConversionDto,
} from '../../../api/adminApi';
import './ConversionsTab.css';

interface Ingredient {
  id: number;
  name: string;
}

interface ConversionsTabProps {
  allIngredients: Ingredient[];
}

export default function ConversionsTab({ allIngredients }: ConversionsTabProps) {
  const { data: conversions = [], isLoading: loadingConversions } = useGetAllConversionsQuery();
  const [createConversion] = useCreateConversionMutation();
  const [updateConversion] = useUpdateConversionMutation();
  const [deleteConversion] = useDeleteConversionMutation();

  const [convSearch, setConvSearch] = useState('');
  const [convError, setConvError] = useState('');
  const [deletingConvId, setDeletingConvId] = useState<number | null>(null);
  const [editingConv, setEditingConv] = useState<ConversionDto | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [savingConv, setSavingConv] = useState(false);

  const [form, setForm] = useState({
    ingredient1Query: '', ingredient1Id: 0, ingredient1Name: '',
    ingredient2Query: '', ingredient2Id: 0, ingredient2Name: '',
    conversionRatio: '', isBidirectional: true,
  });

  const ing1Options =
    form.ingredient1Id === 0 && form.ingredient1Query.length >= 1
      ? allIngredients.filter((i) => i.name.toLowerCase().includes(form.ingredient1Query.toLowerCase())).slice(0, 8)
      : [];

  const ing2Options =
    form.ingredient2Id === 0 && form.ingredient2Query.length >= 1
      ? allIngredients.filter((i) => i.name.toLowerCase().includes(form.ingredient2Query.toLowerCase())).slice(0, 8)
      : [];

  const handleDeleteConversion = async (id: number) => {
    if (!confirm('Delete this conversion?')) return;
    setDeletingConvId(id);
    try {
      await deleteConversion(id).unwrap();
    } catch {
      setConvError('Failed to delete');
    } finally {
      setDeletingConvId(null);
    }
  };

  const handleSaveConversion = async () => {
    setConvError('');
    if (!form.ingredient1Id || !form.ingredient2Id) { setConvError('Please select both ingredients'); return; }
    const ratio = parseFloat(form.conversionRatio);
    if (!ratio || ratio <= 0) { setConvError('Please enter a valid ratio'); return; }
    setSavingConv(true);
    try {
      await createConversion({
        ingredientId1: form.ingredient1Id,
        ingredientId2: form.ingredient2Id,
        conversionRatio: ratio,
        isBidirectional: form.isBidirectional,
      }).unwrap();
      setShowAddForm(false);
      setForm({
        ingredient1Query: '', ingredient1Id: 0, ingredient1Name: '',
        ingredient2Query: '', ingredient2Id: 0, ingredient2Name: '',
        conversionRatio: '', isBidirectional: true,
      });
    } catch {
      setConvError('Failed to save conversion');
    } finally {
      setSavingConv(false);
    }
  };

  const handleUpdateConversion = async () => {
    if (!editingConv) return;
    setSavingConv(true);
    try {
      await updateConversion({
        id: editingConv.id,
        data: {
          conversionRatio: editingConv.conversionRatio,
          isBidirectional: editingConv.isBidirectional,
        },
      }).unwrap();
      setEditingConv(null);
    } catch {
      setConvError('Failed to update');
    } finally {
      setSavingConv(false);
    }
  };

  const filteredConversions = conversions.filter((c) =>
    c.ingredient1Name?.toLowerCase().includes(convSearch.toLowerCase()) ||
    c.ingredient2Name?.toLowerCase().includes(convSearch.toLowerCase())
  );

  return (
    <>
      <div className="cv-header">
        <h3 className="cv-title">
          Ingredient Conversions{' '}
          <img src="/src/assets/icons/action-refresh.png" alt="" className="cv-title-icon" />
        </h3>
        <button
          onClick={() => { setShowAddForm((v) => !v); setConvError(''); }}
          className="cv-add-btn"
        >
          {showAddForm
            ? '✕ Cancel'
            : <>
                <img src="/src/assets/icons/action-add.png" alt="" className="cv-btn-icon" />
                Add Conversion
              </>
          }
        </button>
      </div>

      {showAddForm && (
        <div className="cv-form">
          <h4 className="cv-form-title">New Conversion</h4>
          <div className="cv-form-grid">
            {([1, 2] as const).map((n) => {
              const idKey    = `ingredient${n}Id`    as 'ingredient1Id'    | 'ingredient2Id';
              const nameKey  = `ingredient${n}Name`  as 'ingredient1Name'  | 'ingredient2Name';
              const queryKey = `ingredient${n}Query` as 'ingredient1Query' | 'ingredient2Query';
              const options  = n === 1 ? ing1Options : ing2Options;

              return (
                <div key={n} className="cv-field-wrap">
                  <label className="cv-label">Ingredient {n}</label>
                  <input
                    type="text"
                    value={form[nameKey] || form[queryKey]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [queryKey]: e.target.value, [nameKey]: '', [idKey]: 0 }))
                    }
                    placeholder="Search ingredient..."
                    className="cv-input"
                  />
                  {options.length > 0 && (
                    <div className="cv-dropdown">
                      {options.map((ing) => (
                        <div
                          key={ing.id}
                          className="cv-dropdown-item"
                          onClick={() =>
                            setForm((f) => ({ ...f, [idKey]: ing.id, [nameKey]: ing.name, [queryKey]: ing.name }))
                          }
                        >
                          {ing.name} <span className="cv-dropdown-id">#{ing.id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {form[idKey] > 0 && (
                    <div className="cv-selected">
                      <img src="/src/assets/icons/profile-success.png" alt="" className="cv-btn-icon" />
                      {form[nameKey]}
                      <button
                        className="cv-clear-btn"
                        onClick={() => setForm((f) => ({ ...f, [idKey]: 0, [nameKey]: '', [queryKey]: '' }))}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="cv-form-grid cv-form-grid--bottom">
            <div>
              <label className="cv-label">Conversion Ratio</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.conversionRatio}
                onChange={(e) => setForm((f) => ({ ...f, conversionRatio: e.target.value }))}
                placeholder="e.g. 0.75"
                className="cv-input"
              />
            </div>
            <div className="cv-toggle-wrap">
              <div
                className={`cv-toggle ${form.isBidirectional ? 'cv-toggle--on' : ''}`}
                onClick={() => setForm((f) => ({ ...f, isBidirectional: !f.isBidirectional }))}
              >
                <div className="cv-toggle-thumb" />
              </div>
              <span className="cv-toggle-label">
                Bidirectional{' '}
                {form.isBidirectional
                  ? <img src="/src/assets/icons/arrow2.png" alt="↔" className="cv-btn-icon" />
                  : <img src="/src/assets/icons/arrow1.png" alt="->" className="cv-btn-icon" />
                }
              </span>
            </div>
          </div>

          {form.ingredient1Name && form.ingredient2Name && form.conversionRatio && (
            <div className="cv-preview">
              <img src="/src/assets/icons/content-clipboard.png" alt="" className="cv-btn-icon" />
              Preview: 1 {form.ingredient1Name} = {form.conversionRatio} {form.ingredient2Name}
            </div>
          )}

          {convError && <p className="cv-error">{convError}</p>}

          <button
            onClick={handleSaveConversion}
            disabled={savingConv}
            className={`cv-save-btn ${savingConv ? 'cv-save-btn--busy' : ''}`}
          >
            {savingConv ? 'Saving...' : (
              <>
                <img src="/src/assets/icons/profile-success.png" alt="" className="cv-save-icon" />
                Save Conversion
              </>
            )}
          </button>
        </div>
      )}

      <div className="cv-table-wrap">
        <div className="cv-table-header">
          <span className="cv-count">
            {filteredConversions.length} conversion{filteredConversions.length !== 1 ? 's' : ''}
          </span>
          <div className="cv-search-wrap">
            <input
              type="text"
              value={convSearch}
              onChange={(e) => setConvSearch(e.target.value)}
              placeholder="Search ingredients..."
              className="cv-search"
            />
            <span className="cv-search-icon">
              <img src="/src/assets/icons/search-icon.png" alt="Search" className="cv-search-img" />
            </span>
          </div>
        </div>

        {loadingConversions ? (
          <div className="cv-state">Loading...</div>
        ) : filteredConversions.length === 0 ? (
          <div className="cv-state">
            <div className="cv-state-icon">
              <img src="/src/assets/icons/action-refresh.png" alt="" className="cv-state-img" />
            </div>
            <p>{convSearch ? 'No results' : 'No conversions yet'}</p>
          </div>
        ) : (
          <div className="cv-overflow">
            <table className="cv-table">
              <thead>
                <tr className="cv-thead-row">
                  {['Ingredient 1', '', 'Ingredient 2', 'Ratio', 'Direction', 'Actions'].map((h) => (
                    <th key={h} className="cv-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredConversions.map((conv, idx) => (
                  <tr key={conv.id} className={`cv-row ${idx % 2 === 0 ? '' : 'cv-row--odd'}`}>
                    <td className="cv-td cv-td--bold">{conv.ingredient1Name}</td>
                    <td className="cv-td cv-td--arrow">{conv.isBidirectional ? '↔' : '→'}</td>
                    <td className="cv-td cv-td--bold">{conv.ingredient2Name}</td>
                    <td className="cv-td">
                      {editingConv?.id === conv.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editingConv.conversionRatio ?? ''}
                          onChange={(e) =>
                            setEditingConv((c) => c ? { ...c, conversionRatio: parseFloat(e.target.value) } : c)
                          }
                          className="cv-ratio-input"
                        />
                      ) : (
                        <span className="cv-ratio">{conv.conversionRatio}</span>
                      )}
                    </td>
                    <td className="cv-td">
                      {editingConv?.id === conv.id ? (
                        <div
                          className={`cv-toggle ${editingConv.isBidirectional ? 'cv-toggle--on' : ''}`}
                          onClick={() => setEditingConv((c) => c ? { ...c, isBidirectional: !c.isBidirectional } : c)}
                        >
                          <div className="cv-toggle-thumb" />
                        </div>
                      ) : (
                        <span className={`cv-direction-badge ${conv.isBidirectional ? 'cv-direction-badge--bi' : ''}`}>
                          {conv.isBidirectional
                            ? <><img src="/src/assets/icons/arrow2.png" alt="↔" className="cv-btn-icon" /> Both</>
                            : <><img src="/src/assets/icons/arrow1.png" alt="->" className="cv-btn-icon" /> One-way</>
                          }
                        </span>
                      )}
                    </td>
                    <td className="cv-td">
                      <div className="cv-actions">
                        {editingConv?.id === conv.id ? (
                          <>
                            <button onClick={handleUpdateConversion} disabled={savingConv} className="cv-btn cv-btn--save">
                              {savingConv ? '...' : (
                                <>
                                  <img src="/src/assets/icons/profile-success.png" alt="" className="cv-btn-icon" />
                                  Save
                                </>
                              )}
                            </button>
                            <button onClick={() => setEditingConv(null)} className="cv-btn cv-btn--cancel">Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setEditingConv(conv)} className="cv-btn cv-btn--edit">
                              <img src="/src/assets/icons/profile-edit.png" alt="" className="cv-btn-icon" />
                              Edit
                            </button>
                            <button onClick={() => handleDeleteConversion(conv.id)} disabled={deletingConvId === conv.id} className="cv-btn cv-btn--delete">
                              {deletingConvId === conv.id ? '...' : (
                                <>
                                  <img src="/src/assets/icons/action-delete.png" alt="" className="cv-btn-icon" />
                                  Delete
                                </>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}