import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { getBandeiraUrl } from '../../utils/bandeirasMap';
import AdminPanel from '../../components/AdminPanel/AdminPanel';
import ChangePasswordModal from '../../components/ChangePasswordModal/ChangePasswordModal';
import LazyImage from '../../components/LazyImage/LazyImage';
import logo from '../../assets/logo.png';
import logoCimcero from '../../assets/logo-cimcero.png';
import ThemeToggle from '../../components/ThemeToggle';
import AIAssistant from '../../components/AIAssistant';
import TransferenciasDashboard from '../../components/TransferenciasDashboard';
import { MinisteriosSidebar } from '../../components/Sidebar';
import UserManagement from '../../components/UserManagement';
import './Dashboard.css';

const Dashboard = () => {
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showMinisteriosSidebar, setShowMinisteriosSidebar] = useState(false);
  const [showTransferenciasDashboard, setShowTransferenciasDashboard] = useState(false);
  const [selectedMunicipioTransferencias, setSelectedMunicipioTransferencias] = useState(null);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Itens por página (metade dos municípios para evitar rolagem extensa)
  const itemsPerPage = 24;

  useEffect(() => {
    if (!user) {
      navigate('/paineis/login');
      return;
    }

    fetchMunicipios();
  }, [user, navigate]);

  const fetchMunicipios = async () => {
    try {
      const { data, error } = await supabase
        .from('municipios')
        .select(`
          *,
          paineis_bi (
            id,
            titulo,
            url_powerbi,
            status
          )
        `)
        .order('nome', { ascending: true });

      if (error) throw error;
      
      // Normalizar paineis_bi para sempre ser um array
      const normalizedData = (data || []).map(municipio => ({
        ...municipio,
        paineis_bi: municipio.paineis_bi 
          ? (Array.isArray(municipio.paineis_bi) ? municipio.paineis_bi : [municipio.paineis_bi])
          : []
      }));
      
      setMunicipios(normalizedData);
    } catch (error) {
      console.error('Erro ao carregar municípios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPainel = (e, municipio) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('handleViewPainel chamado para:', municipio.nome, 'ID:', municipio.id);
    console.log('Navegando para:', `/paineis/municipio/${municipio.id}`);
    navigate(`/paineis/municipio/${municipio.id}`, { state: { municipio } });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/paineis/login');
  };

  // Filtrar municípios com base no termo de busca
  const filteredMunicipios = municipios.filter((municipio) =>
    municipio.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular paginação
  const totalPages = Math.ceil(filteredMunicipios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMunicipios = filteredMunicipios.slice(startIndex, endIndex);

  // Reset para primeira página quando o termo de busca mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando municípios...</p>
      </div>
    );
  }

  return (
    <div className={`dashboard-container ${showMinisteriosSidebar ? 'sidebar-open' : ''}`}>
      {/* Sidebar de Ministérios */}
      <MinisteriosSidebar 
        isOpen={showMinisteriosSidebar} 
        onToggle={() => setShowMinisteriosSidebar(!showMinisteriosSidebar)} 
      />
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <img src={logo} alt="Logo DataRO" className="header-logo-dataro" />
            <div className="header-text">
              <span className="header-brand">DATA-RO</span>
              <span className="header-subtitle">INTELIGÊNCIA TERRITORIAL</span>
            </div>
          </div>
          <div className="header-center">
            <div className="header-title-group">
              <h1>Painéis de BI</h1>
              <span className="header-title-subtitle">Rondônia em Números</span>
            </div>
          </div>
          <div className="header-actions">
            <ThemeToggle />
            <span className="user-name">Olá, {user?.nome}</span>
            {(user?.role === 'admin' || user?.role === 'superadmin') && (
              <div className={`admin-dropdown ${showAdminDropdown ? 'open' : ''}`}>
                <button 
                  className="admin-button"
                  onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                >
                  ⚙️ Admin {showAdminDropdown ? '▲' : '▼'}
                </button>
                {showAdminDropdown && (
                  <div className="admin-dropdown-content">
                    <button onClick={() => { setShowAdminPanel(true); setShowAdminDropdown(false); }}>
                      📊 Painel Admin
                    </button>
                    {user?.role === 'superadmin' && (
                      <button onClick={() => { setShowUserManagement(true); setShowAdminDropdown(false); }}>
                        👥 Usuários
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
            <button onClick={handleLogout} className="logout-button">
              🚪 Sair
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Buscar município por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search-button"
                  onClick={() => setSearchTerm('')}
                  title="Limpar busca"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="results-info">
            <p className="results-count">
              {filteredMunicipios.length === 0 ? (
                <span className="no-results">Nenhum município encontrado</span>
              ) : (
                <span>
                  <strong>{filteredMunicipios.length}</strong> municípios | <strong>{filteredMunicipios.filter(m => m.paineis_bi && m.paineis_bi.length > 0 && m.paineis_bi.some(p => p.status === 'ativo')).length}</strong> painéis ativos
                  {searchTerm && <span className="search-term"> para "{searchTerm}"</span>}
                </span>
              )}
            </p>
            {totalPages > 1 && (
              <p className="page-info">
                Página {currentPage} de {totalPages}
              </p>
            )}
          </div>
        </div>

        {filteredMunicipios.length === 0 ? (
          <div className="no-results-container">
            <svg className="no-results-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <circle cx="11" cy="17" r="0.5" fill="currentColor"/>
            </svg>
            <h2>Nenhum município encontrado</h2>
            <p>Tente buscar com outro termo ou limpe o filtro para ver todos os municípios.</p>
            {searchTerm && (
              <button 
                className="clear-filter-button"
                onClick={() => setSearchTerm('')}
              >
                Limpar Filtro
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="municipios-grid">
              {currentMunicipios.map((municipio) => {
                const hasPainel = municipio.paineis_bi && municipio.paineis_bi.length > 0;
                const painel = hasPainel ? municipio.paineis_bi[0] : null;
                const bandeira = getBandeiraUrl(municipio.nome);

                return (
                  <div
                    key={municipio.id}
                    className={`municipio-card ${hasPainel ? 'has-painel' : 'no-painel'}`}
                    onClick={(e) => {
                      console.log('Card clicado:', municipio.nome, 'hasPainel:', hasPainel);
                      if (hasPainel) {
                        handleViewPainel(e, municipio);
                      }
                    }}
                    style={{ cursor: hasPainel ? 'pointer' : 'default' }}
                  >
                    <div className="card-bandeira-section">
                      {bandeira ? (
                        <LazyImage
                          src={bandeira} 
                          alt={`Bandeira de ${municipio.nome}`}
                          className="municipio-bandeira-large"
                          placeholder={
                            <div className="bandeira-placeholder">
                              <span className="municipio-sigla">
                                {municipio.nome.substring(0, 3)}
                              </span>
                            </div>
                          }
                        />
                      ) : (
                        <div className="bandeira-placeholder">
                          <span className="municipio-sigla">
                            {municipio.nome.substring(0, 3)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="card-header">
                      <h3>{municipio.nome}</h3>
                      <span className={`status-badge ${painel?.status || 'pendente'}`}>
                        {painel?.status === 'ativo' ? 'Disponível' : 'Em breve'}
                      </span>
                    </div>
                    <div className="card-body">
                      <div className="info-row">
                        <svg className="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <span><strong>Prefeito(a):</strong> {municipio.prefeito}</span>
                      </div>
                      {municipio.telefone && (
                        <div className="info-row">
                          <svg className="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                          </svg>
                          <span>{municipio.telefone}</span>
                        </div>
                      )}
                      {municipio.email && (
                        <div className="info-row email-row">
                          <svg className="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                          </svg>
                          <span className="email-text">{municipio.email}</span>
                        </div>
                      )}
                      <div className="card-actions">
                        {hasPainel ? (
                          <div className="painel-info">
                            <svg className="icon-check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Painel disponível
                          </div>
                        ) : (
                          <div className="painel-info pending">
                            <svg className="icon-clock" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            Painel em breve
                          </div>
                        )}
                        <button 
                          className="btn-transferencias"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMunicipioTransferencias(municipio.nome);
                            setShowTransferenciasDashboard(true);
                          }}
                          title="Ver transferências federais"
                        >
                          💰 Transferências
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => { setCurrentPage((prev) => Math.max(prev - 1, 1)); window.scrollTo(0, 0); }}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  ← Anterior
                </button>
                <span className="pagination-info">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => { setCurrentPage((prev) => Math.min(prev + 1, totalPages)); window.scrollTo(0, 0); }}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}

      {(showChangePassword || user?.primeiro_acesso) && (
        <ChangePasswordModal 
          user={user} 
          onPasswordChanged={() => {
            setShowChangePassword(false);
            logout();
          }} 
        />
      )}

      {/* Botão Flutuante do Assistente IA */}
      <button 
        className="ai-assistant-fab"
        onClick={() => setShowAIAssistant(true)}
        title="Assistente de IA - Editais e Ministérios"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        <span className="fab-tooltip">Assistente IA</span>
      </button>

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <AIAssistant 
          municipios={municipios}
          onClose={() => setShowAIAssistant(false)} 
        />
      )}

      {/* Transferências Dashboard Modal */}
      {showTransferenciasDashboard && selectedMunicipioTransferencias && (
        <div className="modal-overlay" onClick={() => setShowTransferenciasDashboard(false)}>
          <div className="modal-transferencias" onClick={(e) => e.stopPropagation()}>
            <TransferenciasDashboard 
              municipio={selectedMunicipioTransferencias}
              onClose={() => {
                setShowTransferenciasDashboard(false);
                setSelectedMunicipioTransferencias(null);
              }} 
            />
          </div>
        </div>
      )}

      {/* User Management Modal - Apenas para SuperAdmin */}
      {showUserManagement && user?.role === 'superadmin' && (
        <UserManagement onClose={() => setShowUserManagement(false)} />
      )}
    </div>
  );
};

export default Dashboard;
