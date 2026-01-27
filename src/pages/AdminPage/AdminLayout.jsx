import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import AdminSidebar from './components/AdminSidebar';
import AIAssistant from '../../components/AIAssistant';
import './AdminLayout.css';
import './AdminResponsive.css';

const AdminLayout = () => {
  const { adminUser, loading } = useAdminAuth();
  const { theme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

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

      {/* Botão flutuante do Assistente de IA */}
      <button 
        className="ai-assistant-fab"
        onClick={() => setShowAIAssistant(true)}
        title="Assistente DATA-RO"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span>Assistente IA</span>
      </button>

      {/* Modal do Assistente de IA */}
      {showAIAssistant && (
        <AIAssistant 
          onClose={() => setShowAIAssistant(false)} 
        />
      )}
    </div>
  );
};

export default AdminLayout;
