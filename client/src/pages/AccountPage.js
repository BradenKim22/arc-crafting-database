import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword, deleteAccount } from '../services/api';

export default function AccountPage() {
  const { user, loading, logoutUser } = useAuth();
  const navigate = useNavigate();

  // Profile editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editGamertag, setEditGamertag] = useState('');

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Messages
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
    if (user) {
      setEditUsername(user.username || '');
      setEditEmail(user.email || '');
      setEditGamertag(user.gamertag || '');
    }
  }, [user, loading, navigate]);

  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Profile Update
  async function handleProfileSave() {
    clearMessages();
    if (!editUsername || !editEmail) {
      setErrorMessage('Username and email are required');
      return;
    }

    setLoadingAction(true);
    try {
      await updateProfile(editUsername, editEmail, editGamertag);
      setSuccessMessage('Profile updated successfully!');
      setIsEditingProfile(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoadingAction(false);
    }
  }

  function handleProfileCancel() {
    setIsEditingProfile(false);
    setEditUsername(user.username || '');
    setEditEmail(user.email || '');
    setEditGamertag(user.gamertag || '');
    clearMessages();
  }

  // Password Change
  async function handlePasswordChange() {
    clearMessages();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage('All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters');
      return;
    }

    setLoadingAction(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccessMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoadingAction(false);
    }
  }

  // Delete Account
  async function handleDeleteAccount() {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    const password = prompt('Enter your password to confirm account deletion:');
    if (!password) return;

    setLoadingAction(true);
    try {
      await deleteAccount(password);
      logoutUser();
      navigate('/');
    } catch (err) {
      setErrorMessage(err.message);
      setLoadingAction(false);
    }
  }

  if (loading) {
    return <div className="page"><div className="loading">Loading account...</div></div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="page account-page-container">
      <div className="page-header">
        <h1>Account Settings</h1>
        <p className="page-subtitle">Manage your Arc Raiders account</p>
      </div>

      {successMessage && <div className="success-msg">{successMessage}</div>}
      {errorMessage && <div className="error-msg">{errorMessage}</div>}

      {/* Profile Section */}
      <div className="account-section">
        <h2>Profile</h2>

        {!isEditingProfile ? (
          <>
            <div className="profile-display">
              <div className="profile-field">
                <span className="profile-label">Username</span>
                <span className="profile-value">{user.username}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">Email</span>
                <span className="profile-value">{user.email}</span>
              </div>
              {user.gamertag && (
                <div className="profile-field">
                  <span className="profile-label">Gamertag</span>
                  <span className="profile-value">{user.gamertag}</span>
                </div>
              )}
            </div>
            <div className="section-buttons">
              <button
                onClick={() => setIsEditingProfile(true)}
                className="btn btn-accent"
              >
                Edit Profile
              </button>
            </div>
          </>
        ) : (
          <form className="edit-form" onSubmit={(e) => { e.preventDefault(); handleProfileSave(); }}>
            <label>
              Username
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                required
                minLength={3}
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
              />
            </label>

            <label>
              Gamertag (optional)
              <input
                type="text"
                value={editGamertag}
                onChange={(e) => setEditGamertag(e.target.value)}
              />
            </label>

            <div className="form-buttons">
              <button
                type="submit"
                className="btn btn-accent"
                disabled={loadingAction}
              >
                {loadingAction ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleProfileCancel}
                className="btn"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Password Section */}
      <div className="account-section">
        <h2>Change Password</h2>

        <form className="edit-form" onSubmit={(e) => { e.preventDefault(); handlePasswordChange(); }}>
          <label>
            Current Password
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          <label>
            New Password
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>

          <label>
            Confirm New Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>

          <button
            type="submit"
            className="btn btn-accent"
            disabled={loadingAction}
          >
            {loadingAction ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Delete Account Section */}
      <div className="account-section">
        <h2>Danger Zone</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>
          Deleting your account is permanent and cannot be undone. All your data will be lost.
        </p>
        <div className="section-buttons">
          <button
            onClick={handleDeleteAccount}
            className="btn btn-danger"
            disabled={loadingAction}
          >
            {loadingAction ? 'Processing...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
