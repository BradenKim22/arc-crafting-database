import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RARITY_COLORS = {
  common:    '#9ca3af',
  uncommon:  '#22c55e',
  rare:      '#3b82f6',
  epic:      '#a855f7',
  legendary: '#eab308',
};

function TreeNode({ node, depth = 0 }) {
  const [expanded, setExpanded] = useState(true);
  const hasSources = node.sources && node.sources.length > 0;
  const rarity = (node.rarity || 'common').toLowerCase();
  const color = RARITY_COLORS[rarity] || '#9ca3af';

  return (
    <div className="tree-node" style={{ marginLeft: depth * 28 }}>
      <div className="tree-node-header" onClick={() => hasSources && setExpanded(!expanded)}>
        {hasSources && (
          <span className="tree-toggle">{expanded ? '▾' : '▸'}</span>
        )}
        {!hasSources && <span className="tree-leaf">●</span>}

        <Link
          to={`/items/${node.lootId}`}
          className="tree-node-name"
          style={{ color }}
          onClick={(e) => e.stopPropagation()}
        >
          {node.yieldsQty ? `${node.yieldsQty}x yield ← ` : ''}{node.name}
        </Link>

        <span className={`rarity-badge rarity-${rarity} badge-sm`}>
          {node.rarity}
        </span>

        {node.category && (
          <span className="tree-type">{node.category}</span>
        )}
      </div>

      {hasSources && expanded && (
        <div className="tree-children">
          {node.sources.map((child, i) => (
            <TreeNode key={`${child.lootId}-${i}`} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function RecyclingTree({ tree }) {
  if (!tree) return null;

  return (
    <div className="crafting-tree">
      <TreeNode node={tree} depth={0} />
    </div>
  );
}
