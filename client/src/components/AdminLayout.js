import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/admin',              label: 'Dashboard',    icon: '▣' },
  { to: '/admin/users',        label: 'Users',        icon: '◉' },
  { to: '/admin/items',        label: 'Items',        icon: '◈' },
  { to: '/admin/recipes',      label: 'Recipes',      icon: '⬡' },
  { to: '/admin/blueprints',   label: 'Blueprints',   icon: '◧' },
  { to: '/admin/recyclables',  label: 'Recyclables',  icon: '⟳' },
  { to: '/admin/categories',  label: 'Categories',   icon: '▤' },
  { to: '/admin/found-in',    label: 'Found In',     icon: '◎' },
];

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title">Admin Panel</div>
        <nav className="admin-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
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
