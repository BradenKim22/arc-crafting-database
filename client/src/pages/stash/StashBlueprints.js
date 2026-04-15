import React, { useState, useEffect } from 'react';
import { stashGetBlueprints, stashToggleBlueprint } from '../../services/api';

export default function StashBlueprints() {
  const [blueprints, setBlueprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    stashGetBlueprints()
      .then(data => {
        setBlueprints(data.blueprints);
        setError('');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleToggle(blueprintId) {
    try {
      const result = await stashToggleBlueprint(blueprintId);
      setBlueprints(prev =>
        prev.map(bp =>
          bp.BlueprintID === blueprintId ? { ...bp, Owned: result.owned ? 1 : 0 } : bp
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div className="loading">Loading...</div>;

  const owned = blueprints.filter(b => b.Owned);
  const notOwned = blueprints.filter(b => !b.Owned);

  return (
    <div>
      <h1 className="admin-page-title">Blueprints</h1>
      <p className="admin-page-desc">
        Click a blueprint to toggle whether you own it.
      </p>

      {error && <div className="error-msg">{error}</div>}

      {/* Owned blueprints */}
      {owned.length > 0 && (
        <div className="admin-panel">
          <h2>Owned ({owned.length})</h2>
          <div className="stash-bp-grid">
            {owned.map(bp => (
              <div key={bp.BlueprintID} className="stash-bp-card stash-bp-owned"
                onClick={() => handleToggle(bp.BlueprintID)}>
                <div className="stash-bp-status stash-bp-check">✓</div>
                <div className="stash-bp-info">
                  <div className="stash-bp-name">{bp.BlueprintItemName}</div>
                  <div className="stash-bp-meta">
                    <span className={`rarity-badge badge-sm rarity-${bp.OutputRarity.toLowerCase()}`}>
                      {bp.OutputRarity}
                    </span>
                    <span className="stash-bp-workshop">{bp.WorkshopType} Lv{bp.WorkshopLevel}</span>
                  </div>
                  <div className="stash-bp-output">Unlocks: {bp.RecipeName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Not owned */}
      {notOwned.length > 0 && (
        <div className="admin-panel">
          <h2>Not yet found ({notOwned.length})</h2>
          <div className="stash-bp-grid">
            {notOwned.map(bp => (
              <div key={bp.BlueprintID} className="stash-bp-card stash-bp-missing"
                onClick={() => handleToggle(bp.BlueprintID)}>
                <div className="stash-bp-status">○</div>
                <div className="stash-bp-info">
                  <div className="stash-bp-name">{bp.BlueprintItemName}</div>
                  <div className="stash-bp-meta">
                    <span className={`rarity-badge badge-sm rarity-${bp.OutputRarity.toLowerCase()}`}>
                      {bp.OutputRarity}
                    </span>
                    <span className="stash-bp-workshop">{bp.WorkshopType} Lv{bp.WorkshopLevel}</span>
                  </div>
                  <div className="stash-bp-output">Unlocks: {bp.RecipeName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {blueprints.length === 0 && (
        <div className="empty-state">No blueprints in the database yet.</div>
      )}
    </div>
  );
}
