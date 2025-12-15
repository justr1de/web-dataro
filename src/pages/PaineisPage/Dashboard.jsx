import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { getBandeiraUrl } from '../../utils/bandeirasMap';
import logo from '../../assets/logo.png';
import logoCimcero from '../../assets/logo-cimcero.png';
import './Dashboard.css';

const Dashboard = () => {
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
      setMunicipios(data || []);
    } catch (error) {
      console.error('Erro ao carregar municípios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/paineis/login');
  };

  const filteredMunicipios = municipios.filter(m =>
    m.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginação
  const totalPages = Math.ceil(filteredMunicipios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMunicipios = filteredMunicipios.slice(startIndex, endIndex);

  const handleViewPainel = (municipio) => {
    if (municipio.paineis_bi && municipio.paineis_bi.length > 0) {
      navigate(`/paineis/municipio/${municipio.id}`);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset para página 1 quando buscar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <img src={logo} alt="DATA-RO" className="header-logo" />
            <div className="header-text">
              <span className="header-brand">DATA-RO</span>
              <span className="header-subtitle">INTELIGÊNCIA TERRITORIAL</span>
            </div>
          </div>
          <div className="header-center">
            <img src={logoCimcero} alt="CIMCERO" className="logo-cimcero" />
            <h1>Painéis de BI - CIMCERO</h1>
            <p>Rondônia em Números</p>
          </div>
          <div className="header-actions">
            <span className="user-name">Olá, {user?.nome}</span>
            <button onClick={handleLogout} className="logout-button">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="search-section">
          <input
            type="text"
            placeholder="Buscar município..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="results-info">
            <p className="results-count">
              {filteredMunicipios.length} município(s) encontrado(s)
            </p>
            {totalPages > 1 && (
              <p className="page-info">
                Página {currentPage} de {totalPages}
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading">Carregando municípios...</div>
        ) : (
          <>
            <div className="municipios-grid">
              {currentMunicipios.map((municipio) => {
                const hasPainel = municipio.paineis_bi && municipio.paineis_bi.length > 0;
                const painel = hasPainel ? municipio.paineis_bi[0] : null;

                return (
                  <div
                    key={municipio.id}
                    className={`municipio-card ${hasPainel ? 'has-painel' : 'no-painel'}`}
                    onClick={() => hasPainel && handleViewPainel(municipio)}
                    style={{ cursor: hasPainel ? 'pointer' : 'default' }}
                  >
                    <div className="card-bandeira-section">
                      <img 
                        src={getBandeiraUrl(municipio.nome)} 
                        alt={`Bandeira de ${municipio.nome}`}
                        className="municipio-bandeira-large"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/200x150/10b981/ffffff?text=${encodeURIComponent(municipio.nome.substring(0, 3))}`;
                        }}
                      />
                    </div>
                    <div className="card-header">
                      <h3>{municipio.nome}</h3>
                      <span className={`status-badge ${painel?.status || 'pendente'}`}>
                        {painel?.status === 'ativo' ? 'Disponível' : 'Em breve'}
                      </span>
                    </div>
                    <div className="card-body">
                      <p><strong>Prefeito(a):</strong> {municipio.prefeito}</p>
                      <p><strong>CNPJ:</strong> {municipio.cnpj}</p>
                      {hasPainel && (
                        <p className="painel-title">
                          <strong>Painel:</strong> {painel.titulo}
                        </p>
                      )}
                    </div>
                    {!hasPainel && (
                      <div className="card-footer">
                        <p className="no-painel-message">Painel em desenvolvimento</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Anterior
                </button>

                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
