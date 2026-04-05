// -----------------------------------------------
// API service — all backend calls go through here
// -----------------------------------------------
const BASE_URL = '/api';

function authHeader() {
  const token = localStorage.getItem('arc_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.errors?.[0]?.msg || 'Request failed');
  }

  return data;
}

// --- Auth ---
export function register(username, email, password) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
}

export function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function getProfile() {
  return request('/auth/me');
}

export function updateProfile(username, email, gamertag) {
  return request('/account/profile', {
    method: 'PUT',
    body: JSON.stringify({ username, email, gamertag }),
  });
}

export function changePassword(currentPassword, newPassword) {
  return request('/account/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export function deleteAccount(password) {
  return request('/account', {
    method: 'DELETE',
    body: JSON.stringify({ password }),
  });
}

// --- Items ---
export function getItems(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/items${query ? `?${query}` : ''}`);
}

export function getItemById(id) {
  return request(`/items/${id}`);
}

export function getCraftingTree(id) {
  return request(`/items/${id}/tree`);
}

// --- Recipes ---
export function getRecipes(type = '') {
  const query = type ? `?type=${type}` : '';
  return request(`/recipes${query}`);
}

// --- Health ---
export function healthCheck() {
  return request('/health');
}
