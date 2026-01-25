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

const AdminFinanceiro = () => {
  const { adminUser, isSuperAdmin } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transacoes, setTransacoes] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDocumentoModal, setShowDocumentoModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedTransacao, setSelectedTransacao] = useState(null);
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
  const fileInputRef = useRef(null);

  // Carregar transações do localStorage (simulando banco de dados)
  useEffect(() => {
    const loadData = () => {
      try {
        const savedTransacoes = localStorage.getItem('fin_transacoes');
        const savedDocumentos = localStorage.getItem('fin_documentos');
        
        if (savedTransacoes) {
          setTransacoes(JSON.parse(savedTransacoes));
        } else {
          // Dados de exemplo
          const exemploTransacoes = [
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
              descricao: 'Salários - Janeiro/2026',
              valor: 35000,
              data_vencimento: '2026-01-31',
              status: 'pendente',
              categoria: 'salarios',
              created_at: '2026-01-25'
            }
          ];
          setTransacoes(exemploTransacoes);
          localStorage.setItem('fin_transacoes', JSON.stringify(exemploTransacoes));
        }
        
        if (savedDocumentos) {
          setDocumentos(JSON.parse(savedDocumentos));
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Salvar transações no localStorage
  const saveTransacoes = (newTransacoes) => {
    setTransacoes(newTransacoes);
    localStorage.setItem('fin_transacoes', JSON.stringify(newTransacoes));
  };

  // Salvar documentos no localStorage
  const saveDocumentos = (newDocumentos) => {
    setDocumentos(newDocumentos);
    localStorage.setItem('fin_documentos', JSON.stringify(newDocumentos));
  };

  // Calcular métricas
  const calcularMetricas = () => {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    const transacoesMes = transacoes.filter(t => {
      const dataVenc = new Date(t.data_vencimento);
      return dataVenc >= inicioMes && dataVenc <= fimMes;
    });

    const receitasMes = transacoesMes
      .filter(t => t.tipo === 'receita')
      .reduce((acc, t) => acc + Number(t.valor), 0);

    const despesasMes = transacoesMes
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, t) => acc + Number(t.valor), 0);

    const receitasPagas = transacoesMes
      .filter(t => t.tipo === 'receita' && t.status === 'pago')
      .reduce((acc, t) => acc + Number(t.valor), 0);

    const despesasPagas = transacoesMes
      .filter(t => t.tipo === 'despesa' && t.status === 'pago')
      .reduce((acc, t) => acc + Number(t.valor), 0);

    const pendentes = transacoes.filter(t => t.status === 'pendente');
    const atrasadas = transacoes.filter(t => {
      const dataVenc = new Date(t.data_vencimento);
      return t.status === 'pendente' && dataVenc < hoje;
    });

    return {
      receitasMes,
      despesasMes,
      saldoMes: receitasMes - despesasMes,
      receitasPagas,
      despesasPagas,
      saldoRealizado: receitasPagas - despesasPagas,
      totalPendentes: pendentes.length,
      valorPendentes: pendentes.reduce((acc, t) => acc + Number(t.valor), 0),
      totalAtrasadas: atrasadas.length,
      valorAtrasadas: atrasadas.reduce((acc, t) => acc + Number(t.valor), 0)
    };
  };

  const metricas = calcularMetricas();

  // Filtrar transações
  const transacoesFiltradas = transacoes.filter(t => {
    if (filtros.tipo !== 'todos' && t.tipo !== filtros.tipo) return false;
    if (filtros.status !== 'todos' && t.status !== filtros.status) return false;
    if (filtros.categoria !== 'todas' && t.categoria !== filtros.categoria) return false;
    
    if (filtros.periodo !== 'todos') {
      const hoje = new Date();
      const dataVenc = new Date(t.data_vencimento);
      
      if (filtros.periodo === 'mes_atual') {
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
        if (dataVenc < inicioMes || dataVenc > fimMes) return false;
      } else if (filtros.periodo === 'proximo_mes') {
        const inicioProximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
        const fimProximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 2, 0);
        if (dataVenc < inicioProximoMes || dataVenc > fimProximoMes) return false;
      }
    }
    
    return true;
  });

  // Handlers
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
        numero_documento: transacao.numero_documento || '',
        observacoes: transacao.observacoes || '',
        entidade_nome: transacao.entidade_nome || ''
      });
    } else {
      setSelectedTransacao(null);
      setFormData({
        tipo: 'receita',
        descricao: '',
        valor: '',
        data_vencimento: '',
        data_pagamento: '',
        status: 'pendente',
        categoria: '',
        forma_pagamento: '',
        numero_documento: '',
        observacoes: '',
        entidade_nome: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTransacao(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const novaTransacao = {
      ...formData,
      valor: parseFloat(formData.valor),
      id: modalMode === 'edit' ? selectedTransacao.id : Date.now().toString(),
      created_at: modalMode === 'edit' ? selectedTransacao.created_at : new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    };

    if (modalMode === 'edit') {
      const updatedTransacoes = transacoes.map(t => 
        t.id === selectedTransacao.id ? novaTransacao : t
      );
      saveTransacoes(updatedTransacoes);
    } else {
      saveTransacoes([...transacoes, novaTransacao]);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      const updatedTransacoes = transacoes.filter(t => t.id !== id);
      saveTransacoes(updatedTransacoes);
    }
  };

  const handleMarcarPago = (transacao) => {
    const updatedTransacoes = transacoes.map(t => {
      if (t.id === transacao.id) {
        return {
          ...t,
          status: 'pago',
          data_pagamento: new Date().toISOString().split('T')[0]
        };
      }
      return t;
    });
    saveTransacoes(updatedTransacoes);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simular upload - em produção, enviaria para o Supabase Storage
      const reader = new FileReader();
      reader.onload = (event) => {
        setDocumentoForm({
          ...documentoForm,
          arquivo: {
            nome: file.name,
            tipo: file.type,
            tamanho: file.size,
            data: event.target.result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitDocumento = (e) => {
    e.preventDefault();
    
    const novoDocumento = {
      ...documentoForm,
      id: Date.now().toString(),
      transacao_id: selectedTransacao?.id,
      created_at: new Date().toISOString()
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

  // Formatar valores
  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
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
    if (status === 'pago') return 'status-pago';
    if (status === 'cancelado') return 'status-cancelado';
    
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    if (vencimento < hoje) return 'status-atrasado';
    
    return 'status-pendente';
  };

  const getStatusLabel = (status, dataVencimento) => {
    if (status === 'pago') return 'Pago';
    if (status === 'cancelado') return 'Cancelado';
    
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    if (vencimento < hoje) return 'Atrasado';
    
    return 'Pendente';
  };

  // Verificar se é super admin
  if (!isSuperAdmin()) {
    return (
      <div className="admin-financeiro-blocked">
        <Icons.AlertCircle />
        <h2>Acesso Restrito</h2>
        <p>Esta área é exclusiva para Super Administradores.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-financeiro-loading">
        <div className="spinner"></div>
        <p>Carregando dados financeiros...</p>
      </div>
    );
  }

  return (
    <div className="admin-financeiro">
      {/* Header */}
      <div className="financeiro-header">
        <div className="header-title">
          <Icons.DollarSign />
          <div>
            <h1>Gestão Financeira</h1>
            <p>Controle de pagamentos, recebimentos e documentos fiscais</p>
          </div>
        </div>
        <button className="btn-nova-transacao" onClick={() => handleOpenModal('create')}>
          <Icons.Plus />
          Nova Transação
        </button>
      </div>

      {/* Tabs */}
      <div className="financeiro-tabs">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Icons.PieChart />
          Dashboard
        </button>
        <button 
          className={`tab-btn ${activeTab === 'receitas' ? 'active' : ''}`}
          onClick={() => { setActiveTab('receitas'); setFiltros({...filtros, tipo: 'receita'}); }}
        >
          <Icons.TrendingUp />
          Receitas
        </button>
        <button 
          className={`tab-btn ${activeTab === 'despesas' ? 'active' : ''}`}
          onClick={() => { setActiveTab('despesas'); setFiltros({...filtros, tipo: 'despesa'}); }}
        >
          <Icons.TrendingDown />
          Despesas
        </button>
        <button 
          className={`tab-btn ${activeTab === 'documentos' ? 'active' : ''}`}
          onClick={() => setActiveTab('documentos')}
        >
          <Icons.FileText />
          Documentos
        </button>
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="financeiro-dashboard">
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
                <span className="metrica-sub">{formatarMoeda(metricas.valorPendentes)}</span>
              </div>
            </div>

            {metricas.totalAtrasadas > 0 && (
              <div className="metrica-card atrasadas">
                <div className="metrica-icon">
                  <Icons.AlertCircle />
                </div>
                <div className="metrica-info">
                  <span className="metrica-label">Atrasadas</span>
                  <span className="metrica-valor">{metricas.totalAtrasadas}</span>
                  <span className="metrica-sub">{formatarMoeda(metricas.valorAtrasadas)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Últimas Transações */}
          <div className="ultimas-transacoes">
            <h3>Últimas Transações</h3>
            <div className="transacoes-list">
              {transacoes.slice(0, 5).map(transacao => (
                <div key={transacao.id} className={`transacao-item ${transacao.tipo}`}>
                  <div className="transacao-info">
                    <span className="transacao-descricao">{transacao.descricao}</span>
                    <span className="transacao-entidade">{transacao.entidade_nome || '-'}</span>
                  </div>
                  <div className="transacao-detalhes">
                    <span className={`transacao-valor ${transacao.tipo}`}>
                      {transacao.tipo === 'receita' ? '+' : '-'} {formatarMoeda(transacao.valor)}
                    </span>
                    <span className={`transacao-status ${getStatusClass(transacao.status, transacao.data_vencimento)}`}>
                      {getStatusLabel(transacao.status, transacao.data_vencimento)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lista de Transações (Receitas/Despesas) */}
      {(activeTab === 'receitas' || activeTab === 'despesas') && (
        <div className="financeiro-transacoes">
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
                {categoriasPadrao[filtros.tipo === 'todos' ? 'receita' : filtros.tipo]?.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabela de Transações */}
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
                {transacoesFiltradas.map(transacao => (
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
                          className="btn-acao anexar"
                          onClick={() => { setSelectedTransacao(transacao); setShowDocumentoModal(true); }}
                          title="Anexar Documento"
                        >
                          <Icons.Upload />
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
            {transacoesFiltradas.length === 0 && (
              <div className="empty-state">
                <Icons.FileText />
                <p>Nenhuma transação encontrada</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Documentos */}
      {activeTab === 'documentos' && (
        <div className="financeiro-documentos">
          <div className="documentos-header">
            <h3>Documentos Fiscais</h3>
            <button 
              className="btn-upload"
              onClick={() => { setSelectedTransacao(null); setShowDocumentoModal(true); }}
            >
              <Icons.Upload />
              Upload de Documento
            </button>
          </div>

          <div className="documentos-grid">
            {documentos.map(doc => (
              <div key={doc.id} className="documento-card">
                <div className="documento-icon">
                  <Icons.FileText />
                </div>
                <div className="documento-info">
                  <span className="documento-tipo">{doc.tipo.replace('_', ' ')}</span>
                  <span className="documento-numero">{doc.numero || 'Sem número'}</span>
                  <span className="documento-descricao">{doc.descricao}</span>
                  {doc.valor && (
                    <span className="documento-valor">{formatarMoeda(doc.valor)}</span>
                  )}
                </div>
                <div className="documento-acoes">
                  {doc.arquivo && (
                    <button className="btn-download" title="Visualizar">
                      <Icons.Eye />
                    </button>
                  )}
                  <button 
                    className="btn-delete"
                    onClick={() => {
                      if (window.confirm('Excluir documento?')) {
                        saveDocumentos(documentos.filter(d => d.id !== doc.id));
                      }
                    }}
                    title="Excluir"
                  >
                    <Icons.Trash />
                  </button>
                </div>
              </div>
            ))}
            {documentos.length === 0 && (
              <div className="empty-state full-width">
                <Icons.FileText />
                <p>Nenhum documento cadastrado</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Transação */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'edit' ? 'Editar Transação' : 'Nova Transação'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <Icons.X />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo</label>
                  <select 
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value, categoria: ''})}
                    required
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
                    required
                  >
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <input 
                  type="text"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descrição da transação"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Valor (R$)</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: e.target.value})}
                    placeholder="0,00"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Categoria</label>
                  <select 
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    required
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
                  <label>Data de Vencimento</label>
                  <input 
                    type="date"
                    value={formData.data_vencimento}
                    onChange={(e) => setFormData({...formData, data_vencimento: e.target.value})}
                    required
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
                <label>Cliente/Fornecedor</label>
                <input 
                  type="text"
                  value={formData.entidade_nome}
                  onChange={(e) => setFormData({...formData, entidade_nome: e.target.value})}
                  placeholder="Nome do cliente ou fornecedor"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Forma de Pagamento</label>
                  <select 
                    value={formData.forma_pagamento}
                    onChange={(e) => setFormData({...formData, forma_pagamento: e.target.value})}
                  >
                    <option value="">Selecione...</option>
                    {formasPagamento.map(forma => (
                      <option key={forma} value={forma}>{forma}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Nº Documento/NF</label>
                  <input 
                    type="text"
                    value={formData.numero_documento}
                    onChange={(e) => setFormData({...formData, numero_documento: e.target.value})}
                    placeholder="Ex: NF-001/2026"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Observações</label>
                <textarea 
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  placeholder="Observações adicionais..."
                  rows={3}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancelar" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-salvar">
                  {modalMode === 'edit' ? 'Salvar Alterações' : 'Criar Transação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Documento */}
      {showDocumentoModal && (
        <div className="modal-overlay" onClick={() => setShowDocumentoModal(false)}>
          <div className="modal-content modal-documento" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Anexar Documento</h2>
              <button className="modal-close" onClick={() => setShowDocumentoModal(false)}>
                <Icons.X />
              </button>
            </div>
            <form onSubmit={handleSubmitDocumento}>
              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de Documento</label>
                  <select 
                    value={documentoForm.tipo}
                    onChange={(e) => setDocumentoForm({...documentoForm, tipo: e.target.value})}
                    required
                  >
                    <option value="nota_fiscal">Nota Fiscal</option>
                    <option value="recibo">Recibo</option>
                    <option value="boleto">Boleto</option>
                    <option value="contrato">Contrato</option>
                    <option value="comprovante">Comprovante</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Número</label>
                  <input 
                    type="text"
                    value={documentoForm.numero}
                    onChange={(e) => setDocumentoForm({...documentoForm, numero: e.target.value})}
                    placeholder="Número do documento"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <input 
                  type="text"
                  value={documentoForm.descricao}
                  onChange={(e) => setDocumentoForm({...documentoForm, descricao: e.target.value})}
                  placeholder="Descrição do documento"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data de Emissão</label>
                  <input 
                    type="date"
                    value={documentoForm.data_emissao}
                    onChange={(e) => setDocumentoForm({...documentoForm, data_emissao: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Valor (R$)</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    value={documentoForm.valor}
                    onChange={(e) => setDocumentoForm({...documentoForm, valor: e.target.value})}
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Arquivo</label>
                <div 
                  className="file-upload-area"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                    style={{ display: 'none' }}
                  />
                  {documentoForm.arquivo ? (
                    <div className="file-selected">
                      <Icons.FileText />
                      <span>{documentoForm.arquivo.nome}</span>
                    </div>
                  ) : (
                    <div className="file-placeholder">
                      <Icons.Upload />
                      <span>Clique para selecionar ou arraste um arquivo</span>
                      <small>PDF, JPG, PNG, DOC, XLS (máx. 10MB)</small>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancelar" onClick={() => setShowDocumentoModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-salvar">
                  Anexar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFinanceiro;
