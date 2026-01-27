import React, { useState, useEffect, useMemo } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { supabase } from '../../utils/supabaseClient';
import logo from '../../assets/logo.png';
import './AdminClientes.css';

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
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Filter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  ),
  AlertCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  ),
  CheckCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
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
  { id: 'dte', nome: 'DTE', descricao: 'Documento de Transferência Eletrônica' },
  { id: 'providata', nome: 'ProviDATA (SaaS)', descricao: 'Plataforma de gestão de dados como serviço' },
  { id: 'rondonia_numeros', nome: 'Rondônia em Números (SaaS)', descricao: 'Dashboard interativo com indicadores socioeconômicos de Rondônia' },
  { id: 'emendas', nome: 'Emendas (SaaS)', descricao: 'Sistema de gestão de emendas parlamentares' },
  { id: 'lucrofy', nome: 'Lucrofy', descricao: 'Plataforma de gestão financeira e lucratividade' },
  { id: 'eleitoralflow', nome: 'EleitoralFlow (SaaS)', descricao: 'Sistema de gestão de campanhas eleitorais' },
  { id: 'plataforma_propria', nome: 'Desenvolvimento de Plataforma Própria', descricao: 'Desenvolvimento de plataforma personalizada sob demanda' },
  { id: 'suporte_dev', nome: 'Suporte em Desenvolvimento', descricao: 'Suporte técnico especializado em desenvolvimento de software' },
  { id: 'painel_bi_especifico', nome: 'Desenvolvimento de Painel de BI Específico', descricao: 'Criação de painéis de Business Intelligence personalizados' },
  { id: 'assessoria_ti', nome: 'Assessoria em TI', descricao: 'Consultoria e assessoria em tecnologia da informação' },
  { id: 'assessoria_dados', nome: 'Assessoria em Gestão de Dados', descricao: 'Consultoria especializada em gestão e governança de dados' },
  { id: 'suporte_tecnico', nome: 'Suporte Técnico', descricao: 'Suporte técnico geral para sistemas e infraestrutura' }
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

// Funções de validação
const validarCPF = (cpf) => {
  const numeros = cpf.replace(/\D/g, '');
  if (numeros.length !== 11) return false;
  if (/^(\d)\1+$/.test(numeros)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(numeros.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(numeros.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(numeros.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(numeros.charAt(10))) return false;
  
  return true;
};

const validarCNPJ = (cnpj) => {
  const numeros = cnpj.replace(/\D/g, '');
  if (numeros.length !== 14) return false;
  if (/^(\d)\1+$/.test(numeros)) return false;
  
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  let soma = 0;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(numeros.charAt(i)) * pesos1[i];
  }
  let resto = soma % 11;
  const digito1 = resto < 2 ? 0 : 11 - resto;
  if (digito1 !== parseInt(numeros.charAt(12))) return false;
  
  soma = 0;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(numeros.charAt(i)) * pesos2[i];
  }
  resto = soma % 11;
  const digito2 = resto < 2 ? 0 : 11 - resto;
  if (digito2 !== parseInt(numeros.charAt(13))) return false;
  
  return true;
};

const AdminClientes = () => {
  const { adminUser, isSuperAdmin } = useAdminAuth();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Estados para filtros e busca
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroProduto, setFiltroProduto] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados para validação
  const [validationErrors, setValidationErrors] = useState({});
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 4 colunas x 3 linhas
  
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    fetchClientes();
  }, []);

  // Filtrar clientes
  const clientesFiltrados = useMemo(() => {
    return clientes.filter(c => c.ativo).filter(cliente => {
      // Filtro de busca
      const matchSearch = !searchTerm || 
        cliente.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.municipio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.responsavel_nome?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de tipo
      const matchTipo = !filtroTipo || cliente.tipo_cliente === filtroTipo;
      
      // Filtro de produto
      const matchProduto = !filtroProduto || 
        (cliente.produtos && cliente.produtos.includes(filtroProduto));
      
      return matchSearch && matchTipo && matchProduto;
    });
  }, [clientes, searchTerm, filtroTipo, filtroProduto]);

  // Paginação
  const totalPages = Math.ceil(clientesFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const clientesPaginados = clientesFiltrados.slice(startIndex, endIndex);

  // Resetar página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filtroTipo, filtroProduto]);

  // Funções de paginação
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll suave para o topo da lista
      document.querySelector('.gabinetes-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Gerar números de página para exibição
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

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
    setValidationErrors({});
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
    setValidationErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpar erro de validação ao editar
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
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
    if (numbers.length <= 2) return numbers ? `(${numbers}` : '';
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, responsavel_cpf: formatted }));
    
    // Validar CPF em tempo real
    if (formatted.replace(/\D/g, '').length === 11) {
      if (!validarCPF(formatted)) {
        setValidationErrors(prev => ({ ...prev, responsavel_cpf: 'CPF inválido' }));
      } else {
        setValidationErrors(prev => ({ ...prev, responsavel_cpf: null }));
      }
    } else {
      setValidationErrors(prev => ({ ...prev, responsavel_cpf: null }));
    }
  };

  const handleCNPJChange = (e) => {
    const formatted = formatCNPJ(e.target.value);
    setFormData(prev => ({ ...prev, cnpj: formatted }));
    
    // Validar CNPJ em tempo real
    if (formatted.replace(/\D/g, '').length === 14) {
      if (!validarCNPJ(formatted)) {
        setValidationErrors(prev => ({ ...prev, cnpj: 'CNPJ inválido' }));
      } else {
        setValidationErrors(prev => ({ ...prev, cnpj: null }));
      }
    } else {
      setValidationErrors(prev => ({ ...prev, cnpj: null }));
    }
  };

  const handleTelefoneChange = (e) => {
    const formatted = formatTelefone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
  };

  const validateForm = () => {
    const errors = {};
    
    // Validar campos obrigatórios
    if (!formData.tipo_cliente) {
      errors.tipo_cliente = 'Tipo de cliente é obrigatório';
    }
    
    if (!formData.nome || formData.nome.trim() === '') {
      errors.nome = 'Nome/Razão Social é obrigatório';
    }
    
    if (!formData.telefone || formData.telefone.replace(/\D/g, '').length < 10) {
      errors.telefone = 'Telefone é obrigatório (mínimo 10 dígitos)';
    }
    
    if (!formData.email || formData.email.trim() === '') {
      errors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'E-mail inválido';
    }
    
    if (!formData.responsavel_nome || formData.responsavel_nome.trim() === '') {
      errors.responsavel_nome = 'Nome do responsável é obrigatório';
    }
    
    if (!formData.responsavel_cargo || formData.responsavel_cargo.trim() === '') {
      errors.responsavel_cargo = 'Cargo é obrigatório';
    }
    
    // CPF é opcional - validar apenas se preenchido
    if (formData.responsavel_cpf && formData.responsavel_cpf.replace(/\D/g, '').length > 0) {
      if (formData.responsavel_cpf.replace(/\D/g, '').length !== 11) {
        errors.responsavel_cpf = 'CPF deve ter 11 dígitos';
      } else if (!validarCPF(formData.responsavel_cpf)) {
        errors.responsavel_cpf = 'CPF inválido';
      }
    }
    
    // Validar CNPJ (se preenchido)
    if (formData.cnpj && formData.cnpj.replace(/\D/g, '').length > 0) {
      if (formData.cnpj.replace(/\D/g, '').length !== 14) {
        errors.cnpj = 'CNPJ incompleto (14 dígitos)';
      } else if (!validarCNPJ(formData.cnpj)) {
        errors.cnpj = 'CNPJ inválido';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
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

  const limparFiltros = () => {
    setSearchTerm('');
    setFiltroTipo('');
    setFiltroProduto('');
  };

  const temFiltrosAtivos = searchTerm || filtroTipo || filtroProduto;

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

      {/* Barra de Busca e Filtros */}
      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <Icons.Search />
          <input
            type="text"
            placeholder="Buscar por nome, município, e-mail ou responsável..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <button 
          className={`btn-filter ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Icons.Filter />
          <span>Filtros</span>
          {temFiltrosAtivos && <span className="filter-badge">{[filtroTipo, filtroProduto].filter(Boolean).length}</span>}
        </button>
      </div>

      {/* Painel de Filtros */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Tipo de Cliente</label>
            <select 
              value={filtroTipo} 
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="">Todos os tipos</option>
              {tiposCliente.map(tipo => (
                <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>Produto Contratado</label>
            <select 
              value={filtroProduto} 
              onChange={(e) => setFiltroProduto(e.target.value)}
            >
              <option value="">Todos os produtos</option>
              {produtosDisponiveis.map(produto => (
                <option key={produto.id} value={produto.id}>{produto.nome}</option>
              ))}
            </select>
          </div>
          
          {temFiltrosAtivos && (
            <button className="btn-limpar-filtros" onClick={limparFiltros}>
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Contador de resultados */}
      {temFiltrosAtivos && (
        <div className="results-count">
          {clientesFiltrados.length} cliente(s) encontrado(s)
        </div>
      )}

      {/* Lista de Clientes */}
      <div className="gabinetes-grid">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Carregando clientes...</p>
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="empty-state">
            <Icons.Building />
            {temFiltrosAtivos ? (
              <>
                <p>Nenhum cliente encontrado com os filtros aplicados</p>
                <button className="btn-novo" onClick={limparFiltros}>
                  Limpar filtros
                </button>
              </>
            ) : (
              <>
                <p>Nenhum cliente cadastrado</p>
                {isSuperAdmin() && (
                  <button className="btn-novo" onClick={() => handleOpenModal()}>
                    <Icons.Plus />
                    Criar primeiro cliente
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          clientesPaginados.map(cliente => (
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

      {/* Paginação */}
      {!loading && clientesFiltrados.length > 0 && totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Mostrando {startIndex + 1}-{Math.min(endIndex, clientesFiltrados.length)} de {clientesFiltrados.length} cliente(s)
          </div>
          <div className="pagination-controls">
            <button 
              className="pagination-btn pagination-btn-nav" 
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Anterior
            </button>
            
            <div className="pagination-numbers">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                ) : (
                  <button
                    key={page}
                    className={`pagination-btn pagination-btn-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>
            
            <button 
              className="pagination-btn pagination-btn-nav" 
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Próximo
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}

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
                      className={validationErrors.tipo_cliente ? 'input-error' : ''}
                    >
                      <option value="">Selecione o tipo...</option>
                      {tiposCliente.map(tipo => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </option>
                      ))}
                    </select>
                    {validationErrors.tipo_cliente && (
                      <span className="error-message">{validationErrors.tipo_cliente}</span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cnpj">
                      CNPJ
                      {formData.cnpj && formData.cnpj.replace(/\D/g, '').length === 14 && (
                        <span className={`validation-icon ${validationErrors.cnpj ? 'error' : 'success'}`}>
                          {validationErrors.cnpj ? <Icons.AlertCircle /> : <Icons.CheckCircle />}
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      id="cnpj"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleCNPJChange}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                      className={validationErrors.cnpj ? 'input-error' : ''}
                    />
                    {validationErrors.cnpj && (
                      <span className="error-message">{validationErrors.cnpj}</span>
                    )}
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
                    className={validationErrors.nome ? 'input-error' : ''}
                  />
                  {validationErrors.nome && (
                    <span className="error-message">{validationErrors.nome}</span>
                  )}
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
                        className={validationErrors.telefone ? 'input-error' : ''}
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
                    {validationErrors.telefone && (
                      <span className="error-message">{validationErrors.telefone}</span>
                    )}
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
                      className={validationErrors.email ? 'input-error' : ''}
                    />
                    {validationErrors.email && (
                      <span className="error-message">{validationErrors.email}</span>
                    )}
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
                      className={validationErrors.responsavel_nome ? 'input-error' : ''}
                    />
                    {validationErrors.responsavel_nome && (
                      <span className="error-message">{validationErrors.responsavel_nome}</span>
                    )}
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
                      className={validationErrors.responsavel_cargo ? 'input-error' : ''}
                    />
                    {validationErrors.responsavel_cargo && (
                      <span className="error-message">{validationErrors.responsavel_cargo}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group form-group-half">
                    <label htmlFor="responsavel_cpf">
                      CPF do Responsável
                      <span className="field-info" title="Dado sensível - protegido pela LGPD">
                        <Icons.Info />
                      </span>
                      {formData.responsavel_cpf && formData.responsavel_cpf.replace(/\D/g, '').length === 11 && (
                        <span className={`validation-icon ${validationErrors.responsavel_cpf ? 'error' : 'success'}`}>
                          {validationErrors.responsavel_cpf ? <Icons.AlertCircle /> : <Icons.CheckCircle />}
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      id="responsavel_cpf"
                      name="responsavel_cpf"
                      value={formData.responsavel_cpf}
                      onChange={handleCPFChange}
                      placeholder="000.000.000-00 (opcional)"
                      maxLength={14}
                      className={validationErrors.responsavel_cpf ? 'input-error' : ''}
                    />
                    {validationErrors.responsavel_cpf && (
                      <span className="error-message">{validationErrors.responsavel_cpf}</span>
                    )}
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
                <button 
                  type="submit" 
                  className="btn-submit" 
                  disabled={saving || Object.values(validationErrors).some(e => e)}
                >
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

export default AdminClientes;
