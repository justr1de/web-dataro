import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import './UserManagement.css';

const UserManagement = ({ onClose }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha_hash: '',
    telefone: '',
    cargo: '',
    municipio_id: '',
    role: 'consulta',
    observacoes: '',
    ativo: true
  });

  const [formErrors, setFormErrors] = useState({});

  // Verificar se o usuário atual é superadmin
  const isSuperAdmin = user?.role === 'superadmin';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Buscar usuários
      const { data: usersData, error: usersError } = await supabase
        .from('usuarios')
        .select('*')
        .order('data_criacao', { ascending: false });

      if (usersError) throw usersError;

      // Buscar municípios
      const { data: municipiosData, error: municipiosError } = await supabase
        .from('municipios')
        .select('id, nome')
        .order('nome');

      if (municipiosError) throw municipiosError;

      setUsers(usersData || []);
      setMunicipios(municipiosData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nome.trim()) {
      errors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'E-mail inválido';
    }
    
    if (!editingUser && !formData.senha_hash.trim()) {
      errors.senha_hash = 'Senha é obrigatória para novos usuários';
    } else if (!editingUser && formData.senha_hash.length < 6) {
      errors.senha_hash = 'Senha deve ter no mínimo 6 caracteres';
    }
    
    if (formData.telefone && !/^[\d\s\(\)\-\+]+$/.test(formData.telefone)) {
      errors.telefone = 'Telefone inválido';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpar erro do campo quando o usuário começa a digitar
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (editingUser) {
        // Atualizar usuário existente
        const updateData = {
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone || null,
          cargo: formData.cargo || null,
          municipio_id: formData.municipio_id || null,
          role: formData.role,
          observacoes: formData.observacoes || null,
          ativo: formData.ativo,
          data_atualizacao: new Date().toISOString()
        };

        // Só atualizar senha se foi preenchida
        if (formData.senha_hash.trim()) {
          updateData.senha_hash = formData.senha_hash;
          updateData.primeiro_acesso = true;
        }

        const { error } = await supabase
          .from('usuarios')
          .update(updateData)
          .eq('id', editingUser.id);

        if (error) throw error;
        alert('Usuário atualizado com sucesso!');
      } else {
        // Criar novo usuário
        const { error } = await supabase
          .from('usuarios')
          .insert({
            nome: formData.nome,
            email: formData.email,
            senha_hash: formData.senha_hash,
            telefone: formData.telefone || null,
            cargo: formData.cargo || null,
            municipio_id: formData.municipio_id || null,
            role: formData.role,
            observacoes: formData.observacoes || null,
            ativo: formData.ativo,
            primeiro_acesso: true,
            criado_por: user?.id,
            data_criacao: new Date().toISOString()
          });

        if (error) {
          if (error.code === '23505') {
            throw new Error('Este e-mail já está cadastrado');
          }
          throw error;
        }
        alert('Usuário criado com sucesso!');
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      alert(error.message || 'Erro ao salvar usuário');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      senha_hash: '',
      telefone: '',
      cargo: '',
      municipio_id: '',
      role: 'consulta',
      observacoes: '',
      ativo: true
    });
    setFormErrors({});
    setEditingUser(null);
    setShowAddForm(false);
  };

  const handleEdit = (userToEdit) => {
    setEditingUser(userToEdit);
    setFormData({
      nome: userToEdit.nome || '',
      email: userToEdit.email || '',
      senha_hash: '',
      telefone: userToEdit.telefone || '',
      cargo: userToEdit.cargo || '',
      municipio_id: userToEdit.municipio_id || '',
      role: userToEdit.role || 'consulta',
      observacoes: userToEdit.observacoes || '',
      ativo: userToEdit.ativo !== false
    });
    setShowAddForm(true);
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ 
          ativo: !currentStatus,
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status do usuário');
    }
  };

  const handleDelete = async (userId, userEmail) => {
    // Não permitir excluir o próprio usuário ou o superadmin principal
    if (userEmail === 'admin@cimcero.ro.gov.br') {
      alert('Não é possível excluir a conta administrativa principal');
      return;
    }

    if (userId === user?.id) {
      alert('Não é possível excluir sua própria conta');
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir o usuário ${userEmail}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      alert('Usuário excluído com sucesso!');
      fetchData();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert('Erro ao excluir usuário');
    }
  };

  const getRoleBadge = (role) => {
    const roles = {
      superadmin: { label: '👑 Super Admin', class: 'superadmin' },
      admin: { label: '🔧 Administrador', class: 'admin' },
      consulta: { label: '👁️ Consulta', class: 'consulta' }
    };
    return roles[role] || { label: '👤 Usuário', class: 'user' };
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.cargo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'ativo' && u.ativo) ||
      (filterStatus === 'inativo' && !u.ativo);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="user-management-overlay">
        <div className="user-management">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando usuários...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management-overlay">
      <div className="user-management">
        <div className="user-management-header">
          <h2>👥 Gerenciamento de Usuários</h2>
          <button onClick={onClose} className="close-button">✕</button>
        </div>

        {/* Estatísticas */}
        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-number">{users.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{users.filter(u => u.ativo).length}</span>
            <span className="stat-label">Ativos</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{users.filter(u => u.role === 'admin' || u.role === 'superadmin').length}</span>
            <span className="stat-label">Admins</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{users.filter(u => u.role === 'consulta').length}</span>
            <span className="stat-label">Consulta</span>
          </div>
        </div>

        {/* Barra de ações */}
        <div className="user-actions-bar">
          <div className="search-filters">
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select 
              value={filterRole} 
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todos os níveis</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Administrador</option>
              <option value="consulta">Consulta</option>
            </select>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todos os status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
            </select>
          </div>
          
          {isSuperAdmin && (
            <button 
              onClick={() => setShowAddForm(true)} 
              className="btn-add-user"
            >
              ➕ Adicionar Usuário
            </button>
          )}
        </div>

        {/* Formulário de Adicionar/Editar */}
        {showAddForm && (
          <div className="user-form-container">
            <div className="user-form">
              <h3>{editingUser ? '✏️ Editar Usuário' : '➕ Novo Usuário'}</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome Completo *</label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      placeholder="Nome completo do usuário"
                      className={formErrors.nome ? 'error' : ''}
                    />
                    {formErrors.nome && <span className="error-message">{formErrors.nome}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>E-mail *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@exemplo.com"
                      className={formErrors.email ? 'error' : ''}
                    />
                    {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{editingUser ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}</label>
                    <input
                      type="password"
                      name="senha_hash"
                      value={formData.senha_hash}
                      onChange={handleInputChange}
                      placeholder={editingUser ? '••••••••' : 'Mínimo 6 caracteres'}
                      className={formErrors.senha_hash ? 'error' : ''}
                    />
                    {formErrors.senha_hash && <span className="error-message">{formErrors.senha_hash}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Telefone</label>
                    <input
                      type="text"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      placeholder="(69) 99999-9999"
                      className={formErrors.telefone ? 'error' : ''}
                    />
                    {formErrors.telefone && <span className="error-message">{formErrors.telefone}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Cargo/Função</label>
                    <input
                      type="text"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleInputChange}
                      placeholder="Ex: Secretário de Finanças"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Município Vinculado</label>
                    <select
                      name="municipio_id"
                      value={formData.municipio_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Nenhum (acesso geral)</option>
                      {municipios.map(mun => (
                        <option key={mun.id} value={mun.id}>{mun.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Nível de Acesso *</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="consulta">👁️ Consulta - Apenas visualização</option>
                      <option value="admin">🔧 Administrador - Gerenciar painéis</option>
                      {isSuperAdmin && editingUser?.email !== 'admin@cimcero.ro.gov.br' && (
                        <option value="superadmin">👑 Super Admin - Acesso total</option>
                      )}
                    </select>
                    <small className="help-text">
                      {formData.role === 'consulta' && 'Pode visualizar painéis e usar o assistente IA'}
                      {formData.role === 'admin' && 'Pode gerenciar painéis e configurações'}
                      {formData.role === 'superadmin' && 'Acesso total ao sistema, incluindo gerenciamento de usuários'}
                    </small>
                  </div>
                  
                  <div className="form-group">
                    <label>Status</label>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="ativo"
                          checked={formData.ativo}
                          onChange={handleInputChange}
                        />
                        <span>Usuário ativo</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Observações</label>
                  <textarea
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleInputChange}
                    placeholder="Observações adicionais sobre o usuário..."
                    rows="3"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" onClick={resetForm} className="btn-cancel">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-save">
                    {editingUser ? '💾 Salvar Alterações' : '➕ Criar Usuário'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de Usuários */}
        <div className="users-list">
          <table>
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Contato</th>
                <th>Cargo</th>
                <th>Nível</th>
                <th>Status</th>
                <th>Criado em</th>
                {isSuperAdmin && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => {
                const roleBadge = getRoleBadge(u.role);
                const municipio = municipios.find(m => m.id === u.municipio_id);
                
                return (
                  <tr key={u.id} className={!u.ativo ? 'inactive' : ''}>
                    <td className="user-info-cell">
                      <div className="user-name">{u.nome}</div>
                      <div className="user-email">{u.email}</div>
                    </td>
                    <td>
                      {u.telefone && <div className="user-phone">📱 {u.telefone}</div>}
                      {municipio && <div className="user-municipio">🏛️ {municipio.nome}</div>}
                    </td>
                    <td>{u.cargo || '-'}</td>
                    <td>
                      <span className={`role-badge ${roleBadge.class}`}>
                        {roleBadge.label}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${u.ativo ? 'ativo' : 'inativo'}`}>
                        {u.ativo ? '✅ Ativo' : '❌ Inativo'}
                      </span>
                    </td>
                    <td>
                      {u.data_criacao ? new Date(u.data_criacao).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    {isSuperAdmin && (
                      <td className="actions-cell">
                        <button 
                          onClick={() => handleEdit(u)}
                          className="btn-action btn-edit"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(u.id, u.ativo)}
                          className="btn-action btn-toggle"
                          title={u.ativo ? 'Desativar' : 'Ativar'}
                        >
                          {u.ativo ? '🔒' : '🔓'}
                        </button>
                        {u.email !== 'admin@cimcero.ro.gov.br' && (
                          <button 
                            onClick={() => handleDelete(u.id, u.email)}
                            className="btn-action btn-delete"
                            title="Excluir"
                          >
                            🗑️
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="no-results">
              <p>Nenhum usuário encontrado com os filtros aplicados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
