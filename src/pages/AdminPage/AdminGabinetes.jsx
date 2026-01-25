import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { supabase } from '../../utils/supabaseClient';
import logo from '../../assets/logo.png';
import './AdminGabinetes.css';

// Ícones SVG
const Icons = {
  Building: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
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
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
};

const AdminGabinetes = () => {
  const { adminUser, isSuperAdmin } = useAdminAuth();
  const [gabinetes, setGabinetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGabinete, setEditingGabinete] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    municipio: ''
  });

  useEffect(() => {
    fetchGabinetes();
  }, []);

  const fetchGabinetes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_gabinetes')
        .select('*, admin_usuarios(nome)')
        .order('nome');
      
      if (error) throw error;
      setGabinetes(data || []);
    } catch (error) {
      console.error('Erro ao buscar gabinetes:', error);
    }
    setLoading(false);
  };

  const handleOpenModal = (gabinete = null) => {
    if (gabinete) {
      setEditingGabinete(gabinete);
      setFormData({
        nome: gabinete.nome,
        descricao: gabinete.descricao || '',
        municipio: gabinete.municipio || ''
      });
    } else {
      setEditingGabinete(null);
      setFormData({ nome: '', descricao: '', municipio: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGabinete(null);
    setFormData({ nome: '', descricao: '', municipio: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGabinete) {
        const { error } = await supabase
          .from('admin_gabinetes')
          .update({
            nome: formData.nome,
            descricao: formData.descricao,
            municipio: formData.municipio,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingGabinete.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('admin_gabinetes')
          .insert({
            nome: formData.nome,
            descricao: formData.descricao,
            municipio: formData.municipio,
            responsavel_id: adminUser.id
          });
        
        if (error) throw error;
      }
      
      handleCloseModal();
      fetchGabinetes();
    } catch (error) {
      console.error('Erro ao salvar gabinete:', error);
      alert('Erro ao salvar gabinete');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este gabinete?')) return;
    
    try {
      const { error } = await supabase
        .from('admin_gabinetes')
        .update({ ativo: false })
        .eq('id', id);
      
      if (error) throw error;
      fetchGabinetes();
    } catch (error) {
      console.error('Erro ao excluir gabinete:', error);
      alert('Erro ao excluir gabinete');
    }
  };

  return (
    <div className="admin-gabinetes">
      {/* Header com Logo */}
      <div className="page-header-with-logo">
        <img src={logo} alt="DATA-RO" className="page-logo" />
      </div>

      {/* Header */}
      <div className="gabinetes-header">
        <div className="header-title">
          <Icons.Building />
          <h1>Gabinetes</h1>
          <span className="header-subtitle">Gerencie os gabinetes cadastrados no sistema</span>
        </div>
        {isSuperAdmin() && (
          <button className="btn-novo" onClick={() => handleOpenModal()}>
            <Icons.Plus />
            Novo Gabinete
          </button>
        )}
      </div>

      {/* Lista de Gabinetes */}
      <div className="gabinetes-grid">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Carregando gabinetes...</p>
          </div>
        ) : gabinetes.filter(g => g.ativo).length === 0 ? (
          <div className="empty-state">
            <Icons.Building />
            <p>Nenhum gabinete cadastrado</p>
            {isSuperAdmin() && (
              <button className="btn-novo" onClick={() => handleOpenModal()}>
                <Icons.Plus />
                Criar primeiro gabinete
              </button>
            )}
          </div>
        ) : (
          gabinetes.filter(g => g.ativo).map(gabinete => (
            <div key={gabinete.id} className="gabinete-card">
              <div className="gabinete-header">
                <h3>{gabinete.nome}</h3>
                {isSuperAdmin() && (
                  <div className="gabinete-actions">
                    <button 
                      className="btn-icon" 
                      onClick={() => handleOpenModal(gabinete)}
                      title="Editar"
                    >
                      <Icons.Edit />
                    </button>
                    <button 
                      className="btn-icon btn-danger" 
                      onClick={() => handleDelete(gabinete.id)}
                      title="Excluir"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                )}
              </div>
              <p className="gabinete-descricao">{gabinete.descricao || 'Sem descrição'}</p>
              <div className="gabinete-footer">
                <span className="gabinete-municipio">{gabinete.municipio || 'Sem município'}</span>
                <span className="gabinete-responsavel">
                  {gabinete.admin_usuarios?.nome || 'Sem responsável'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Criação/Edição */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingGabinete ? 'Editar Gabinete' : 'Novo Gabinete'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>
                <Icons.X />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nome">Nome do Gabinete *</label>
                <input
                  type="text"
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                  placeholder="Ex: Gabinete Municipal de Ji-Paraná"
                />
              </div>
              <div className="form-group">
                <label htmlFor="municipio">Município</label>
                <input
                  type="text"
                  id="municipio"
                  value={formData.municipio}
                  onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                  placeholder="Ex: Ji-Paraná"
                />
              </div>
              <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição do gabinete..."
                  rows={4}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit">
                  {editingGabinete ? 'Salvar Alterações' : 'Criar Gabinete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGabinetes;
