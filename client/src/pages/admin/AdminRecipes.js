import React, { useState, useEffect, useCallback } from 'react';
import {
  adminGetRecipes, adminCreateRecipe, adminUpdateRecipe,
  adminDeleteRecipe, adminGetAllLootNames,
} from '../../services/api';

const EMPTY_FORM = {
  name: '', outputLootId: '', workshopType: '', workshopLevel: '1',
  isDefault: false, components: [{ lootId: '', quantity: 1 }],
};

export default function AdminRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [lootOptions, setLootOptions] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    adminGetAllLootNames().then(d => setLootOptions(d.items)).catch(() => {});
  }, []);

  const fetchRecipes = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 25 };
    if (search) params.search = search;

    adminGetRecipes(params)
      .then(data => { setRecipes(data.recipes); setPagination(data.pagination); setError(''); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => { fetchRecipes(); }, [fetchRecipes]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, components: [{ lootId: '', quantity: 1 }] });
    setFormError('');
    setShowForm(true);
  }

  function openEdit(r) {
    setEditingId(r.RecipeID);
    setForm({
      name: r.Name,
      outputLootId: String(r.OutputLootID),
      workshopType: r.WorkshopType,
      workshopLevel: String(r.WorkshopLevel),
      isDefault: !!r.IsDefault,
      components: r.components.length > 0
        ? r.components.map(c => ({ lootId: String(c.LootID), quantity: c.QuantityRequired }))
        : [{ lootId: '', quantity: 1 }],
    });
    setFormError('');
    setShowForm(true);
  }

  function addComponent() {
    setForm({ ...form, components: [...form.components, { lootId: '', quantity: 1 }] });
  }
  function removeComponent(idx) {
    if (form.components.length <= 1) return;
    setForm({ ...form, components: form.components.filter((_, i) => i !== idx) });
  }
  function updateComponent(idx, field, value) {
    const comps = [...form.components];
    comps[idx] = { ...comps[idx], [field]: value };
    setForm({ ...form, components: comps });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    const payload = {
      name: form.name,
      outputLootId: Number(form.outputLootId),
      workshopType: form.workshopType,
      workshopLevel: Number(form.workshopLevel),
      isDefault: form.isDefault,
      components: form.components
        .filter(c => c.lootId)
        .map(c => ({ lootId: Number(c.lootId), quantity: Number(c.quantity) })),
    };

    if (payload.components.length === 0) {
      setFormError('Add at least one component');
      return;
    }

    try {
      if (editingId) {
        await adminUpdateRecipe(editingId, payload);
      } else {
        await adminCreateRecipe(payload);
      }
      setShowForm(false);
      fetchRecipes();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete recipe "${name}"?`)) return;
    try {
      await adminDeleteRecipe(id);
      fetchRecipes();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Recipes</h1>
        <button className="btn btn-accent" onClick={openCreate}>+ Add recipe</button>
      </div>

      <div className="admin-search-bar">
        <input
          type="text" placeholder="Search recipes or output items..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="search-input"
        />
      </div>

      {error && <div className="error-msg">{error}</div>}

      {showForm && (
        <div className="admin-form-panel">
          <h2>{editingId ? 'Edit recipe' : 'New recipe'}</h2>
          {formError && <div className="error-msg">{formError}</div>}
          <form onSubmit={handleSubmit} className="admin-form">
            <label>
              Recipe name
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              Output item
              <select value={form.outputLootId} onChange={e => setForm({ ...form, outputLootId: e.target.value })} required>
                <option value="">Select item...</option>
                {lootOptions.map(l => <option key={l.LootID} value={l.LootID}>{l.Name}</option>)}
              </select>
            </label>

            <div className="admin-form-row">
              <label>
                Workshop type
                <input type="text" value={form.workshopType}
                  onChange={e => setForm({ ...form, workshopType: e.target.value })}
                  placeholder="e.g. Weapons Workbench, Medical Workbench" required />
              </label>
              <label>
                Workshop level
                <select value={form.workshopLevel} onChange={e => setForm({ ...form, workshopLevel: e.target.value })}>
                  <option value="1">Level 1</option>
                  <option value="2">Level 2</option>
                  <option value="3">Level 3</option>
                </select>
              </label>
            </div>

            <label className="admin-checkbox-label">
              <input type="checkbox" checked={form.isDefault}
                onChange={e => setForm({ ...form, isDefault: e.target.checked })} />
              Known by default (no blueprint required)
            </label>

            <div className="admin-form-section">
              <div className="admin-form-section-header">
                <span>Components</span>
                <button type="button" className="btn btn-sm" onClick={addComponent}>+ Add</button>
              </div>
              {form.components.map((comp, idx) => (
                <div key={idx} className="admin-component-row">
                  <select
                    value={comp.lootId}
                    onChange={e => updateComponent(idx, 'lootId', e.target.value)}
                    className="admin-component-select" required
                  >
                    <option value="">Select item...</option>
                    {lootOptions.map(l => <option key={l.LootID} value={l.LootID}>{l.Name}</option>)}
                  </select>
                  <input
                    type="number" min="1" value={comp.quantity}
                    onChange={e => updateComponent(idx, 'quantity', e.target.value)}
                    className="admin-component-qty" placeholder="Qty"
                  />
                  {form.components.length > 1 && (
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removeComponent(idx)}>x</button>
                  )}
                </div>
              ))}
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn btn-accent">{editingId ? 'Save' : 'Create'}</button>
              <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Recipe</th>
                <th>Output</th>
                <th>Workshop</th>
                <th>Type</th>
                <th>Components</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map(r => (
                <tr key={r.RecipeID}>
                  <td>{r.RecipeID}</td>
                  <td>{r.Name}</td>
                  <td>
                    <span className={`rarity-badge badge-sm rarity-${r.OutputRarity.toLowerCase()}`}>{r.OutputRarity}</span>
                    {' '}{r.OutputName}
                  </td>
                  <td>{r.WorkshopType} Lv{r.WorkshopLevel}</td>
                  <td>
                    {r.IsDefault
                      ? <span className="admin-tag tag-default">Default</span>
                      : <span className="admin-tag tag-blueprint">Blueprint</span>
                    }
                  </td>
                  <td>
                    {r.components.map(c => (
                      <div key={c.LootID} className="admin-component-tag">
                        {c.QuantityRequired}x {c.ComponentName}
                      </div>
                    ))}
                  </td>
                  <td className="admin-actions">
                    <button className="btn btn-sm" onClick={() => openEdit(r)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.RecipeID, r.Name)}>Delete</button>
                  </td>
                </tr>
              ))}
              {recipes.length === 0 && (
                <tr><td colSpan="7" className="admin-empty">No recipes found</td></tr>
              )}
            </tbody>
          </table>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button className="btn btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
              <span className="pagination-info">Page {pagination.page} of {pagination.pages}</span>
              <button className="btn btn-sm" disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
