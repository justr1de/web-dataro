import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import logo from '../../assets/logo.png';
import ThemeToggle from '../../components/ThemeToggle';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAdminAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginAdmin(email, senha);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Erro ao fazer login');
    }

    setLoading(false);
  };

  const handleVoltar = () => {
    navigate('/');
  };

  return (
    <div className={`admin-login-wrapper ${theme}`}>
      {/* Header */}
      <header className="admin-login-header">
        <div className="admin-header-content">
          <img src={logo} alt="DATA-RO" className="admin-header-logo" />
          <ThemeToggle className="admin-theme-toggle" />
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-login-main">
        <div className="admin-login-container">
          {/* Logo e Título */}
          <div className="admin-login-branding">
            <img src={logo} alt="DATA-RO" className="admin-login-logo" />
            <h1>Área de Gestão</h1>
            <p>DATA-RO INTELIGÊNCIA TERRITORIAL</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="admin-login-form">
            {error && <div className="admin-error-message">{error}</div>}

            <div className="admin-form-group">
              <label htmlFor="email">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                autoComplete="email"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="senha">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Senha
              </label>
              <input
                type="password"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="admin-login-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="admin-spinner"></span>
                  Entrando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Link voltar */}
          <button onClick={handleVoltar} className="admin-back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Voltar à página inicial
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="admin-login-footer">
        <p>DATA-RO INTELIGÊNCIA TERRITORIAL</p>
        <p className="admin-copyright">TODOS OS DIREITOS RESERVADOS</p>
      </footer>
    </div>
  );
};

export default AdminLogin;
