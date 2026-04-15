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

export function getItemCategories() {
  return request('/items/categories');
}

export function getItemById(id) {
  return request(`/items/${id}`);
}

export function getCraftingTree(id) {
  return request(`/items/${id}/tree`);
}

export function getRecyclingTree(id) {
  return request(`/items/${id}/recycle-tree`);
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

// --- Admin ---
export function adminGetStats() {
  return request('/admin/stats');
}

export function adminGetUsers(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/admin/users${query ? `?${query}` : ''}`);
}

export function adminDeleteUser(id) {
  return request(`/admin/users/${id}`, { method: 'DELETE' });
}

export function adminToggleAdmin(id) {
  return request(`/admin/users/${id}/admin`, { method: 'PUT' });
}

export function adminGetLoot(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/admin/loot${query ? `?${query}` : ''}`);
}

export function adminCreateLoot(data) {
  return request('/admin/loot', { method: 'POST', body: JSON.stringify(data) });
}

export function adminUpdateLoot(id, data) {
  return request(`/admin/loot/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function adminDeleteLoot(id) {
  return request(`/admin/loot/${id}`, { method: 'DELETE' });
}

// Recipes
export function adminGetRecipes(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/admin/recipes${query ? `?${query}` : ''}`);
}

export function adminCreateRecipe(data) {
  return request('/admin/recipes', { method: 'POST', body: JSON.stringify(data) });
}

export function adminUpdateRecipe(id, data) {
  return request(`/admin/recipes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function adminDeleteRecipe(id) {
  return request(`/admin/recipes/${id}`, { method: 'DELETE' });
}

// Blueprints (item → recipe links)
export function adminGetBlueprints(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/admin/blueprints${query ? `?${query}` : ''}`);
}

export function adminCreateBlueprint(data) {
  return request('/admin/blueprints', { method: 'POST', body: JSON.stringify(data) });
}

export function adminDeleteBlueprint(id) {
  return request(`/admin/blueprints/${id}`, { method: 'DELETE' });
}

export function adminGetUnlinkedRecipes() {
  return request('/admin/blueprints/unlinked');
}

export function adminGetBreakdowns(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/admin/breakdowns${query ? `?${query}` : ''}`);
}

export function adminCreateBreakdown(data) {
  return request('/admin/breakdowns', { method: 'POST', body: JSON.stringify(data) });
}

export function adminUpdateBreakdown(lootId, componentLootId, data) {
  return request(`/admin/breakdowns/${lootId}/${componentLootId}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function adminDeleteBreakdown(lootId, componentLootId) {
  return request(`/admin/breakdowns/${lootId}/${componentLootId}`, { method: 'DELETE' });
}

export function adminGetLocations(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/admin/locations${query ? `?${query}` : ''}`);
}

export function adminCreateLocation(data) {
  return request('/admin/locations', { method: 'POST', body: JSON.stringify(data) });
}

export function adminDeleteLocation(lootId, locationName) {
  return request(`/admin/locations/${lootId}/${encodeURIComponent(locationName)}`, { method: 'DELETE' });
}

// --- Stash (user inventory) ---
export function stashGetItems() {
  return request('/stash/items');
}

export function stashAddItem(data) {
  return request('/stash/items', { method: 'POST', body: JSON.stringify(data) });
}

export function stashUpdateItem(lootId, data) {
  return request(`/stash/items/${lootId}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function stashRemoveItem(lootId) {
  return request(`/stash/items/${lootId}`, { method: 'DELETE' });
}

export function stashGetBlueprints() {
  return request('/stash/blueprints');
}

export function stashToggleBlueprint(blueprintId) {
  return request(`/stash/blueprints/${blueprintId}`, { method: 'POST' });
}

export function stashGetWorkbenches() {
  return request('/stash/workbenches');
}

export function stashUpsertWorkbench(data) {
  return request('/stash/workbenches', { method: 'POST', body: JSON.stringify(data) });
}

export function stashRemoveWorkbench(id) {
  return request(`/stash/workbenches/${id}`, { method: 'DELETE' });
}

export function stashGetLootNames() {
  return request('/stash/lookup/loot');
}

export function stashGetWorkshopTypes() {
  return request('/stash/lookup/workshop-types');
}

export function stashAnalyzeItem(lootId) {
  return request(`/stash/analyze/${lootId}`);
}

export function adminGetAllLootNames() {
  return request('/admin/lookup/loot');
}

// Categories
export function adminGetCategories() {
  return request('/admin/categories');
}
export function adminCreateCategory(data) {
  return request('/admin/categories', { method: 'POST', body: JSON.stringify(data) });
}
export function adminUpdateCategory(id, data) {
  return request(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export function adminDeleteCategory(id) {
  return request(`/admin/categories/${id}`, { method: 'DELETE' });
}

// FoundIn
export function adminGetFoundIn() {
  return request('/admin/found-in');
}
export function adminCreateFoundIn(data) {
  return request('/admin/found-in', { method: 'POST', body: JSON.stringify(data) });
}
export function adminUpdateFoundIn(id, data) {
  return request(`/admin/found-in/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}
export function adminDeleteFoundIn(id) {
  return request(`/admin/found-in/${id}`, { method: 'DELETE' });
}
