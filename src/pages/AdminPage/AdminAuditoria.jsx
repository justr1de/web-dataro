import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { supabase } from '../../utils/supabaseClient';
import './AdminAuditoria.css';

const AdminAuditoria = () => {
  const { theme } = useTheme();
  const { adminUser, isSuperAdmin } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('logs');
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
      if (Array.isArray(data)) {
        setLogs(data);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error('Erro ao carregar logs:', err);
      setLogs([]);
    }
  }, [filtros]);

  // Carregar tentativas de acesso falhas
  const fetchTentativas = useCallback(async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/admin_log_auditoria?select=*&tipo_evento=in.(TENTATIVA_LOGIN_FALHA,TENTATIVA_LOGIN_SENHA_INCORRETA,LOGIN_BLOQUEADO_SESSAO_ATIVA)&order=created_at.desc&limit=100`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setTentativas(data);
      } else {
        setTentativas([]);
      }
    } catch (err) {
      console.error('Erro ao carregar tentativas:', err);
      setTentativas([]);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchLogs(), fetchTentativas()]);
      setLoading(false);
    };
    loadData();
  }, [fetchLogs, fetchTentativas]);

  // Formatar data
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR');
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
      'USUARIO_EXCLUIDO': { label: 'Usuário Excluído', class: 'danger' },
      'PRIMEIRO_ACESSO': { label: 'Primeiro Acesso', class: 'info' }
    };
    return badges[tipo] || { label: tipo, class: 'default' };
  };

  // Métricas
  const metricas = {
    loginsHoje: logs.filter(l => {
      const hoje = new Date().toDateString();
      return l.tipo_evento === 'LOGIN_SUCESSO' && new Date(l.created_at).toDateString() === hoje;
    }).length,
    tentativasFalhas: tentativas.filter(t => {
      const hoje = new Date().toDateString();
      return new Date(t.created_at).toDateString() === hoje;
    }).length,
    usuariosUnicos: [...new Set(logs.filter(l => l.tipo_evento === 'LOGIN_SUCESSO').map(l => l.email))].length,
    totalEventos: logs.length
  };

  // Estatísticas por navegador
  const estatisticasBrowser = logs.reduce((acc, log) => {
    const { browser } = parseUserAgent(log.user_agent);
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {});

  // Estatísticas por sistema operacional
  const estatisticasOS = logs.reduce((acc, log) => {
    const { os } = parseUserAgent(log.user_agent);
    acc[os] = (acc[os] || 0) + 1;
    return acc;
  }, {});

  // Estatísticas por dispositivo
  const estatisticasDevice = logs.reduce((acc, log) => {
    const { device } = parseUserAgent(log.user_agent);
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});

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
            <span className="header-subtitle">| Acesso restrito</span>
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
          <span className="header-subtitle">| Monitoramento de acessos e segurança</span>
        </div>
        <button className="admin-btn-secondary" onClick={() => { fetchLogs(); fetchTentativas(); }}>
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
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
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

        <div className="admin-metric-card">
          <div className="admin-metric-icon events">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div className="admin-metric-info">
            <span className="admin-metric-value">{metricas.totalEventos}</span>
            <span className="admin-metric-label">Total de Eventos</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-auditoria-tabs">
        <button 
          className={`admin-tab ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
          Logs de Acesso
        </button>
        <button 
          className={`admin-tab ${activeTab === 'tentativas' ? 'active' : ''}`}
          onClick={() => setActiveTab('tentativas')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          Tentativas Falhas
          {tentativas.length > 0 && <span className="admin-tab-badge">{tentativas.length}</span>}
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

      {/* Content */}
      <div className="admin-auditoria-content">
        {loading ? (
          <div className="admin-auditoria-loading">
            <div className="admin-spinner"></div>
            <p>Carregando dados de auditoria...</p>
          </div>
        ) : (
          <>
            {/* Tab: Logs de Acesso */}
            {activeTab === 'logs' && (
              <div className="admin-auditoria-section">
                <div className="admin-auditoria-filters">
                  <div className="admin-filter-group">
                    <label>Usuário</label>
                    <input 
                      type="text" 
                      placeholder="Buscar por email..."
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
                      <option value="SENHA_ALTERADA">Senha Alterada</option>
                      <option value="USUARIO_CRIADO">Usuário Criado</option>
                      <option value="USUARIO_EDITADO">Usuário Editado</option>
                      <option value="USUARIO_EXCLUIDO">Usuário Excluído</option>
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

                <div className="admin-auditoria-table-container">
                  <table className="admin-auditoria-table">
                    <thead>
                      <tr>
                        <th>Data/Hora</th>
                        <th>Usuário</th>
                        <th>Evento</th>
                        <th>Navegador</th>
                        <th>Sistema</th>
                        <th>Dispositivo</th>
                        <th>IP</th>
                        <th>Detalhes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="admin-auditoria-empty">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            <p>Nenhum log encontrado</p>
                          </td>
                        </tr>
                      ) : (
                        logs.map((log, index) => {
                          const { browser, os, device } = parseUserAgent(log.user_agent);
                          const badge = getEventBadge(log.tipo_evento);
                          return (
                            <tr key={log.id || index}>
                              <td>{formatDate(log.created_at)}</td>
                              <td>{log.email}</td>
                              <td>
                                <span className={`admin-badge ${badge.class}`}>{badge.label}</span>
                              </td>
                              <td>{browser}</td>
                              <td>{os}</td>
                              <td>{device}</td>
                              <td>{log.ip_address || '-'}</td>
                              <td className="admin-auditoria-details">{log.detalhes || '-'}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Tentativas Falhas */}
            {activeTab === 'tentativas' && (
              <div className="admin-auditoria-section">
                <div className="admin-auditoria-alert">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <div>
                    <strong>Monitoramento de Segurança</strong>
                    <p>Esta seção exibe todas as tentativas de login que falharam, incluindo senhas incorretas e tentativas bloqueadas.</p>
                  </div>
                </div>

                <div className="admin-auditoria-table-container">
                  <table className="admin-auditoria-table">
                    <thead>
                      <tr>
                        <th>Data/Hora</th>
                        <th>Email Tentado</th>
                        <th>Tipo</th>
                        <th>Navegador</th>
                        <th>Sistema</th>
                        <th>IP</th>
                        <th>Detalhes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tentativas.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="admin-auditoria-empty">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <p>Nenhuma tentativa falha registrada</p>
                          </td>
                        </tr>
                      ) : (
                        tentativas.map((tentativa, index) => {
                          const { browser, os } = parseUserAgent(tentativa.user_agent);
                          const badge = getEventBadge(tentativa.tipo_evento);
                          return (
                            <tr key={tentativa.id || index}>
                              <td>{formatDate(tentativa.created_at)}</td>
                              <td>{tentativa.email}</td>
                              <td>
                                <span className={`admin-badge ${badge.class}`}>{badge.label}</span>
                              </td>
                              <td>{browser}</td>
                              <td>{os}</td>
                              <td>{tentativa.ip_address || '-'}</td>
                              <td className="admin-auditoria-details">{tentativa.detalhes || '-'}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab: Estatísticas */}
            {activeTab === 'estatisticas' && (
              <div className="admin-auditoria-section">
                <div className="admin-auditoria-stats-grid">
                  {/* Estatísticas por Navegador */}
                  <div className="admin-stats-card">
                    <h3>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="4"></circle>
                        <line x1="21.17" y1="8" x2="12" y2="8"></line>
                        <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
                        <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
                      </svg>
                      Por Navegador
                    </h3>
                    <div className="admin-stats-list">
                      {Object.entries(estatisticasBrowser).sort((a, b) => b[1] - a[1]).map(([browser, count]) => (
                        <div key={browser} className="admin-stats-item">
                          <span className="admin-stats-name">{browser}</span>
                          <div className="admin-stats-bar-container">
                            <div 
                              className="admin-stats-bar" 
                              style={{ width: `${(count / logs.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="admin-stats-count">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Estatísticas por Sistema Operacional */}
                  <div className="admin-stats-card">
                    <h3>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                      Por Sistema Operacional
                    </h3>
                    <div className="admin-stats-list">
                      {Object.entries(estatisticasOS).sort((a, b) => b[1] - a[1]).map(([os, count]) => (
                        <div key={os} className="admin-stats-item">
                          <span className="admin-stats-name">{os}</span>
                          <div className="admin-stats-bar-container">
                            <div 
                              className="admin-stats-bar os" 
                              style={{ width: `${(count / logs.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="admin-stats-count">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Estatísticas por Dispositivo */}
                  <div className="admin-stats-card">
                    <h3>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                        <line x1="12" y1="18" x2="12.01" y2="18"></line>
                      </svg>
                      Por Dispositivo
                    </h3>
                    <div className="admin-stats-list">
                      {Object.entries(estatisticasDevice).sort((a, b) => b[1] - a[1]).map(([device, count]) => (
                        <div key={device} className="admin-stats-item">
                          <span className="admin-stats-name">{device}</span>
                          <div className="admin-stats-bar-container">
                            <div 
                              className="admin-stats-bar device" 
                              style={{ width: `${(count / logs.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="admin-stats-count">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resumo de Eventos */}
                  <div className="admin-stats-card">
                    <h3>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                      </svg>
                      Resumo de Eventos
                    </h3>
                    <div className="admin-stats-summary">
                      <div className="admin-stats-summary-item">
                        <span className="admin-stats-summary-label">Total de Logins</span>
                        <span className="admin-stats-summary-value success">
                          {logs.filter(l => l.tipo_evento === 'LOGIN_SUCESSO').length}
                        </span>
                      </div>
                      <div className="admin-stats-summary-item">
                        <span className="admin-stats-summary-label">Total de Logouts</span>
                        <span className="admin-stats-summary-value info">
                          {logs.filter(l => l.tipo_evento === 'LOGOUT').length}
                        </span>
                      </div>
                      <div className="admin-stats-summary-item">
                        <span className="admin-stats-summary-label">Senhas Alteradas</span>
                        <span className="admin-stats-summary-value warning">
                          {logs.filter(l => l.tipo_evento === 'SENHA_ALTERADA').length}
                        </span>
                      </div>
                      <div className="admin-stats-summary-item">
                        <span className="admin-stats-summary-label">Tentativas Falhas</span>
                        <span className="admin-stats-summary-value danger">
                          {tentativas.length}
                        </span>
                      </div>
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
