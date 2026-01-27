import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import './AdminCredenciais.css';

// Ícones SVG
const Icons = {
  Key: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  EyeOff: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  ),
  Copy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  Globe: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
};

const AdminCredenciais = () => {
  const [credenciais, setCredenciais] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCredencial, setEditingCredencial] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [formData, setFormData] = useState({
    cliente_id: '',
    servico: '',
    url: '',
    usuario: '',
    senha: '',
    notas: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Buscar clientes
      const { data: clientesData } = await supabase
        .from('admin_gabinetes')
        .select('*')
        .order('nome', { ascending: true });
      setClientes(clientesData || []);

      // Simular credenciais (em produção, buscar de tabela real)
      const credenciaisSimuladas = [
        { id: 1, cliente_id: clientesData?.[0]?.id, cliente_nome: clientesData?.[0]?.nome, servico: 'Portal do Município', url: 'https://portal.municipio.gov.br', usuario: 'admin', senha: 'senha123' },
        { id: 2, cliente_id: clientesData?.[0]?.id, cliente_nome: clientesData?.[0]?.nome, servico: 'Email Institucional', url: 'https://mail.google.com', usuario: 'contato@municipio.gov.br', senha: 'email456' },
      ];
      setCredenciais(credenciaisSimuladas);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
    setLoading(false);
  };

  const filteredCredenciais = credenciais.filter(cred => {
    if (selectedCliente && cred.cliente_id !== selectedCliente) return false;
    return true;
  });

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    alert(`${type} copiado para a área de transferência!`);
  };

  const handleOpenModal = (credencial = null) => {
    if (credencial) {
      setEditingCredencial(credencial);
      setFormData(credencial);
    } else {
      setEditingCredencial(null);
      setFormData({
        cliente_id: '',
        servico: '',
        url: '',
        usuario: '',
        senha: '',
        notas: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCredencial(null);
  };

  const handleSave = async () => {
    alert('Credencial salva com sucesso!');
    handleCloseModal();
    fetchData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta credencial?')) {
      alert('Credencial excluída!');
      fetchData();
    }
  };

  return (
    <div className="admin-credenciais">
      {/* Header */}
      <div className="credenciais-header">
        <div className="header-title">
          <Icons.Key />
          <div className="header-text">
            <h1>Credenciais de Clientes</h1>
            <span className="header-subtitle">Gerencie senhas e acessos dos clientes</span>
          </div>
        </div>
        <button className="btn-nova-credencial" onClick={() => handleOpenModal()}>
          <Icons.Plus />
          Nova Credencial
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Cliente</label>
          <select value={selectedCliente} onChange={(e) => setSelectedCliente(e.target.value)}>
            <option value="">Todos os Clientes</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Credenciais */}
      <div className="credenciais-section">
        <div className="section-header">
          <Icons.Key />
          <h2>Credenciais Cadastradas ({filteredCredenciais.length})</h2>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Carregando credenciais...</p>
          </div>
        ) : filteredCredenciais.length === 0 ? (
          <div className="empty-state">
            <Icons.Key />
            <p>Nenhuma credencial encontrada</p>
          </div>
        ) : (
          <div className="credenciais-list">
            {filteredCredenciais.map(cred => (
              <div key={cred.id} className="credencial-card">
                <div className="credencial-header">
                  <h3>{cred.servico}</h3>
                  <span className="cliente-badge">{cred.cliente_nome}</span>
                </div>
                <div className="credencial-body">
                  {cred.url && (
                    <div className="credencial-field">
                      <Icons.Globe />
                      <a href={cred.url} target="_blank" rel="noopener noreferrer">{cred.url}</a>
                    </div>
                  )}
                  <div className="credencial-field">
                    <Icons.User />
                    <span>{cred.usuario}</span>
                    <button className="btn-copy" onClick={() => copyToClipboard(cred.usuario, 'Usuário')}>
                      <Icons.Copy />
                    </button>
                  </div>
                  <div className="credencial-field">
                    <Icons.Key />
                    <span className="password-field">
                      {visiblePasswords[cred.id] ? cred.senha : '••••••••'}
                    </span>
                    <button className="btn-toggle-password" onClick={() => togglePasswordVisibility(cred.id)}>
                      {visiblePasswords[cred.id] ? <Icons.EyeOff /> : <Icons.Eye />}
                    </button>
                    <button className="btn-copy" onClick={() => copyToClipboard(cred.senha, 'Senha')}>
                      <Icons.Copy />
                    </button>
                  </div>
                </div>
                <div className="credencial-actions">
                  <button className="btn-action btn-edit" onClick={() => handleOpenModal(cred)}>
                    <Icons.Edit />
                    Editar
                  </button>
                  <button className="btn-action btn-delete" onClick={() => handleDelete(cred.id)}>
                    <Icons.Trash />
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCredencial ? 'Editar Credencial' : 'Nova Credencial'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>
                <Icons.X />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Cliente *</label>
                <select
                  value={formData.cliente_id}
                  onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Serviço *</label>
                <input
                  type="text"
                  value={formData.servico}
                  onChange={(e) => setFormData({ ...formData, servico: e.target.value })}
                  placeholder="Ex: Portal do Município, Email, etc."
                />
              </div>
              <div className="form-group">
                <label>URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Usuário *</label>
                  <input
                    type="text"
                    value={formData.usuario}
                    onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                    placeholder="Nome de usuário ou email"
                  />
                </div>
                <div className="form-group">
                  <label>Senha *</label>
                  <input
                    type="password"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    placeholder="Senha de acesso"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Notas</label>
                <textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Observações adicionais..."
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancelar" onClick={handleCloseModal}>Cancelar</button>
              <button className="btn-salvar" onClick={handleSave}>
                {editingCredencial ? 'Salvar Alterações' : 'Criar Credencial'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCredenciais;
