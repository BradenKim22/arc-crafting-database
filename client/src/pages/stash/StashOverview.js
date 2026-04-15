import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { stashGetItems, stashGetBlueprints, stashGetWorkbenches } from '../../services/api';

export default function StashOverview() {
  const [counts, setCounts] = useState({ items: 0, blueprints: 0, workbenches: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      stashGetItems(),
      stashGetBlueprints(),
      stashGetWorkbenches(),
    ]).then(([itemData, bpData, wbData]) => {
      setCounts({
        items: itemData.items.length,
        blueprints: bpData.blueprints.filter(b => b.Owned).length,
        workbenches: wbData.workbenches.length,
      });
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading stash...</div>;

  return (
    <div>
      <h1 className="admin-page-title">My Stash</h1>
      <p className="admin-page-desc">Track your inventory, blueprints, and workbench levels.</p>

      <div className="stats-grid">
        <Link to="/stash/items" className="stat-card stat-card-link">
          <div className="stat-card-icon">◈</div>
          <div className="stat-card-value">{counts.items}</div>
          <div className="stat-card-label">Items owned</div>
        </Link>
        <Link to="/stash/blueprints" className="stat-card stat-card-link">
          <div className="stat-card-icon">◧</div>
          <div className="stat-card-value">{counts.blueprints}</div>
          <div className="stat-card-label">Blueprints found</div>
        </Link>
        <Link to="/stash/workbench" className="stat-card stat-card-link">
          <div className="stat-card-icon">⬡</div>
          <div className="stat-card-value">{counts.workbenches}</div>
          <div className="stat-card-label">Workbenches</div>
        </Link>
      </div>
    </div>
  );
}
