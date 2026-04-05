import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes } from '../services/api';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getRecipes()
      .then((data) => setRecipes(data.recipes))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Recipes</h1>
        <p className="page-subtitle">All crafting blueprints</p>
      </div>

      {error && <div className="error-msg">{error}</div>}
      {loading && <div className="loading">Loading recipes...</div>}

      {!loading && recipes.length === 0 && !error && (
        <div className="empty-state">No recipes found.</div>
      )}

      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe.blueprintId} className="recipe-card">
            <div className="recipe-header">
              <span className="recipe-type-badge type-craft">craft</span>
              <Link to={`/items/${recipe.output.lootId}`} className="recipe-output-name">
                {recipe.output.name}
              </Link>
              <span className={`rarity-badge rarity-${recipe.output.rarity} badge-sm`}>
                {recipe.output.rarity}
              </span>
            </div>

            <div className="recipe-ingredients">
              <span className="recipe-label">Requires:</span>
              <ul className="ingredient-list">
                {recipe.components.map((comp) => (
                  <li key={comp.lootId}>
                    <Link to={`/items/${comp.lootId}`}>{comp.quantity}x {comp.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
