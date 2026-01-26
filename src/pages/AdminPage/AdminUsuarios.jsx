import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import './AdminUsuarios.css';

const AdminUsuarios = () => {
  const { theme } = useTheme();
  const { adminUser } = useAdminAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' ou 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    role: 'user',
    ativo: true,
    github: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const SUPABASE_URL = 'https://csuzmlajnhfauxqgczmu.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzdXptbGFqbmhmYXV4cWdjem11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzExMzcsImV4cCI6MjA4MTMwNzEzN30.eATRbvz2klesZnV3iGBk6sgrvZMbk_1YscW5oi9etfA';

  // Carregar usuários
  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/admin_usuarios?select=*&order=nome.asc`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      const data = await response.json();
      setUsuarios(data || []);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Abrir modal para criar
  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      nome: '',
      email: '',
      role: 'user',
      ativo: true,
      github: ''
    });
    setError('');
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      nome: user.nome,
      email: user.email,
      role: user.role,
      ativo: user.ativo,
      github: user.github || ''
    });
    setError('');
    setShowModal(true);
  };

  // Confirmar exclusão
  const handleDeleteConfirm = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  // Excluir usuário
  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/admin_usuarios?id=eq.${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });

      if (response.ok) {
        setSuccess('Usuário excluído com sucesso!');
        fetchUsuarios();
      } else {
        setError('Erro ao excluir usuário');
      }
    } catch (err) {
      setError('Erro ao excluir usuário');
    } finally {
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  // Salvar usuário (criar ou editar)
  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nome || !formData.email) {
      setError('Nome e email são obrigatórios');
      return;
    }

    try {
      if (modalMode === 'create') {
        // Criar novo usuário com senha padrão 123456
        const response = await fetch(`${SUPABASE_URL}/rest/v1/admin_usuarios`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            nome: formData.nome,
            email: formData.email,
            role: formData.role,
            ativo: formData.ativo,
            github: formData.github || null,
            senha_hash: '123456',
            primeiro_acesso: true,
            is_super_admin: false
          })
        });

        if (response.ok) {
          setSuccess('Usuário criado com sucesso! Senha padrão: 123456');
          setShowModal(false);
          fetchUsuarios();
        } else {
          const errorData = await response.json();
          if (errorData.message?.includes('duplicate')) {
            setError('Este email já está cadastrado');
          } else {
            setError('Erro ao criar usuário');
          }
        }
      } else {
        // Editar usuário existente
        const response = await fetch(`${SUPABASE_URL}/rest/v1/admin_usuarios?id=eq.${selectedUser.id}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            nome: formData.nome,
            email: formData.email,
            role: formData.role,
            ativo: formData.ativo,
            github: formData.github || null,
            updated_at: new Date().toISOString()
          })
        });

        const result = await response.json();
        
        if (response.ok && result && result.length > 0) {
          setSuccess('Usuário atualizado com sucesso!');
          setShowModal(false);
          fetchUsuarios();
        } else if (response.ok && (!result || result.length === 0)) {
          setError('Nenhum usuário foi atualizado. Verifique se o usuário ainda existe.');
        } else {
          setError(result?.message || 'Erro ao atualizar usuário');
        }
      }
    } catch (err) {
      setError('Erro ao salvar usuário');
    }
  };

  // Resetar senha
  const handleResetPassword = async (user) => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/admin_usuarios?id=eq.${user.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          senha_hash: '123456',
          primeiro_acesso: true,
          updated_at: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSuccess(`Senha de ${user.nome} resetada para 123456`);
        fetchUsuarios();
      } else {
        setError('Erro ao resetar senha');
      }
    } catch (err) {
      setError('Erro ao resetar senha');
    }
  };

  // Limpar mensagens após 5 segundos
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const getRoleBadge = (role, isSuperAdmin) => {
    if (isSuperAdmin) return { label: 'Super Admin', class: 'super-admin' };
    switch (role) {
      case 'admin': return { label: 'Administrador', class: 'admin' };
      case 'user': return { label: 'Usuário', class: 'user' };
      default: return { label: role, class: 'user' };
    }
  };

  const canManageUser = (user) => {
    // Super admin pode gerenciar todos
    if (adminUser?.is_super_admin) return true;
    // Admin pode gerenciar apenas usuários comuns
    if (adminUser?.role === 'admin' && user.role === 'user') return true;
    return false;
  };

  return (
    <div className={`admin-usuarios ${theme}`}>
      {/* Header */}
      <div className="admin-usuarios-header">
        <div className="admin-usuarios-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <h1 className="hover-glow">Gestão de Usuários</h1>
          <span className="header-subtitle">Gerencie os usuários do sistema</span>
        </div>
        {(adminUser?.is_super_admin || adminUser?.role === 'admin') && (
          <button className="admin-btn-primary" onClick={handleCreate}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Novo Usuário
          </button>
        )}
      </div>

      {/* Mensagens */}
      {success && <div className="admin-success-message">{success}</div>}
      {error && <div className="admin-error-message">{error}</div>}

      {/* Métricas */}
      <div className="admin-usuarios-metrics">
        <div className="admin-metric-card">
          <div className="admin-metric-icon total">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="admin-metric-info">
            <span className="admin-metric-value">{usuarios.length}</span>
            <span className="admin-metric-label">Total de Usuários</span>
          </div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-icon active">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="admin-metric-info">
            <span className="admin-metric-value">{usuarios.filter(u => u.ativo).length}</span>
            <span className="admin-metric-label">Ativos</span>
          </div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-icon admins">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div className="admin-metric-info">
            <span className="admin-metric-value">{usuarios.filter(u => u.role === 'admin' || u.is_super_admin).length}</span>
            <span className="admin-metric-label">Administradores</span>
          </div>
        </div>
        <div className="admin-metric-card">
          <div className="admin-metric-icon pending">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="admin-metric-info">
            <span className="admin-metric-value">{usuarios.filter(u => u.primeiro_acesso).length}</span>
            <span className="admin-metric-label">Primeiro Acesso</span>
          </div>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="admin-usuarios-table-container">
        <table className="admin-usuarios-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Email</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Último Acesso</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="admin-loading">Carregando...</td>
              </tr>
            ) : usuarios.length === 0 ? (
              <tr>
                <td colSpan="6" className="admin-empty">Nenhum usuário encontrado</td>
              </tr>
            ) : (
              usuarios.map(user => {
                const roleBadge = getRoleBadge(user.role, user.is_super_admin);
                return (
                  <tr key={user.id}>
                    <td>
                      <div className="admin-user-cell">
                        <div className="admin-user-avatar">
                          {user.nome?.charAt(0).toUpperCase()}
                        </div>
                        <span className="admin-user-name">{user.nome}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`admin-role-badge ${roleBadge.class}`}>
                        {roleBadge.label}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status-badge ${user.ativo ? 'active' : 'inactive'}`}>
                        {user.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                      {user.primeiro_acesso && (
                        <span className="admin-first-access-badge">1º Acesso</span>
                      )}
                    </td>
                    <td>
                      {user.ultimo_acesso 
                        ? new Date(user.ultimo_acesso).toLocaleDateString('pt-BR')
                        : 'Nunca acessou'}
                    </td>
                    <td>
                      <div className="admin-actions">
                        {canManageUser(user) && !user.is_super_admin && (
                          <>
                            <button 
                              className="admin-action-btn edit" 
                              onClick={() => handleEdit(user)}
                              title="Editar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button 
                              className="admin-action-btn reset" 
                              onClick={() => handleResetPassword(user)}
                              title="Resetar Senha"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                              </svg>
                            </button>
                            <button 
                              className="admin-action-btn delete" 
                              onClick={() => handleDeleteConfirm(user)}
                              title="Excluir"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Criar/Editar */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{modalMode === 'create' ? 'Novo Usuário' : 'Editar Usuário'}</h2>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="admin-modal-form">
              {error && <div className="admin-error-message">{error}</div>}
              
              <div className="admin-form-group">
                <label>Nome Completo</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                  required
                  placeholder="Nome do usuário"
                />
              </div>

              <div className="admin-form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="admin-form-group">
                <label>Perfil de Acesso</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>GitHub (opcional)</label>
                <div className="admin-input-with-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  <input
                    type="text"
                    value={formData.github}
                    onChange={e => setFormData({...formData, github: e.target.value})}
                    placeholder="username"
                  />
                </div>
                <span className="admin-form-hint">Apenas o nome de usuário do GitHub</span>
              </div>

              <div className="admin-form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.ativo}
                    onChange={e => setFormData({...formData, ativo: e.target.checked})}
                  />
                  Usuário Ativo
                </label>
              </div>

              {modalMode === 'create' && (
                <div className="admin-info-box">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <span>A senha padrão será <strong>123456</strong>. O usuário deverá alterá-la no primeiro acesso.</span>
                </div>
              )}

              <div className="admin-modal-actions">
                <button type="button" className="admin-btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="admin-btn-primary">
                  {modalMode === 'create' ? 'Criar Usuário' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="admin-modal admin-modal-small" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Confirmar Exclusão</h2>
            </div>
            <div className="admin-modal-body">
              <p>Tem certeza que deseja excluir o usuário <strong>{userToDelete?.nome}</strong>?</p>
              <p className="admin-warning">Esta ação não pode ser desfeita.</p>
            </div>
            <div className="admin-modal-actions">
              <button className="admin-btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancelar
              </button>
              <button className="admin-btn-danger" onClick={handleDelete}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsuarios;
