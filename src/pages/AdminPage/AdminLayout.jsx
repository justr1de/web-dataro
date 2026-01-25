import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import AdminSidebar from './components/AdminSidebar';
import './AdminLayout.css';

const AdminLayout = () => {
  const { adminUser, loading } = useAdminAuth();
  const { theme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isDarkMode = theme === 'dark';

  // Loading state
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!adminUser) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className={`admin-layout ${theme} ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <AdminSidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
        isDarkMode={isDarkMode}
      />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
