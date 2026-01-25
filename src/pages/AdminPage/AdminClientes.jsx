import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './AdminClientes.css';

// Ícones SVG inline
const Icons = {
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Globe: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  ),
  Layout: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  ),
  Database: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
  ),
  BarChart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  ExternalLink: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  )
};

// Mapeamento de tipos de sistema para ícones
const systemTypeIcons = {
  'site': Icons.Globe,
  'plataforma': Icons.Layout,
  'sistema': Icons.Database,
  'painel': Icons.BarChart,
  'default': Icons.Globe
};

// Dados mockados de clientes (depois será substituído por dados do Supabase)
const mockClientes = [
  {
    id: 1,
    tipoSistema: 'Site/Plataforma de Gestão',
    nomeEmpresa: 'MF Compliance',
    url: 'https://www.mfcompliance.com.br',
    status: 'ativo',
    ultimoAcesso: '2026-01-24',
    cor: '#3b82f6'
  },
  {
    id: 2,
    tipoSistema: 'Painel de BI',
    nomeEmpresa: 'Rondônia em Números',
    url: 'https://www.dataro-it.com.br/paineis',
    status: 'ativo',
    ultimoAcesso: '2026-01-24',
    cor: '#10b981'
  },
  {
    id: 3,
    tipoSistema: 'Sistema de Gestão',
    nomeEmpresa: 'Prefeitura de Ji-Paraná',
    url: null,
    status: 'desenvolvimento',
    ultimoAcesso: null,
    cor: '#f59e0b'
  }
];

const AdminClientes = () => {
  const { theme } = useTheme();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  const isDarkMode = theme === 'dark';

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setClientes(mockClientes);
      setLoading(false);
    }, 500);
  }, []);

  const getSystemIcon = (tipoSistema) => {
    const tipo = tipoSistema.toLowerCase();
    if (tipo.includes('site')) return systemTypeIcons.site;
    if (tipo.includes('plataforma')) return systemTypeIcons.plataforma;
    if (tipo.includes('sistema')) return systemTypeIcons.sistema;
    if (tipo.includes('painel')) return systemTypeIcons.painel;
    return systemTypeIcons.default;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'ativo': { label: 'Ativo', class: 'status-ativo' },
      'inativo': { label: 'Inativo', class: 'status-inativo' },
      'desenvolvimento': { label: 'Em Desenvolvimento', class: 'status-desenvolvimento' },
      'manutencao': { label: 'Em Manutenção', class: 'status-manutencao' }
    };
    return statusConfig[status] || statusConfig['ativo'];
  };

  const handleNovoCliente = () => {
    setSelectedCliente(null);
    setShowModal(true);
  };

  const handleEditCliente = (cliente) => {
    setSelectedCliente(cliente);
    setShowModal(true);
  };

  const handleAcessarSistema = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className={`admin-clientes ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Header */}
      <div className="clientes-header">
        <div className="header-info">
          <h1>Clientes</h1>
          <p>Gerencie os sistemas e plataformas dos clientes</p>
        </div>
        <button className="btn-novo-cliente" onClick={handleNovoCliente}>
          <Icons.Plus />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="clientes-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
            <Icons.Globe />
          </div>
          <div className="stat-info">
            <span className="stat-value">{clientes.length}</span>
            <span className="stat-label">Total de Clientes</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
            <Icons.Layout />
          </div>
          <div className="stat-info">
            <span className="stat-value">{clientes.filter(c => c.status === 'ativo').length}</span>
            <span className="stat-label">Ativos</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
            <Icons.Database />
          </div>
          <div className="stat-info">
            <span className="stat-value">{clientes.filter(c => c.status === 'desenvolvimento').length}</span>
            <span className="stat-label">Em Desenvolvimento</span>
          </div>
        </div>
      </div>

      {/* Grid de Cards de Clientes */}
      <div className="clientes-grid">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Carregando clientes...</p>
          </div>
        ) : clientes.length === 0 ? (
          <div className="empty-state">
            <Icons.Globe />
            <h3>Nenhum cliente cadastrado</h3>
            <p>Clique em "Novo Cliente" para adicionar o primeiro cliente.</p>
          </div>
        ) : (
          clientes.map((cliente) => {
            const IconComponent = getSystemIcon(cliente.tipoSistema);
            const statusInfo = getStatusBadge(cliente.status);
            
            return (
              <div 
                key={cliente.id} 
                className="cliente-card"
                style={{ '--card-accent-color': cliente.cor }}
              >
                <div className="card-header">
                  <div className="card-icon" style={{ background: `${cliente.cor}20` }}>
                    <IconComponent />
                  </div>
                  <span className={`status-badge ${statusInfo.class}`}>
                    {statusInfo.label}
                  </span>
                </div>
                
                <div className="card-content">
                  <h3 className="tipo-sistema">{cliente.tipoSistema}</h3>
                  <h2 className="nome-empresa">{cliente.nomeEmpresa}</h2>
                  
                  {cliente.ultimoAcesso && (
                    <p className="ultimo-acesso">
                      Último acesso: {new Date(cliente.ultimoAcesso).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
                
                <div className="card-actions">
                  <button 
                    className="btn-action btn-edit"
                    onClick={() => handleEditCliente(cliente)}
                    title="Editar"
                  >
                    <Icons.Edit />
                    <span>Editar</span>
                  </button>
                  
                  {cliente.url && (
                    <button 
                      className="btn-action btn-access"
                      onClick={() => handleAcessarSistema(cliente.url)}
                      title="Acessar Sistema"
                    >
                      <Icons.ExternalLink />
                      <span>Acessar</span>
                    </button>
                  )}
                  
                  <button 
                    className="btn-action btn-settings"
                    title="Configurações"
                  >
                    <Icons.Settings />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Novo/Editar Cliente (placeholder) */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{selectedCliente ? 'Editar Cliente' : 'Novo Cliente'}</h2>
            <p>Formulário em desenvolvimento...</p>
            <button className="btn-fechar" onClick={() => setShowModal(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClientes;
