import React, { useState, useEffect, useCallback } from 'react';
import {
  stashGetItems, stashAddItem, stashUpdateItem, stashRemoveItem, stashGetLootNames,
} from '../../services/api';

export default function StashItems() {
  const [items, setItems] = useState([]);
  const [lootOptions, setLootOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ lootId: '', quantity: 1 });
  const [formError, setFormError] = useState('');

  // Inline edit
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState(1);

  const fetchItems = useCallback(() => {
    setLoading(true);
    stashGetItems()
      .then(data => { setItems(data.items); setError(''); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  function openAdd() {
    setFormError('');
    setForm({ lootId: '', quantity: 1 });
    if (lootOptions.length === 0) {
      stashGetLootNames().then(d => setLootOptions(d.items)).catch(() => {});
    }
    setShowForm(true);
  }

  async function handleAdd(e) {
    e.preventDefault();
    setFormError('');
    try {
      await stashAddItem({ lootId: Number(form.lootId), quantity: Number(form.quantity) });
      setShowForm(false);
      fetchItems();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleSaveEdit(lootId) {
    try {
      await stashUpdateItem(lootId, { quantity: Number(editQty) });
      setEditingId(null);
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRemove(lootId, name) {
    if (!window.confirm(`Remove "${name}" from your stash?`)) return;
    try {
      await stashRemoveItem(lootId);
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Items</h1>
        <button className="btn btn-accent" onClick={openAdd}>+ Add item</button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {showForm && (
        <div className="admin-form-panel">
          <h2>Add item to stash</h2>
          {formError && <div className="error-msg">{formError}</div>}
          <form onSubmit={handleAdd} className="admin-form">
            <label>
              Item
              <select value={form.lootId} onChange={e => setForm({ ...form, lootId: e.target.value })} required>
                <option value="">Select item...</option>
                {lootOptions.map(l => (
                  <option key={l.LootID} value={l.LootID}>{l.Name} ({l.Rarity})</option>
                ))}
              </select>
            </label>
            <label>
              Quantity
              <input type="number" min="1" value={form.quantity}
                onChange={e => setForm({ ...form, quantity: e.target.value })} required />
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
        <table className="admin-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Rarity</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const isEditing = editingId === item.LootID;
              return (
                <tr key={item.LootID}>
                  <td>{item.Name}</td>
                  <td>
                    <span className={`rarity-badge badge-sm rarity-${item.Rarity.toLowerCase()}`}>
                      {item.Rarity}
                    </span>
                  </td>
                  <td>
                    {isEditing ? (
                      <input type="number" min="0" value={editQty}
                        onChange={e => setEditQty(e.target.value)}
                        className="admin-inline-input" />
                    ) : (
                      item.Quantity
                    )}
                  </td>
                  <td className="admin-actions">
                    {isEditing ? (
                      <>
                        <button className="btn btn-sm btn-accent" onClick={() => handleSaveEdit(item.LootID)}>Save</button>
                        <button className="btn btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm" onClick={() => { setEditingId(item.LootID); setEditQty(item.Quantity); }}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleRemove(item.LootID, item.Name)}>Remove</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr><td colSpan="4" className="admin-empty">No items in your stash yet</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
