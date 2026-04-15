import React, { useState, useEffect, useCallback } from 'react';
import {
  adminGetBlueprints, adminCreateBlueprint, adminDeleteBlueprint,
  adminGetUnlinkedRecipes, adminGetAllLootNames,
} from '../../services/api';

export default function AdminBlueprints() {
  const [blueprints, setBlueprints] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ lootId: '', recipeId: '' });
  const [formError, setFormError] = useState('');
  const [lootOptions, setLootOptions] = useState([]);
  const [unlinkedRecipes, setUnlinkedRecipes] = useState([]);

  const fetchBlueprints = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 25 };
    if (search) params.search = search;

    adminGetBlueprints(params)
      .then(data => { setBlueprints(data.blueprints); setPagination(data.pagination); setError(''); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => { fetchBlueprints(); }, [fetchBlueprints]);

  function openCreate() {
    setFormError('');
    setForm({ lootId: '', recipeId: '' });
    Promise.all([
      adminGetAllLootNames(),
      adminGetUnlinkedRecipes(),
    ]).then(([lootData, recipeData]) => {
      setLootOptions(lootData.items);
      setUnlinkedRecipes(recipeData.recipes);
      setShowForm(true);
    }).catch(err => setError(err.message));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');
    try {
      await adminCreateBlueprint({ lootId: Number(form.lootId), recipeId: Number(form.recipeId) });
      setShowForm(false);
      fetchBlueprints();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete blueprint link for "${name}"?`)) return;
    try {
      await adminDeleteBlueprint(id);
      fetchBlueprints();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Blueprints</h1>
        <button className="btn btn-accent" onClick={openCreate}>+ Link blueprint</button>
      </div>

      <p className="admin-page-desc">
        Blueprints are items that unlock recipes. Link a loot item (the blueprint drop) to the recipe it unlocks.
      </p>

      <div className="admin-search-bar">
        <input
          type="text" placeholder="Search by blueprint, recipe, or output..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="search-input"
        />
      </div>

      {error && <div className="error-msg">{error}</div>}

      {showForm && (
        <div className="admin-form-panel">
          <h2>Link blueprint to recipe</h2>
          {formError && <div className="error-msg">{formError}</div>}
          <form onSubmit={handleCreate} className="admin-form">
            <label>
              Blueprint item (the loot drop)
              <select value={form.lootId} onChange={e => setForm({ ...form, lootId: e.target.value })} required>
                <option value="">Select item...</option>
                {lootOptions.map(l => <option key={l.LootID} value={l.LootID}>{l.Name}</option>)}
              </select>
            </label>
            <label>
              Recipe it unlocks
              <select value={form.recipeId} onChange={e => setForm({ ...form, recipeId: e.target.value })} required>
                <option value="">Select recipe...</option>
                {unlinkedRecipes.map(r => (
                  <option key={r.RecipeID} value={r.RecipeID}>{r.Name} (crafts {r.OutputName})</option>
                ))}
              </select>
            </label>
            <div className="form-buttons">
              <button type="submit" className="btn btn-accent">Create</button>
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
                <th>Blueprint item</th>
                <th>Unlocks recipe</th>
                <th>Crafts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blueprints.map(bp => (
                <tr key={bp.BlueprintID}>
                  <td>{bp.BlueprintID}</td>
                  <td>{bp.BlueprintItemName}</td>
                  <td>{bp.RecipeName}</td>
                  <td>{bp.OutputName}</td>
                  <td className="admin-actions">
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(bp.BlueprintID, bp.BlueprintItemName)}>Delete</button>
                  </td>
                </tr>
              ))}
              {blueprints.length === 0 && (
                <tr><td colSpan="5" className="admin-empty">No blueprints linked</td></tr>
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
