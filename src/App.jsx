import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importando componentes reutilizáveis
import Header from './components/header';
import Footer from './components/footer';
import ContactPopup from './components/contactPopup';

// Importando as PÁGINAS
import HomePage from './pages/homePage';
import AboutUs from './pages/AboutUs';
import ServicesPage from './pages/ServicesPage/index';

// Importando páginas de Painéis
import Login from './pages/PaineisPage/Login';
import TrocarSenha from './pages/PaineisPage/TrocarSenha';
import Dashboard from './pages/PaineisPage/Dashboard';
import MunicipioPainel from './pages/PaineisPage/MunicipioPainel';

// Importando páginas de Admin
import { 
  AdminLogin, 
  AdminLayout, 
  AdminDashboard, 
  AdminClientes,
  AdminUsuarios,
  AdminTrocarSenha,
  AdminPlaceholder,
  AdminFinanceiro,
  AdminAuditoria 
} from './pages/AdminPage';

// Contexto de autenticação
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';

// Componente para scroll automático ao topo
import ScrollToTop from './components/ScrollToTop';

// Contexto de tema
import { ThemeProvider } from './contexts/ThemeContext';

import './App.css';

// Componente para rotas protegidas - usa o contexto de autenticação
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Enquanto está carregando, mostra um loading
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e0e0e0',
            borderTop: '4px solid #2e7d32',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#666' }}>Carregando...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  // Se não há usuário após carregar, redireciona para login
  if (!user) {
    return <Navigate to="/paineis/login" />;
  }
  
  return children;
};

// Componente para rotas protegidas do Admin
const AdminProtectedRoute = ({ children }) => {
  const { adminUser, loading } = useAdminAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #064e3b 0%, #022c22 40%, #0a0f0d 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(16, 185, 129, 0.2)',
            borderTop: '4px solid #10b981',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>Carregando...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  if (!adminUser) {
    return <Navigate to="/admin/login" />;
  }
  
  // Se é primeiro acesso, redireciona para troca de senha
  if (adminUser.primeiro_acesso) {
    return <Navigate to="/admin/trocar-senha" />;
  }
  
  return children;
};

// Componente para rota de troca de senha (precisa estar logado mas não precisa ter trocado a senha)
const AdminTrocarSenhaRoute = ({ children }) => {
  const { adminUser, loading } = useAdminAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #064e3b 0%, #022c22 40%, #0a0f0d 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(16, 185, 129, 0.2)',
            borderTop: '4px solid #10b981',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>Carregando...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  if (!adminUser) {
    return <Navigate to="/admin/login" />;
  }
  
  return children;
};

// Layout para páginas públicas (com Header e Footer)
const PublicLayout = ({ children }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  return (
    <div className="App">
      <Header onContactClick={togglePopup} />
      <main className="main-content">{children}</main>
      <Footer />
      {isPopupOpen && <ContactPopup handleClose={togglePopup} />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <Router>
          <ScrollToTop />
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
            <Route path="/about-us" element={<PublicLayout><AboutUs /></PublicLayout>} />

            {/* Rotas de Painéis */}
            <Route path="/paineis/login" element={<Login />} />
            <Route
              path="/paineis/trocar-senha"
              element={
                <ProtectedRoute>
                  <TrocarSenha />
                </ProtectedRoute>
              }
            />
            <Route
              path="/paineis/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/paineis/municipio/:id"
              element={
                <ProtectedRoute>
                  <MunicipioPainel />
                </ProtectedRoute>
              }
            />

            {/* Rotas de Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/trocar-senha" 
              element={
                <AdminTrocarSenhaRoute>
                  <AdminTrocarSenha />
                </AdminTrocarSenhaRoute>
              } 
            />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/clientes" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="clientes" element={<AdminClientes />} />
              <Route path="demandas" element={<AdminDashboard />} />
              <Route path="relatorios" element={<AdminPlaceholder />} />
              <Route path="contatos" element={<AdminPlaceholder />} />
              <Route path="perfil" element={<AdminPlaceholder />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="credenciais" element={<AdminPlaceholder />} />
              <Route path="financeiro" element={<AdminFinanceiro />} />
              <Route path="busca" element={<AdminPlaceholder />} />
              <Route path="logs" element={<AdminAuditoria />} />
              <Route path="auditoria" element={<AdminPlaceholder />} />
              <Route path="excluidos" element={<AdminPlaceholder />} />
              <Route path="configuracoes" element={<AdminPlaceholder />} />
            </Route>

            {/* Rota padrão - redireciona para home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          </Router>
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
