import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { supabase } from '../../utils/supabaseClient';
import './AdminPerfil.css';

const Icons = {
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ),
  Briefcase: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  ),
  Building: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
      <path d="M9 22v-4h6v4"></path>
      <path d="M8 6h.01"></path>
      <path d="M16 6h.01"></path>
      <path d="M12 6h.01"></path>
      <path d="M12 10h.01"></path>
      <path d="M12 14h.01"></path>
      <path d="M16 10h.01"></path>
      <path d="M16 14h.01"></path>
      <path d="M8 10h.01"></path>
      <path d="M8 14h.01"></path>
    </svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  Save: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  Camera: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
      <circle cx="12" cy="13" r="4"></circle>
    </svg>
  ),
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  Key: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
    </svg>
  ),
  Github: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  AlertCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  )
};

const AdminPerfil = () => {
  const { adminUser } = useAdminAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileData, setProfileData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    departamento: '',
    bio: '',
    github: '',
    avatar_url: ''
  });
  const [originalData, setOriginalData] = useState({});

  // Carregar dados do perfil
  useEffect(() => {
    const loadProfile = async () => {
      if (!adminUser) return;

      try {
        // Buscar dados do admin_usuarios
        const { data, error } = await supabase
          .from('admin_usuarios')
          .select('*')
          .eq('id', adminUser.id)
          .single();

        if (error) throw error;

        const profile = {
          nome: data.nome || '',
          email: data.email || '',
          telefone: data.telefone || '',
          cargo: data.role || '',
          departamento: data.departamento || '',
          bio: data.bio || '',
          github: data.github || '',
          avatar_url: data.avatar_url || ''
        };

        setProfileData(profile);
        setOriginalData(profile);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        // Usar dados do contexto como fallback
        const fallbackProfile = {
          nome: adminUser.nome || '',
          email: adminUser.email || '',
          telefone: '',
          cargo: adminUser.role || '',
          departamento: '',
          bio: '',
          github: adminUser.github || '',
          avatar_url: adminUser.avatar_url || ''
        };
        setProfileData(fallbackProfile);
        setOriginalData(fallbackProfile);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [adminUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('admin_usuarios')
        .update({
          nome: profileData.nome,
          telefone: profileData.telefone,
          role: profileData.cargo,
          departamento: profileData.departamento,
          bio: profileData.bio,
          github: profileData.github,
          updated_at: new Date().toISOString()
        })
        .eq('id', adminUser.id);

      if (error) throw error;

      setOriginalData(profileData);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });

      // Atualizar localStorage
      const storedAdmin = JSON.parse(localStorage.getItem('admin_user') || '{}');
      storedAdmin.nome = profileData.nome;
      storedAdmin.role = profileData.cargo;
      storedAdmin.github = profileData.github;
      localStorage.setItem('admin_user', JSON.stringify(storedAdmin));

    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar perfil. Tente novamente.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Converter para base64 (temporário - idealmente usar Supabase Storage)
    const reader = new FileReader();
    reader.onloadend = async () => {
      setProfileData(prev => ({ ...prev, avatar_url: reader.result }));
      
      // Salvar no banco
      try {
        await supabase
          .from('admin_usuarios')
          .update({ avatar_url: reader.result })
          .eq('id', adminUser.id);
      } catch (error) {
        console.error('Erro ao salvar avatar:', error);
      }
    };
    reader.readAsDataURL(file);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não disponível';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-perfil">
        <div className="perfil-loading">
          <div className="loading-spinner"></div>
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-perfil">
      {/* Header */}
      <div className="perfil-header">
        <div className="header-content">
          <Icons.User />
          <div className="header-text">
            <h1>Meu Perfil</h1>
            <p>Gerencie suas informações pessoais e configurações de conta</p>
          </div>
        </div>
        {!isEditing ? (
          <button className="btn-editar" onClick={() => setIsEditing(true)}>
            <Icons.Edit />
            <span>Editar Perfil</span>
          </button>
        ) : (
          <div className="header-actions">
            <button className="btn-cancelar" onClick={handleCancel}>
              <Icons.X />
              <span>Cancelar</span>
            </button>
            <button className="btn-salvar" onClick={handleSave} disabled={saving}>
              <Icons.Save />
              <span>{saving ? 'Salvando...' : 'Salvar'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Mensagem de feedback */}
      {message.text && (
        <div className={`perfil-message ${message.type}`}>
          {message.type === 'success' ? <Icons.Check /> : <Icons.AlertCircle />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="perfil-content">
        {/* Card do Avatar e Info Principal */}
        <div className="perfil-card perfil-card-principal">
          <div className="avatar-section">
            <div className="avatar-container">
              {profileData.avatar_url ? (
                <img src={profileData.avatar_url} alt="Avatar" className="avatar-image" />
              ) : (
                <div className="avatar-placeholder">
                  <Icons.User />
                </div>
              )}
              {isEditing && (
                <label className="avatar-edit-btn">
                  <Icons.Camera />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
            <div className="avatar-info">
              <h2>{profileData.nome || 'Usuário'}</h2>
              <p className="user-role">
                <Icons.Shield />
                <span>{adminUser?.is_super_admin ? 'Super Administrador' : (profileData.cargo || 'Administrador')}</span>
              </p>
              {profileData.departamento && (
                <p className="user-dept">
                  <Icons.Building />
                  <span>{profileData.departamento}</span>
                </p>
              )}
            </div>
          </div>

          {profileData.bio && !isEditing && (
            <div className="bio-section">
              <p>{profileData.bio}</p>
            </div>
          )}
        </div>

        {/* Formulário de Dados */}
        <div className="perfil-card perfil-card-dados">
          <h3>Informações Pessoais</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>
                <Icons.User />
                <span>Nome Completo</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="nome"
                  value={profileData.nome}
                  onChange={handleInputChange}
                  placeholder="Seu nome completo"
                />
              ) : (
                <p className="field-value">{profileData.nome || 'Não informado'}</p>
              )}
            </div>

            <div className="form-group">
              <label>
                <Icons.Mail />
                <span>E-mail</span>
              </label>
              <p className="field-value field-readonly">
                {profileData.email}
                <small>(não editável)</small>
              </p>
            </div>

            <div className="form-group">
              <label>
                <Icons.Phone />
                <span>Telefone</span>
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="telefone"
                  value={profileData.telefone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                />
              ) : (
                <p className="field-value">{profileData.telefone || 'Não informado'}</p>
              )}
            </div>

            <div className="form-group">
              <label>
                <Icons.Briefcase />
                <span>Cargo</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="cargo"
                  value={profileData.cargo}
                  onChange={handleInputChange}
                  placeholder="Seu cargo"
                />
              ) : (
                <p className="field-value">{profileData.cargo || 'Não informado'}</p>
              )}
            </div>

            <div className="form-group">
              <label>
                <Icons.Building />
                <span>Departamento</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="departamento"
                  value={profileData.departamento}
                  onChange={handleInputChange}
                  placeholder="Seu departamento"
                />
              ) : (
                <p className="field-value">{profileData.departamento || 'Não informado'}</p>
              )}
            </div>

            <div className="form-group">
              <label>
                <Icons.Github />
                <span>GitHub</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="github"
                  value={profileData.github}
                  onChange={handleInputChange}
                  placeholder="username"
                />
              ) : (
                <p className="field-value">
                  {profileData.github ? (
                    <a href={`https://github.com/${profileData.github}`} target="_blank" rel="noopener noreferrer">
                      @{profileData.github}
                    </a>
                  ) : 'Não informado'}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="form-group form-group-full">
                <label>
                  <Icons.User />
                  <span>Biografia</span>
                </label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  placeholder="Uma breve descrição sobre você..."
                  rows="3"
                />
              </div>
            )}
          </div>
        </div>

        {/* Card de Segurança */}
        <div className="perfil-card perfil-card-seguranca">
          <h3>Segurança da Conta</h3>
          
          <div className="seguranca-info">
            <div className="seguranca-item">
              <div className="seguranca-icon">
                <Icons.Key />
              </div>
              <div className="seguranca-text">
                <h4>Senha</h4>
                <p>Última alteração: {formatDate(adminUser?.updated_at)}</p>
              </div>
              <button className="btn-alterar-senha" disabled>
                Alterar Senha
              </button>
            </div>

            <div className="seguranca-item">
              <div className="seguranca-icon">
                <Icons.Clock />
              </div>
              <div className="seguranca-text">
                <h4>Último Acesso</h4>
                <p>{formatDate(adminUser?.ultimo_acesso || new Date().toISOString())}</p>
              </div>
            </div>

            <div className="seguranca-item">
              <div className="seguranca-icon">
                <Icons.Shield />
              </div>
              <div className="seguranca-text">
                <h4>Nível de Acesso</h4>
                <p>{adminUser?.is_super_admin ? 'Super Administrador - Acesso Total' : 'Administrador - Acesso Padrão'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="perfil-footer">
        <p>DATA-RO INTELIGÊNCIA TERRITORIAL</p>
        <small>Todos os dados coletados respeitam às Normas da LGPD</small>
      </div>
    </div>
  );
};

export default AdminPerfil;
