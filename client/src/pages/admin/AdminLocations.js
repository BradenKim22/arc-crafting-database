import React, { useState, useEffect, useCallback } from 'react';
import {
  adminGetLocations, adminCreateLocation, adminDeleteLocation, adminGetAllLootNames,
} from '../../services/api';

export default function AdminLocations() {
  const [locations, setLocations] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [lootOptions, setLootOptions] = useState([]);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ lootId: '', locationName: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    adminGetAllLootNames().then(d => setLootOptions(d.items)).catch(() => {});
  }, []);

  const fetchLocations = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 25 };
    if (search) params.search = search;

    adminGetLocations(params)
      .then(data => { setLocations(data.locations); setPagination(data.pagination); setError(''); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => { fetchLocations(); }, [fetchLocations]);

  async function handleCreate(e) {
    e.preventDefault();
    setFormError('');
    try {
      await adminCreateLocation({ lootId: Number(form.lootId), locationName: form.locationName });
      setShowForm(false);
      setForm({ lootId: '', locationName: '' });
      fetchLocations();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleDelete(lootId, locationName, itemName) {
    if (!window.confirm(`Delete location "${locationName}" from ${itemName}?`)) return;
    try {
      await adminDeleteLocation(lootId, locationName);
      fetchLocations();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Loot locations</h1>
        <button className="btn btn-accent" onClick={() => { setShowForm(true); setFormError(''); }}>+ Add location</button>
      </div>

      <div className="admin-search-bar">
        <input
          type="text" placeholder="Search by item or location name..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="search-input"
        />
      </div>

      {error && <div className="error-msg">{error}</div>}

      {showForm && (
        <div className="admin-form-panel">
          <h2>New location</h2>
          {formError && <div className="error-msg">{formError}</div>}
          <form onSubmit={handleCreate} className="admin-form">
            <label>
              Item
              <select value={form.lootId} onChange={e => setForm({ ...form, lootId: e.target.value })} required>
                <option value="">Select item...</option>
                {lootOptions.map(l => <option key={l.LootID} value={l.LootID}>{l.Name}</option>)}
              </select>
            </label>
            <label>
              Location name
              <input
                type="text" value={form.locationName}
                onChange={e => setForm({ ...form, locationName: e.target.value })}
                placeholder="e.g. Abandoned Factory, Northern Plains"
                required
              />
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
                <th>Item</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.map(loc => (
                <tr key={`${loc.LootID}-${loc.LocationName}`}>
                  <td>{loc.ItemName}</td>
                  <td>{loc.LocationName}</td>
                  <td className="admin-actions">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(loc.LootID, loc.LocationName, loc.ItemName)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {locations.length === 0 && (
                <tr><td colSpan="3" className="admin-empty">No locations found</td></tr>
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
