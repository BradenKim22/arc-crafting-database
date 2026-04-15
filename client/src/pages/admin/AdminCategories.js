import React, { useState, useEffect, useCallback } from 'react';
import {
  adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory,
} from '../../services/api';

const EMPTY_FORM = { name: '', iconUrl: '' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const fetch = useCallback(() => {
    setLoading(true);
    adminGetCategories()
      .then(data => { setCategories(data.categories); setError(''); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  }

  function openEdit(cat) {
    setEditingId(cat.CategoryID);
    setForm({ name: cat.Name, iconUrl: cat.IconURL || '' });
    setFormError('');
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    try {
      if (editingId) {
        await adminUpdateCategory(editingId, form);
      } else {
        await adminCreateCategory(form);
      }
      setShowForm(false);
      fetch();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete category "${name}"? This will fail if items use it.`)) return;
    try {
      await adminDeleteCategory(id);
      fetch();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Categories</h1>
        <button className="btn btn-accent" onClick={openCreate}>+ Add category</button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {showForm && (
        <div className="admin-form-panel">
          <h2>{editingId ? 'Edit category' : 'New category'}</h2>
          {formError && <div className="error-msg">{formError}</div>}
          <form onSubmit={handleSubmit} className="admin-form">
            <label>
              Name
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              Icon URL
              <input type="text" value={form.iconUrl} onChange={e => setForm({ ...form, iconUrl: e.target.value })}
                placeholder="/images/icons/cat-example.svg" />
            </label>
            {form.iconUrl && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Preview:</span>
                <img src={form.iconUrl} alt="preview" style={{ width: 32, height: 32, borderRadius: 4 }} />
              </div>
            )}
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
        <table className="admin-table">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.CategoryID}>
                <td style={{ textAlign: 'center' }}>
                  {cat.IconURL && <img src={cat.IconURL} alt={cat.Name} className="admin-icon-preview" />}
                </td>
                <td>{cat.Name}</td>
                <td className="admin-actions">
                  <button className="btn btn-sm" onClick={() => openEdit(cat)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat.CategoryID, cat.Name)}>Delete</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan="3" className="admin-empty">No categories</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
