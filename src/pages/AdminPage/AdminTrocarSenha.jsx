import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import logo from '../../assets/logo.png';
import ThemeToggle from '../../components/ThemeToggle';
import './AdminTrocarSenha.css';

const AdminTrocarSenha = () => {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminUser, atualizarSenha, logoutAdmin } = useAdminAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Validação da política de segurança
  const validarSenha = (senha) => {
    const requisitos = {
      minLength: senha.length >= 8,
      hasUpperCase: /[A-Z]/.test(senha),
      hasLowerCase: /[a-z]/.test(senha),
      hasNumber: /[0-9]/.test(senha),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)
    };
    return requisitos;
  };

  const requisitos = validarSenha(novaSenha);
  const senhaValida = Object.values(requisitos).every(v => v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!senhaValida) {
      setError('A senha não atende aos requisitos de segurança');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    const result = await atualizarSenha(novaSenha);

    if (result.success) {
      // Fazer logout para forçar novo login com a nova senha
      await logoutAdmin(true); // silent logout
      navigate('/admin/login');
    } else {
      setError(result.error || 'Erro ao trocar senha');
      setLoading(false);
    }
  };

  return (
    <div className={`admin-trocar-senha-wrapper ${theme}`}>
      {/* Header */}
      <header className="admin-trocar-senha-header">
        <div className="admin-header-content">
          <div className="admin-header-title-wrapper hover-glow">
            <img src={logo} alt="DATA-RO" className="admin-header-logo" />
            <div className="admin-header-text">
              <span className="admin-header-title">Sistema de Gestão</span>
              <span className="admin-header-subtitle">DATA-RO INTELIGÊNCIA TERRITORIAL</span>
            </div>
          </div>
          <ThemeToggle className="admin-theme-toggle" />
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-trocar-senha-main">
        <div className="admin-trocar-senha-container">
          {/* Logo e Título */}
          <div className="admin-trocar-senha-branding">
            <img src={logo} alt="DATA-RO" className="admin-trocar-senha-logo hover-glow" />
            <h1 className="hover-glow">Primeiro Acesso</h1>
            <p>Por segurança, você deve criar uma nova senha</p>
          </div>

          {/* Informação do usuário */}
          {adminUser && (
            <div className="admin-user-info">
              <span className="admin-user-name">{adminUser.nome}</span>
              <span className="admin-user-email">{adminUser.email}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="admin-trocar-senha-form">
            {error && <div className="admin-error-message">{error}</div>}

            <div className="admin-form-group">
              <label htmlFor="novaSenha">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Nova Senha
              </label>
              <div className="admin-password-wrapper">
                <input
                  type={showNovaSenha ? "text" : "password"}
                  id="novaSenha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  required
                  placeholder="Digite sua nova senha"
                />
                <button 
                  type="button" 
                  className="admin-toggle-password"
                  onClick={() => setShowNovaSenha(!showNovaSenha)}
                  title={showNovaSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showNovaSenha ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="confirmarSenha">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Confirmar Senha
              </label>
              <div className="admin-password-wrapper">
                <input
                  type={showConfirmarSenha ? "text" : "password"}
                  id="confirmarSenha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  placeholder="Confirme sua nova senha"
                />
                <button 
                  type="button" 
                  className="admin-toggle-password"
                  onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                  title={showConfirmarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showConfirmarSenha ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Política de Segurança */}
            <div className="admin-password-policy">
              <h4>Política de Segurança de Senhas</h4>
              <ul>
                <li className={requisitos.minLength ? 'valid' : 'invalid'}>
                  {requisitos.minLength ? '✓' : '○'} Mínimo de 8 caracteres
                </li>
                <li className={requisitos.hasUpperCase ? 'valid' : 'invalid'}>
                  {requisitos.hasUpperCase ? '✓' : '○'} Pelo menos 1 letra maiúscula
                </li>
                <li className={requisitos.hasLowerCase ? 'valid' : 'invalid'}>
                  {requisitos.hasLowerCase ? '✓' : '○'} Pelo menos 1 letra minúscula
                </li>
                <li className={requisitos.hasNumber ? 'valid' : 'invalid'}>
                  {requisitos.hasNumber ? '✓' : '○'} Pelo menos 1 número
                </li>
                <li className={requisitos.hasSpecial ? 'valid' : 'invalid'}>
                  {requisitos.hasSpecial ? '✓' : '○'} Pelo menos 1 caractere especial (!@#$%^&*...)
                </li>
              </ul>
            </div>

            <button 
              type="submit" 
              className="admin-submit-button" 
              disabled={loading || !senhaValida || novaSenha !== confirmarSenha}
            >
              {loading ? (
                <>
                  <span className="admin-spinner"></span>
                  Salvando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Salvar Nova Senha
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="admin-trocar-senha-footer">
        <p>DATA-RO INTELIGÊNCIA TERRITORIAL</p>
        <p className="admin-copyright">TODOS OS DIREITOS RESERVADOS</p>
      </footer>
    </div>
  );
};

export default AdminTrocarSenha;
