import React from 'react';
import { Link } from 'react-router-dom';

const RARITY_COLORS = {
  common:    '#9ca3af',
  uncommon:  '#22c55e',
  rare:      '#3b82f6',
  epic:      '#a855f7',
  legendary: '#f59e0b',
};

export default function ItemCard({ item }) {
  const borderColor = RARITY_COLORS[item.rarity] || '#9ca3af';

  return (
    <Link to={`/items/${item.lootId}`} className="item-card" style={{ borderLeftColor: borderColor }}>
      <div className="item-card-header">
        <h3 className="item-card-name">{item.name}</h3>
        <span className={`rarity-badge rarity-${item.rarity}`}>
          {item.rarity}
        </span>
      </div>
      <p className="item-card-desc">
        {item.description
          ? item.description.length > 100
            ? item.description.slice(0, 100) + '...'
            : item.description
          : 'No description'}
      </p>
      <span className="item-card-type">{item.category}</span>
    </Link>
  );
}
