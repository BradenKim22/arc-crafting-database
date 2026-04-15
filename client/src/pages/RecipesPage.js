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
        <p className="page-subtitle">All crafting recipes in Arc Raiders</p>
      </div>

      {error && <div className="error-msg">{error}</div>}
      {loading && <div className="loading">Loading recipes...</div>}

      {!loading && recipes.length === 0 && !error && (
        <div className="empty-state">No recipes found.</div>
      )}

      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe.recipeId} className={`recipe-card item-card-${recipe.output.rarity.toLowerCase()}`}>
            <div className="recipe-header">
              <Link to={`/items/${recipe.output.lootId}`} className="recipe-output-name">
                {recipe.output.name}
              </Link>
              <span className={`rarity-badge rarity-${recipe.output.rarity.toLowerCase()} badge-sm`}>
                {recipe.output.rarity}
              </span>
            </div>

            <div className="recipe-meta">
              <span className="recipe-meta-item">
                {recipe.workshopType} Lv{recipe.workshopLevel}
              </span>
              {recipe.isDefault ? (
                <span className="recipe-tag tag-default">Default</span>
              ) : recipe.blueprint ? (
                <span className="recipe-tag tag-blueprint">
                  Blueprint: <Link to={`/items/${recipe.blueprint.lootId}`}>{recipe.blueprint.name}</Link>
                </span>
              ) : (
                <span className="recipe-tag tag-blueprint">Blueprint required</span>
              )}
            </div>

            <div className="recipe-ingredients">
              <span className="recipe-label">Materials:</span>
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
