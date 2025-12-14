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
import Dashboard from './pages/PaineisPage/Dashboard';
import MunicipioPainel from './pages/PaineisPage/MunicipioPainel';

// Contexto de autenticação
import { AuthProvider } from './contexts/AuthContext';

import './App.css';

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('paineis_user');
  return user ? children : <Navigate to="/paineis/login" />;
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
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />

          {/* Rotas de Painéis */}
          <Route path="/paineis/login" element={<Login />} />
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
  );
}

export default App;
