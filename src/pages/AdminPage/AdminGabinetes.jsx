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
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ),
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  ),
  WhatsApp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  Package: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  )
};

// Tipos de cliente disponíveis
const tiposCliente = [
  { value: 'prefeitura', label: 'Prefeitura Municipal' },
  { value: 'secretaria', label: 'Secretaria (Executivo)' },
  { value: 'autarquia', label: 'Autarquia' },
  { value: 'orgao_executivo', label: 'Outro Órgão do Executivo' },
  { value: 'camara_municipal', label: 'Câmara Municipal (Legislativo)' },
  { value: 'assembleia', label: 'Assembleia Legislativa' },
  { value: 'empresa_privada', label: 'Empresa Privada' },
  { value: 'vereador', label: 'Vereador(a)' },
  { value: 'deputado_estadual', label: 'Deputado(a) Estadual' },
  { value: 'deputado_federal', label: 'Deputado(a) Federal' },
  { value: 'senador', label: 'Senador(a)' },
  { value: 'outro', label: 'Outro' }
];

// Produtos disponíveis
const produtosDisponiveis = [
  { id: 'painel_bi', nome: 'Painel de BI - Rondônia em Números', descricao: 'Dashboard interativo com indicadores socioeconômicos' },
  { id: 'consultoria', nome: 'Consultoria em Dados', descricao: 'Análise e interpretação de dados territoriais' },
  { id: 'plataforma_gestao', nome: 'Plataforma de Gestão', descricao: 'Sistema completo de gestão municipal' },
  { id: 'api_dados', nome: 'API de Dados', descricao: 'Acesso programático aos dados territoriais' },
  { id: 'relatorios', nome: 'Relatórios Personalizados', descricao: 'Relatórios sob demanda com análises específicas' },
  { id: 'treinamento', nome: 'Treinamento', descricao: 'Capacitação em análise de dados e uso das ferramentas' }
];

// Municípios de Rondônia
const municipiosRO = [
  'Alta Floresta D\'Oeste', 'Alto Alegre dos Parecis', 'Alto Paraíso', 'Alvorada D\'Oeste',
  'Ariquemes', 'Buritis', 'Cabixi', 'Cacaulândia', 'Cacoal', 'Campo Novo de Rondônia',
  'Candeias do Jamari', 'Castanheiras', 'Cerejeiras', 'Chupinguaia', 'Colorado do Oeste',
  'Corumbiara', 'Costa Marques', 'Cujubim', 'Espigão D\'Oeste', 'Governador Jorge Teixeira',
  'Guajará-Mirim', 'Itapuã do Oeste', 'Jaru', 'Ji-Paraná', 'Machadinho D\'Oeste',
  'Ministro Andreazza', 'Mirante da Serra', 'Monte Negro', 'Nova Brasilândia D\'Oeste',
  'Nova Mamoré', 'Nova União', 'Novo Horizonte do Oeste', 'Ouro Preto do Oeste',
  'Parecis', 'Pimenta Bueno', 'Pimenteiras do Oeste', 'Porto Velho', 'Presidente Médici',
  'Primavera de Rondônia', 'Rio Crespo', 'Rolim de Moura', 'Santa Luzia D\'Oeste',
  'São Felipe D\'Oeste', 'São Francisco do Guaporé', 'São Miguel do Guaporé',
  'Seringueiras', 'Teixeirópolis', 'Theobroma', 'Urupá', 'Vale do Anari',
  'Vale do Paraíso', 'Vilhena'
];

const AdminGabinetes = () => {
  const { adminUser, isSuperAdmin } = useAdminAuth();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Dados do Cliente
    tipo_cliente: '',
    nome: '',
    cnpj: '',
    municipio: '',
    endereco: '',
    
    // Dados de Contato
    telefone: '',
    telefone_whatsapp: false,
    email: '',
    
    // Dados do Responsável
    responsavel_nome: '',
    responsavel_cargo: '',
    responsavel_cpf: '',
    
    // Produtos Contratados
    produtos: [],
    
    // Observações
    observacoes: ''
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_gabinetes')
        .select('*, admin_usuarios(nome)')
        .order('nome');
      
      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
    setLoading(false);
  };

  const handleOpenModal = (cliente = null) => {
    if (cliente) {
      setEditingCliente(cliente);
      setFormData({
        tipo_cliente: cliente.tipo_cliente || '',
        nome: cliente.nome || '',
        cnpj: cliente.cnpj || '',
        municipio: cliente.municipio || '',
        endereco: cliente.endereco || '',
        telefone: cliente.telefone || '',
        telefone_whatsapp: cliente.telefone_whatsapp || false,
        email: cliente.email || '',
        responsavel_nome: cliente.responsavel_nome || '',
        responsavel_cargo: cliente.responsavel_cargo || '',
        responsavel_cpf: cliente.responsavel_cpf || '',
        produtos: cliente.produtos || [],
        observacoes: cliente.observacoes || ''
      });
    } else {
      setEditingCliente(null);
      setFormData({
        tipo_cliente: '',
        nome: '',
        cnpj: '',
        municipio: '',
        endereco: '',
        telefone: '',
        telefone_whatsapp: false,
        email: '',
        responsavel_nome: '',
        responsavel_cargo: '',
        responsavel_cpf: '',
        produtos: [],
        observacoes: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCliente(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProdutoToggle = (produtoId) => {
    setFormData(prev => ({
      ...prev,
      produtos: prev.produtos.includes(produtoId)
        ? prev.produtos.filter(p => p !== produtoId)
        : [...prev.produtos, produtoId]
    }));
  };

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const formatCNPJ = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
    if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
  };

  const formatTelefone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, responsavel_cpf: formatted }));
  };

  const handleCNPJChange = (e) => {
    const formatted = formatCNPJ(e.target.value);
    setFormData(prev => ({ ...prev, cnpj: formatted }));
  };

  const handleTelefoneChange = (e) => {
    const formatted = formatTelefone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const dataToSave = {
        tipo_cliente: formData.tipo_cliente,
        nome: formData.nome,
        cnpj: formData.cnpj,
        municipio: formData.municipio,
        endereco: formData.endereco,
        telefone: formData.telefone,
        telefone_whatsapp: formData.telefone_whatsapp,
        email: formData.email,
        responsavel_nome: formData.responsavel_nome,
        responsavel_cargo: formData.responsavel_cargo,
        responsavel_cpf: formData.responsavel_cpf,
        produtos: formData.produtos,
        observacoes: formData.observacoes,
        updated_at: new Date().toISOString()
      };

      if (editingCliente) {
        const { error } = await supabase
          .from('admin_gabinetes')
          .update(dataToSave)
          .eq('id', editingCliente.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('admin_gabinetes')
          .insert({
            ...dataToSave,
            responsavel_id: adminUser.id,
            ativo: true
          });
        
        if (error) throw error;
      }
      
      handleCloseModal();
      fetchClientes();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente: ' + error.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;
    
    try {
      const { error } = await supabase
        .from('admin_gabinetes')
        .update({ ativo: false })
        .eq('id', id);
      
      if (error) throw error;
      fetchClientes();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      alert('Erro ao excluir cliente');
    }
  };

  const getTipoClienteLabel = (tipo) => {
    const found = tiposCliente.find(t => t.value === tipo);
    return found ? found.label : tipo || 'Não informado';
  };

  const getProdutosNomes = (produtosIds) => {
    if (!produtosIds || produtosIds.length === 0) return 'Nenhum produto';
    return produtosIds.map(id => {
      const produto = produtosDisponiveis.find(p => p.id === id);
      return produto ? produto.nome : id;
    }).join(', ');
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
          <h1>Clientes</h1>
          <span className="header-subtitle">Gerencie os clientes cadastrados no sistema</span>
        </div>
        {isSuperAdmin() && (
          <button className="btn-novo" onClick={() => handleOpenModal()}>
            <Icons.Plus />
            Novo Cliente
          </button>
        )}
      </div>

      {/* Lista de Clientes */}
      <div className="gabinetes-grid">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Carregando clientes...</p>
          </div>
        ) : clientes.filter(c => c.ativo).length === 0 ? (
          <div className="empty-state">
            <Icons.Building />
            <p>Nenhum cliente cadastrado</p>
            {isSuperAdmin() && (
              <button className="btn-novo" onClick={() => handleOpenModal()}>
                <Icons.Plus />
                Criar primeiro cliente
              </button>
            )}
          </div>
        ) : (
          clientes.filter(c => c.ativo).map(cliente => (
            <div key={cliente.id} className="gabinete-card">
              <div className="gabinete-header">
                <div className="gabinete-tipo-badge">
                  {getTipoClienteLabel(cliente.tipo_cliente)}
                </div>
                {isSuperAdmin() && (
                  <div className="gabinete-actions">
                    <button 
                      className="btn-icon" 
                      onClick={() => handleOpenModal(cliente)}
                      title="Editar"
                    >
                      <Icons.Edit />
                    </button>
                    <button 
                      className="btn-icon btn-danger" 
                      onClick={() => handleDelete(cliente.id)}
                      title="Excluir"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                )}
              </div>
              <h3 className="gabinete-nome">{cliente.nome}</h3>
              
              <div className="gabinete-info-grid">
                {cliente.municipio && (
                  <div className="gabinete-info-item">
                    <Icons.Building />
                    <span>{cliente.municipio}</span>
                  </div>
                )}
                {cliente.telefone && (
                  <div className="gabinete-info-item">
                    {cliente.telefone_whatsapp ? <Icons.WhatsApp /> : <Icons.Phone />}
                    <span>{cliente.telefone}</span>
                  </div>
                )}
                {cliente.email && (
                  <div className="gabinete-info-item">
                    <Icons.Mail />
                    <span>{cliente.email}</span>
                  </div>
                )}
                {cliente.responsavel_nome && (
                  <div className="gabinete-info-item">
                    <Icons.User />
                    <span>{cliente.responsavel_nome}</span>
                  </div>
                )}
              </div>

              {cliente.produtos && cliente.produtos.length > 0 && (
                <div className="gabinete-produtos">
                  <Icons.Package />
                  <span>{cliente.produtos.length} produto(s) contratado(s)</span>
                </div>
              )}

              <div className="gabinete-footer">
                <span className="gabinete-responsavel">
                  Cadastrado por: {cliente.admin_usuarios?.nome || 'Sistema'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Criação/Edição */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCliente ? 'Editar Cliente' : 'Novo Cliente'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>
                <Icons.X />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="cliente-form">
              {/* Seção: Dados do Cliente */}
              <div className="form-section">
                <h3 className="section-title">
                  <Icons.Building />
                  Dados do Cliente
                </h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="tipo_cliente">Tipo de Cliente *</label>
                    <select
                      id="tipo_cliente"
                      name="tipo_cliente"
                      value={formData.tipo_cliente}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione o tipo...</option>
                      {tiposCliente.map(tipo => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cnpj">CNPJ</label>
                    <input
                      type="text"
                      id="cnpj"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleCNPJChange}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="nome">Nome/Razão Social *</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: Prefeitura Municipal de Ji-Paraná"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="municipio">Município</label>
                    <select
                      id="municipio"
                      name="municipio"
                      value={formData.municipio}
                      onChange={handleInputChange}
                    >
                      <option value="">Selecione o município...</option>
                      {municipiosRO.map(mun => (
                        <option key={mun} value={mun}>{mun}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="endereco">Endereço</label>
                    <input
                      type="text"
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleInputChange}
                      placeholder="Rua, número, bairro..."
                    />
                  </div>
                </div>
              </div>

              {/* Seção: Dados de Contato */}
              <div className="form-section">
                <h3 className="section-title">
                  <Icons.Phone />
                  Dados de Contato
                </h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="telefone">Telefone *</label>
                    <div className="input-with-checkbox">
                      <input
                        type="text"
                        id="telefone"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleTelefoneChange}
                        required
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                      />
                      <label className="checkbox-inline">
                        <input
                          type="checkbox"
                          name="telefone_whatsapp"
                          checked={formData.telefone_whatsapp}
                          onChange={handleInputChange}
                        />
                        <Icons.WhatsApp />
                        <span>WhatsApp</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">E-mail *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="contato@exemplo.gov.br"
                    />
                  </div>
                </div>
              </div>

              {/* Seção: Dados do Responsável */}
              <div className="form-section">
                <h3 className="section-title">
                  <Icons.User />
                  Dados do Responsável
                  <span className="section-info" title="Dados protegidos pela LGPD">
                    <Icons.Info />
                  </span>
                </h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="responsavel_nome">Nome do Responsável *</label>
                    <input
                      type="text"
                      id="responsavel_nome"
                      name="responsavel_nome"
                      value={formData.responsavel_nome}
                      onChange={handleInputChange}
                      required
                      placeholder="Nome completo"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="responsavel_cargo">Cargo *</label>
                    <input
                      type="text"
                      id="responsavel_cargo"
                      name="responsavel_cargo"
                      value={formData.responsavel_cargo}
                      onChange={handleInputChange}
                      required
                      placeholder="Ex: Prefeito, Secretário, Diretor..."
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group form-group-half">
                    <label htmlFor="responsavel_cpf">
                      CPF do Responsável *
                      <span className="field-info" title="Dado sensível - protegido pela LGPD">
                        <Icons.Info />
                      </span>
                    </label>
                    <input
                      type="text"
                      id="responsavel_cpf"
                      name="responsavel_cpf"
                      value={formData.responsavel_cpf}
                      onChange={handleCPFChange}
                      required
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>
                </div>
              </div>

              {/* Seção: Produtos Contratados */}
              <div className="form-section">
                <h3 className="section-title">
                  <Icons.Package />
                  Produtos Contratados
                </h3>
                
                <div className="produtos-grid">
                  {produtosDisponiveis.map(produto => (
                    <label 
                      key={produto.id} 
                      className={`produto-card ${formData.produtos.includes(produto.id) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.produtos.includes(produto.id)}
                        onChange={() => handleProdutoToggle(produto.id)}
                      />
                      <div className="produto-info">
                        <span className="produto-nome">{produto.nome}</span>
                        <span className="produto-descricao">{produto.descricao}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Seção: Observações */}
              <div className="form-section">
                <h3 className="section-title">Observações</h3>
                <div className="form-group">
                  <textarea
                    id="observacoes"
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleInputChange}
                    placeholder="Informações adicionais sobre o cliente..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Aviso LGPD */}
              <div className="lgpd-notice">
                <Icons.Info />
                <p>
                  Todos os dados coletados respeitam às normas da <strong>Lei Geral de Proteção de Dados (LGPD)</strong>. 
                  Os dados pessoais serão utilizados exclusivamente para fins de gestão contratual e comunicação com o cliente.
                </p>
              </div>

              {/* Ações do Modal */}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit" disabled={saving}>
                  {saving ? 'Salvando...' : (editingCliente ? 'Salvar Alterações' : 'Cadastrar Cliente')}
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
