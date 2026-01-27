import React, { useState } from 'react';
import './AdminConfiguracoes.css';

// Ícones SVG
const Icons = {
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
  Bell: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  ),
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  ),
  Database: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
  ),
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
  Globe: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  ),
  Save: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
  )
};

const AdminConfiguracoes = () => {
  const [config, setConfig] = useState({
    // Notificações
    notificacoesEmail: true,
    notificacoesPush: false,
    lembreteEventos: true,
    lembreteAntecedencia: '48',
    
    // Segurança
    autenticacaoDoisFatores: false,
    sessaoExpira: '8',
    logAcessos: true,
    
    // Sistema
    idioma: 'pt-BR',
    fusoHorario: 'America/Sao_Paulo',
    formatoData: 'DD/MM/YYYY',
    
    // Backup
    backupAutomatico: true,
    frequenciaBackup: 'diario',
    
    // Email
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: ''
  });

  const [activeTab, setActiveTab] = useState('notificacoes');
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Configurações salvas com sucesso!');
    setSaving(false);
  };

  const tabs = [
    { id: 'notificacoes', label: 'Notificações', icon: Icons.Bell },
    { id: 'seguranca', label: 'Segurança', icon: Icons.Shield },
    { id: 'sistema', label: 'Sistema', icon: Icons.Globe },
    { id: 'backup', label: 'Backup', icon: Icons.Database },
    { id: 'email', label: 'Email', icon: Icons.Mail }
  ];

  return (
    <div className="admin-configuracoes">
      {/* Header */}
      <div className="configuracoes-header">
        <div className="header-title">
          <Icons.Settings />
          <div className="header-text">
            <h1>Configurações</h1>
            <span className="header-subtitle">Gerencie as configurações do sistema</span>
          </div>
        </div>
        <button className="btn-salvar" onClick={handleSave} disabled={saving}>
          <Icons.Save />
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      {/* Tabs */}
      <div className="config-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="config-content">
        {activeTab === 'notificacoes' && (
          <div className="config-section">
            <h2>Configurações de Notificações</h2>
            
            <div className="config-group">
              <div className="config-item">
                <div className="config-info">
                  <h3>Notificações por Email</h3>
                  <p>Receber notificações importantes por email</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={config.notificacoesEmail}
                    onChange={(e) => handleChange('notificacoesEmail', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="config-item">
                <div className="config-info">
                  <h3>Notificações Push</h3>
                  <p>Receber notificações no navegador</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={config.notificacoesPush}
                    onChange={(e) => handleChange('notificacoesPush', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="config-item">
                <div className="config-info">
                  <h3>Lembrete de Eventos</h3>
                  <p>Receber lembretes antes dos eventos</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={config.lembreteEventos}
                    onChange={(e) => handleChange('lembreteEventos', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="config-item">
                <div className="config-info">
                  <h3>Antecedência do Lembrete</h3>
                  <p>Quanto tempo antes do evento enviar o lembrete</p>
                </div>
                <select
                  value={config.lembreteAntecedencia}
                  onChange={(e) => handleChange('lembreteAntecedencia', e.target.value)}
                >
                  <option value="24">24 horas</option>
                  <option value="48">48 horas</option>
                  <option value="72">72 horas</option>
                  <option value="168">1 semana</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seguranca' && (
          <div className="config-section">
            <h2>Configurações de Segurança</h2>
            
            <div className="config-group">
              <div className="config-item">
                <div className="config-info">
                  <h3>Autenticação de Dois Fatores</h3>
                  <p>Adicionar camada extra de segurança ao login</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={config.autenticacaoDoisFatores}
                    onChange={(e) => handleChange('autenticacaoDoisFatores', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="config-item">
                <div className="config-info">
                  <h3>Expiração da Sessão</h3>
                  <p>Tempo de inatividade antes do logout automático</p>
                </div>
                <select
                  value={config.sessaoExpira}
                  onChange={(e) => handleChange('sessaoExpira', e.target.value)}
                >
                  <option value="1">1 hora</option>
                  <option value="4">4 horas</option>
                  <option value="8">8 horas</option>
                  <option value="24">24 horas</option>
                </select>
              </div>

              <div className="config-item">
                <div className="config-info">
                  <h3>Log de Acessos</h3>
                  <p>Registrar todas as atividades dos usuários</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={config.logAcessos}
                    onChange={(e) => handleChange('logAcessos', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sistema' && (
          <div className="config-section">
            <h2>Configurações do Sistema</h2>
            
            <div className="config-group">
              <div className="config-item">
                <div className="config-info">
                  <h3>Idioma</h3>
                  <p>Idioma da interface do sistema</p>
                </div>
                <select
                  value={config.idioma}
                  onChange={(e) => handleChange('idioma', e.target.value)}
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div className="config-item">
                <div className="config-info">
                  <h3>Fuso Horário</h3>
                  <p>Fuso horário para exibição de datas</p>
                </div>
                <select
                  value={config.fusoHorario}
                  onChange={(e) => handleChange('fusoHorario', e.target.value)}
                >
                  <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                  <option value="America/Manaus">Manaus (GMT-4)</option>
                  <option value="America/Porto_Velho">Porto Velho (GMT-4)</option>
                </select>
              </div>

              <div className="config-item">
                <div className="config-info">
                  <h3>Formato de Data</h3>
                  <p>Como as datas serão exibidas</p>
                </div>
                <select
                  value={config.formatoData}
                  onChange={(e) => handleChange('formatoData', e.target.value)}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="config-section">
            <h2>Configurações de Backup</h2>
            
            <div className="config-group">
              <div className="config-item">
                <div className="config-info">
                  <h3>Backup Automático</h3>
                  <p>Realizar backups automaticamente</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={config.backupAutomatico}
                    onChange={(e) => handleChange('backupAutomatico', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="config-item">
                <div className="config-info">
                  <h3>Frequência do Backup</h3>
                  <p>Com que frequência realizar o backup</p>
                </div>
                <select
                  value={config.frequenciaBackup}
                  onChange={(e) => handleChange('frequenciaBackup', e.target.value)}
                >
                  <option value="diario">Diário</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensal">Mensal</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="config-section">
            <h2>Configurações de Email (SMTP)</h2>
            
            <div className="config-group">
              <div className="config-item-input">
                <label>Servidor SMTP</label>
                <input
                  type="text"
                  value={config.smtpHost}
                  onChange={(e) => handleChange('smtpHost', e.target.value)}
                  placeholder="smtp.exemplo.com"
                />
              </div>

              <div className="config-item-input">
                <label>Porta</label>
                <input
                  type="text"
                  value={config.smtpPort}
                  onChange={(e) => handleChange('smtpPort', e.target.value)}
                  placeholder="587"
                />
              </div>

              <div className="config-item-input">
                <label>Usuário</label>
                <input
                  type="text"
                  value={config.smtpUser}
                  onChange={(e) => handleChange('smtpUser', e.target.value)}
                  placeholder="usuario@exemplo.com"
                />
              </div>

              <div className="config-item-input">
                <label>Senha</label>
                <input
                  type="password"
                  value={config.smtpPassword}
                  onChange={(e) => handleChange('smtpPassword', e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminConfiguracoes;
