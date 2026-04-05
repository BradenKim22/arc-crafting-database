import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⚡</span>
          <span>ARC RAIDERS</span>
        </Link>

        <div className="navbar-links">
          <Link to="/">Items</Link>
          <Link to="/recipes">Recipes</Link>
          {user ? (
            <>
              <span className="navbar-user">
                {user.username}
              </span>
              <Link to="/account" className="btn btn-sm">
                Account
              </Link>
              <button onClick={handleLogout} className="btn btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-sm btn-accent">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
