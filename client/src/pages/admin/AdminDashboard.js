import React, { useState, useEffect } from 'react';
import { adminGetStats } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminGetStats()
      .then(setStats)
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div className="error-msg">{error}</div>;
  if (!stats) return <div className="loading">Loading dashboard...</div>;

  const { counts, recentUsers } = stats;

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>

      <div className="stats-grid">
        <StatCard label="Users" value={counts.users} icon="◉" />
        <StatCard label="Active now" value={counts.active} icon="●" />
        <StatCard label="Items" value={counts.loot} icon="◈" />
        <StatCard label="Recipes" value={counts.recipes} icon="⬡" />
        <StatCard label="Blueprints" value={counts.blueprints} icon="◧" />
      </div>

      <div className="admin-panel">
        <h2>Recent users</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map(u => {
              const isOnline = u.LastActiveAt &&
                (Date.now() - new Date(u.LastActiveAt).getTime()) < 5 * 60 * 1000;
              return (
                <tr key={u.UserID}>
                  <td>{u.Username}</td>
                  <td>{u.Email}</td>
                  <td>{u.IsAdmin ? <span className="admin-badge">Admin</span> : 'User'}</td>
                  <td>
                    <span className={`status-dot ${isOnline ? 'status-online' : 'status-offline'}`} />
                    {isOnline ? 'Online' : 'Offline'}
                  </td>
                  <td>{new Date(u.CreatedAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}
