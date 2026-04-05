import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getItemById, getCraftingTree } from '../services/api';
import CraftingTree from '../components/CraftingTree';

const RARITY_COLORS = {
  common:    '#9ca3af',
  uncommon:  '#22c55e',
  rare:      '#3b82f6',
  epic:      '#a855f7',
  legendary: '#f59e0b',
};

export default function ItemDetailPage() {
  const { id } = useParams();
  const [data, setData]       = useState(null);
  const [tree, setTree]       = useState(null);
  const [showTree, setShowTree] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getItemById(id)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleShowTree() {
    if (tree) {
      setShowTree(!showTree);
      return;
    }
    try {
      const treeData = await getCraftingTree(id);
      setTree(treeData);
      setShowTree(true);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div className="page"><div className="loading">Loading...</div></div>;
  if (error) return <div className="page"><div className="error-msg">{error}</div></div>;
  if (!data) return null;

  const { item, crafting, breakdownSources, breaksInto } = data;
  const borderColor = RARITY_COLORS[item.rarity] || '#9ca3af';

  return (
    <div className="page">
      <Link to="/" className="back-link">← Back to items</Link>

      {/* Item Header */}
      <div className="item-detail-header" style={{ borderLeftColor: borderColor }}>
        <h1 className="item-detail-name">{item.name}</h1>
        <div className="item-detail-meta">
          <span className={`rarity-badge rarity-${item.rarity}`}>{item.rarity}</span>
          <span className="type-badge">{item.category}</span>
        </div>
        {item.description && (
          <p className="item-detail-desc">{item.description}</p>
        )}
      </div>

      {/* Two-Column Layout: How to Craft | Breakdown Sources */}
      <div className="detail-columns">
        {/* LEFT COLUMN: How to Craft */}
        <div className="detail-column">
          <h2 className="detail-column-title">How to Craft</h2>
          <div className="column-content">
            {crafting && crafting.length > 0 ? (
              <div className="blueprint-components">
                {crafting.map((recipe) => (
                  <div key={recipe.blueprintId}>
                    {recipe.components && recipe.components.map((ing) => (
                      <div key={ing.lootId} className="blueprint-component">
                        <span className="component-quantity">{ing.quantity}x</span>
                        <Link to={`/items/${ing.lootId}`}>{ing.name}</Link>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data-message">No crafting recipe available</div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Breakdown Sources */}
        <div className="detail-column">
          <h2 className="detail-column-title">Breakdown Sources</h2>
          <div className="column-content">
            {breakdownSources && breakdownSources.length > 0 ? (
              <div className="breakdown-sources">
                {breakdownSources.map((src) => (
                  <div key={src.lootId} className="breakdown-source">
                    <Link to={`/items/${src.lootId}`}>{src.name}</Link>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      ({src.quantity}x disassemble)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data-message">No breakdown sources found</div>
            )}
          </div>
        </div>
      </div>

      {/* Breaks Into Section */}
      {breaksInto && breaksInto.length > 0 && (
        <div className="breaks-into-section">
          <h2 className="section-title">Breaks Into</h2>
          <div className="breaks-into-list">
            {breaksInto.map((out, i) => (
              <div key={i} className="breaks-into-item">
                <Link to={`/items/${out.lootId}`}>
                  {out.quantity}x {out.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crafting Tree Button & View */}
      {crafting && crafting.length > 0 && (
        <>
          <button onClick={handleShowTree} className="btn btn-accent tree-toggle-btn" style={{ marginTop: '24px' }}>
            {showTree ? 'Hide' : 'Show'} Crafting Tree
          </button>

          {showTree && tree && (
            <div className="section">
              <h2 className="section-title">Crafting Tree</h2>
              <CraftingTree tree={tree} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
