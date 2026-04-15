import React, { useState, useEffect, useCallback } from 'react';
import { getItems, getItemCategories } from '../services/api';
import ItemCard from '../components/ItemCard';

const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export default function HomePage() {
  const [items, setItems]           = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch]         = useState('');
  const [rarityFilter, setRarityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage]             = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    getItemCategories()
      .then(data => setCategories(data.categories))
      .catch(() => {});
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 21 };
      if (search) params.search = search;
      if (rarityFilter) params.rarity = rarityFilter;
      if (categoryFilter) params.category = categoryFilter;

      const data = await getItems(params);
      setItems(data.items);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, rarityFilter, categoryFilter, page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  function handleSearchChange(e) {
    setSearch(e.target.value);
    setPage(1);
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Item Database</h1>
        <p className="page-subtitle">Search and browse all Arc Raiders items, materials, and gear</p>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search items..."
          value={search}
          onChange={handleSearchChange}
        />

        <select
          className="filter-select"
          value={rarityFilter}
          onChange={(e) => { setRarityFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Rarities</option>
          {RARITIES.map((r) => (
            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.CategoryID} value={c.Name}>{c.Name}</option>
          ))}
        </select>
      </div>

      {error && <div className="error-msg">{error}</div>}
      {loading && <div className="loading">Loading items...</div>}

      {!loading && items.length === 0 && !error && (
        <div className="empty-state">No items found. Try different filters.</div>
      )}

      <div className="item-grid">
        {items.map((item) => (
          <ItemCard key={item.lootId} item={item} />
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
