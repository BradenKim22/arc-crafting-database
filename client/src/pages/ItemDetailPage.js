import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getItemById, getCraftingTree, getRecyclingTree, stashAnalyzeItem } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CraftingTree from '../components/CraftingTree';
import RecyclingTree from '../components/RecyclingTree';

const RARITY_COLORS = {
  common:    '#9ca3af',
  uncommon:  '#22c55e',
  rare:      '#3b82f6',
  epic:      '#a855f7',
  legendary: '#eab308',
};

export default function ItemDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData]       = useState(null);
  const [tree, setTree]       = useState(null);
  const [showTree, setShowTree] = useState(false);
  const [recycleTree, setRecycleTree] = useState(null);
  const [showRecycleTree, setShowRecycleTree] = useState(false);
  const [stashData, setStashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [treeError, setTreeError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    setTreeError('');
    setStashData(null);
    setTree(null);
    setRecycleTree(null);
    setShowTree(false);
    setShowRecycleTree(false);
    getItemById(id)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch stash analysis when logged in and item loads
  useEffect(() => {
    if (user && id) {
      stashAnalyzeItem(id)
        .then(setStashData)
        .catch(() => setStashData(null));
    }
  }, [user, id]);

  async function handleShowTree() {
    if (tree) {
      setShowTree(!showTree);
      return;
    }
    setTreeError('');
    try {
      const treeData = await getCraftingTree(id);
      setTree(treeData);
      setShowTree(true);
    } catch (err) {
      setTreeError(err.message);
    }
  }

  async function handleShowRecycleTree() {
    if (recycleTree) {
      setShowRecycleTree(!showRecycleTree);
      return;
    }
    setTreeError('');
    try {
      const treeData = await getRecyclingTree(id);
      setRecycleTree(treeData);
      setShowRecycleTree(true);
    } catch (err) {
      setTreeError(err.message);
    }
  }

  if (loading) return <div className="page"><div className="loading">Loading...</div></div>;
  if (error) return <div className="page"><div className="error-msg">{error}</div></div>;
  if (!data) return null;

  const { item, crafting, breakdownSources, breaksInto } = data;
  const rarity = item.rarity.toLowerCase();
  const borderColor = RARITY_COLORS[rarity] || '#9ca3af';

  return (
    <div className="page">
      <Link to="/" className="back-link">← Back to items</Link>

      {/* Item Header */}
      <div className={`item-detail-header item-card-${rarity}`} style={{ borderLeftColor: borderColor }}>
        <div className="item-detail-inner">
          <div className={`item-detail-img-wrap img-bg-${rarity}`} style={{ borderColor }}>
            <img
              src={item.imageUrl || '/images/default-item.svg'}
              alt={item.name}
              className="item-detail-img"
              onError={(e) => { e.target.src = '/images/default-item.svg'; }}
            />
          </div>
          <div className="item-detail-text">
            <h1 className="item-detail-name">{item.name}</h1>
            <div className="item-detail-meta">
              <span className={`rarity-badge rarity-${rarity}`}>{item.rarity}</span>
              {item.categoryIcon ? (
                <img src={item.categoryIcon} alt={item.category} title={item.category} className="item-tag-icon item-tag-icon-detail" />
              ) : (
                <span className="type-badge">{item.category}</span>
              )}
              {item.foundIn && (
                <span className="type-badge type-badge-foundin">{item.foundIn}</span>
              )}
            </div>
            {item.description && (
              <p className="item-detail-desc">{item.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Two-Column Layout: How to Craft | Recycle Other Sources */}
      <div className="detail-columns">
        <div className="detail-column">
          <h2 className="detail-column-title">How to Craft</h2>
          <div className="column-content">
            {crafting && crafting.length > 0 ? (
              <div className="blueprint-components">
                {crafting.map((recipe) => (
                  <div key={recipe.recipeId || recipe.blueprintId}>
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

        <div className="detail-column">
          <h2 className="detail-column-title">Recycle Other Sources</h2>
          <div className="column-content">
            {breakdownSources && breakdownSources.length > 0 ? (
              <div className="breakdown-sources">
                {breakdownSources.map((src) => (
                  <div key={src.lootId} className="breakdown-source">
                    <Link to={`/items/${src.lootId}`}>{src.name}</Link>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      ({src.quantity}x yield)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data-message">No recyclable sources found</div>
            )}
          </div>
        </div>
      </div>

      {/* Recycles Into */}
      {breaksInto && breaksInto.length > 0 && (
        <div className="breaks-into-section">
          <h2 className="section-title">Recycles Into</h2>
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

      {/* Your Stash */}
      <div className="section stash-analysis-section">
        <h2 className="section-title">Your Stash</h2>
        {!user ? (
          <div className="stash-login-prompt">
            <Link to="/login">Log in</Link> to see how your stash can help you get this item.
          </div>
        ) : !stashData ? (
          <div className="loading">Checking your stash...</div>
        ) : (
          <StashAnalysis item={item} stashData={stashData} />
        )}
      </div>

      {/* Tree buttons */}
      <div className="tree-buttons" style={{ marginTop: '24px' }}>
        {crafting && crafting.length > 0 && (
          <button onClick={handleShowTree} className="btn btn-accent tree-toggle-btn">
            {showTree ? 'Hide' : 'Show'} Crafting Tree
          </button>
        )}
        {breakdownSources && breakdownSources.length > 0 && (
          <button onClick={handleShowRecycleTree} className="btn btn-accent tree-toggle-btn">
            {showRecycleTree ? 'Hide' : 'Show'} Recycling Tree
          </button>
        )}
      </div>

      {treeError && <div className="error-msg">{treeError}</div>}

      {showTree && tree && (
        <div className="section">
          <h2 className="section-title">Crafting Tree</h2>
          <CraftingTree tree={tree} />
        </div>
      )}

      {showRecycleTree && recycleTree && (
        <div className="section">
          <h2 className="section-title">Recycling Tree</h2>
          <RecyclingTree tree={recycleTree} />
        </div>
      )}
    </div>
  );
}

// Sub-component: stash analysis display
function StashAnalysis({ item, stashData }) {
  const { directHave, craftingOptions, recycleOptions } = stashData;
  const hasCrafting = craftingOptions.length > 0;
  const hasRecycling = recycleOptions.length > 0;
  const hasNothing = !hasCrafting && !hasRecycling && directHave === 0;

  return (
    <div className="stash-analysis">
      {/* Direct ownership */}
      {directHave > 0 && (
        <div className="stash-analysis-card stash-have">
          <div className="stash-analysis-icon">✓</div>
          <div className="stash-analysis-body">
            <div className="stash-analysis-title">You have {directHave}x {item.name} in your stash</div>
          </div>
        </div>
      )}

      {/* Crafting options */}
      {hasCrafting && (
        <div className="stash-analysis-group">
          <h3 className="stash-analysis-heading">Craft it</h3>
          {craftingOptions.map(recipe => (
            <div key={recipe.recipeId} className={`stash-analysis-card ${recipe.canCraft ? 'stash-craftable' : ''}`}>
              <div className="stash-analysis-body">
                <div className="stash-analysis-title">
                  {recipe.name}
                  <span className="stash-analysis-meta">{recipe.workshopType} Lv{recipe.workshopLevel}</span>
                </div>
                {recipe.canCraft ? (
                  <div className="stash-analysis-status stash-status-ready">You have everything needed</div>
                ) : (
                  <div className="stash-analysis-status stash-status-missing">Missing stash inventory</div>
                )}

                {/* Workbench + Blueprint requirements */}
                <div className="stash-req-group">
                  <div className={`stash-req-row ${recipe.hasWorkbench ? 'stash-req-ok' : 'stash-req-missing'}`}>
                    <span className="stash-req-label">Workbench</span>
                    <span className="stash-req-value">
                      {recipe.hasWorkbench
                        ? `${recipe.workshopType} Lv${recipe.workshopLevel} ✓`
                        : recipe.userWorkbenchLevel > 0
                          ? `Need ${recipe.workshopType} Lv${recipe.workshopLevel} (you have Lv${recipe.userWorkbenchLevel})`
                          : `Need ${recipe.workshopType} Lv${recipe.workshopLevel}`
                      }
                    </span>
                  </div>
                  <div className={`stash-req-row ${recipe.hasBlueprint ? 'stash-req-ok' : 'stash-req-missing'}`}>
                    <span className="stash-req-label">Blueprint</span>
                    <span className="stash-req-value">
                      {recipe.isDefault
                        ? 'Default recipe (no blueprint needed)'
                        : recipe.hasBlueprint
                          ? `${recipe.blueprint?.name || 'Blueprint'} ✓`
                          : recipe.blueprint
                            ? `Need ${recipe.blueprint.name}`
                            : 'Blueprint required'
                      }
                    </span>
                  </div>
                </div>

                {/* Materials */}
                <div className="stash-analysis-materials">
                  {recipe.components.map(c => (
                    <div key={c.lootId} className={`stash-mat-row ${c.enough ? 'stash-mat-ok' : 'stash-mat-missing'}`}>
                      <Link to={`/items/${c.lootId}`}>{c.name}</Link>
                      <span className="stash-mat-qty">
                        {c.have}/{c.needed}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recycle options */}
      {hasRecycling && (
        <div className="stash-analysis-group">
          <h3 className="stash-analysis-heading">Recycle from stash</h3>
          <div className="stash-analysis-recycle-grid">
            {recycleOptions.map(opt => (
              <div key={opt.lootId} className="stash-analysis-card stash-recyclable">
                <div className="stash-analysis-icon">⟳</div>
                <div className="stash-analysis-body">
                  <div className="stash-analysis-title">
                    <Link to={`/items/${opt.lootId}`}>{opt.name}</Link>
                  </div>
                  <div className="stash-analysis-detail">
                    You have {opt.haveQty}x — recycling yields {opt.yieldsQty}x {item.name} each
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No crafting or recycling data at all */}
      {!hasCrafting && !hasRecycling && directHave === 0 && (
        <div className="stash-analysis-status stash-status-missing" style={{ padding: '12px 0' }}>
          No crafting recipes or recyclable sources exist for this item. Add items to <Link to="/stash/items">your stash</Link> to track what you have.
        </div>
      )}
    </div>
  );
}
