import React, { useState, useEffect, useCallback } from 'react';
import {
  adminGetBreakdowns, adminCreateBreakdown, adminUpdateBreakdown,
  adminDeleteBreakdown, adminGetAllLootNames,
} from '../../services/api';

const EMPTY_FORM = {
  lootId: '',
  components: [{ componentLootId: '', quantity: 1 }],
};

export default function AdminBreakdowns() {
  const [breakdowns, setBreakdowns] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [lootOptions, setLootOptions] = useState([]);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingLootId, setEditingLootId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    adminGetAllLootNames().then(d => setLootOptions(d.items)).catch(() => {});
  }, []);

  const fetchBreakdowns = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 25 };
    if (search) params.search = search;

    adminGetBreakdowns(params)
      .then(data => { setBreakdowns(data.breakdowns); setPagination(data.pagination); setError(''); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => { fetchBreakdowns(); }, [fetchBreakdowns]);

  function openCreate() {
    setEditingLootId(null);
    setForm({ ...EMPTY_FORM, components: [{ componentLootId: '', quantity: 1 }] });
    setFormError('');
    setShowForm(true);
  }

  function openEdit(bd) {
    setEditingLootId(bd.LootID);
    setForm({
      lootId: String(bd.LootID),
      components: bd.components.length > 0
        ? bd.components.map(c => ({ componentLootId: String(c.ComponentLootID), quantity: c.Quantity }))
        : [{ componentLootId: '', quantity: 1 }],
    });
    setFormError('');
    setShowForm(true);
  }

  function addComponent() {
    setForm({ ...form, components: [...form.components, { componentLootId: '', quantity: 1 }] });
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

    const lootId = Number(form.lootId);
    const components = form.components
      .filter(c => c.componentLootId)
      .map(c => ({ componentLootId: Number(c.componentLootId), quantity: Number(c.quantity) }));

    if (components.length === 0) {
      setFormError('Add at least one component');
      return;
    }

    // Check for self-references
    const selfRef = components.find(c => c.componentLootId === lootId);
    if (selfRef) {
      setFormError('An item cannot break down into itself');
      return;
    }

    try {
      if (editingLootId) {
        // Editing: delete all existing components for this source, then re-create
        const existing = breakdowns.find(b => b.LootID === editingLootId);
        if (existing) {
          for (const old of existing.components) {
            await adminDeleteBreakdown(editingLootId, old.ComponentLootID);
          }
        }
        for (const comp of components) {
          await adminCreateBreakdown({
            lootId: editingLootId,
            componentLootId: comp.componentLootId,
            quantity: comp.quantity,
          });
        }
      } else {
        // Creating: add each component row
        for (const comp of components) {
          await adminCreateBreakdown({
            lootId,
            componentLootId: comp.componentLootId,
            quantity: comp.quantity,
          });
        }
      }
      setShowForm(false);
      fetchBreakdowns();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleDeleteAll(bd) {
    if (!window.confirm(`Delete all breakdown components for "${bd.SourceName}"?`)) return;
    try {
      for (const comp of bd.components) {
        await adminDeleteBreakdown(bd.LootID, comp.ComponentLootID);
      }
      fetchBreakdowns();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Recyclables</h1>
        <button className="btn btn-accent" onClick={openCreate}>+ Add recyclable</button>
      </div>

      <div className="admin-search-bar">
        <input
          type="text" placeholder="Search by source item name..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="search-input"
        />
      </div>

      {error && <div className="error-msg">{error}</div>}

      {showForm && (
        <div className="admin-form-panel">
          <h2>{editingLootId ? 'Edit recyclable' : 'New recyclable'}</h2>
          {formError && <div className="error-msg">{formError}</div>}
          <form onSubmit={handleSubmit} className="admin-form">
            <label>
              Source item (recycled)
              <select
                value={form.lootId}
                onChange={e => setForm({ ...form, lootId: e.target.value })}
                disabled={!!editingLootId}
                required
              >
                <option value="">Select item...</option>
                {lootOptions.map(l => <option key={l.LootID} value={l.LootID}>{l.Name}</option>)}
              </select>
            </label>

            <div className="admin-form-section">
              <div className="admin-form-section-header">
                <span>Components (what it breaks into)</span>
                <button type="button" className="btn btn-sm" onClick={addComponent}>+ Add</button>
              </div>
              {form.components.map((comp, idx) => (
                <div key={idx} className="admin-component-row">
                  <select
                    value={comp.componentLootId}
                    onChange={e => updateComponent(idx, 'componentLootId', e.target.value)}
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
              <button type="submit" className="btn btn-accent">{editingLootId ? 'Save' : 'Create'}</button>
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
                <th>Source item</th>
                <th>Breaks into</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {breakdowns.map(bd => (
                <tr key={bd.LootID}>
                  <td>{bd.SourceName}</td>
                  <td>
                    {bd.components.map(c => (
                      <div key={c.ComponentLootID} className="admin-component-tag">
                        {c.Quantity}x {c.ComponentName}
                      </div>
                    ))}
                  </td>
                  <td className="admin-actions">
                    <button className="btn btn-sm" onClick={() => openEdit(bd)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteAll(bd)}>Delete</button>
                  </td>
                </tr>
              ))}
              {breakdowns.length === 0 && (
                <tr><td colSpan="3" className="admin-empty">No recyclables found</td></tr>
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
