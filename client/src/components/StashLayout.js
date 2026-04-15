import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/stash',             label: 'Overview',    icon: '▣' },
  { to: '/stash/items',       label: 'Items',       icon: '◈' },
  { to: '/stash/blueprints',  label: 'Blueprints',  icon: '◧' },
  { to: '/stash/workbench',   label: 'Workbench',   icon: '⬡' },
];

export default function StashLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar stash-sidebar">
        <div className="admin-sidebar-title stash-sidebar-title">My Stash</div>
        <nav className="admin-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/stash'}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? 'admin-nav-active' : ''}`
              }
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
