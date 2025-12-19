import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importando componentes reutilizáveis
import Header from './components/header';
import Footer from './components/footer';
import ContactPopup from './components/contactPopup';

// Importando as PÁGINAS
import HomePage from './pages/homePage';
import ServicesPage from './pages/ServicesPage/index';

// Importando páginas de Painéis
import Login from './pages/PaineisPage/Login';
import TrocarSenha from './pages/PaineisPage/TrocarSenha';
import Dashboard from './pages/PaineisPage/Dashboard';
import MunicipioPainel from './pages/PaineisPage/MunicipioPainel';

// Contexto de autenticação
import { AuthProvider, useAuth } from './contexts/AuthContext';

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
        <Router>
        <ScrollToTop />
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />

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

          {/* Rota padrão - redireciona para home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
