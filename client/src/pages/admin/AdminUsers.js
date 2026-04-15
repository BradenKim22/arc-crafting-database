import React, { useState, useEffect, useCallback } from 'react';
import { adminGetUsers, adminDeleteUser, adminToggleAdmin } from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 25 };
    if (search) params.search = search;

    adminGetUsers(params)
      .then(data => {
        setUsers(data.users);
        setPagination(data.pagination);
        setError('');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  }

  async function handleDelete(userId, username) {
    if (!window.confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    try {
      await adminDeleteUser(userId);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggleAdmin(userId) {
    try {
      await adminToggleAdmin(userId);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 className="admin-page-title">Users</h1>

      <form onSubmit={handleSearch} className="admin-search-bar">
        <input
          type="text"
          placeholder="Search by username, email, or gamertag..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="btn btn-accent">Search</button>
      </form>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>GamerTag</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.UserID}>
                  <td>{u.UserID}</td>
                  <td>{u.Username}</td>
                  <td>{u.Email}</td>
                  <td>{u.GamerTag || '—'}</td>
                  <td>{u.IsAdmin ? <span className="admin-badge">Admin</span> : 'User'}</td>
                  <td>{new Date(u.CreatedAt).toLocaleDateString()}</td>
                  <td className="admin-actions">
                    <button
                      className="btn btn-sm"
                      onClick={() => handleToggleAdmin(u.UserID)}
                      title={u.IsAdmin ? 'Remove admin' : 'Make admin'}
                    >
                      {u.IsAdmin ? 'Demote' : 'Promote'}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(u.UserID, u.Username)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="7" className="admin-empty">No users found</td></tr>
              )}
            </tbody>
          </table>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button className="btn btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
              <span className="pagination-info">Page {pagination.page} of {pagination.pages}</span>
              <button className="btn btn-sm" disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
