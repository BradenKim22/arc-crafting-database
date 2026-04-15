import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate('/');
  }

  function navClass({ isActive }) {
    return `navbar-link ${isActive ? 'navbar-link-active' : ''}`;
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" end className="navbar-brand">
          <span className="brand-icon">△</span>
          <span>ARC RAIDERS</span>
        </NavLink>

        <div className="navbar-links">
          <NavLink to="/" end className={navClass}>Items</NavLink>
          <NavLink to="/recipes" className={navClass}>Recipes</NavLink>
          {user ? (
            <>
              <NavLink to="/stash" className={navClass}>My Stash</NavLink>
              {user.isAdmin && (
                <NavLink to="/admin" className={navClass}>Admin</NavLink>
              )}
              <NavLink to="/account" className={navClass}>Account</NavLink>
              <span className="navbar-user">{user.username}</span>
              <button onClick={handleLogout} className="btn btn-sm btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>Login</NavLink>
              <NavLink to="/register" className={navClass}>Register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
