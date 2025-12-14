import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import './Dashboard.css';

const Dashboard = () => {
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleViewPainel = (municipio) => {
    if (municipio.paineis_bi && municipio.paineis_bi.length > 0) {
      navigate(`/paineis/municipio/${municipio.id}`);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div>
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
          <p className="results-count">
            {filteredMunicipios.length} município(s) encontrado(s)
          </p>
        </div>

        {loading ? (
          <div className="loading">Carregando municípios...</div>
        ) : (
          <div className="municipios-grid">
            {filteredMunicipios.map((municipio) => {
              const hasPainel = municipio.paineis_bi && municipio.paineis_bi.length > 0;
              const painel = hasPainel ? municipio.paineis_bi[0] : null;

              return (
                <div
                  key={municipio.id}
                  className={`municipio-card ${hasPainel ? 'has-painel' : 'no-painel'}`}
                  onClick={() => hasPainel && handleViewPainel(municipio)}
                  style={{ cursor: hasPainel ? 'pointer' : 'default' }}
                >
                  <div className="card-header">
                    <h3>{municipio.nome}</h3>
                    <span className={`status-badge ${painel?.status || 'pendente'}`}>
                      {painel?.status === 'ativo' ? 'Disponível' : 'Em breve'}
                    </span>
                  </div>
                  <div className="card-body">
                    <p><strong>Prefeito:</strong> {municipio.prefeito}</p>
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
        )}
      </main>
    </div>
  );
};

export default Dashboard;
