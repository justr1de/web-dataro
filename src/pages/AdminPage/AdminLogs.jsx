import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import './AdminLogs.css';

// Ícones SVG
const Icons = {
  Activity: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  LogIn: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
      <polyline points="10 17 15 12 10 7"></polyline>
      <line x1="15" y1="12" x2="3" y2="12"></line>
    </svg>
  ),
  LogOut: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Eye: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ),
  Download: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  ),
  Filter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  Globe: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  )
};

const getActionIcon = (acao) => {
  switch (acao) {
    case 'login': return <Icons.LogIn />;
    case 'logout': return <Icons.LogOut />;
    case 'criar': return <Icons.Plus />;
    case 'editar': return <Icons.Edit />;
    case 'excluir': return <Icons.Trash />;
    case 'visualizar': return <Icons.Eye />;
    case 'download': return <Icons.Download />;
    default: return <Icons.Activity />;
  }
};

const getActionColor = (acao) => {
  switch (acao) {
    case 'login': return '#10b981';
    case 'logout': return '#f59e0b';
    case 'criar': return '#3b82f6';
    case 'editar': return '#8b5cf6';
    case 'excluir': return '#ef4444';
    case 'visualizar': return '#06b6d4';
    case 'download': return '#10b981';
    default: return '#6b7280';
  }
};

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAcao, setSelectedAcao] = useState('');
  const [selectedUsuario, setSelectedUsuario] = useState('');
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Buscar usuários
      const { data: usuariosData } = await supabase
        .from('admin_usuarios')
        .select('*')
        .order('nome', { ascending: true });
      setUsuarios(usuariosData || []);

      // Simular logs de acesso
      const logsSimulados = [
        { id: 1, usuario: 'Hugo Nascimento Silva', acao: 'login', descricao: 'Login realizado com sucesso', ip: '187.45.123.45', data: '2026-01-27T10:30:00' },
        { id: 2, usuario: 'Kaliel Mendes Cardoso', acao: 'criar', descricao: 'Criou novo cliente: Prefeitura de Porto Velho', ip: '189.23.45.67', data: '2026-01-27T09:15:00' },
        { id: 3, usuario: 'DATA-RO Admin', acao: 'editar', descricao: 'Editou projeto: Dashboard Municipal', ip: '200.12.34.56', data: '2026-01-27T08:45:00' },
        { id: 4, usuario: 'Hugo Nascimento Silva', acao: 'visualizar', descricao: 'Visualizou relatório financeiro', ip: '187.45.123.45', data: '2026-01-26T16:20:00' },
        { id: 5, usuario: 'Kaliel Mendes Cardoso', acao: 'excluir', descricao: 'Excluiu demanda #1234', ip: '189.23.45.67', data: '2026-01-26T14:00:00' },
        { id: 6, usuario: 'DATA-RO Admin', acao: 'logout', descricao: 'Logout realizado', ip: '200.12.34.56', data: '2026-01-26T12:30:00' },
        { id: 7, usuario: 'Hugo Nascimento Silva', acao: 'download', descricao: 'Baixou documento: Contrato.pdf', ip: '187.45.123.45', data: '2026-01-26T11:00:00' },
        { id: 8, usuario: 'DATA-RO Admin', acao: 'login', descricao: 'Login realizado com sucesso', ip: '200.12.34.56', data: '2026-01-26T08:00:00' },
      ];
      setLogs(logsSimulados);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
    setLoading(false);
  };

  const filteredLogs = logs.filter(log => {
    if (selectedAcao && log.acao !== selectedAcao) return false;
    if (selectedUsuario && log.usuario !== selectedUsuario) return false;
    return true;
  });

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-logs">
      {/* Header */}
      <div className="logs-header">
        <div className="header-title">
          <Icons.Activity />
          <div className="header-text">
            <h1>Logs de Acesso</h1>
            <span className="header-subtitle">Monitore todas as atividades do sistema</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-group">
          <label><Icons.Filter /> Ação</label>
          <select value={selectedAcao} onChange={(e) => setSelectedAcao(e.target.value)}>
            <option value="">Todas as Ações</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="criar">Criar</option>
            <option value="editar">Editar</option>
            <option value="excluir">Excluir</option>
            <option value="visualizar">Visualizar</option>
            <option value="download">Download</option>
          </select>
        </div>
        <div className="filter-group">
          <label><Icons.User /> Usuário</label>
          <select value={selectedUsuario} onChange={(e) => setSelectedUsuario(e.target.value)}>
            <option value="">Todos os Usuários</option>
            {usuarios.map(u => (
              <option key={u.id} value={u.nome}>{u.nome}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Logs */}
      <div className="logs-section">
        <div className="section-header">
          <Icons.Activity />
          <h2>Atividades Recentes ({filteredLogs.length})</h2>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Carregando logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="empty-state">
            <Icons.Activity />
            <p>Nenhum log encontrado</p>
          </div>
        ) : (
          <div className="logs-list">
            {filteredLogs.map(log => (
              <div key={log.id} className="log-item">
                <div 
                  className="log-icon" 
                  style={{ backgroundColor: `${getActionColor(log.acao)}20`, color: getActionColor(log.acao) }}
                >
                  {getActionIcon(log.acao)}
                </div>
                <div className="log-content">
                  <div className="log-header">
                    <span className="log-usuario">{log.usuario}</span>
                    <span 
                      className="log-acao-badge"
                      style={{ backgroundColor: `${getActionColor(log.acao)}20`, color: getActionColor(log.acao) }}
                    >
                      {log.acao.toUpperCase()}
                    </span>
                  </div>
                  <p className="log-descricao">{log.descricao}</p>
                  <div className="log-meta">
                    <span><Icons.Clock /> {formatDateTime(log.data)}</span>
                    <span><Icons.Globe /> {log.ip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogs;
