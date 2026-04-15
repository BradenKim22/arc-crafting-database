import React, { useState, useEffect, useCallback } from 'react';
import {
  stashGetWorkbenches, stashUpsertWorkbench, stashRemoveWorkbench, stashGetWorkshopTypes,
} from '../../services/api';

export default function StashWorkbench() {
  const [workbenches, setWorkbenches] = useState([]);
  const [workshopTypes, setWorkshopTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: '', level: '1' });
  const [formError, setFormError] = useState('');

  const fetchWorkbenches = useCallback(() => {
    setLoading(true);
    stashGetWorkbenches()
      .then(data => { setWorkbenches(data.workbenches); setError(''); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchWorkbenches(); }, [fetchWorkbenches]);

  function openAdd() {
    setFormError('');
    setForm({ category: '', level: '1' });
    if (workshopTypes.length === 0) {
      stashGetWorkshopTypes().then(d => setWorkshopTypes(d.types)).catch(() => {});
    }
    setShowForm(true);
  }

  async function handleAdd(e) {
    e.preventDefault();
    setFormError('');
    try {
      await stashUpsertWorkbench({ category: form.category, level: Number(form.level) });
      setShowForm(false);
      fetchWorkbenches();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleLevelChange(wb, newLevel) {
    try {
      await stashUpsertWorkbench({ category: wb.Category, level: Number(newLevel) });
      fetchWorkbenches();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRemove(wb) {
    if (!window.confirm(`Remove your ${wb.Category}?`)) return;
    try {
      await stashRemoveWorkbench(wb.WorkbenchID);
      fetchWorkbenches();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Workbench</h1>
        <button className="btn btn-accent" onClick={openAdd}>+ Add workbench</button>
      </div>
      <p className="admin-page-desc">
        Set which workbenches you have and their current level.
      </p>

      {error && <div className="error-msg">{error}</div>}

      {showForm && (
        <div className="admin-form-panel">
          <h2>Add workbench</h2>
          {formError && <div className="error-msg">{formError}</div>}
          <form onSubmit={handleAdd} className="admin-form">
            <label>
              Workbench type
              {workshopTypes.length > 0 ? (
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select type...</option>
                  {workshopTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              ) : (
                <input type="text" value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  placeholder="e.g. Mechanical Workbench" required />
              )}
            </label>
            <label>
              Level
              <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
              </select>
            </label>
            <div className="form-buttons">
              <button type="submit" className="btn btn-accent">Add</button>
              <button type="button" className="btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="stash-wb-grid">
          {workbenches.map(wb => (
            <div key={wb.WorkbenchID || wb.Category} className={`stash-wb-card ${wb.IsDefault ? 'stash-wb-default' : ''}`}>
              <div className="stash-wb-header">
                <span className="stash-wb-name">
                  {wb.Category}
                  {wb.IsDefault && <span className="stash-wb-tag">Default</span>}
                </span>
                {!wb.IsDefault && (
                  <button className="btn btn-sm btn-danger" onClick={() => handleRemove(wb)}>Remove</button>
                )}
              </div>
              <div className="stash-wb-levels">
                {Array.from({ length: wb.MaxLevel || 3 }, (_, i) => i + 1).map(lvl => (
                  <button
                    key={lvl}
                    className={`stash-wb-lvl ${wb.Level >= lvl ? 'stash-wb-lvl-active' : ''}`}
                    onClick={() => !wb.IsDefault && handleLevelChange(wb, lvl)}
                    disabled={wb.IsDefault}
                  >
                    Lv{lvl}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {workbenches.length === 0 && (
            <div className="empty-state">No workbenches added yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
