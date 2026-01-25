import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { supabase } from '../../utils/supabaseClient';
import './AdminAuditoria.css';

const AdminAuditoria = () => {
  const { theme } = useTheme();
  const { adminUser, isSuperAdmin } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('sessoes');
  const [sessoes, setSessoes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [tentativas, setTentativas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    usuario: '',
    tipoEvento: '',
    dataInicio: '',
    dataFim: ''
  });

  const SUPABASE_URL = 'https://csuzmlajnhfauxqgczmu.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzdXptbGFqbmhmYXV4cWdjem11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzExMzcsImV4cCI6MjA4MTMwNzEzN30.eATRbvz2klesZnV3iGBk6sgrvZMbk_1YscW5oi9etfA';

  // Carregar sessões ativas
  const fetchSessoes = useCallback(async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/admin_sessoes?select=*,admin_usuarios(nome,email)&ativa=eq.true&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      const data = await response.json();
      setSessoes(data || []);
    } catch (err) {
      console.error('Erro ao carregar sessões:', err);
    }
  }, []);

  // Carregar logs de auditoria
  const fetchLogs = useCallback(async () => {
    try {
      let url = `${SUPABASE_URL}/rest/v1/admin_log_auditoria?select=*&order=created_at.desc&limit=500`;
      
      if (filtros.usuario) {
        url += `&email=ilike.*${filtros.usuario}*`;
      }
      if (filtros.tipoEvento) {
        url += `&tipo_evento=eq.${filtros.tipoEvento}`;
      }
      if (filtros.dataInicio) {
        url += `&created_at=gte.${filtros.dataInicio}T00:00:00`;
      }
      if (filtros.dataFim) {
        url += `&created_at=lte.${filtros.dataFim}T23:59:59`;
      }

      const response = await fetch(url, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      const data = await response.json();
      setLogs(data || []);
    } catch (err) {
      console.error('Erro ao carregar logs:', err);
    }
  }, [filtros]);

  // Carregar tentativas de acesso
  const fetchTentativas = useCallback(async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/admin_log_auditoria?select=*&tipo_evento=in.(TENTATIVA_LOGIN_FALHA,TENTATIVA_LOGIN_SENHA_INCORRETA,LOGIN_BLOQUEADO_SESSAO_ATIVA)&order=created_at.desc&limit=100`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      const data = await response.json();
      setTentativas(data || []);
    } catch (err) {
      console.error('Erro ao carregar tentativas:', err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSessoes(), fetchLogs(), fetchTentativas()]);
      setLoading(false);
    };
    loadData();
  }, [fetchSessoes, fetchLogs, fetchTentativas]);

  // Encerrar sessão
  const handleEncerrarSessao = async (sessaoId, userId) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/admin_sessoes?id=eq.${sessaoId}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ativa: false,
          encerrada_em: new Date().toISOString(),
          encerrada_por: adminUser?.email
        })
      });
      
      // Registrar log
      await supabase.from('admin_log_auditoria').insert({
        email: adminUser?.email,
        tipo_evento: 'SESSAO_ENCERRADA_ADMIN',
        detalhes: `Sessão encerrada pelo administrador. ID: ${sessaoId}`,
        user_agent: navigator.userAgent
      });

      fetchSessoes();
    } catch (err) {
      console.error('Erro ao encerrar sessão:', err);
    }
  };

  // Formatar data
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR');
  };

  // Calcular tempo de sessão
  const calcularTempoSessao = (inicio) => {
    if (!inicio) return '-';
    const diff = Date.now() - new Date(inicio).getTime();
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${horas}h ${minutos}min`;
  };

  // Extrair informações do User Agent
  const parseUserAgent = (ua) => {
    if (!ua) return { browser: 'Desconhecido', os: 'Desconhecido', device: 'Desconhecido' };
    
    let browser = 'Outro';
    let os = 'Outro';
    let device = 'Desktop';

    // Browser
    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edg')) browser = 'Edge';
    else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';

    // OS
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac OS')) os = 'macOS';
    else if (ua.includes('Linux') && !ua.includes('Android')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

    // Device
    if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) device = 'Mobile';
    else if (ua.includes('Tablet') || ua.includes('iPad')) device = 'Tablet';

    return { browser, os, device };
  };

  // Badge de tipo de evento
  const getEventBadge = (tipo) => {
    const badges = {
      'LOGIN_SUCESSO': { label: 'Login', class: 'success' },
      'LOGOUT': { label: 'Logout', class: 'info' },
      'TENTATIVA_LOGIN_FALHA': { label: 'Falha', class: 'danger' },
      'TENTATIVA_LOGIN_SENHA_INCORRETA': { label: 'Senha Incorreta', class: 'warning' },
      'LOGIN_BLOQUEADO_SESSAO_ATIVA': { label: 'Bloqueado', class: 'danger' },
      'SENHA_ALTERADA': { label: 'Senha Alterada', class: 'info' },
      'SESSAO_ENCERRADA_ADMIN': { label: 'Sessão Encerrada', class: 'warning' },
      'USUARIO_CRIADO': { label: 'Usuário Criado', class: 'success' },
      'USUARIO_EDITADO': { label: 'Usuário Editado', class: 'info' },
      'USUARIO_EXCLUIDO': { label: 'Usuário Excluído', class: 'danger' }
    };
    return badges[tipo] || { label: tipo, class: 'default' };
  };

  // Métricas
  const metricas = {
    sessoesAtivas: sessoes.length,
    loginsHoje: logs.filter(l => {
      const hoje = new Date().toDateString();
      return l.tipo_evento === 'LOGIN_SUCESSO' && new Date(l.created_at).toDateString() === hoje;
    }).length,
    tentativasFalhas: tentativas.filter(t => {
      const hoje = new Date().toDateString();
      return new Date(t.created_at).toDateString() === hoje;
    }).length,
    usuariosUnicos: [...new Set(logs.filter(l => l.tipo_evento === 'LOGIN_SUCESSO').map(l => l.email))].length
  };

  // Verificar se é super admin
  if (!isSuperAdmin()) {
    return (
      <div className={`admin-auditoria ${theme}`}>
        <div className="admin-auditoria-header">
          <div className="admin-auditoria-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <h1>Auditoria</h1>
            <span className="header-subtitle">Acesso restrito</span>
          </div>
        </div>
        <div className="admin-auditoria-restricted">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <h2>Acesso Restrito</h2>
          <p>Esta área é exclusiva para Super Administradores.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-auditoria ${theme}`}>
      {/* Header */}
      <div className="admin-auditoria-header">
        <div className="admin-auditoria-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <h1>Auditoria</h1>
          <span className="header-subtitle">Monitoramento de acessos e segurança</span>
        </div>
        <button className="admin-btn-secondary" onClick={() => { fetchSessoes(); fetchLogs(); fetchTentativas(); }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          Atualizar
        </button>
      </div>

      {/* Métricas */}
      <div className="admin-auditoria-metrics">
        <div className="admin-metric-card">
          <div className="admin-metric-icon sessions">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
          <div className="admin-metric-info">
            <span className="admin-metric-value">{metricas.sessoesAtivas}</span>
            <span className="admin-metric-label">Sessões Ativas</span>
          </div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-icon logins">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
          </div>
          <div className="admin-metric-info">
            <span className="admin-metric-value">{metricas.loginsHoje}</span>
            <span className="admin-metric-label">Logins Hoje</span>
          </div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-icon failures">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div className="admin-metric-info">
            <span className="admin-metric-value">{metricas.tentativasFalhas}</span>
            <span className="admin-metric-label">Tentativas Falhas Hoje</span>
          </div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-icon users">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="admin-metric-info">
            <span className="admin-metric-value">{metricas.usuariosUnicos}</span>
            <span className="admin-metric-label">Usuários Únicos</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-auditoria-tabs">
        <button 
          className={`admin-tab ${activeTab === 'sessoes' ? 'active' : ''}`}
          onClick={() => setActiveTab('sessoes')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          Sessões Ativas ({sessoes.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Logs de Acesso
        </button>
        <button 
          className={`admin-tab ${activeTab === 'tentativas' ? 'active' : ''}`}
          onClick={() => setActiveTab('tentativas')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          Tentativas de Acesso ({tentativas.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'estatisticas' ? 'active' : ''}`}
          onClick={() => setActiveTab('estatisticas')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          Estatísticas
        </button>
      </div>

      {/* Conteúdo das Tabs */}
      <div className="admin-auditoria-content">
        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
            <p>Carregando dados de auditoria...</p>
          </div>
        ) : (
          <>
            {/* Tab Sessões Ativas */}
            {activeTab === 'sessoes' && (
              <div className="admin-tab-content">
                <div className="admin-section-header">
                  <h3>Sessões Ativas</h3>
                  <p>Usuários atualmente logados no sistema</p>
                </div>
                {sessoes.length === 0 ? (
                  <div className="admin-empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p>Nenhuma sessão ativa no momento</p>
                  </div>
                ) : (
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Usuário</th>
                          <th>Email</th>
                          <th>IP</th>
                          <th>Navegador</th>
                          <th>Sistema</th>
                          <th>Dispositivo</th>
                          <th>Início</th>
                          <th>Tempo</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessoes.map((sessao) => {
                          const uaInfo = parseUserAgent(sessao.user_agent);
                          return (
                            <tr key={sessao.id}>
                              <td className="user-cell">
                                <div className="user-avatar">
                                  {sessao.admin_usuarios?.nome?.charAt(0) || '?'}
                                </div>
                                <span>{sessao.admin_usuarios?.nome || 'Desconhecido'}</span>
                              </td>
                              <td>{sessao.admin_usuarios?.email || '-'}</td>
                              <td>
                                <span className="ip-badge">{sessao.ip_address || 'N/A'}</span>
                              </td>
                              <td>{uaInfo.browser}</td>
                              <td>{uaInfo.os}</td>
                              <td>
                                <span className={`device-badge ${uaInfo.device.toLowerCase()}`}>
                                  {uaInfo.device}
                                </span>
                              </td>
                              <td>{formatDate(sessao.created_at)}</td>
                              <td>{calcularTempoSessao(sessao.created_at)}</td>
                              <td>
                                <button 
                                  className="admin-btn-danger-sm"
                                  onClick={() => handleEncerrarSessao(sessao.id, sessao.user_id)}
                                  title="Encerrar sessão"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                  </svg>
                                  Encerrar
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab Logs de Acesso */}
            {activeTab === 'logs' && (
              <div className="admin-tab-content">
                <div className="admin-section-header">
                  <h3>Logs de Acesso</h3>
                  <p>Histórico completo de atividades no sistema</p>
                </div>
                
                {/* Filtros */}
                <div className="admin-filters">
                  <div className="admin-filter-group">
                    <label>Usuário</label>
                    <input
                      type="text"
                      placeholder="Filtrar por email..."
                      value={filtros.usuario}
                      onChange={(e) => setFiltros({...filtros, usuario: e.target.value})}
                    />
                  </div>
                  <div className="admin-filter-group">
                    <label>Tipo de Evento</label>
                    <select
                      value={filtros.tipoEvento}
                      onChange={(e) => setFiltros({...filtros, tipoEvento: e.target.value})}
                    >
                      <option value="">Todos</option>
                      <option value="LOGIN_SUCESSO">Login</option>
                      <option value="LOGOUT">Logout</option>
                      <option value="TENTATIVA_LOGIN_FALHA">Tentativa Falha</option>
                      <option value="TENTATIVA_LOGIN_SENHA_INCORRETA">Senha Incorreta</option>
                      <option value="LOGIN_BLOQUEADO_SESSAO_ATIVA">Bloqueado</option>
                      <option value="SENHA_ALTERADA">Senha Alterada</option>
                    </select>
                  </div>
                  <div className="admin-filter-group">
                    <label>Data Início</label>
                    <input
                      type="date"
                      value={filtros.dataInicio}
                      onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
                    />
                  </div>
                  <div className="admin-filter-group">
                    <label>Data Fim</label>
                    <input
                      type="date"
                      value={filtros.dataFim}
                      onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
                    />
                  </div>
                  <button className="admin-btn-filter" onClick={fetchLogs}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    Filtrar
                  </button>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Data/Hora</th>
                        <th>Email</th>
                        <th>Evento</th>
                        <th>IP</th>
                        <th>Navegador</th>
                        <th>Detalhes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => {
                        const badge = getEventBadge(log.tipo_evento);
                        const uaInfo = parseUserAgent(log.user_agent);
                        return (
                          <tr key={log.id}>
                            <td>{formatDate(log.created_at)}</td>
                            <td>{log.email}</td>
                            <td>
                              <span className={`event-badge ${badge.class}`}>
                                {badge.label}
                              </span>
                            </td>
                            <td>
                              <span className="ip-badge">{log.ip_address || 'N/A'}</span>
                            </td>
                            <td>{uaInfo.browser} / {uaInfo.os}</td>
                            <td className="details-cell">{log.detalhes || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab Tentativas de Acesso */}
            {activeTab === 'tentativas' && (
              <div className="admin-tab-content">
                <div className="admin-section-header">
                  <h3>Tentativas de Acesso</h3>
                  <p>Tentativas de login falhas e bloqueadas</p>
                </div>
                
                {tentativas.length === 0 ? (
                  <div className="admin-empty-state success">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <p>Nenhuma tentativa de acesso suspeita registrada</p>
                  </div>
                ) : (
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Data/Hora</th>
                          <th>Email</th>
                          <th>Tipo</th>
                          <th>IP</th>
                          <th>Navegador</th>
                          <th>Detalhes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tentativas.map((tentativa) => {
                          const badge = getEventBadge(tentativa.tipo_evento);
                          const uaInfo = parseUserAgent(tentativa.user_agent);
                          return (
                            <tr key={tentativa.id} className="row-warning">
                              <td>{formatDate(tentativa.created_at)}</td>
                              <td>{tentativa.email}</td>
                              <td>
                                <span className={`event-badge ${badge.class}`}>
                                  {badge.label}
                                </span>
                              </td>
                              <td>
                                <span className="ip-badge danger">{tentativa.ip_address || 'N/A'}</span>
                              </td>
                              <td>{uaInfo.browser} / {uaInfo.os}</td>
                              <td className="details-cell">{tentativa.detalhes || '-'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab Estatísticas */}
            {activeTab === 'estatisticas' && (
              <div className="admin-tab-content">
                <div className="admin-section-header">
                  <h3>Estatísticas de Acesso</h3>
                  <p>Análise de padrões de uso do sistema</p>
                </div>
                
                <div className="admin-stats-grid">
                  <div className="admin-stat-card">
                    <h4>Logins por Período</h4>
                    <div className="stat-items">
                      <div className="stat-item">
                        <span className="stat-label">Hoje</span>
                        <span className="stat-value">{metricas.loginsHoje}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Esta Semana</span>
                        <span className="stat-value">
                          {logs.filter(l => {
                            const semanaAtras = new Date();
                            semanaAtras.setDate(semanaAtras.getDate() - 7);
                            return l.tipo_evento === 'LOGIN_SUCESSO' && new Date(l.created_at) >= semanaAtras;
                          }).length}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Este Mês</span>
                        <span className="stat-value">
                          {logs.filter(l => {
                            const mesAtual = new Date().getMonth();
                            return l.tipo_evento === 'LOGIN_SUCESSO' && new Date(l.created_at).getMonth() === mesAtual;
                          }).length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="admin-stat-card">
                    <h4>Navegadores Mais Usados</h4>
                    <div className="stat-items">
                      {(() => {
                        const browsers = {};
                        logs.forEach(l => {
                          const browser = parseUserAgent(l.user_agent).browser;
                          browsers[browser] = (browsers[browser] || 0) + 1;
                        });
                        return Object.entries(browsers)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 5)
                          .map(([browser, count]) => (
                            <div className="stat-item" key={browser}>
                              <span className="stat-label">{browser}</span>
                              <span className="stat-value">{count}</span>
                            </div>
                          ));
                      })()}
                    </div>
                  </div>

                  <div className="admin-stat-card">
                    <h4>Sistemas Operacionais</h4>
                    <div className="stat-items">
                      {(() => {
                        const systems = {};
                        logs.forEach(l => {
                          const os = parseUserAgent(l.user_agent).os;
                          systems[os] = (systems[os] || 0) + 1;
                        });
                        return Object.entries(systems)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 5)
                          .map(([os, count]) => (
                            <div className="stat-item" key={os}>
                              <span className="stat-label">{os}</span>
                              <span className="stat-value">{count}</span>
                            </div>
                          ));
                      })()}
                    </div>
                  </div>

                  <div className="admin-stat-card">
                    <h4>Dispositivos</h4>
                    <div className="stat-items">
                      {(() => {
                        const devices = {};
                        logs.forEach(l => {
                          const device = parseUserAgent(l.user_agent).device;
                          devices[device] = (devices[device] || 0) + 1;
                        });
                        return Object.entries(devices)
                          .sort((a, b) => b[1] - a[1])
                          .map(([device, count]) => (
                            <div className="stat-item" key={device}>
                              <span className="stat-label">{device}</span>
                              <span className="stat-value">{count}</span>
                            </div>
                          ));
                      })()}
                    </div>
                  </div>

                  <div className="admin-stat-card full-width">
                    <h4>Usuários Mais Ativos</h4>
                    <div className="stat-items horizontal">
                      {(() => {
                        const users = {};
                        logs.filter(l => l.tipo_evento === 'LOGIN_SUCESSO').forEach(l => {
                          users[l.email] = (users[l.email] || 0) + 1;
                        });
                        return Object.entries(users)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 10)
                          .map(([email, count]) => (
                            <div className="stat-item-horizontal" key={email}>
                              <span className="stat-label">{email}</span>
                              <span className="stat-value">{count} logins</span>
                            </div>
                          ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAuditoria;
