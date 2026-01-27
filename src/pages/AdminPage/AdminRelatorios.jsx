import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import './AdminRelatorios.css';

// Ícones SVG
const Icons = {
  Chart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  ),
  Download: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  ),
  FileText: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
    </svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  Folder: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  TrendingUp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  )
};

const AdminRelatorios = () => {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalProjetos: 0,
    totalDemandas: 0,
    totalEventos: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriodo, setSelectedPeriodo] = useState('mes');
  const [selectedTipo, setSelectedTipo] = useState('geral');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [clientesRes, projetosRes, demandasRes, eventosRes] = await Promise.all([
        supabase.from('admin_gabinetes').select('id', { count: 'exact' }),
        supabase.from('admin_projetos').select('id', { count: 'exact' }),
        supabase.from('admin_demandas').select('id', { count: 'exact' }),
        supabase.from('calendario_eventos').select('id', { count: 'exact' })
      ]);

      setStats({
        totalClientes: clientesRes.count || 0,
        totalProjetos: projetosRes.count || 0,
        totalDemandas: demandasRes.count || 0,
        totalEventos: eventosRes.count || 0
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
    setLoading(false);
  };

  const relatoriosDisponiveis = [
    { id: 1, nome: 'Relatório de Clientes', descricao: 'Lista completa de clientes ativos e inativos', tipo: 'clientes', icon: Icons.Users },
    { id: 2, nome: 'Relatório de Projetos', descricao: 'Status e progresso de todos os projetos', tipo: 'projetos', icon: Icons.Folder },
    { id: 3, nome: 'Relatório de Demandas', descricao: 'Demandas por status, urgência e cliente', tipo: 'demandas', icon: Icons.FileText },
    { id: 4, nome: 'Relatório de Eventos', descricao: 'Eventos e compromissos do calendário', tipo: 'eventos', icon: Icons.Calendar },
    { id: 5, nome: 'Relatório Financeiro', descricao: 'Receitas, despesas e balanço mensal', tipo: 'financeiro', icon: Icons.TrendingUp },
    { id: 6, nome: 'Relatório de Desempenho', descricao: 'Métricas de produtividade da equipe', tipo: 'desempenho', icon: Icons.Chart }
  ];

  const handleExportarRelatorio = (tipo) => {
    alert(`Exportando relatório de ${tipo}...`);
    // Implementar exportação real aqui
  };

  return (
    <div className="admin-relatorios">
      {/* Header */}
      <div className="relatorios-header">
        <div className="header-title">
          <Icons.Chart />
          <div className="header-text">
            <h1>Relatórios</h1>
            <span className="header-subtitle">Gere e exporte relatórios do sistema</span>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Icons.Users /></div>
          <div className="stat-content">
            <span className="stat-value">{loading ? '...' : stats.totalClientes}</span>
            <span className="stat-label">Clientes</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Icons.Folder /></div>
          <div className="stat-content">
            <span className="stat-value">{loading ? '...' : stats.totalProjetos}</span>
            <span className="stat-label">Projetos</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Icons.FileText /></div>
          <div className="stat-content">
            <span className="stat-value">{loading ? '...' : stats.totalDemandas}</span>
            <span className="stat-label">Demandas</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Icons.Calendar /></div>
          <div className="stat-content">
            <span className="stat-value">{loading ? '...' : stats.totalEventos}</span>
            <span className="stat-label">Eventos</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Período</label>
          <select value={selectedPeriodo} onChange={(e) => setSelectedPeriodo(e.target.value)}>
            <option value="semana">Última Semana</option>
            <option value="mes">Último Mês</option>
            <option value="trimestre">Último Trimestre</option>
            <option value="ano">Último Ano</option>
            <option value="todos">Todos os Períodos</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Tipo de Relatório</label>
          <select value={selectedTipo} onChange={(e) => setSelectedTipo(e.target.value)}>
            <option value="geral">Todos os Tipos</option>
            <option value="clientes">Clientes</option>
            <option value="projetos">Projetos</option>
            <option value="demandas">Demandas</option>
            <option value="financeiro">Financeiro</option>
          </select>
        </div>
      </div>

      {/* Lista de Relatórios */}
      <div className="relatorios-section">
        <div className="section-header">
          <Icons.FileText />
          <h2>Relatórios Disponíveis</h2>
        </div>

        <div className="relatorios-grid">
          {relatoriosDisponiveis
            .filter(r => selectedTipo === 'geral' || r.tipo === selectedTipo)
            .map(relatorio => (
              <div key={relatorio.id} className="relatorio-card">
                <div className="relatorio-icon">
                  <relatorio.icon />
                </div>
                <div className="relatorio-info">
                  <h3>{relatorio.nome}</h3>
                  <p>{relatorio.descricao}</p>
                </div>
                <button 
                  className="btn-exportar"
                  onClick={() => handleExportarRelatorio(relatorio.tipo)}
                >
                  <Icons.Download />
                  Exportar
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminRelatorios;
