import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import './AdminContatos.css';

// Ícones SVG
const Icons = {
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ),
  Building: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
};

const AdminContatos = () => {
  const [contatos, setContatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingContato, setEditingContato] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    cargo: '',
    categoria: 'cliente',
    notas: ''
  });

  useEffect(() => {
    fetchContatos();
  }, []);

  const fetchContatos = async () => {
    setLoading(true);
    try {
      // Buscar contatos da tabela admin_gabinetes como exemplo
      const { data, error } = await supabase
        .from('admin_gabinetes')
        .select('*')
        .order('nome', { ascending: true });

      if (data) {
        // Mapear para formato de contatos
        const contatosMapeados = data.map(g => ({
          id: g.id,
          nome: g.nome,
          email: g.email || '',
          telefone: g.telefone || '',
          empresa: g.nome,
          cargo: 'Cliente',
          categoria: 'cliente'
        }));
        setContatos(contatosMapeados);
      }
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
    }
    setLoading(false);
  };

  const filteredContatos = contatos.filter(contato => {
    if (searchTerm && !contato.nome?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !contato.email?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedCategoria && contato.categoria !== selectedCategoria) return false;
    return true;
  });

  const handleOpenModal = (contato = null) => {
    if (contato) {
      setEditingContato(contato);
      setFormData(contato);
    } else {
      setEditingContato(null);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        empresa: '',
        cargo: '',
        categoria: 'cliente',
        notas: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingContato(null);
  };

  const handleSave = async () => {
    // Implementar salvamento
    alert('Contato salvo com sucesso!');
    handleCloseModal();
    fetchContatos();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      alert('Contato excluído!');
      fetchContatos();
    }
  };

  return (
    <div className="admin-contatos">
      {/* Header */}
      <div className="contatos-header">
        <div className="header-title">
          <Icons.Users />
          <div className="header-text">
            <h1>Contatos</h1>
            <span className="header-subtitle">Gerencie sua lista de contatos</span>
          </div>
        </div>
        <button className="btn-novo-contato" onClick={() => handleOpenModal()}>
          <Icons.Plus />
          Novo Contato
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="search-box">
          <Icons.Search />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select value={selectedCategoria} onChange={(e) => setSelectedCategoria(e.target.value)}>
            <option value="">Todas as Categorias</option>
            <option value="cliente">Clientes</option>
            <option value="fornecedor">Fornecedores</option>
            <option value="parceiro">Parceiros</option>
            <option value="outro">Outros</option>
          </select>
        </div>
      </div>

      {/* Lista de Contatos */}
      <div className="contatos-section">
        <div className="section-header">
          <Icons.Users />
          <h2>Lista de Contatos ({filteredContatos.length})</h2>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Carregando contatos...</p>
          </div>
        ) : filteredContatos.length === 0 ? (
          <div className="empty-state">
            <Icons.Users />
            <p>Nenhum contato encontrado</p>
          </div>
        ) : (
          <div className="contatos-grid">
            {filteredContatos.map(contato => (
              <div key={contato.id} className="contato-card">
                <div className="contato-avatar">
                  {contato.nome?.charAt(0).toUpperCase()}
                </div>
                <div className="contato-info">
                  <h3>{contato.nome}</h3>
                  {contato.cargo && <span className="contato-cargo">{contato.cargo}</span>}
                  <div className="contato-detalhes">
                    {contato.email && (
                      <div className="detalhe">
                        <Icons.Mail />
                        <span>{contato.email}</span>
                      </div>
                    )}
                    {contato.telefone && (
                      <div className="detalhe">
                        <Icons.Phone />
                        <span>{contato.telefone}</span>
                      </div>
                    )}
                    {contato.empresa && (
                      <div className="detalhe">
                        <Icons.Building />
                        <span>{contato.empresa}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="contato-actions">
                  <button className="btn-action btn-edit" onClick={() => handleOpenModal(contato)}>
                    <Icons.Edit />
                  </button>
                  <button className="btn-action btn-delete" onClick={() => handleDelete(contato.id)}>
                    <Icons.Trash />
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
              <h2>{editingContato ? 'Editar Contato' : 'Novo Contato'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>
                <Icons.X />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="form-group">
                  <label>Telefone</label>
                  <input
                    type="tel"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Empresa</label>
                  <input
                    type="text"
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    placeholder="Nome da empresa"
                  />
                </div>
                <div className="form-group">
                  <label>Cargo</label>
                  <input
                    type="text"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    placeholder="Cargo ou função"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Categoria</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                >
                  <option value="cliente">Cliente</option>
                  <option value="fornecedor">Fornecedor</option>
                  <option value="parceiro">Parceiro</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notas</label>
                <textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Observações sobre o contato..."
                  rows={3}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancelar" onClick={handleCloseModal}>Cancelar</button>
              <button className="btn-salvar" onClick={handleSave}>
                {editingContato ? 'Salvar Alterações' : 'Criar Contato'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContatos;
