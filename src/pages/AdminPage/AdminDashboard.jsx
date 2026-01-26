import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { supabase } from '../../utils/supabaseClient';
import './AdminDashboard.css';

// Ícones SVG
const Icons = {
  Document: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
    </svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  Refresh: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"></polyline>
      <polyline points="1 20 1 14 7 14"></polyline>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  )
};

const AdminDashboard = () => {
  const { adminUser } = useAdminAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pendentes: 0,
    emAndamento: 0,
    concluidas: 0,
    urgentes: 0
  });
  const [demandas, setDemandas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedUrgencia, setSelectedUrgencia] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Buscar clientes
      const { data: clienteData } = await supabase
        .from('admin_gabinetes')
        .select('*')
        .eq('ativo', true);
      setClientes(clienteData || []);

      // Buscar demandas
      const { data: demData } = await supabase
        .from('admin_demandas')
        .select('*, admin_gabinetes(nome)')
        .order('created_at', { ascending: false });
      setDemandas(demData || []);

      // Calcular estatísticas
      const allDemandas = demData || [];
      setStats({
        total: allDemandas.length,
        pendentes: allDemandas.filter(d => d.status === 'pendente').length,
        emAndamento: allDemandas.filter(d => d.status === 'em_andamento').length,
        concluidas: allDemandas.filter(d => d.status === 'concluida').length,
        urgentes: allDemandas.filter(d => d.urgencia === 'urgente').length
      });
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
    setLoading(false);
  };

  const filteredDemandas = demandas.filter(demanda => {
    if (selectedCliente && demanda.gabinete_id !== selectedCliente) return false;
    if (selectedStatus && demanda.status !== selectedStatus) return false;
    if (selectedUrgencia && demanda.urgencia !== selectedUrgencia) return false;
    if (selectedTipo && demanda.tipo !== selectedTipo) return false;
    if (searchTerm && !demanda.titulo?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente': return 'status-pendente';
      case 'em_andamento': return 'status-andamento';
      case 'concluida': return 'status-concluida';
      default: return '';
    }
  };

  const getUrgenciaColor = (urgencia) => {
    switch (urgencia) {
      case 'baixa': return 'urgencia-baixa';
      case 'normal': return 'urgencia-normal';
      case 'alta': return 'urgencia-alta';
      case 'urgente': return 'urgencia-urgente';
      default: return '';
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-title">
          <Icons.Document />
          <h1>Gestão de Demandas</h1>
          <span className="header-subtitle">Gerencie todas as demandas dos clientes</span>
        </div>
        <button className="btn-nova-demanda" onClick={() => navigate('/admin/demandas/nova')}>
          <Icons.Plus />
          Nova Demanda
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-content">
            <span className="stat-label">Total</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-icon">
            <Icons.Document />
          </div>
        </div>

        <div className="stat-card stat-pendentes">
          <div className="stat-content">
            <span className="stat-label">Pendentes</span>
            <span className="stat-value">{stats.pendentes}</span>
          </div>
          <div className="stat-icon">
            <Icons.Clock />
          </div>
        </div>

        <div className="stat-card stat-andamento">
          <div className="stat-content">
            <span className="stat-label">Em Andamento</span>
            <span className="stat-value">{stats.emAndamento}</span>
          </div>
          <div className="stat-icon">
            <Icons.Refresh />
          </div>
        </div>

        <div className="stat-card stat-concluidas">
          <div className="stat-content">
            <span className="stat-label">Concluídas</span>
            <span className="stat-value">{stats.concluidas}</span>
          </div>
          <div className="stat-icon">
            <Icons.Check />
          </div>
        </div>

        <div className="stat-card stat-urgentes">
          <div className="stat-content">
            <span className="stat-label">Urgentes</span>
            <span className="stat-value">{stats.urgentes}</span>
          </div>
          <div className="stat-icon">
            <Icons.Alert />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Cliente</label>
          <select 
            value={selectedCliente} 
            onChange={(e) => setSelectedCliente(e.target.value)}
          >
            <option value="">Selecione um cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="pendente">Pendente</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluida">Concluída</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Urgência</label>
          <select 
            value={selectedUrgencia} 
            onChange={(e) => setSelectedUrgencia(e.target.value)}
          >
            <option value="">Todas as urgências</option>
            <option value="baixa">Baixa</option>
            <option value="normal">Normal</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Tipo</label>
          <select 
            value={selectedTipo} 
            onChange={(e) => setSelectedTipo(e.target.value)}
          >
            <option value="">Todos os tipos</option>
          </select>
        </div>

        <div className="filter-group filter-search">
          <label>Buscar</label>
          <input 
            type="text" 
            placeholder="Buscar por título, descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de Demandas */}
      <div className="demandas-section">
        <div className="section-header">
          <Icons.Document />
          <h2>Lista de Demandas</h2>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Carregando demandas...</p>
          </div>
        ) : filteredDemandas.length === 0 ? (
          <div className="empty-state">
            <Icons.Document />
            <p>Selecione um cliente para visualizar as demandas</p>
          </div>
        ) : (
          <div className="demandas-list">
            {filteredDemandas.map(demanda => (
              <div key={demanda.id} className="demanda-card">
                <div className="demanda-header">
                  <h3>{demanda.titulo}</h3>
                  <div className="demanda-badges">
                    <span className={`badge ${getStatusColor(demanda.status)}`}>
                      {demanda.status?.replace('_', ' ')}
                    </span>
                    <span className={`badge ${getUrgenciaColor(demanda.urgencia)}`}>
                      {demanda.urgencia}
                    </span>
                  </div>
                </div>
                <p className="demanda-descricao">{demanda.descricao}</p>
                <div className="demanda-footer">
                  <span className="demanda-cliente">
                    {demanda.admin_gabinetes?.nome || 'Sem cliente'}
                  </span>
                  <span className="demanda-data">
                    {new Date(demanda.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
