import React from 'react';
import { Link } from 'react-router-dom';

const RARITY_COLORS = {
  common:    '#9ca3af',
  uncommon:  '#22c55e',
  rare:      '#3b82f6',
  epic:      '#a855f7',
  legendary: '#eab308',
};

export default function ItemCard({ item }) {
  const rarity = item.rarity.toLowerCase();
  const borderColor = RARITY_COLORS[rarity] || '#9ca3af';

  return (
    <Link to={`/items/${item.lootId}`} className={`item-card item-card-${rarity}`} style={{ borderLeftColor: borderColor }}>
      <div className="item-card-inner">
        <div className={`item-card-img-wrap img-bg-${rarity}`} style={{ borderColor }}>
          <img
            src={item.imageUrl || '/images/default-item.svg'}
            alt={item.name}
            className="item-card-img"
            onError={(e) => { e.target.src = '/images/default-item.svg'; }}
          />
        </div>
        <div className="item-card-content">
          <div className="item-card-header">
            <h3 className="item-card-name">{item.name}</h3>
            <span className={`rarity-badge rarity-${rarity}`}>
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
          <div className="item-card-tags">
            {item.categoryIcon && (
              <img src={item.categoryIcon} alt={item.category} title={item.category} className="item-tag-icon" />
            )}
            {!item.categoryIcon && item.category && (
              <span className="item-card-type" title={item.category}>{item.category}</span>
            )}
            {item.foundIn && (
              <span className="item-card-type item-card-foundin">{item.foundIn}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
