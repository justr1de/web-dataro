import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './AdminProjetos.css';

// Ícones SVG inline
const Icons = {
  Folder: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  ExternalLink: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  ),
  BarChart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  ),
  Globe: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  )
};

// Dados dos projetos
const projetos = [
  {
    id: 1,
    nome: 'Rondônia em Números',
    descricao: 'Painel de Business Intelligence com dados estatísticos dos 52 municípios de Rondônia. Inclui indicadores socioeconômicos, demográficos, educacionais, de saúde e infraestrutura.',
    status: 'Ativo',
    tipo: 'Painel de BI',
    url: '/paineis',
    urlExterna: null,
    icone: 'BarChart',
    cor: '#10b981',
    dataCriacao: '2024-01-15',
    ultimaAtualizacao: '2026-01-25',
    estatisticas: {
      municipios: 52,
      indicadores: 150,
      acessos: 12500
    }
  }
];

const AdminProjetos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Scroll para o topo ao carregar a página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const projetosFiltrados = projetos.filter(projeto =>
    projeto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projeto.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projeto.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAcessarProjeto = (projeto) => {
    if (projeto.urlExterna) {
      window.open(projeto.urlExterna, '_blank');
    } else if (projeto.url) {
      navigate(projeto.url);
    }
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'BarChart':
        return <Icons.BarChart />;
      case 'Globe':
        return <Icons.Globe />;
      case 'Users':
        return <Icons.Users />;
      default:
        return <Icons.Folder />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="admin-projetos">
      {/* Header */}
      <div className="projetos-header">
        <div className="header-content">
          <div className="header-icon">
            <Icons.Folder />
          </div>
          <div className="header-text">
            <h1>Projetos</h1>
            <p>Gerencie os projetos e painéis desenvolvidos pela DATA-RO</p>
          </div>
        </div>
      </div>

      {/* Barra de busca */}
      <div className="projetos-toolbar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="projetos-count">
          {projetosFiltrados.length} projeto(s) encontrado(s)
        </div>
      </div>

      {/* Grid de Projetos */}
      <div className="projetos-grid">
        {projetosFiltrados.map((projeto) => (
          <div key={projeto.id} className="projeto-card">
            <div className="projeto-card-header" style={{ borderColor: projeto.cor }}>
              <div className="projeto-icon" style={{ backgroundColor: projeto.cor }}>
                {getIconComponent(projeto.icone)}
              </div>
              <div className="projeto-status">
                <span className={`status-badge ${projeto.status.toLowerCase()}`}>
                  {projeto.status}
                </span>
              </div>
            </div>

            <div className="projeto-card-body">
              <h3 className="projeto-nome">{projeto.nome}</h3>
              <span className="projeto-tipo">{projeto.tipo}</span>
              <p className="projeto-descricao">{projeto.descricao}</p>

              {/* Estatísticas */}
              {projeto.estatisticas && (
                <div className="projeto-stats">
                  <div className="stat-item">
                    <Icons.Globe />
                    <span>{projeto.estatisticas.municipios} municípios</span>
                  </div>
                  <div className="stat-item">
                    <Icons.BarChart />
                    <span>{projeto.estatisticas.indicadores} indicadores</span>
                  </div>
                  <div className="stat-item">
                    <Icons.Users />
                    <span>{projeto.estatisticas.acessos.toLocaleString()} acessos</span>
                  </div>
                </div>
              )}

              {/* Datas */}
              <div className="projeto-dates">
                <div className="date-item">
                  <Icons.Calendar />
                  <span>Criado em: {formatDate(projeto.dataCriacao)}</span>
                </div>
                <div className="date-item">
                  <Icons.Info />
                  <span>Atualizado: {formatDate(projeto.ultimaAtualizacao)}</span>
                </div>
              </div>
            </div>

            <div className="projeto-card-footer">
              <button 
                className="btn-acessar"
                onClick={() => handleAcessarProjeto(projeto)}
                style={{ backgroundColor: projeto.cor }}
              >
                Acessar Projeto
                <Icons.ExternalLink />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mensagem quando não há projetos */}
      {projetosFiltrados.length === 0 && (
        <div className="no-projetos">
          <Icons.Folder />
          <h3>Nenhum projeto encontrado</h3>
          <p>Tente ajustar os termos de busca</p>
        </div>
      )}

      {/* Rodapé */}
      <div className="projetos-footer">
        <img src={logo} alt="DATA-RO" className="footer-logo" />
        <p>Desenvolvido por DATA-RO Inteligência Territorial</p>
      </div>
    </div>
  );
};

export default AdminProjetos;
