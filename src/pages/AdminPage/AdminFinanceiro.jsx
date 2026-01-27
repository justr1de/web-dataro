import React, { useState, useEffect, useRef } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { supabase } from '../../utils/supabaseClient';
import './AdminFinanceiro.css';

// Ícones SVG inline
const Icons = {
  DollarSign: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  ),
  TrendingUp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  ),
  TrendingDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
      <polyline points="17 18 23 18 23 12"></polyline>
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
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
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  FileText: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  Upload: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  ),
  Download: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  Filter: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  ),
  AlertCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  ),
  Eye: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ),
  CreditCard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
      <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
  ),
  PieChart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
      <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
    </svg>
  ),
  Calculator: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2"></rect>
      <line x1="8" y1="6" x2="16" y2="6"></line>
      <line x1="8" y1="10" x2="8" y2="10"></line>
      <line x1="12" y1="10" x2="12" y2="10"></line>
      <line x1="16" y1="10" x2="16" y2="10"></line>
      <line x1="8" y1="14" x2="8" y2="14"></line>
      <line x1="12" y1="14" x2="12" y2="14"></line>
      <line x1="16" y1="14" x2="16" y2="14"></line>
      <line x1="8" y1="18" x2="8" y2="18"></line>
      <line x1="12" y1="18" x2="12" y2="18"></line>
      <line x1="16" y1="18" x2="16" y2="18"></line>
    </svg>
  ),
  BarChart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"></line>
      <line x1="18" y1="20" x2="18" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="16"></line>
    </svg>
  ),
  Clipboard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    </svg>
  ),
  Activity: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  ),
  Briefcase: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  ),
  Percent: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19"></line>
      <circle cx="6.5" cy="6.5" r="2.5"></circle>
      <circle cx="17.5" cy="17.5" r="2.5"></circle>
    </svg>
  ),
  ChevronDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  ),
  Printer: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9"></polyline>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
      <rect x="6" y="14" width="12" height="8"></rect>
    </svg>
  ),
  RefreshCw: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"></polyline>
      <polyline points="1 20 1 14 7 14"></polyline>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
  ),
  Database: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
  ),
  Save: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
  ),
  RotateCcw: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"></polyline>
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
    </svg>
  ),
  Archive: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8"></polyline>
      <rect x="1" y="3" width="22" height="5"></rect>
      <line x1="10" y1="12" x2="14" y2="12"></line>
    </svg>
  )
};

// Categorias padrão
const categoriasPadrao = {
  receita: [
    { id: 'consultoria', nome: 'Consultoria', cor: '#10b981' },
    { id: 'desenvolvimento', nome: 'Desenvolvimento', cor: '#3b82f6' },
    { id: 'treinamentos', nome: 'Treinamentos', cor: '#8b5cf6' },
    { id: 'licencas', nome: 'Licenças', cor: '#f59e0b' },
    { id: 'manutencao', nome: 'Manutenção', cor: '#06b6d4' },
    { id: 'outros_recebimentos', nome: 'Outros Recebimentos', cor: '#6b7280' }
  ],
  despesa: [
    { id: 'salarios', nome: 'Salários', cor: '#ef4444' },
    { id: 'impostos', nome: 'Impostos', cor: '#dc2626' },
    { id: 'infraestrutura', nome: 'Infraestrutura', cor: '#f97316' },
    { id: 'software', nome: 'Software', cor: '#eab308' },
    { id: 'marketing', nome: 'Marketing', cor: '#ec4899' },
    { id: 'administrativo', nome: 'Administrativo', cor: '#64748b' },
    { id: 'viagens', nome: 'Viagens', cor: '#14b8a6' },
    { id: 'equipamentos', nome: 'Equipamentos', cor: '#a855f7' },
    { id: 'licenca_mensal', nome: 'Licença Mensal', cor: '#0ea5e9' },
    { id: 'licenca_anual', nome: 'Licença Anual', cor: '#6366f1' },
    { id: 'licenca_avulsa', nome: 'Licença Avulsa', cor: '#8b5cf6' },
    { id: 'outros_pagamentos', nome: 'Outros Pagamentos', cor: '#6b7280' }
  ]
};

const formasPagamento = [
  'PIX',
  'Transferência Bancária',
  'Boleto',
  'Cartão de Crédito',
  'Cartão de Débito',
  'Dinheiro',
  'Cheque'
];

// Funções de formatação monetária
const formatarMoeda = (valor) => {
  if (!valor && valor !== 0) return '';
  const numero = typeof valor === 'string' ? parseFloat(valor.replace(/\D/g, '')) / 100 : valor;
  if (isNaN(numero)) return '';
  return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const parseMoeda = (valorFormatado) => {
  if (!valorFormatado) return 0;
  // Remove tudo exceto números e vírgula
  const limpo = valorFormatado.toString().replace(/[^\d,]/g, '');
  // Substitui vírgula por ponto para conversão
  const numero = parseFloat(limpo.replace(',', '.'));
  return isNaN(numero) ? 0 : numero;
};

const handleValorChange = (e, setter, field) => {
  // Remove tudo que não é número
  let valor = e.target.value.replace(/\D/g, '');
  
  // Converte para centavos e formata
  if (valor) {
    const numero = parseInt(valor) / 100;
    const formatado = numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    setter(prev => ({ ...prev, [field]: formatado }));
  } else {
    setter(prev => ({ ...prev, [field]: '' }));
  }
};

// Tabelas de impostos Simples Nacional 2024
const tabelasSimples = {
  anexoIII: { // Serviços
    faixas: [
      { ate: 180000, aliquota: 6.00, deducao: 0 },
      { ate: 360000, aliquota: 11.20, deducao: 9360 },
      { ate: 720000, aliquota: 13.50, deducao: 17640 },
      { ate: 1800000, aliquota: 16.00, deducao: 35640 },
      { ate: 3600000, aliquota: 21.00, deducao: 125640 },
      { ate: 4800000, aliquota: 33.00, deducao: 648000 }
    ]
  },
  anexoV: { // Serviços com maior tributação
    faixas: [
      { ate: 180000, aliquota: 15.50, deducao: 0 },
      { ate: 360000, aliquota: 18.00, deducao: 4500 },
      { ate: 720000, aliquota: 19.50, deducao: 9900 },
      { ate: 1800000, aliquota: 20.50, deducao: 17100 },
      { ate: 3600000, aliquota: 23.00, deducao: 62100 },
      { ate: 4800000, aliquota: 30.50, deducao: 540000 }
    ]
  }
};

const AdminFinanceiro = () => {
  const { adminUser, isSuperAdmin } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDocumentoModal, setShowDocumentoModal] = useState(false);
  const [showContratoModal, setShowContratoModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedTransacao, setSelectedTransacao] = useState(null);
  const [selectedContrato, setSelectedContrato] = useState(null);
  const [filtros, setFiltros] = useState({
    tipo: 'todos',
    status: 'todos',
    periodo: 'mes_atual',
    categoria: 'todas'
  });
  const [formData, setFormData] = useState({
    tipo: 'receita',
    descricao: '',
    valor: '',
    data_vencimento: '',
    data_pagamento: '',
    status: 'pendente',
    categoria: '',
    forma_pagamento: '',
    banco: '',
    final_cartao: '',
    conta: '',
    numero_documento: '',
    observacoes: '',
    entidade_nome: ''
  });
  const [documentoForm, setDocumentoForm] = useState({
    tipo: 'nota_fiscal',
    numero: '',
    descricao: '',
    data_emissao: '',
    valor: '',
    arquivo: null
  });
  const [contratoForm, setContratoForm] = useState({
    cliente: '',
    descricao: '',
    valor_mensal: '',
    data_inicio: '',
    data_fim: '',
    dia_vencimento: '10',
    status: 'ativo'
  });
  
  // Estados para calculadora de impostos
  const [calcImpostos, setCalcImpostos] = useState({
    faturamento12Meses: '',
    faturamentoMes: '',
    regime: 'simples_anexoIII',
    aliquotaISS: '5'
  });
  const [resultadoImpostos, setResultadoImpostos] = useState(null);
  
  // Estados para balanço
  const [periodoBalanco, setPeriodoBalanco] = useState({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear()
  });
  
  // Estados para backups
  const [backups, setBackups] = useState([]);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupNome, setBackupNome] = useState('');
  const [showConfirmZerar, setShowConfirmZerar] = useState(false);
  
  const fileInputRef = useRef(null);

  // Carregar dados do localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedTransacoes = localStorage.getItem('fin_transacoes');
        const savedDocumentos = localStorage.getItem('fin_documentos');
        const savedContratos = localStorage.getItem('fin_contratos');
        
        if (savedTransacoes) {
          setTransacoes(JSON.parse(savedTransacoes));
        } else {
          // Dados de exemplo
          const exemploTransacoes = gerarDadosExemplo();
          setTransacoes(exemploTransacoes);
          localStorage.setItem('fin_transacoes', JSON.stringify(exemploTransacoes));
        }
        
        if (savedDocumentos) {
          setDocumentos(JSON.parse(savedDocumentos));
        }
        
        if (savedContratos) {
          setContratos(JSON.parse(savedContratos));
        } else {
          const exemploContratos = [
            {
              id: '1',
              cliente: 'CIMCERO',
              descricao: 'Manutenção mensal - Rondônia em Números',
              valor_mensal: 5000,
              data_inicio: '2026-01-01',
              data_fim: '2026-12-31',
              dia_vencimento: '10',
              status: 'ativo',
              created_at: '2026-01-01'
            },
            {
              id: '2',
              cliente: 'Prefeitura de Ji-Paraná',
              descricao: 'Consultoria BI - Pacote Anual',
              valor_mensal: 3500,
              data_inicio: '2026-01-01',
              data_fim: '2026-06-30',
              dia_vencimento: '15',
              status: 'ativo',
              created_at: '2026-01-01'
            }
          ];
          setContratos(exemploContratos);
          localStorage.setItem('fin_contratos', JSON.stringify(exemploContratos));
        }
        
        // Carregar backups salvos
        const savedBackups = localStorage.getItem('fin_backups');
        if (savedBackups) {
          setBackups(JSON.parse(savedBackups));
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Gerar dados de exemplo
  const gerarDadosExemplo = () => {
    return [
      {
        id: '1',
        tipo: 'receita',
        descricao: 'Consultoria BI - Prefeitura de Ji-Paraná',
        valor: 15000,
        data_vencimento: '2026-01-30',
        data_pagamento: '2026-01-25',
        status: 'pago',
        categoria: 'consultoria',
        forma_pagamento: 'Transferência Bancária',
        numero_documento: 'NF-001/2026',
        entidade_nome: 'Prefeitura de Ji-Paraná',
        created_at: '2026-01-10'
      },
      {
        id: '2',
        tipo: 'receita',
        descricao: 'Desenvolvimento Dashboard - CIMCERO',
        valor: 25000,
        data_vencimento: '2026-02-15',
        status: 'pendente',
        categoria: 'desenvolvimento',
        entidade_nome: 'CIMCERO',
        created_at: '2026-01-15'
      },
      {
        id: '3',
        tipo: 'despesa',
        descricao: 'Servidor Cloud AWS',
        valor: 2500,
        data_vencimento: '2026-01-28',
        data_pagamento: '2026-01-20',
        status: 'pago',
        categoria: 'infraestrutura',
        forma_pagamento: 'Cartão de Crédito',
        created_at: '2026-01-05'
      },
      {
        id: '4',
        tipo: 'despesa',
        descricao: 'Licença Power BI Pro',
        valor: 500,
        data_vencimento: '2026-02-01',
        status: 'pendente',
        categoria: 'software',
        created_at: '2026-01-20'
      },
      {
        id: '5',
        tipo: 'despesa',
        descricao: 'Folha de Pagamento - Janeiro',
        valor: 18000,
        data_vencimento: '2026-01-31',
        data_pagamento: '2026-01-30',
        status: 'pago',
        categoria: 'salarios',
        forma_pagamento: 'Transferência Bancária',
        created_at: '2026-01-25'
      },
      {
        id: '6',
        tipo: 'receita',
        descricao: 'Treinamento Power BI - Equipe SEDUC',
        valor: 8000,
        data_vencimento: '2026-01-20',
        data_pagamento: '2026-01-18',
        status: 'pago',
        categoria: 'treinamentos',
        forma_pagamento: 'PIX',
        numero_documento: 'NF-002/2026',
        entidade_nome: 'SEDUC-RO',
        created_at: '2026-01-05'
      }
    ];
  };

  // Salvar transações
  const saveTransacoes = (newTransacoes) => {
    setTransacoes(newTransacoes);
    localStorage.setItem('fin_transacoes', JSON.stringify(newTransacoes));
  };

  // Salvar documentos
  const saveDocumentos = (newDocumentos) => {
    setDocumentos(newDocumentos);
    localStorage.setItem('fin_documentos', JSON.stringify(newDocumentos));
  };

  // Salvar contratos
  const saveContratos = (newContratos) => {
    setContratos(newContratos);
    localStorage.setItem('fin_contratos', JSON.stringify(newContratos));
  };

  // Funções de Backup
  const criarBackup = (nome) => {
    const novoBackup = {
      id: Date.now().toString(),
      nome: nome || `Backup ${new Date().toLocaleDateString('pt-BR')}`,
      data: new Date().toISOString(),
      dados: {
        transacoes: [...transacoes],
        documentos: [...documentos],
        contratos: [...contratos]
      },
      resumo: {
        totalTransacoes: transacoes.length,
        totalReceitas: transacoes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0),
        totalDespesas: transacoes.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + t.valor, 0),
        totalDocumentos: documentos.length,
        totalContratos: contratos.length
      }
    };
    
    const novosBackups = [...backups, novoBackup];
    setBackups(novosBackups);
    localStorage.setItem('fin_backups', JSON.stringify(novosBackups));
    
    return novoBackup;
  };

  const restaurarBackup = (backupId) => {
    const backup = backups.find(b => b.id === backupId);
    if (!backup) return false;
    
    // Restaurar dados
    saveTransacoes(backup.dados.transacoes);
    saveDocumentos(backup.dados.documentos);
    saveContratos(backup.dados.contratos);
    
    return true;
  };

  const excluirBackup = (backupId) => {
    const novosBackups = backups.filter(b => b.id !== backupId);
    setBackups(novosBackups);
    localStorage.setItem('fin_backups', JSON.stringify(novosBackups));
  };

  const zerarDados = () => {
    saveTransacoes([]);
    saveDocumentos([]);
    saveContratos([]);
  };

  const exportarBackupJSON = (backupId) => {
    const backup = backups.find(b => b.id === backupId);
    if (!backup) return;
    
    const dataStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${backup.nome.replace(/\s+/g, '_')}_${new Date(backup.data).toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Funções auxiliares
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  const formatarData = (data) => {
    if (!data) return '-';
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const getCategoriaNome = (categoriaId, tipo) => {
    const categorias = categoriasPadrao[tipo] || [];
    const categoria = categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.nome : categoriaId;
  };

  const getCategoriaCor = (categoriaId, tipo) => {
    const categorias = categoriasPadrao[tipo] || [];
    const categoria = categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.cor : '#6b7280';
  };

  const getStatusClass = (status, dataVencimento) => {
    if (status === 'pago') return 'pago';
    if (status === 'cancelado') return 'cancelado';
    if (dataVencimento) {
      const hoje = new Date();
      const vencimento = new Date(dataVencimento + 'T00:00:00');
      if (vencimento < hoje) return 'vencido';
    }
    return 'pendente';
  };

  const getStatusLabel = (status, dataVencimento) => {
    if (status === 'pago') return 'Pago';
    if (status === 'cancelado') return 'Cancelado';
    if (dataVencimento) {
      const hoje = new Date();
      const vencimento = new Date(dataVencimento + 'T00:00:00');
      if (vencimento < hoje) return 'Vencido';
    }
    return 'Pendente';
  };

  // Calcular métricas
  const calcularMetricas = () => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    const transacoesMes = transacoes.filter(t => {
      const dataVenc = new Date(t.data_vencimento + 'T00:00:00');
      return dataVenc.getMonth() === mesAtual && dataVenc.getFullYear() === anoAtual;
    });

    const receitasMes = transacoesMes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0);
    const despesasMes = transacoesMes.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + t.valor, 0);
    const receitasPagas = transacoesMes.filter(t => t.tipo === 'receita' && t.status === 'pago').reduce((acc, t) => acc + t.valor, 0);
    const despesasPagas = transacoesMes.filter(t => t.tipo === 'despesa' && t.status === 'pago').reduce((acc, t) => acc + t.valor, 0);
    const totalPendentes = transacoes.filter(t => t.status === 'pendente').length;
    const vencidos = transacoes.filter(t => {
      if (t.status !== 'pendente') return false;
      const venc = new Date(t.data_vencimento + 'T00:00:00');
      return venc < hoje;
    }).length;

    return {
      receitasMes,
      despesasMes,
      receitasPagas,
      despesasPagas,
      saldoMes: receitasMes - despesasMes,
      saldoRealizado: receitasPagas - despesasPagas,
      totalPendentes,
      vencidos
    };
  };

  const metricas = calcularMetricas();

  // Filtrar transações
  const filtrarTransacoes = () => {
    let resultado = [...transacoes];

    if (filtros.tipo !== 'todos') {
      resultado = resultado.filter(t => t.tipo === filtros.tipo);
    }

    if (filtros.status !== 'todos') {
      resultado = resultado.filter(t => t.status === filtros.status);
    }

    if (filtros.categoria !== 'todas') {
      resultado = resultado.filter(t => t.categoria === filtros.categoria);
    }

    if (filtros.periodo !== 'todos') {
      const hoje = new Date();
      resultado = resultado.filter(t => {
        const dataVenc = new Date(t.data_vencimento + 'T00:00:00');
        if (filtros.periodo === 'mes_atual') {
          return dataVenc.getMonth() === hoje.getMonth() && dataVenc.getFullYear() === hoje.getFullYear();
        } else if (filtros.periodo === 'proximo_mes') {
          const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
          return dataVenc.getMonth() === proximoMes.getMonth() && dataVenc.getFullYear() === proximoMes.getFullYear();
        }
        return true;
      });
    }

    return resultado.sort((a, b) => new Date(a.data_vencimento) - new Date(b.data_vencimento));
  };

  const transacoesFiltradas = filtrarTransacoes();

  // Handlers de CRUD
  const handleOpenModal = (mode, transacao = null) => {
    setModalMode(mode);
    if (mode === 'edit' && transacao) {
      setSelectedTransacao(transacao);
      setFormData({
        tipo: transacao.tipo,
        descricao: transacao.descricao,
        valor: transacao.valor.toString(),
        data_vencimento: transacao.data_vencimento,
        data_pagamento: transacao.data_pagamento || '',
        status: transacao.status,
        categoria: transacao.categoria,
        forma_pagamento: transacao.forma_pagamento || '',
        banco: transacao.banco || '',
        final_cartao: transacao.final_cartao || '',
        conta: transacao.conta || '',
        numero_documento: transacao.numero_documento || '',
        observacoes: transacao.observacoes || '',
        entidade_nome: transacao.entidade_nome || ''
      });
    } else {
      setSelectedTransacao(null);
      setFormData({
        tipo: activeTab === 'despesas' ? 'despesa' : 'receita',
        descricao: '',
        valor: '',
        data_vencimento: '',
        data_pagamento: '',
        status: 'pendente',
        categoria: '',
        forma_pagamento: '',
        banco: '',
        final_cartao: '',
        conta: '',
        numero_documento: '',
        observacoes: '',
        entidade_nome: ''
      });
    }
    setShowModal(true);
  };

  const handleSaveTransacao = () => {
    if (!formData.descricao || !formData.valor || !formData.data_vencimento) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const novaTransacao = {
      ...formData,
      valor: parseMoeda(formData.valor),
      id: modalMode === 'edit' ? selectedTransacao.id : Date.now().toString(),
      created_at: modalMode === 'edit' ? selectedTransacao.created_at : new Date().toISOString().split('T')[0]
    };

    if (modalMode === 'edit') {
      const updated = transacoes.map(t => t.id === selectedTransacao.id ? novaTransacao : t);
      saveTransacoes(updated);
    } else {
      saveTransacoes([...transacoes, novaTransacao]);
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      saveTransacoes(transacoes.filter(t => t.id !== id));
    }
  };

  const handleMarcarPago = (transacao) => {
    const updated = transacoes.map(t => {
      if (t.id === transacao.id) {
        return {
          ...t,
          status: 'pago',
          data_pagamento: new Date().toISOString().split('T')[0]
        };
      }
      return t;
    });
    saveTransacoes(updated);
  };

  // Handler para documentos
  const handleSaveDocumento = () => {
    if (!documentoForm.descricao) {
      alert('Preencha a descrição do documento');
      return;
    }

    const novoDocumento = {
      ...documentoForm,
      valor: parseMoeda(documentoForm.valor),
      id: Date.now().toString(),
      transacao_id: selectedTransacao?.id || null,
      created_at: new Date().toISOString().split('T')[0]
    };

    saveDocumentos([...documentos, novoDocumento]);
    setShowDocumentoModal(false);
    setDocumentoForm({
      tipo: 'nota_fiscal',
      numero: '',
      descricao: '',
      data_emissao: '',
      valor: '',
      arquivo: null
    });
  };

  // Handler para contratos
  const handleSaveContrato = () => {
    if (!contratoForm.cliente || !contratoForm.valor_mensal) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const novoContrato = {
      ...contratoForm,
      valor_mensal: parseMoeda(contratoForm.valor_mensal),
      id: modalMode === 'edit' ? selectedContrato.id : Date.now().toString(),
      created_at: modalMode === 'edit' ? selectedContrato.created_at : new Date().toISOString().split('T')[0]
    };

    if (modalMode === 'edit') {
      const updated = contratos.map(c => c.id === selectedContrato.id ? novoContrato : c);
      saveContratos(updated);
    } else {
      saveContratos([...contratos, novoContrato]);
    }

    setShowContratoModal(false);
    setContratoForm({
      cliente: '',
      descricao: '',
      valor_mensal: '',
      data_inicio: '',
      data_fim: '',
      dia_vencimento: '10',
      status: 'ativo'
    });
  };

  // Calculadora de Impostos
  const calcularImpostos = () => {
    const faturamento12 = parseMoeda(calcImpostos.faturamento12Meses) || 0;
    const faturamentoMes = parseMoeda(calcImpostos.faturamentoMes) || 0;
    
    if (faturamento12 <= 0 || faturamentoMes <= 0) {
      alert('Preencha os valores de faturamento');
      return;
    }

    let resultado = {
      faturamentoMes,
      faturamento12Meses: faturamento12,
      impostos: {}
    };

    if (calcImpostos.regime.startsWith('simples')) {
      // Cálculo Simples Nacional
      const anexo = calcImpostos.regime === 'simples_anexoIII' ? tabelasSimples.anexoIII : tabelasSimples.anexoV;
      const faixa = anexo.faixas.find(f => faturamento12 <= f.ate) || anexo.faixas[anexo.faixas.length - 1];
      
      const aliquotaEfetiva = ((faturamento12 * faixa.aliquota / 100) - faixa.deducao) / faturamento12 * 100;
      const valorImposto = faturamentoMes * (aliquotaEfetiva / 100);

      resultado.impostos = {
        regime: 'Simples Nacional',
        anexo: calcImpostos.regime === 'simples_anexoIII' ? 'Anexo III' : 'Anexo V',
        aliquotaNominal: faixa.aliquota,
        aliquotaEfetiva: aliquotaEfetiva.toFixed(2),
        valorDAS: valorImposto,
        total: valorImposto
      };
    } else if (calcImpostos.regime === 'lucro_presumido') {
      // Cálculo Lucro Presumido (serviços)
      const baseIRPJ = faturamentoMes * 0.32; // 32% para serviços
      const irpj = baseIRPJ * 0.15;
      const adicionalIR = baseIRPJ > 20000 ? (baseIRPJ - 20000) * 0.10 : 0;
      const csll = baseIRPJ * 0.09;
      const pis = faturamentoMes * 0.0065;
      const cofins = faturamentoMes * 0.03;
      const iss = faturamentoMes * (parseFloat(calcImpostos.aliquotaISS) / 100);

      resultado.impostos = {
        regime: 'Lucro Presumido',
        irpj,
        adicionalIR,
        csll,
        pis,
        cofins,
        iss,
        total: irpj + adicionalIR + csll + pis + cofins + iss
      };
    } else {
      // MEI
      resultado.impostos = {
        regime: 'MEI',
        das: 70.60, // Valor aproximado para serviços
        total: 70.60
      };
    }

    setResultadoImpostos(resultado);
  };

  // Calcular Balanço
  const calcularBalanco = () => {
    const transacoesPeriodo = transacoes.filter(t => {
      const data = new Date(t.data_vencimento + 'T00:00:00');
      return data.getMonth() + 1 === periodoBalanco.mes && data.getFullYear() === periodoBalanco.ano;
    });

    const receitas = transacoesPeriodo.filter(t => t.tipo === 'receita');
    const despesas = transacoesPeriodo.filter(t => t.tipo === 'despesa');

    const totalReceitas = receitas.reduce((acc, t) => acc + t.valor, 0);
    const totalDespesas = despesas.reduce((acc, t) => acc + t.valor, 0);
    const receitasRealizadas = receitas.filter(t => t.status === 'pago').reduce((acc, t) => acc + t.valor, 0);
    const despesasRealizadas = despesas.filter(t => t.status === 'pago').reduce((acc, t) => acc + t.valor, 0);

    // Agrupar por categoria
    const receitasPorCategoria = {};
    receitas.forEach(t => {
      const cat = getCategoriaNome(t.categoria, 'receita');
      receitasPorCategoria[cat] = (receitasPorCategoria[cat] || 0) + t.valor;
    });

    const despesasPorCategoria = {};
    despesas.forEach(t => {
      const cat = getCategoriaNome(t.categoria, 'despesa');
      despesasPorCategoria[cat] = (despesasPorCategoria[cat] || 0) + t.valor;
    });

    return {
      totalReceitas,
      totalDespesas,
      receitasRealizadas,
      despesasRealizadas,
      lucroLiquido: totalReceitas - totalDespesas,
      lucroRealizado: receitasRealizadas - despesasRealizadas,
      receitasPorCategoria,
      despesasPorCategoria,
      margemLucro: totalReceitas > 0 ? ((totalReceitas - totalDespesas) / totalReceitas * 100).toFixed(2) : 0
    };
  };

  // Fluxo de Caixa Projetado
  const calcularFluxoCaixa = () => {
    const hoje = new Date();
    const meses = [];
    
    for (let i = 0; i < 6; i++) {
      const mes = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
      const transacoesMes = transacoes.filter(t => {
        const data = new Date(t.data_vencimento + 'T00:00:00');
        return data.getMonth() === mes.getMonth() && data.getFullYear() === mes.getFullYear();
      });

      // Adicionar receitas de contratos ativos
      const receitasContratos = contratos
        .filter(c => c.status === 'ativo')
        .filter(c => {
          const inicio = new Date(c.data_inicio + 'T00:00:00');
          const fim = c.data_fim ? new Date(c.data_fim + 'T00:00:00') : new Date(2099, 11, 31);
          return mes >= inicio && mes <= fim;
        })
        .reduce((acc, c) => acc + c.valor_mensal, 0);

      const receitas = transacoesMes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0) + receitasContratos;
      const despesas = transacoesMes.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + t.valor, 0);

      meses.push({
        mes: mes.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        receitas,
        despesas,
        saldo: receitas - despesas
      });
    }

    return meses;
  };

  // Verificar acesso
  if (!isSuperAdmin) {
    return (
      <div className="admin-financeiro acesso-negado">
        <div className="acesso-negado-content">
          <Icons.AlertCircle />
          <h2>Acesso Restrito</h2>
          <p>Esta área é restrita a Super Administradores.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-financeiro loading">
        <div className="spinner"></div>
        <p>Carregando dados financeiros...</p>
      </div>
    );
  }

  const balanco = calcularBalanco();
  const fluxoCaixa = calcularFluxoCaixa();

  // Menu de navegação lateral
  const menuItems = [
    { id: 'dashboard', icon: <Icons.PieChart />, label: 'Dashboard' },
    { id: 'receitas', icon: <Icons.TrendingUp />, label: 'Receitas' },
    { id: 'despesas', icon: <Icons.TrendingDown />, label: 'Despesas' },
    { id: 'notas_fiscais', icon: <Icons.FileText />, label: 'Notas Fiscais' },
    { id: 'calculadora', icon: <Icons.Calculator />, label: 'Calculadora de Impostos' },
    { id: 'balancos', icon: <Icons.BarChart />, label: 'Balanços' },
    { id: 'relatorios', icon: <Icons.Clipboard />, label: 'Relatórios' },
    { id: 'fluxo_caixa', icon: <Icons.Activity />, label: 'Fluxo de Caixa' },
    { id: 'contratos', icon: <Icons.Briefcase />, label: 'Contratos' },
    { id: 'backups', icon: <Icons.Database />, label: 'Backups' }
  ];

  return (
    <div className="admin-financeiro">
      {/* Header */}
      <div className="financeiro-header">
        <div className="header-title">
          <Icons.DollarSign />
          <h1>Gestão Financeira</h1>
          <span className="header-subtitle">Controle completo de finanças, impostos e documentos fiscais</span>
        </div>
        <button className="btn-nova-transacao" onClick={() => handleOpenModal('create')}>
          <Icons.Plus />
          Nova Transação
        </button>
      </div>

      {/* Layout com menu lateral */}
      <div className="financeiro-layout">
        {/* Menu Lateral */}
        <nav className="financeiro-sidebar">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(item.id); setActiveSubTab(null); }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Conteúdo Principal */}
        <main className="financeiro-content">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="financeiro-dashboard">
              <h2>Visão Geral</h2>
              
              {/* Cards de Métricas */}
              <div className="metricas-grid">
                <div className="metrica-card receitas">
                  <div className="metrica-icon">
                    <Icons.TrendingUp />
                  </div>
                  <div className="metrica-info">
                    <span className="metrica-label">Receitas do Mês</span>
                    <span className="metrica-valor">{formatarMoeda(metricas.receitasMes)}</span>
                    <span className="metrica-sub">Realizado: {formatarMoeda(metricas.receitasPagas)}</span>
                  </div>
                </div>

                <div className="metrica-card despesas">
                  <div className="metrica-icon">
                    <Icons.TrendingDown />
                  </div>
                  <div className="metrica-info">
                    <span className="metrica-label">Despesas do Mês</span>
                    <span className="metrica-valor">{formatarMoeda(metricas.despesasMes)}</span>
                    <span className="metrica-sub">Realizado: {formatarMoeda(metricas.despesasPagas)}</span>
                  </div>
                </div>

                <div className={`metrica-card saldo ${metricas.saldoMes >= 0 ? 'positivo' : 'negativo'}`}>
                  <div className="metrica-icon">
                    <Icons.DollarSign />
                  </div>
                  <div className="metrica-info">
                    <span className="metrica-label">Saldo Previsto</span>
                    <span className="metrica-valor">{formatarMoeda(metricas.saldoMes)}</span>
                    <span className="metrica-sub">Realizado: {formatarMoeda(metricas.saldoRealizado)}</span>
                  </div>
                </div>

                <div className="metrica-card pendentes">
                  <div className="metrica-icon">
                    <Icons.Calendar />
                  </div>
                  <div className="metrica-info">
                    <span className="metrica-label">Pendentes</span>
                    <span className="metrica-valor">{metricas.totalPendentes}</span>
                    <span className="metrica-sub vencidos">{metricas.vencidos} vencido(s)</span>
                  </div>
                </div>
              </div>

              {/* Últimas Movimentações */}
              <div className="dashboard-section">
                <h3>Últimas Movimentações</h3>
                <div className="ultimas-movimentacoes">
                  {transacoes.slice(0, 5).map(t => (
                    <div key={t.id} className={`movimentacao-item ${t.tipo}`}>
                      <div className="mov-info">
                        <span className="mov-descricao">{t.descricao}</span>
                        <span className="mov-data">{formatarData(t.data_vencimento)}</span>
                      </div>
                      <span className={`mov-valor ${t.tipo}`}>
                        {t.tipo === 'receita' ? '+' : '-'} {formatarMoeda(t.valor)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fluxo de Caixa Resumido */}
              <div className="dashboard-section">
                <h3>Projeção de Fluxo de Caixa</h3>
                <div className="fluxo-resumido">
                  {fluxoCaixa.slice(0, 3).map((mes, idx) => (
                    <div key={idx} className="fluxo-mes-card">
                      <span className="fluxo-mes-nome">{mes.mes}</span>
                      <div className="fluxo-valores">
                        <span className="fluxo-receita">+{formatarMoeda(mes.receitas)}</span>
                        <span className="fluxo-despesa">-{formatarMoeda(mes.despesas)}</span>
                      </div>
                      <span className={`fluxo-saldo ${mes.saldo >= 0 ? 'positivo' : 'negativo'}`}>
                        {formatarMoeda(mes.saldo)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Receitas e Despesas */}
          {(activeTab === 'receitas' || activeTab === 'despesas') && (
            <div className="financeiro-transacoes">
              <div className="transacoes-header">
                <h2>{activeTab === 'receitas' ? 'Receitas' : 'Despesas'}</h2>
                <button 
                  className="btn-nova"
                  onClick={() => {
                    setFormData(prev => ({...prev, tipo: activeTab === 'receitas' ? 'receita' : 'despesa'}));
                    handleOpenModal('create');
                  }}
                >
                  <Icons.Plus />
                  {activeTab === 'receitas' ? 'Nova Receita' : 'Nova Despesa'}
                </button>
              </div>

              {/* Filtros */}
              <div className="filtros-bar">
                <div className="filtro-group">
                  <label>Status</label>
                  <select 
                    value={filtros.status} 
                    onChange={(e) => setFiltros({...filtros, status: e.target.value})}
                  >
                    <option value="todos">Todos</option>
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <div className="filtro-group">
                  <label>Período</label>
                  <select 
                    value={filtros.periodo} 
                    onChange={(e) => setFiltros({...filtros, periodo: e.target.value})}
                  >
                    <option value="todos">Todos</option>
                    <option value="mes_atual">Mês Atual</option>
                    <option value="proximo_mes">Próximo Mês</option>
                  </select>
                </div>
                <div className="filtro-group">
                  <label>Categoria</label>
                  <select 
                    value={filtros.categoria} 
                    onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
                  >
                    <option value="todas">Todas</option>
                    {categoriasPadrao[activeTab === 'receitas' ? 'receita' : 'despesa']?.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tabela */}
              <div className="transacoes-table-container">
                <table className="transacoes-table">
                  <thead>
                    <tr>
                      <th>Descrição</th>
                      <th>Entidade</th>
                      <th>Categoria</th>
                      <th>Vencimento</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transacoesFiltradas
                      .filter(t => t.tipo === (activeTab === 'receitas' ? 'receita' : 'despesa'))
                      .map(transacao => (
                      <tr key={transacao.id}>
                        <td>
                          <div className="transacao-descricao-cell">
                            <span>{transacao.descricao}</span>
                            {transacao.numero_documento && (
                              <small>{transacao.numero_documento}</small>
                            )}
                          </div>
                        </td>
                        <td>{transacao.entidade_nome || '-'}</td>
                        <td>
                          <span 
                            className="categoria-badge"
                            style={{ backgroundColor: getCategoriaCor(transacao.categoria, transacao.tipo) }}
                          >
                            {getCategoriaNome(transacao.categoria, transacao.tipo)}
                          </span>
                        </td>
                        <td>{formatarData(transacao.data_vencimento)}</td>
                        <td className={`valor-cell ${transacao.tipo}`}>
                          {transacao.tipo === 'receita' ? '+' : '-'} {formatarMoeda(transacao.valor)}
                        </td>
                        <td>
                          <span className={`status-badge ${getStatusClass(transacao.status, transacao.data_vencimento)}`}>
                            {getStatusLabel(transacao.status, transacao.data_vencimento)}
                          </span>
                        </td>
                        <td>
                          <div className="acoes-cell">
                            {transacao.status === 'pendente' && (
                              <button 
                                className="btn-acao confirmar"
                                onClick={() => handleMarcarPago(transacao)}
                                title="Marcar como Pago"
                              >
                                <Icons.Check />
                              </button>
                            )}
                            <button 
                              className="btn-acao editar"
                              onClick={() => handleOpenModal('edit', transacao)}
                              title="Editar"
                            >
                              <Icons.Edit />
                            </button>
                            <button 
                              className="btn-acao excluir"
                              onClick={() => handleDelete(transacao.id)}
                              title="Excluir"
                            >
                              <Icons.Trash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {transacoesFiltradas.filter(t => t.tipo === (activeTab === 'receitas' ? 'receita' : 'despesa')).length === 0 && (
                  <div className="empty-state">
                    <Icons.FileText />
                    <p>Nenhuma transação encontrada</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notas Fiscais */}
          {activeTab === 'notas_fiscais' && (
            <div className="financeiro-notas">
              <div className="notas-header">
                <h2>Notas Fiscais e Documentos</h2>
                <button 
                  className="btn-upload"
                  onClick={() => { setSelectedTransacao(null); setShowDocumentoModal(true); }}
                >
                  <Icons.Upload />
                  Upload de Documento
                </button>
              </div>

              <div className="notas-categorias">
                <div className="categoria-section">
                  <h3>Notas Fiscais de Serviço</h3>
                  <div className="documentos-grid">
                    {documentos.filter(d => d.tipo === 'nota_fiscal').map(doc => (
                      <div key={doc.id} className="documento-card">
                        <div className="documento-icon">
                          <Icons.FileText />
                        </div>
                        <div className="documento-info">
                          <span className="documento-numero">{doc.numero || 'Sem número'}</span>
                          <span className="documento-descricao">{doc.descricao}</span>
                          <span className="documento-data">{formatarData(doc.data_emissao)}</span>
                          {doc.valor && <span className="documento-valor">{formatarMoeda(doc.valor)}</span>}
                        </div>
                        <div className="documento-acoes">
                          <button className="btn-acao" title="Visualizar">
                            <Icons.Eye />
                          </button>
                          <button className="btn-acao" title="Download">
                            <Icons.Download />
                          </button>
                        </div>
                      </div>
                    ))}
                    {documentos.filter(d => d.tipo === 'nota_fiscal').length === 0 && (
                      <div className="empty-docs">
                        <p>Nenhuma nota fiscal cadastrada</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="categoria-section">
                  <h3>Recibos</h3>
                  <div className="documentos-grid">
                    {documentos.filter(d => d.tipo === 'recibo').map(doc => (
                      <div key={doc.id} className="documento-card">
                        <div className="documento-icon">
                          <Icons.FileText />
                        </div>
                        <div className="documento-info">
                          <span className="documento-numero">{doc.numero || 'Sem número'}</span>
                          <span className="documento-descricao">{doc.descricao}</span>
                          <span className="documento-data">{formatarData(doc.data_emissao)}</span>
                        </div>
                      </div>
                    ))}
                    {documentos.filter(d => d.tipo === 'recibo').length === 0 && (
                      <div className="empty-docs">
                        <p>Nenhum recibo cadastrado</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="categoria-section">
                  <h3>Comprovantes</h3>
                  <div className="documentos-grid">
                    {documentos.filter(d => d.tipo === 'comprovante').map(doc => (
                      <div key={doc.id} className="documento-card">
                        <div className="documento-icon">
                          <Icons.FileText />
                        </div>
                        <div className="documento-info">
                          <span className="documento-descricao">{doc.descricao}</span>
                          <span className="documento-data">{formatarData(doc.data_emissao)}</span>
                        </div>
                      </div>
                    ))}
                    {documentos.filter(d => d.tipo === 'comprovante').length === 0 && (
                      <div className="empty-docs">
                        <p>Nenhum comprovante cadastrado</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calculadora de Impostos */}
          {activeTab === 'calculadora' && (
            <div className="financeiro-calculadora">
              <h2>Calculadora de Impostos</h2>
              <p className="calculadora-desc">Calcule os impostos devidos com base no regime tributário da empresa</p>

              <div className="calculadora-form">
                <div className="calc-row">
                  <div className="calc-field">
                    <label>Regime Tributário</label>
                    <select 
                      value={calcImpostos.regime}
                      onChange={(e) => setCalcImpostos({...calcImpostos, regime: e.target.value})}
                    >
                      <option value="mei">MEI</option>
                      <option value="simples_anexoIII">Simples Nacional - Anexo III (Serviços)</option>
                      <option value="simples_anexoV">Simples Nacional - Anexo V (Serviços)</option>
                      <option value="lucro_presumido">Lucro Presumido</option>
                    </select>
                  </div>
                </div>

                <div className="calc-row">
                  <div className="calc-field">
                    <label>Faturamento dos Últimos 12 Meses (R$)</label>
                    <input 
                      type="text"
                      inputMode="numeric"
                      placeholder="Ex: 500.000,00"
                      value={calcImpostos.faturamento12Meses}
                      onChange={(e) => handleValorChange(e, setCalcImpostos, 'faturamento12Meses')}
                    />
                  </div>
                  <div className="calc-field">
                    <label>Faturamento do Mês Atual (R$)</label>
                    <input 
                      type="text"
                      inputMode="numeric"
                      placeholder="Ex: 50.000,00"
                      value={calcImpostos.faturamentoMes}
                      onChange={(e) => handleValorChange(e, setCalcImpostos, 'faturamentoMes')}
                    />
                  </div>
                </div>

                {calcImpostos.regime === 'lucro_presumido' && (
                  <div className="calc-row">
                    <div className="calc-field">
                      <label>Alíquota ISS (%)</label>
                      <select 
                        value={calcImpostos.aliquotaISS}
                        onChange={(e) => setCalcImpostos({...calcImpostos, aliquotaISS: e.target.value})}
                      >
                        <option value="2">2%</option>
                        <option value="3">3%</option>
                        <option value="4">4%</option>
                        <option value="5">5%</option>
                      </select>
                    </div>
                  </div>
                )}

                <button className="btn-calcular" onClick={calcularImpostos}>
                  <Icons.Calculator />
                  Calcular Impostos
                </button>
              </div>

              {resultadoImpostos && (
                <div className="calculadora-resultado">
                  <h3>Resultado do Cálculo</h3>
                  <div className="resultado-header">
                    <span className="regime-nome">{resultadoImpostos.impostos.regime}</span>
                    {resultadoImpostos.impostos.anexo && (
                      <span className="anexo-badge">{resultadoImpostos.impostos.anexo}</span>
                    )}
                  </div>

                  <div className="resultado-grid">
                    {resultadoImpostos.impostos.regime === 'Simples Nacional' && (
                      <>
                        <div className="resultado-item">
                          <span className="item-label">Alíquota Nominal</span>
                          <span className="item-valor">{resultadoImpostos.impostos.aliquotaNominal}%</span>
                        </div>
                        <div className="resultado-item">
                          <span className="item-label">Alíquota Efetiva</span>
                          <span className="item-valor">{resultadoImpostos.impostos.aliquotaEfetiva}%</span>
                        </div>
                        <div className="resultado-item destaque">
                          <span className="item-label">Valor DAS</span>
                          <span className="item-valor">{formatarMoeda(resultadoImpostos.impostos.valorDAS)}</span>
                        </div>
                      </>
                    )}

                    {resultadoImpostos.impostos.regime === 'Lucro Presumido' && (
                      <>
                        <div className="resultado-item">
                          <span className="item-label">IRPJ</span>
                          <span className="item-valor">{formatarMoeda(resultadoImpostos.impostos.irpj)}</span>
                        </div>
                        <div className="resultado-item">
                          <span className="item-label">Adicional IR</span>
                          <span className="item-valor">{formatarMoeda(resultadoImpostos.impostos.adicionalIR)}</span>
                        </div>
                        <div className="resultado-item">
                          <span className="item-label">CSLL</span>
                          <span className="item-valor">{formatarMoeda(resultadoImpostos.impostos.csll)}</span>
                        </div>
                        <div className="resultado-item">
                          <span className="item-label">PIS</span>
                          <span className="item-valor">{formatarMoeda(resultadoImpostos.impostos.pis)}</span>
                        </div>
                        <div className="resultado-item">
                          <span className="item-label">COFINS</span>
                          <span className="item-valor">{formatarMoeda(resultadoImpostos.impostos.cofins)}</span>
                        </div>
                        <div className="resultado-item">
                          <span className="item-label">ISS</span>
                          <span className="item-valor">{formatarMoeda(resultadoImpostos.impostos.iss)}</span>
                        </div>
                      </>
                    )}

                    {resultadoImpostos.impostos.regime === 'MEI' && (
                      <div className="resultado-item">
                        <span className="item-label">DAS-MEI (Serviços)</span>
                        <span className="item-valor">{formatarMoeda(resultadoImpostos.impostos.das)}</span>
                      </div>
                    )}

                    <div className="resultado-item total">
                      <span className="item-label">Total de Impostos</span>
                      <span className="item-valor">{formatarMoeda(resultadoImpostos.impostos.total)}</span>
                    </div>
                  </div>

                  <div className="resultado-info">
                    <p>* Valores calculados com base nas tabelas vigentes. Consulte um contador para valores exatos.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Balanços */}
          {activeTab === 'balancos' && (
            <div className="financeiro-balancos">
              <h2>Balanço Financeiro</h2>

              <div className="balanco-periodo">
                <label>Período:</label>
                <select 
                  value={periodoBalanco.mes}
                  onChange={(e) => setPeriodoBalanco({...periodoBalanco, mes: parseInt(e.target.value)})}
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i+1} value={i+1}>
                      {new Date(2026, i, 1).toLocaleDateString('pt-BR', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <select 
                  value={periodoBalanco.ano}
                  onChange={(e) => setPeriodoBalanco({...periodoBalanco, ano: parseInt(e.target.value)})}
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>

              <div className="balanco-resumo">
                <div className="balanco-card receitas">
                  <h3>Receitas</h3>
                  <div className="balanco-valor">{formatarMoeda(balanco.totalReceitas)}</div>
                  <div className="balanco-realizado">Realizado: {formatarMoeda(balanco.receitasRealizadas)}</div>
                </div>
                <div className="balanco-card despesas">
                  <h3>Despesas</h3>
                  <div className="balanco-valor">{formatarMoeda(balanco.totalDespesas)}</div>
                  <div className="balanco-realizado">Realizado: {formatarMoeda(balanco.despesasRealizadas)}</div>
                </div>
                <div className={`balanco-card resultado ${balanco.lucroLiquido >= 0 ? 'positivo' : 'negativo'}`}>
                  <h3>Resultado</h3>
                  <div className="balanco-valor">{formatarMoeda(balanco.lucroLiquido)}</div>
                  <div className="balanco-margem">Margem: {balanco.margemLucro}%</div>
                </div>
              </div>

              <div className="balanco-detalhes">
                <div className="balanco-coluna">
                  <h3>Receitas por Categoria</h3>
                  <div className="categoria-lista">
                    {Object.entries(balanco.receitasPorCategoria).map(([cat, valor]) => (
                      <div key={cat} className="categoria-item">
                        <span className="cat-nome">{cat}</span>
                        <span className="cat-valor">{formatarMoeda(valor)}</span>
                      </div>
                    ))}
                    {Object.keys(balanco.receitasPorCategoria).length === 0 && (
                      <p className="empty-msg">Nenhuma receita no período</p>
                    )}
                  </div>
                </div>
                <div className="balanco-coluna">
                  <h3>Despesas por Categoria</h3>
                  <div className="categoria-lista">
                    {Object.entries(balanco.despesasPorCategoria).map(([cat, valor]) => (
                      <div key={cat} className="categoria-item">
                        <span className="cat-nome">{cat}</span>
                        <span className="cat-valor">{formatarMoeda(valor)}</span>
                      </div>
                    ))}
                    {Object.keys(balanco.despesasPorCategoria).length === 0 && (
                      <p className="empty-msg">Nenhuma despesa no período</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="balanco-acoes">
                <button className="btn-exportar">
                  <Icons.Download />
                  Exportar PDF
                </button>
                <button className="btn-imprimir">
                  <Icons.Printer />
                  Imprimir
                </button>
              </div>
            </div>
          )}

          {/* Relatórios */}
          {activeTab === 'relatorios' && (
            <div className="financeiro-relatorios">
              <h2>Relatórios Financeiros</h2>

              <div className="relatorios-grid">
                <div className="relatorio-card">
                  <div className="relatorio-icon">
                    <Icons.TrendingUp />
                  </div>
                  <h3>Relatório de Receitas</h3>
                  <p>Análise detalhada de todas as receitas por período, categoria e cliente.</p>
                  <button className="btn-gerar">
                    <Icons.FileText />
                    Gerar Relatório
                  </button>
                </div>

                <div className="relatorio-card">
                  <div className="relatorio-icon">
                    <Icons.TrendingDown />
                  </div>
                  <h3>Relatório de Despesas</h3>
                  <p>Análise detalhada de todas as despesas por período, categoria e fornecedor.</p>
                  <button className="btn-gerar">
                    <Icons.FileText />
                    Gerar Relatório
                  </button>
                </div>

                <div className="relatorio-card">
                  <div className="relatorio-icon">
                    <Icons.BarChart />
                  </div>
                  <h3>DRE - Demonstrativo de Resultados</h3>
                  <p>Demonstrativo de Resultados do Exercício com receitas, custos e lucro.</p>
                  <button className="btn-gerar">
                    <Icons.FileText />
                    Gerar Relatório
                  </button>
                </div>

                <div className="relatorio-card">
                  <div className="relatorio-icon">
                    <Icons.Activity />
                  </div>
                  <h3>Fluxo de Caixa</h3>
                  <p>Relatório completo de entradas e saídas de caixa por período.</p>
                  <button className="btn-gerar">
                    <Icons.FileText />
                    Gerar Relatório
                  </button>
                </div>

                <div className="relatorio-card">
                  <div className="relatorio-icon">
                    <Icons.Percent />
                  </div>
                  <h3>Relatório de Impostos</h3>
                  <p>Resumo dos impostos pagos e a pagar por período.</p>
                  <button className="btn-gerar">
                    <Icons.FileText />
                    Gerar Relatório
                  </button>
                </div>

                <div className="relatorio-card">
                  <div className="relatorio-icon">
                    <Icons.Briefcase />
                  </div>
                  <h3>Relatório de Contratos</h3>
                  <p>Análise de contratos ativos, receitas recorrentes e vencimentos.</p>
                  <button className="btn-gerar">
                    <Icons.FileText />
                    Gerar Relatório
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Fluxo de Caixa */}
          {activeTab === 'fluxo_caixa' && (
            <div className="financeiro-fluxo">
              <h2>Fluxo de Caixa Projetado</h2>
              <p className="fluxo-desc">Projeção de entradas e saídas para os próximos 6 meses</p>

              <div className="fluxo-grid">
                {fluxoCaixa.map((mes, idx) => (
                  <div key={idx} className="fluxo-card">
                    <div className="fluxo-mes">{mes.mes}</div>
                    <div className="fluxo-detalhe">
                      <div className="fluxo-linha receita">
                        <span>Receitas</span>
                        <span>+{formatarMoeda(mes.receitas)}</span>
                      </div>
                      <div className="fluxo-linha despesa">
                        <span>Despesas</span>
                        <span>-{formatarMoeda(mes.despesas)}</span>
                      </div>
                      <div className={`fluxo-linha saldo ${mes.saldo >= 0 ? 'positivo' : 'negativo'}`}>
                        <span>Saldo</span>
                        <span>{formatarMoeda(mes.saldo)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="fluxo-acoes">
                <button className="btn-atualizar">
                  <Icons.RefreshCw />
                  Atualizar Projeção
                </button>
                <button className="btn-exportar">
                  <Icons.Download />
                  Exportar
                </button>
              </div>
            </div>
          )}

          {/* Contratos */}
          {activeTab === 'contratos' && (
            <div className="financeiro-contratos">
              <div className="contratos-header">
                <h2>Gestão de Contratos</h2>
                <button 
                  className="btn-novo"
                  onClick={() => {
                    setModalMode('create');
                    setSelectedContrato(null);
                    setContratoForm({
                      cliente: '',
                      descricao: '',
                      valor_mensal: '',
                      data_inicio: '',
                      data_fim: '',
                      dia_vencimento: '10',
                      status: 'ativo'
                    });
                    setShowContratoModal(true);
                  }}
                >
                  <Icons.Plus />
                  Novo Contrato
                </button>
              </div>

              <div className="contratos-resumo">
                <div className="resumo-card">
                  <span className="resumo-label">Contratos Ativos</span>
                  <span className="resumo-valor">{contratos.filter(c => c.status === 'ativo').length}</span>
                </div>
                <div className="resumo-card">
                  <span className="resumo-label">Receita Recorrente Mensal</span>
                  <span className="resumo-valor">
                    {formatarMoeda(contratos.filter(c => c.status === 'ativo').reduce((acc, c) => acc + c.valor_mensal, 0))}
                  </span>
                </div>
              </div>

              <div className="contratos-table-container">
                <table className="contratos-table">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Descrição</th>
                      <th>Valor Mensal</th>
                      <th>Vigência</th>
                      <th>Dia Venc.</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contratos.map(contrato => (
                      <tr key={contrato.id}>
                        <td>{contrato.cliente}</td>
                        <td>{contrato.descricao}</td>
                        <td>{formatarMoeda(contrato.valor_mensal)}</td>
                        <td>
                          {formatarData(contrato.data_inicio)} - {contrato.data_fim ? formatarData(contrato.data_fim) : 'Indeterminado'}
                        </td>
                        <td>Dia {contrato.dia_vencimento}</td>
                        <td>
                          <span className={`status-badge ${contrato.status}`}>
                            {contrato.status === 'ativo' ? 'Ativo' : contrato.status === 'pausado' ? 'Pausado' : 'Encerrado'}
                          </span>
                        </td>
                        <td>
                          <div className="acoes-cell">
                            <button 
                              className="btn-acao editar"
                              onClick={() => {
                                setModalMode('edit');
                                setSelectedContrato(contrato);
                                setContratoForm({
                                  cliente: contrato.cliente,
                                  descricao: contrato.descricao,
                                  valor_mensal: contrato.valor_mensal.toString(),
                                  data_inicio: contrato.data_inicio,
                                  data_fim: contrato.data_fim || '',
                                  dia_vencimento: contrato.dia_vencimento,
                                  status: contrato.status
                                });
                                setShowContratoModal(true);
                              }}
                              title="Editar"
                            >
                              <Icons.Edit />
                            </button>
                            <button 
                              className="btn-acao excluir"
                              onClick={() => {
                                if (window.confirm('Tem certeza que deseja excluir este contrato?')) {
                                  saveContratos(contratos.filter(c => c.id !== contrato.id));
                                }
                              }}
                              title="Excluir"
                            >
                              <Icons.Trash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {contratos.length === 0 && (
                  <div className="empty-state">
                    <Icons.Briefcase />
                    <p>Nenhum contrato cadastrado</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Backups */}
          {activeTab === 'backups' && (
            <div className="financeiro-backups">
              <div className="backups-header">
                <h2>Gerenciamento de Dados</h2>
                <div className="backups-actions">
                  <button 
                    className="btn-backup"
                    onClick={() => {
                      setBackupNome('');
                      setShowBackupModal(true);
                    }}
                  >
                    <Icons.Save />
                    Criar Backup
                  </button>
                  <button 
                    className="btn-zerar"
                    onClick={() => setShowConfirmZerar(true)}
                  >
                    <Icons.Trash />
                    Zerar Dados
                  </button>
                </div>
              </div>

              {/* Resumo dos Dados Atuais */}
              <div className="dados-atuais-resumo">
                <h3>Dados Atuais</h3>
                <div className="resumo-grid">
                  <div className="resumo-item">
                    <span className="resumo-numero">{transacoes.length}</span>
                    <span className="resumo-label">Transações</span>
                  </div>
                  <div className="resumo-item receita">
                    <span className="resumo-numero">{formatarMoeda(transacoes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0))}</span>
                    <span className="resumo-label">Total Receitas</span>
                  </div>
                  <div className="resumo-item despesa">
                    <span className="resumo-numero">{formatarMoeda(transacoes.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + t.valor, 0))}</span>
                    <span className="resumo-label">Total Despesas</span>
                  </div>
                  <div className="resumo-item">
                    <span className="resumo-numero">{documentos.length}</span>
                    <span className="resumo-label">Documentos</span>
                  </div>
                  <div className="resumo-item">
                    <span className="resumo-numero">{contratos.length}</span>
                    <span className="resumo-label">Contratos</span>
                  </div>
                </div>
              </div>

              {/* Lista de Backups */}
              <div className="backups-lista">
                <h3>Backups Salvos ({backups.length})</h3>
                {backups.length === 0 ? (
                  <div className="empty-state">
                    <Icons.Database />
                    <p>Nenhum backup salvo</p>
                    <small>Crie um backup para guardar seus dados financeiros</small>
                  </div>
                ) : (
                  <div className="backups-grid">
                    {backups.sort((a, b) => new Date(b.data) - new Date(a.data)).map(backup => (
                      <div key={backup.id} className="backup-card">
                        <div className="backup-header">
                          <div className="backup-info">
                            <h4>{backup.nome}</h4>
                            <span className="backup-data">
                              {new Date(backup.data).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <Icons.Archive />
                        </div>
                        <div className="backup-resumo">
                          <div className="backup-stat">
                            <span className="stat-valor">{backup.resumo.totalTransacoes}</span>
                            <span className="stat-label">Transações</span>
                          </div>
                          <div className="backup-stat receita">
                            <span className="stat-valor">{formatarMoeda(backup.resumo.totalReceitas)}</span>
                            <span className="stat-label">Receitas</span>
                          </div>
                          <div className="backup-stat despesa">
                            <span className="stat-valor">{formatarMoeda(backup.resumo.totalDespesas)}</span>
                            <span className="stat-label">Despesas</span>
                          </div>
                        </div>
                        <div className="backup-actions">
                          <button 
                            className="btn-restaurar"
                            onClick={() => {
                              if (window.confirm(`Deseja restaurar o backup "${backup.nome}"? Os dados atuais serão substituídos.`)) {
                                restaurarBackup(backup.id);
                                alert('Backup restaurado com sucesso!');
                              }
                            }}
                            title="Restaurar este backup"
                          >
                            <Icons.RotateCcw />
                            Restaurar
                          </button>
                          <button 
                            className="btn-exportar"
                            onClick={() => exportarBackupJSON(backup.id)}
                            title="Exportar como JSON"
                          >
                            <Icons.Download />
                            Exportar
                          </button>
                          <button 
                            className="btn-excluir-backup"
                            onClick={() => {
                              if (window.confirm(`Deseja excluir o backup "${backup.nome}"?`)) {
                                excluirBackup(backup.id);
                              }
                            }}
                            title="Excluir backup"
                          >
                            <Icons.Trash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal de Criar Backup */}
      {showBackupModal && (
        <div className="modal-overlay" onClick={() => setShowBackupModal(false)}>
          <div className="modal-content modal-backup" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Criar Backup</h2>
              <button className="btn-fechar" onClick={() => setShowBackupModal(false)}>
                <Icons.X />
              </button>
            </div>
            <div className="modal-body">
              <p className="backup-info-text">
                Será criado um backup com todos os dados financeiros atuais:
              </p>
              <ul className="backup-info-list">
                <li><strong>{transacoes.length}</strong> transações</li>
                <li><strong>{documentos.length}</strong> documentos</li>
                <li><strong>{contratos.length}</strong> contratos</li>
              </ul>
              <div className="form-group">
                <label>Nome do Backup *</label>
                <input 
                  type="text"
                  value={backupNome}
                  onChange={(e) => setBackupNome(e.target.value)}
                  placeholder="Ex: Contabilidade Teste, Fechamento Janeiro..."
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancelar" onClick={() => setShowBackupModal(false)}>
                Cancelar
              </button>
              <button 
                className="btn-salvar"
                onClick={() => {
                  if (!backupNome.trim()) {
                    alert('Digite um nome para o backup');
                    return;
                  }
                  criarBackup(backupNome.trim());
                  setShowBackupModal(false);
                  alert('Backup criado com sucesso!');
                }}
              >
                <Icons.Save />
                Criar Backup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação para Zerar Dados */}
      {showConfirmZerar && (
        <div className="modal-overlay" onClick={() => setShowConfirmZerar(false)}>
          <div className="modal-content modal-confirmar-zerar" onClick={e => e.stopPropagation()}>
            <div className="modal-header modal-header-danger">
              <h2>Zerar Todos os Dados</h2>
              <button className="btn-fechar" onClick={() => setShowConfirmZerar(false)}>
                <Icons.X />
              </button>
            </div>
            <div className="modal-body">
              <div className="warning-icon">
                <Icons.AlertCircle />
              </div>
              <p className="warning-text">
                <strong>Atenção!</strong> Esta ação irá excluir permanentemente:
              </p>
              <ul className="dados-a-excluir">
                <li><strong>{transacoes.length}</strong> transações (receitas e despesas)</li>
                <li><strong>{documentos.length}</strong> documentos</li>
                <li><strong>{contratos.length}</strong> contratos</li>
              </ul>
              <p className="recomendacao">
                Recomendamos criar um backup antes de prosseguir.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancelar" onClick={() => setShowConfirmZerar(false)}>
                Cancelar
              </button>
              <button 
                className="btn-backup-antes"
                onClick={() => {
                  setShowConfirmZerar(false);
                  setBackupNome('Backup antes de zerar - ' + new Date().toLocaleDateString('pt-BR'));
                  setShowBackupModal(true);
                }}
              >
                <Icons.Save />
                Criar Backup Primeiro
              </button>
              <button 
                className="btn-confirmar-zerar"
                onClick={() => {
                  zerarDados();
                  setShowConfirmZerar(false);
                  alert('Todos os dados foram zerados com sucesso!');
                }}
              >
                <Icons.Trash />
                Zerar Mesmo Assim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Transação */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'edit' ? 'Editar Transação' : 'Nova Transação'}</h2>
              <button className="btn-fechar" onClick={() => setShowModal(false)}>
                <Icons.X />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo</label>
                  <select 
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value, categoria: ''})}
                  >
                    <option value="receita">Receita</option>
                    <option value="despesa">Despesa</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Descrição *</label>
                <input 
                  type="text"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Ex: Consultoria BI - Cliente X"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Valor (R$) *</label>
                  <input 
                    type="text"
                    inputMode="numeric"
                    value={formData.valor}
                    onChange={(e) => handleValorChange(e, setFormData, 'valor')}
                    placeholder="0,00"
                  />
                </div>
                <div className="form-group">
                  <label>Categoria</label>
                  <select 
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  >
                    <option value="">Selecione...</option>
                    {categoriasPadrao[formData.tipo]?.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data de Vencimento *</label>
                  <input 
                    type="date"
                    value={formData.data_vencimento}
                    onChange={(e) => setFormData({...formData, data_vencimento: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Data de Pagamento</label>
                  <input 
                    type="date"
                    value={formData.data_pagamento}
                    onChange={(e) => setFormData({...formData, data_pagamento: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{formData.tipo === 'receita' ? 'Cliente' : 'Fornecedor'}</label>
                <input 
                  type="text"
                  value={formData.entidade_nome}
                  onChange={(e) => setFormData({...formData, entidade_nome: e.target.value})}
                  placeholder={formData.tipo === 'receita' ? 'Nome do cliente' : 'Nome do fornecedor'}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Forma de Pagamento</label>
                  <select 
                    value={formData.forma_pagamento}
                    onChange={(e) => setFormData({...formData, forma_pagamento: e.target.value, banco: '', final_cartao: '', conta: ''})}
                  >
                    <option value="">Selecione...</option>
                    {formasPagamento.map(fp => (
                      <option key={fp} value={fp}>{fp}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Número do Documento</label>
                  <input 
                    type="text"
                    value={formData.numero_documento}
                    onChange={(e) => setFormData({...formData, numero_documento: e.target.value})}
                    placeholder="Ex: NF-001/2026"
                  />
                </div>
              </div>

              {/* Campos condicionais para Cartão de Crédito/Débito */}
              {(formData.forma_pagamento === 'Cartão de Crédito' || formData.forma_pagamento === 'Cartão de Débito') && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Banco</label>
                    <select 
                      value={formData.banco}
                      onChange={(e) => setFormData({...formData, banco: e.target.value})}
                    >
                      <option value="">Selecione o banco...</option>
                      <option value="Banco do Brasil">Banco do Brasil</option>
                      <option value="Bradesco">Bradesco</option>
                      <option value="Caixa Econômica">Caixa Econômica</option>
                      <option value="Itaú">Itaú</option>
                      <option value="Santander">Santander</option>
                      <option value="Nubank">Nubank</option>
                      <option value="Inter">Inter</option>
                      <option value="C6 Bank">C6 Bank</option>
                      <option value="Sicoob">Sicoob</option>
                      <option value="Sicredi">Sicredi</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Final do Cartão</label>
                    <input 
                      type="text"
                      value={formData.final_cartao}
                      onChange={(e) => {
                        const valor = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setFormData({...formData, final_cartao: valor});
                      }}
                      placeholder="Ex: 1234"
                      maxLength="4"
                    />
                  </div>
                </div>
              )}

              {/* Campos condicionais para PIX, Boleto ou Transferência */}
              {(formData.forma_pagamento === 'PIX' || formData.forma_pagamento === 'Boleto' || formData.forma_pagamento === 'Transferência Bancária') && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Banco</label>
                    <select 
                      value={formData.banco}
                      onChange={(e) => setFormData({...formData, banco: e.target.value})}
                    >
                      <option value="">Selecione o banco...</option>
                      <option value="Banco do Brasil">Banco do Brasil</option>
                      <option value="Bradesco">Bradesco</option>
                      <option value="Caixa Econômica">Caixa Econômica</option>
                      <option value="Itaú">Itaú</option>
                      <option value="Santander">Santander</option>
                      <option value="Nubank">Nubank</option>
                      <option value="Inter">Inter</option>
                      <option value="C6 Bank">C6 Bank</option>
                      <option value="Sicoob">Sicoob</option>
                      <option value="Sicredi">Sicredi</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Conta</label>
                    <input 
                      type="text"
                      value={formData.conta}
                      onChange={(e) => setFormData({...formData, conta: e.target.value})}
                      placeholder="Ex: 12345-6"
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Observações</label>
                <textarea 
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  placeholder="Observações adicionais..."
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancelar" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="btn-salvar" onClick={handleSaveTransacao}>
                {modalMode === 'edit' ? 'Salvar Alterações' : 'Criar Transação'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Documento */}
      {showDocumentoModal && (
        <div className="modal-overlay" onClick={() => setShowDocumentoModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload de Documento</h2>
              <button className="btn-fechar" onClick={() => setShowDocumentoModal(false)}>
                <Icons.X />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Tipo de Documento</label>
                <select 
                  value={documentoForm.tipo}
                  onChange={(e) => setDocumentoForm({...documentoForm, tipo: e.target.value})}
                >
                  <option value="nota_fiscal">Nota Fiscal</option>
                  <option value="recibo">Recibo</option>
                  <option value="comprovante">Comprovante</option>
                  <option value="contrato">Contrato</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Número</label>
                  <input 
                    type="text"
                    value={documentoForm.numero}
                    onChange={(e) => setDocumentoForm({...documentoForm, numero: e.target.value})}
                    placeholder="Ex: NF-001/2026"
                  />
                </div>
                <div className="form-group">
                  <label>Data de Emissão</label>
                  <input 
                    type="date"
                    value={documentoForm.data_emissao}
                    onChange={(e) => setDocumentoForm({...documentoForm, data_emissao: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descrição *</label>
                <input 
                  type="text"
                  value={documentoForm.descricao}
                  onChange={(e) => setDocumentoForm({...documentoForm, descricao: e.target.value})}
                  placeholder="Descrição do documento"
                />
              </div>

              <div className="form-group">
                <label>Valor (R$)</label>
                <input 
                  type="text"
                  inputMode="numeric"
                  value={documentoForm.valor}
                  onChange={(e) => handleValorChange(e, setDocumentoForm, 'valor')}
                  placeholder="0,00"
                />
              </div>

              <div className="form-group">
                <label>Arquivo</label>
                <div className="upload-area">
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => setDocumentoForm({...documentoForm, arquivo: e.target.files[0]})}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <Icons.Upload />
                  <p>Clique para selecionar ou arraste o arquivo</p>
                  <small>PDF, JPG ou PNG (máx. 10MB)</small>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancelar" onClick={() => setShowDocumentoModal(false)}>
                Cancelar
              </button>
              <button className="btn-salvar" onClick={handleSaveDocumento}>
                Salvar Documento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Contrato */}
      {showContratoModal && (
        <div className="modal-overlay" onClick={() => setShowContratoModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'edit' ? 'Editar Contrato' : 'Novo Contrato'}</h2>
              <button className="btn-fechar" onClick={() => setShowContratoModal(false)}>
                <Icons.X />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Cliente *</label>
                <input 
                  type="text"
                  value={contratoForm.cliente}
                  onChange={(e) => setContratoForm({...contratoForm, cliente: e.target.value})}
                  placeholder="Nome do cliente"
                />
              </div>

              <div className="form-group">
                <label>Descrição do Serviço *</label>
                <input 
                  type="text"
                  value={contratoForm.descricao}
                  onChange={(e) => setContratoForm({...contratoForm, descricao: e.target.value})}
                  placeholder="Ex: Manutenção mensal - Sistema BI"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Valor Mensal (R$) *</label>
                  <input 
                    type="text"
                    inputMode="numeric"
                    value={contratoForm.valor_mensal}
                    onChange={(e) => handleValorChange(e, setContratoForm, 'valor_mensal')}
                    placeholder="0,00"
                  />
                </div>
                <div className="form-group">
                  <label>Dia de Vencimento</label>
                  <select 
                    value={contratoForm.dia_vencimento}
                    onChange={(e) => setContratoForm({...contratoForm, dia_vencimento: e.target.value})}
                  >
                    {[...Array(28)].map((_, i) => (
                      <option key={i+1} value={i+1}>Dia {i+1}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data de Início</label>
                  <input 
                    type="date"
                    value={contratoForm.data_inicio}
                    onChange={(e) => setContratoForm({...contratoForm, data_inicio: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Data de Término</label>
                  <input 
                    type="date"
                    value={contratoForm.data_fim}
                    onChange={(e) => setContratoForm({...contratoForm, data_fim: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select 
                  value={contratoForm.status}
                  onChange={(e) => setContratoForm({...contratoForm, status: e.target.value})}
                >
                  <option value="ativo">Ativo</option>
                  <option value="pausado">Pausado</option>
                  <option value="encerrado">Encerrado</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancelar" onClick={() => setShowContratoModal(false)}>
                Cancelar
              </button>
              <button className="btn-salvar" onClick={handleSaveContrato}>
                {modalMode === 'edit' ? 'Salvar Alterações' : 'Criar Contrato'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFinanceiro;
