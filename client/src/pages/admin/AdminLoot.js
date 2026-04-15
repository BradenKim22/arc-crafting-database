import React, { useState, useEffect, useCallback } from 'react';
import {
  adminGetLoot, adminCreateLoot, adminUpdateLoot, adminDeleteLoot,
  adminGetCategories, adminGetFoundIn,
} from '../../services/api';

const RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
const EMPTY_FORM = { name: '', description: '', rarity: 'Common', categoryId: '', foundInId: '', imageUrl: '' };

export default function AdminLoot() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [filterRarity, setFilterRarity] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Lookup options
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [foundInOptions, setFoundInOptions] = useState([]);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    Promise.all([adminGetCategories(), adminGetFoundIn()])
      .then(([catData, fiData]) => {
        setCategoryOptions(catData.categories);
        setFoundInOptions(fiData.foundIn);
      })
      .catch(() => {});
  }, []);

  const fetchItems = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 25 };
    if (search) params.search = search;
    if (filterRarity) params.rarity = filterRarity;

    adminGetLoot(params)
      .then(data => { setItems(data.items); setPagination(data.pagination); setError(''); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, filterRarity, page]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  }

  function openEdit(item) {
    setEditingId(item.LootID);
    setForm({
      name: item.Name,
      description: item.Description,
      rarity: item.Rarity,
      categoryId: String(item.CategoryID || ''),
      foundInId: String(item.FoundInID || ''),
      imageUrl: item.ImageURL || '',
    });
    setFormError('');
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    const payload = {
      name: form.name,
      description: form.description,
      rarity: form.rarity,
      categoryId: Number(form.categoryId),
      foundInId: form.foundInId ? Number(form.foundInId) : null,
      imageUrl: form.imageUrl || null,
    };
    try {
      if (editingId) {
        await adminUpdateLoot(editingId, payload);
      } else {
        await adminCreateLoot(payload);
      }
      setShowForm(false);
      fetchItems();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await adminDeleteLoot(id);
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Items</h1>
        <button className="btn btn-accent" onClick={openCreate}>+ Add item</button>
      </div>

      <div className="admin-search-bar">
        <input
          type="text" placeholder="Search items..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="search-input"
        />
        <select className="filter-select" value={filterRarity} onChange={e => { setFilterRarity(e.target.value); setPage(1); }}>
          <option value="">All rarities</option>
          {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {showForm && (
        <div className="admin-form-panel">
          <h2>{editingId ? 'Edit item' : 'New item'}</h2>
          {formError && <div className="error-msg">{formError}</div>}
          <form onSubmit={handleSubmit} className="admin-form">
            <label>
              Name
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              Description
              <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
            </label>
            <label>
              Rarity
              <select value={form.rarity} onChange={e => setForm({ ...form, rarity: e.target.value })}>
                {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
            <label>
              Category
              <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
                <option value="">Select category...</option>
                {categoryOptions.map(c => <option key={c.CategoryID} value={c.CategoryID}>{c.Name}</option>)}
              </select>
            </label>
            <label>
              Found in (optional)
              <select value={form.foundInId} onChange={e => setForm({ ...form, foundInId: e.target.value })}>
                <option value="">None</option>
                {foundInOptions.map(fi => <option key={fi.FoundInID} value={fi.FoundInID}>{fi.Name}</option>)}
              </select>
            </label>
            <label>
              Image URL (optional)
              <input
                type="text" value={form.imageUrl}
                onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://example.com/image.png"
              />
            </label>
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
                <th>Name</th>
                <th>Rarity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.LootID}>
                  <td>{item.LootID}</td>
                  <td>{item.Name}</td>
                  <td><span className={`rarity-badge badge-sm rarity-${item.Rarity.toLowerCase()}`}>{item.Rarity}</span></td>
                  <td className="admin-actions">
                    <button className="btn btn-sm" onClick={() => openEdit(item)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.LootID, item.Name)}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan="4" className="admin-empty">No items found</td></tr>
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
