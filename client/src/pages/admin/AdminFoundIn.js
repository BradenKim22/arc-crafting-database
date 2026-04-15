import React, { useState, useEffect, useCallback } from 'react';
import {
  adminGetFoundIn, adminCreateFoundIn, adminUpdateFoundIn, adminDeleteFoundIn,
} from '../../services/api';

const EMPTY_FORM = { name: '', iconUrl: '' };

export default function AdminFoundIn() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const fetch = useCallback(() => {
    setLoading(true);
    adminGetFoundIn()
      .then(data => { setItems(data.foundIn); setError(''); })
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

  function openEdit(fi) {
    setEditingId(fi.FoundInID);
    setForm({ name: fi.Name, iconUrl: fi.IconURL || '' });
    setFormError('');
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    try {
      if (editingId) {
        await adminUpdateFoundIn(editingId, form);
      } else {
        await adminCreateFoundIn(form);
      }
      setShowForm(false);
      fetch();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? Items using it will have their Found In cleared.`)) return;
    try {
      await adminDeleteFoundIn(id);
      fetch();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Found In</h1>
        <button className="btn btn-accent" onClick={openCreate}>+ Add source</button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {showForm && (
        <div className="admin-form-panel">
          <h2>{editingId ? 'Edit source' : 'New source'}</h2>
          {formError && <div className="error-msg">{formError}</div>}
          <form onSubmit={handleSubmit} className="admin-form">
            <label>
              Name
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              Icon URL
              <input type="text" value={form.iconUrl} onChange={e => setForm({ ...form, iconUrl: e.target.value })}
                placeholder="/images/icons/fi-example.svg" />
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
            {items.map(fi => (
              <tr key={fi.FoundInID}>
                <td style={{ textAlign: 'center' }}>
                  {fi.IconURL && <img src={fi.IconURL} alt={fi.Name} className="admin-icon-preview" />}
                </td>
                <td>{fi.Name}</td>
                <td className="admin-actions">
                  <button className="btn btn-sm" onClick={() => openEdit(fi)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(fi.FoundInID, fi.Name)}>Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan="3" className="admin-empty">No sources</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
