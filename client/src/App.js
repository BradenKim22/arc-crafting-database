import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import StashLayout from './components/StashLayout';
import HomePage from './pages/HomePage';
import ItemDetailPage from './pages/ItemDetailPage';
import RecipesPage from './pages/RecipesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLoot from './pages/admin/AdminLoot';
import AdminRecipes from './pages/admin/AdminRecipes';
import AdminBlueprints from './pages/admin/AdminBlueprints';
import AdminBreakdowns from './pages/admin/AdminBreakdowns';
import AdminCategories from './pages/admin/AdminCategories';
import AdminFoundIn from './pages/admin/AdminFoundIn';
import StashOverview from './pages/stash/StashOverview';
import StashItems from './pages/stash/StashItems';
import StashBlueprints from './pages/stash/StashBlueprints';
import StashWorkbench from './pages/stash/StashWorkbench';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/items/:id" element={<ItemDetailPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<AccountPage />} />

            {/* Stash routes (logged-in users) */}
            <Route path="/stash" element={<ProtectedRoute><StashLayout /></ProtectedRoute>}>
              <Route index element={<StashOverview />} />
              <Route path="items" element={<StashItems />} />
              <Route path="blueprints" element={<StashBlueprints />} />
              <Route path="workbench" element={<StashWorkbench />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="items" element={<AdminLoot />} />
              <Route path="recipes" element={<AdminRecipes />} />
              <Route path="blueprints" element={<AdminBlueprints />} />
              <Route path="recyclables" element={<AdminBreakdowns />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="found-in" element={<AdminFoundIn />} />
            </Route>
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
