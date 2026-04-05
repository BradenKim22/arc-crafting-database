import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RARITY_COLORS = {
  common:    '#9ca3af',
  uncommon:  '#22c55e',
  rare:      '#3b82f6',
  epic:      '#a855f7',
  legendary: '#f59e0b',
};

function TreeNode({ node, depth = 0 }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.ingredients && node.ingredients.length > 0;
  const color = RARITY_COLORS[node.rarity] || '#9ca3af';

  return (
    <div className="tree-node" style={{ marginLeft: depth * 28 }}>
      <div className="tree-node-header" onClick={() => hasChildren && setExpanded(!expanded)}>
        {hasChildren && (
          <span className="tree-toggle">{expanded ? '▾' : '▸'}</span>
        )}
        {!hasChildren && <span className="tree-leaf">●</span>}

        <Link
          to={`/items/${node.lootId}`}
          className="tree-node-name"
          style={{ color }}
          onClick={(e) => e.stopPropagation()}
        >
          {node.quantity ? `${node.quantity}x ` : ''}{node.name}
        </Link>

        <span className={`rarity-badge rarity-${node.rarity} badge-sm`}>
          {node.rarity}
        </span>

        {node.category && (
          <span className="tree-type">{node.category}</span>
        )}

        {node.station && (
          <span className="tree-station">@ {node.station}</span>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="tree-children">
          {node.ingredients.map((child, i) => (
            <TreeNode key={`${child.lootId}-${i}`} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CraftingTree({ tree }) {
  if (!tree) return null;

  return (
    <div className="crafting-tree">
      <TreeNode node={tree} depth={0} />
    </div>
  );
}
