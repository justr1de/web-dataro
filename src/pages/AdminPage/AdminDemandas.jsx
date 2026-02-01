import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { supabase } from '../../utils/supabaseClient';
import './AdminDemandas.css';

// Ícones SVG
const Icons = {
  Document: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
    </svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  Refresh: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"></polyline>
      <polyline points="1 20 1 14 7 14"></polyline>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
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
  Eye: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ),
  Report: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  Dashboard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  ),
  Attachment: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
    </svg>
  ),
  Download: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  BarChart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"></line>
      <line x1="18" y1="20" x2="18" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="16"></line>
    </svg>
  ),
  List: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  )
};

// Tipos de demanda baseados nas atividades da DATA-RO
const tiposDemanda = [
  { value: 'desenvolvimento_plataforma', label: 'Desenvolvimento de Plataforma' },
  { value: 'desenvolvimento_painel_bi', label: 'Desenvolvimento de Painel de BI' },
  { value: 'suporte_tecnico', label: 'Suporte Técnico' },
  { value: 'suporte_desenvolvimento', label: 'Suporte em Desenvolvimento' },
  { value: 'assessoria_ti', label: 'Assessoria em TI' },
  { value: 'assessoria_dados', label: 'Assessoria em Gestão de Dados' },
  { value: 'consultoria', label: 'Consultoria' },
  { value: 'treinamento', label: 'Treinamento' },
  { value: 'integracao_sistemas', label: 'Integração de Sistemas' },
  { value: 'manutencao', label: 'Manutenção' },
  { value: 'correcao_bug', label: 'Correção de Bug' },
  { value: 'nova_funcionalidade', label: 'Nova Funcionalidade' },
  { value: 'relatorio_personalizado', label: 'Relatório Personalizado' },
  { value: 'analise_dados', label: 'Análise de Dados' },
  { value: 'outro', label: 'Outro' }
];

const AdminDemandas = () => {
  const { adminUser } = useAdminAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Verificar se o usuário é administrador
  const isAdmin = adminUser?.role === 'admin' || 
                  adminUser?.role === 'administrador' || 
                  adminUser?.role === 'Administrador' ||
                  adminUser?.is_super_admin === true;
  
  // Função para registrar log de atividade
  const registrarLog = async (acao, descricao, dadosAnteriores = null, dadosNovos = null) => {
    try {
      await supabase.from('admin_logs').insert([{
        usuario_id: adminUser?.id || null,
        usuario_nome: adminUser?.nome || 'Desconhecido',
        usuario_email: adminUser?.email || 'Desconhecido',
        acao: acao,
        modulo: 'demandas',
        descricao: descricao,
        dados_anteriores: dadosAnteriores,
        dados_novos: dadosNovos,
        created_at: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Erro ao registrar log:', error);
    }
  };
  
  // Estados principais
  const [activeTab, setActiveTab] = useState('demandas'); // 'demandas', 'relatorio', 'dashboard'
  const [stats, setStats] = useState({
    total: 0,
    pendentes: 0,
    emAndamento: 0,
    concluidas: 0,
    urgentes: 0
  });
  const [demandas, setDemandas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedUrgencia, setSelectedUrgencia] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para relatório
  const [reportFilters, setReportFilters] = useState({
    dataInicio: '',
    dataFim: '',
    usuario: '',
    status: '',
    cliente: ''
  });
  
  // Estados para dashboard
  const [dashboardPeriodo, setDashboardPeriodo] = useState('mes'); // 'semana', 'mes', 'trimestre', 'ano'
  const [dashboardData, setDashboardData] = useState({
    porStatus: [],
    porTipo: [],
    porMes: [],
    tempoMedio: 0,
    taxaConclusao: 0
  });
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingDemanda, setEditingDemanda] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    gabinete_id: '',
    responsavel_id: '',
    status: 'pendente',
    urgencia: 'normal',
    tipo: '',
    data_prazo: '',
    observacoes: '',
    anexos: []
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      calcularDashboardData();
    }
  }, [activeTab, dashboardPeriodo, demandas]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Buscar clientes
      const { data: clienteData } = await supabase
        .from('admin_gabinetes')
        .select('*')
        .eq('ativo', true);
      setClientes(clienteData || []);

      // Buscar usuários para responsáveis
      const { data: usuariosData } = await supabase
        .from('admin_usuarios')
        .select('id, nome, email')
        .eq('ativo', true);
      setUsuarios(usuariosData || []);

      // Buscar demandas
      const { data: demData, error: demError } = await supabase
        .from('admin_demandas')
        .select('*, admin_gabinetes(nome)')
        .order('created_at', { ascending: false });
      
      if (demError) {
        console.error('Erro ao buscar demandas:', demError);
      }
      setDemandas(demData || []);

      // Calcular estatísticas
      const allDemandas = demData || [];
      setStats({
        total: allDemandas.length,
        pendentes: allDemandas.filter(d => d.status === 'pendente').length,
        emAndamento: allDemandas.filter(d => d.status === 'em_andamento').length,
        concluidas: allDemandas.filter(d => d.status === 'concluida').length,
        urgentes: allDemandas.filter(d => d.urgencia === 'urgente').length
      });
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
    setLoading(false);
  };

  const calcularDashboardData = () => {
    const now = new Date();
    let dataInicio = new Date();
    
    switch (dashboardPeriodo) {
      case 'semana':
        dataInicio.setDate(now.getDate() - 7);
        break;
      case 'mes':
        dataInicio.setMonth(now.getMonth() - 1);
        break;
      case 'trimestre':
        dataInicio.setMonth(now.getMonth() - 3);
        break;
      case 'ano':
        dataInicio.setFullYear(now.getFullYear() - 1);
        break;
      default:
        dataInicio.setMonth(now.getMonth() - 1);
    }

    const demandasPeriodo = demandas.filter(d => 
      new Date(d.created_at) >= dataInicio
    );

    // Por status
    const porStatus = [
      { label: 'Pendentes', value: demandasPeriodo.filter(d => d.status === 'pendente').length, color: '#f59e0b' },
      { label: 'Em Andamento', value: demandasPeriodo.filter(d => d.status === 'em_andamento').length, color: '#3b82f6' },
      { label: 'Concluídas', value: demandasPeriodo.filter(d => d.status === 'concluida').length, color: '#10b981' }
    ];

    // Por tipo
    const tiposCount = {};
    demandasPeriodo.forEach(d => {
      if (d.tipo) {
        tiposCount[d.tipo] = (tiposCount[d.tipo] || 0) + 1;
      }
    });
    const porTipo = Object.entries(tiposCount)
      .map(([tipo, count]) => ({
        label: tiposDemanda.find(t => t.value === tipo)?.label || tipo,
        value: count
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Por mês (últimos 6 meses)
    const porMes = [];
    for (let i = 5; i >= 0; i--) {
      const mes = new Date();
      mes.setMonth(mes.getMonth() - i);
      const mesStr = mes.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      const count = demandas.filter(d => {
        const dataDemanda = new Date(d.created_at);
        return dataDemanda.getMonth() === mes.getMonth() && 
               dataDemanda.getFullYear() === mes.getFullYear();
      }).length;
      porMes.push({ label: mesStr, value: count });
    }

    // Taxa de conclusão
    const taxaConclusao = demandasPeriodo.length > 0 
      ? Math.round((demandasPeriodo.filter(d => d.status === 'concluida').length / demandasPeriodo.length) * 100)
      : 0;

    // Tempo médio de conclusão (em dias)
    const concluidas = demandasPeriodo.filter(d => d.status === 'concluida' && d.data_conclusao);
    let tempoMedio = 0;
    if (concluidas.length > 0) {
      const totalDias = concluidas.reduce((acc, d) => {
        const inicio = new Date(d.created_at);
        const fim = new Date(d.data_conclusao);
        return acc + Math.ceil((fim - inicio) / (1000 * 60 * 60 * 24));
      }, 0);
      tempoMedio = Math.round(totalDias / concluidas.length);
    }

    setDashboardData({
      porStatus,
      porTipo,
      porMes,
      tempoMedio,
      taxaConclusao
    });
  };

  const filteredDemandas = demandas.filter(demanda => {
    if (selectedCliente && demanda.gabinete_id !== selectedCliente) return false;
    if (selectedStatus && demanda.status !== selectedStatus) return false;
    if (selectedUrgencia && demanda.urgencia !== selectedUrgencia) return false;
    if (selectedTipo && demanda.tipo !== selectedTipo) return false;
    if (searchTerm && !demanda.titulo?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Filtrar demandas para relatório
  const getReportDemandas = () => {
    return demandas.filter(demanda => {
      if (reportFilters.dataInicio) {
        const dataInicio = new Date(reportFilters.dataInicio);
        if (new Date(demanda.created_at) < dataInicio) return false;
      }
      if (reportFilters.dataFim) {
        const dataFim = new Date(reportFilters.dataFim);
        dataFim.setHours(23, 59, 59);
        if (new Date(demanda.created_at) > dataFim) return false;
      }
      if (reportFilters.usuario && demanda.responsavel_id !== reportFilters.usuario) return false;
      if (reportFilters.status && demanda.status !== reportFilters.status) return false;
      if (reportFilters.cliente && demanda.gabinete_id !== reportFilters.cliente) return false;
      return true;
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente': return 'status-pendente';
      case 'em_andamento': return 'status-andamento';
      case 'concluida': return 'status-concluida';
      default: return '';
    }
  };

  const getUrgenciaColor = (urgencia) => {
    switch (urgencia) {
      case 'baixa': return 'urgencia-baixa';
      case 'normal': return 'urgencia-normal';
      case 'alta': return 'urgencia-alta';
      case 'urgente': return 'urgencia-urgente';
      default: return '';
    }
  };

  const handleOpenModal = (demanda = null) => {
    if (!isAdmin) {
      alert('Você não tem permissão para gerenciar demandas.');
      return;
    }
    
    if (demanda) {
      setEditingDemanda(demanda);
      setFormData({
        titulo: demanda.titulo || '',
        descricao: demanda.descricao || '',
        gabinete_id: demanda.gabinete_id || '',
        responsavel_id: demanda.responsavel_id || '',
        status: demanda.status || 'pendente',
        urgencia: demanda.urgencia || 'normal',
        tipo: demanda.tipo || '',
        data_prazo: demanda.data_prazo || '',
        observacoes: demanda.observacoes || '',
        anexos: demanda.anexos || []
      });
    } else {
      setEditingDemanda(null);
      setFormData({
        titulo: '',
        descricao: '',
        gabinete_id: '',
        responsavel_id: '',
        status: 'pendente',
        urgencia: 'normal',
        tipo: '',
        data_prazo: '',
        observacoes: '',
        anexos: []
      });
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDemanda(null);
    setError('');
  };

  // Função para upload de arquivo
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingFile(true);
    const novosAnexos = [...(formData.anexos || [])];

    for (const file of files) {
      try {
        // Gerar nome único para o arquivo
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `demandas/${fileName}`;

        // Upload para o Supabase Storage
        const { data, error } = await supabase.storage
          .from('anexos')
          .upload(filePath, file);

        if (error) {
          console.error('Erro no upload:', error);
          // Se o bucket não existir, salvar como base64
          const reader = new FileReader();
          reader.onload = (e) => {
            novosAnexos.push({
              nome: file.name,
              tipo: file.type,
              tamanho: file.size,
              data: e.target.result,
              created_at: new Date().toISOString()
            });
            setFormData({ ...formData, anexos: novosAnexos });
          };
          reader.readAsDataURL(file);
        } else {
          // Obter URL pública
          const { data: urlData } = supabase.storage
            .from('anexos')
            .getPublicUrl(filePath);

          novosAnexos.push({
            nome: file.name,
            tipo: file.type,
            tamanho: file.size,
            url: urlData.publicUrl,
            path: filePath,
            created_at: new Date().toISOString()
          });
          setFormData({ ...formData, anexos: novosAnexos });
        }
      } catch (err) {
        console.error('Erro ao processar arquivo:', err);
      }
    }

    setUploadingFile(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Função para remover anexo
  const handleRemoveAnexo = async (index) => {
    const anexo = formData.anexos[index];
    
    // Se tiver path no storage, tentar remover
    if (anexo.path) {
      try {
        await supabase.storage.from('anexos').remove([anexo.path]);
      } catch (err) {
        console.error('Erro ao remover arquivo do storage:', err);
      }
    }

    const novosAnexos = formData.anexos.filter((_, i) => i !== index);
    setFormData({ ...formData, anexos: novosAnexos });
  };

  const handleSave = async () => {
    if (!formData.titulo.trim()) {
      setError('O título é obrigatório');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const dataToSave = {
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        gabinete_id: formData.gabinete_id || null,
        responsavel_id: formData.responsavel_id || null,
        status: formData.status,
        urgencia: formData.urgencia,
        tipo: formData.tipo || null,
        data_prazo: formData.data_prazo || null,
        observacoes: formData.observacoes || null,
        anexos: formData.anexos || [],
        updated_at: new Date().toISOString()
      };

      // Se status mudou para concluída, registrar data de conclusão
      if (formData.status === 'concluida' && editingDemanda?.status !== 'concluida') {
        dataToSave.data_conclusao = new Date().toISOString();
      }

      if (editingDemanda) {
        const { error: updateError } = await supabase
          .from('admin_demandas')
          .update(dataToSave)
          .eq('id', editingDemanda.id);

        if (updateError) throw updateError;
        
        await registrarLog(
          'atualizar',
          `Demanda "${dataToSave.titulo}" atualizada`,
          editingDemanda,
          dataToSave
        );
      } else {
        dataToSave.criado_por = adminUser?.id || null;
        dataToSave.created_at = new Date().toISOString();

        const { error: insertError } = await supabase
          .from('admin_demandas')
          .insert([dataToSave]);

        if (insertError) throw insertError;
        
        await registrarLog(
          'criar',
          `Nova demanda "${dataToSave.titulo}" criada`,
          null,
          dataToSave
        );
      }

      handleCloseModal();
      fetchData();
    } catch (err) {
      console.error('Erro ao salvar demanda:', err);
      setError('Erro ao salvar demanda. Por favor, tente novamente.');
    }

    setSaving(false);
  };

  const handleDelete = async (demanda) => {
    if (!isAdmin) {
      alert('Você não tem permissão para excluir demandas.');
      return;
    }
    
    if (!window.confirm(`Tem certeza que deseja excluir a demanda "${demanda.titulo}"?`)) {
      return;
    }

    try {
      // Remover anexos do storage
      if (demanda.anexos && demanda.anexos.length > 0) {
        const paths = demanda.anexos.filter(a => a.path).map(a => a.path);
        if (paths.length > 0) {
          await supabase.storage.from('anexos').remove(paths);
        }
      }

      const { error } = await supabase
        .from('admin_demandas')
        .delete()
        .eq('id', demanda.id);

      if (error) throw error;
      
      await registrarLog(
        'excluir',
        `Demanda "${demanda.titulo}" excluída`,
        demanda,
        null
      );
      
      fetchData();
    } catch (err) {
      console.error('Erro ao excluir demanda:', err);
      alert('Erro ao excluir demanda. Por favor, tente novamente.');
    }
  };

  const formatTipoLabel = (tipo) => {
    const found = tiposDemanda.find(t => t.value === tipo);
    return found ? found.label : tipo;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Exportar relatório para CSV
  const exportarRelatorio = () => {
    const reportDemandas = getReportDemandas();
    
    const headers = ['Título', 'Cliente', 'Responsável', 'Status', 'Urgência', 'Tipo', 'Data Criação', 'Data Prazo', 'Data Conclusão'];
    const rows = reportDemandas.map(d => [
      d.titulo,
      d.admin_gabinetes?.nome || '',
      usuarios.find(u => u.id === d.responsavel_id)?.nome || '',
      d.status,
      d.urgencia,
      formatTipoLabel(d.tipo),
      new Date(d.created_at).toLocaleDateString('pt-BR'),
      d.data_prazo ? new Date(d.data_prazo).toLocaleDateString('pt-BR') : '',
      d.data_conclusao ? new Date(d.data_conclusao).toLocaleDateString('pt-BR') : ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_demandas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="admin-demandas">
      {/* Header */}
      <div className="demandas-header">
        <div className="header-title">
          <Icons.Document />
          <h1>Gestão de Demandas</h1>
          <span className="header-subtitle">Gerencie todas as demandas dos clientes</span>
        </div>
        {isAdmin && (
          <button className="btn-nova-demanda" onClick={() => handleOpenModal()}>
            <Icons.Plus />
            Nova Demanda
          </button>
        )}
      </div>

      {/* Tabs de navegação */}
      <div className="demandas-tabs">
        <button 
          className={`tab-btn ${activeTab === 'demandas' ? 'active' : ''}`}
          onClick={() => setActiveTab('demandas')}
        >
          <Icons.List />
          Demandas
        </button>
        <button 
          className={`tab-btn ${activeTab === 'relatorio' ? 'active' : ''}`}
          onClick={() => setActiveTab('relatorio')}
        >
          <Icons.Report />
          Relatório
        </button>
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Icons.Dashboard />
          Dashboard
        </button>
      </div>

      {/* Conteúdo baseado na tab ativa */}
      {activeTab === 'demandas' && (
        <>
          {/* Cards de Estatísticas */}
          <div className="stats-grid">
            <div className="stat-card stat-total">
              <div className="stat-content">
                <span className="stat-label">Total</span>
                <span className="stat-value">{stats.total}</span>
              </div>
              <div className="stat-icon">
                <Icons.Document />
              </div>
            </div>

            <div className="stat-card stat-pendentes">
              <div className="stat-content">
                <span className="stat-label">Pendentes</span>
                <span className="stat-value">{stats.pendentes}</span>
              </div>
              <div className="stat-icon">
                <Icons.Clock />
              </div>
            </div>

            <div className="stat-card stat-andamento">
              <div className="stat-content">
                <span className="stat-label">Em Andamento</span>
                <span className="stat-value">{stats.emAndamento}</span>
              </div>
              <div className="stat-icon">
                <Icons.Refresh />
              </div>
            </div>

            <div className="stat-card stat-concluidas">
              <div className="stat-content">
                <span className="stat-label">Concluídas</span>
                <span className="stat-value">{stats.concluidas}</span>
              </div>
              <div className="stat-icon">
                <Icons.Check />
              </div>
            </div>

            <div className="stat-card stat-urgentes">
              <div className="stat-content">
                <span className="stat-label">Urgentes</span>
                <span className="stat-value">{stats.urgentes}</span>
              </div>
              <div className="stat-icon">
                <Icons.Alert />
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="filters-section">
            <div className="filter-group">
              <label>Cliente</label>
              <select 
                value={selectedCliente} 
                onChange={(e) => setSelectedCliente(e.target.value)}
              >
                <option value="">Todos os clientes</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Status</label>
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluida">Concluída</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Urgência</label>
              <select 
                value={selectedUrgencia} 
                onChange={(e) => setSelectedUrgencia(e.target.value)}
              >
                <option value="">Todas as urgências</option>
                <option value="baixa">Baixa</option>
                <option value="normal">Normal</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Tipo</label>
              <select 
                value={selectedTipo} 
                onChange={(e) => setSelectedTipo(e.target.value)}
              >
                <option value="">Todos os tipos</option>
                {tiposDemanda.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-group filter-search">
              <label>Buscar</label>
              <input
                type="text"
                placeholder="Buscar por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Lista de Demandas */}
          <div className="demandas-list-section">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Carregando demandas...</p>
              </div>
            ) : filteredDemandas.length === 0 ? (
              <div className="empty-state">
                <Icons.Document />
                <p>Nenhuma demanda encontrada</p>
              </div>
            ) : (
              <div className="demandas-grid">
                {filteredDemandas.map(demanda => (
                  <div key={demanda.id} className={`demanda-card ${getUrgenciaColor(demanda.urgencia)}`}>
                    <div className="demanda-header">
                      <h3 className="demanda-titulo">{demanda.titulo}</h3>
                      <div className="demanda-badges">
                        <span className={`badge ${getStatusColor(demanda.status)}`}>
                          {demanda.status === 'pendente' ? 'Pendente' : 
                           demanda.status === 'em_andamento' ? 'Em Andamento' : 'Concluída'}
                        </span>
                        {demanda.tipo && (
                          <span className="badge badge-tipo">
                            {formatTipoLabel(demanda.tipo)}
                          </span>
                        )}
                        {demanda.anexos && demanda.anexos.length > 0 && (
                          <span className="badge badge-anexos" title={`${demanda.anexos.length} anexo(s)`}>
                            <Icons.Attachment /> {demanda.anexos.length}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="demanda-descricao">{demanda.descricao}</p>
                    <div className="demanda-footer">
                      <div className="demanda-info">
                        <span className="demanda-cliente">
                          {demanda.admin_gabinetes?.nome || 'Sem cliente'}
                        </span>
                        {demanda.data_prazo && (
                          <span className="demanda-prazo">
                            Prazo: {new Date(demanda.data_prazo).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                        <span className="demanda-data">
                          Criado em: {new Date(demanda.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      {isAdmin && (
                        <div className="demanda-actions">
                          <button className="btn-action btn-edit" onClick={() => handleOpenModal(demanda)} title="Editar">
                            <Icons.Edit />
                          </button>
                          <button className="btn-action btn-delete" onClick={() => handleDelete(demanda)} title="Excluir">
                            <Icons.Trash />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Tab Relatório */}
      {activeTab === 'relatorio' && (
        <div className="relatorio-section">
          <div className="relatorio-header">
            <h2><Icons.Report /> Relatório de Demandas</h2>
            <button className="btn-exportar" onClick={exportarRelatorio}>
              <Icons.Download />
              Exportar CSV
            </button>
          </div>

          {/* Filtros do Relatório */}
          <div className="relatorio-filters">
            <div className="filter-group">
              <label>Data Início</label>
              <input
                type="date"
                value={reportFilters.dataInicio}
                onChange={(e) => setReportFilters({ ...reportFilters, dataInicio: e.target.value })}
              />
            </div>
            <div className="filter-group">
              <label>Data Fim</label>
              <input
                type="date"
                value={reportFilters.dataFim}
                onChange={(e) => setReportFilters({ ...reportFilters, dataFim: e.target.value })}
              />
            </div>
            <div className="filter-group">
              <label>Responsável</label>
              <select
                value={reportFilters.usuario}
                onChange={(e) => setReportFilters({ ...reportFilters, usuario: e.target.value })}
              >
                <option value="">Todos</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.nome}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Status</label>
              <select
                value={reportFilters.status}
                onChange={(e) => setReportFilters({ ...reportFilters, status: e.target.value })}
              >
                <option value="">Todos</option>
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluida">Concluída</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Cliente</label>
              <select
                value={reportFilters.cliente}
                onChange={(e) => setReportFilters({ ...reportFilters, cliente: e.target.value })}
              >
                <option value="">Todos</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabela do Relatório */}
          <div className="relatorio-table-container">
            <table className="relatorio-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Cliente</th>
                  <th>Responsável</th>
                  <th>Status</th>
                  <th>Urgência</th>
                  <th>Tipo</th>
                  <th>Data Criação</th>
                  <th>Prazo</th>
                </tr>
              </thead>
              <tbody>
                {getReportDemandas().map(demanda => (
                  <tr key={demanda.id}>
                    <td>{demanda.titulo}</td>
                    <td>{demanda.admin_gabinetes?.nome || '-'}</td>
                    <td>{usuarios.find(u => u.id === demanda.responsavel_id)?.nome || '-'}</td>
                    <td>
                      <span className={`badge ${getStatusColor(demanda.status)}`}>
                        {demanda.status === 'pendente' ? 'Pendente' : 
                         demanda.status === 'em_andamento' ? 'Em Andamento' : 'Concluída'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getUrgenciaColor(demanda.urgencia)}`}>
                        {demanda.urgencia}
                      </span>
                    </td>
                    <td>{formatTipoLabel(demanda.tipo) || '-'}</td>
                    <td>{new Date(demanda.created_at).toLocaleDateString('pt-BR')}</td>
                    <td>{demanda.data_prazo ? new Date(demanda.data_prazo).toLocaleDateString('pt-BR') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {getReportDemandas().length === 0 && (
              <div className="empty-table">
                <p>Nenhuma demanda encontrada com os filtros selecionados</p>
              </div>
            )}
          </div>

          {/* Resumo do Relatório */}
          <div className="relatorio-resumo">
            <div className="resumo-card">
              <span className="resumo-label">Total de Demandas</span>
              <span className="resumo-value">{getReportDemandas().length}</span>
            </div>
            <div className="resumo-card">
              <span className="resumo-label">Pendentes</span>
              <span className="resumo-value">{getReportDemandas().filter(d => d.status === 'pendente').length}</span>
            </div>
            <div className="resumo-card">
              <span className="resumo-label">Em Andamento</span>
              <span className="resumo-value">{getReportDemandas().filter(d => d.status === 'em_andamento').length}</span>
            </div>
            <div className="resumo-card">
              <span className="resumo-label">Concluídas</span>
              <span className="resumo-value">{getReportDemandas().filter(d => d.status === 'concluida').length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="dashboard-section">
          <div className="dashboard-header">
            <h2><Icons.BarChart /> Dashboard de Desempenho</h2>
            <div className="periodo-selector">
              <button 
                className={`periodo-btn ${dashboardPeriodo === 'semana' ? 'active' : ''}`}
                onClick={() => setDashboardPeriodo('semana')}
              >
                Semana
              </button>
              <button 
                className={`periodo-btn ${dashboardPeriodo === 'mes' ? 'active' : ''}`}
                onClick={() => setDashboardPeriodo('mes')}
              >
                Mês
              </button>
              <button 
                className={`periodo-btn ${dashboardPeriodo === 'trimestre' ? 'active' : ''}`}
                onClick={() => setDashboardPeriodo('trimestre')}
              >
                Trimestre
              </button>
              <button 
                className={`periodo-btn ${dashboardPeriodo === 'ano' ? 'active' : ''}`}
                onClick={() => setDashboardPeriodo('ano')}
              >
                Ano
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="dashboard-kpis">
            <div className="kpi-card">
              <div className="kpi-icon" style={{ backgroundColor: '#10b981' }}>
                <Icons.Check />
              </div>
              <div className="kpi-content">
                <span className="kpi-value">{dashboardData.taxaConclusao}%</span>
                <span className="kpi-label">Taxa de Conclusão</span>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon" style={{ backgroundColor: '#3b82f6' }}>
                <Icons.Clock />
              </div>
              <div className="kpi-content">
                <span className="kpi-value">{dashboardData.tempoMedio} dias</span>
                <span className="kpi-label">Tempo Médio de Conclusão</span>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon" style={{ backgroundColor: '#f59e0b' }}>
                <Icons.Document />
              </div>
              <div className="kpi-content">
                <span className="kpi-value">{dashboardData.porStatus.reduce((acc, s) => acc + s.value, 0)}</span>
                <span className="kpi-label">Total no Período</span>
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="dashboard-charts">
            {/* Gráfico por Status */}
            <div className="chart-card">
              <h3>Demandas por Status</h3>
              <div className="chart-bars">
                {dashboardData.porStatus.map((item, index) => (
                  <div key={index} className="bar-item">
                    <div className="bar-label">{item.label}</div>
                    <div className="bar-container">
                      <div 
                        className="bar-fill" 
                        style={{ 
                          width: `${Math.max(5, (item.value / Math.max(...dashboardData.porStatus.map(s => s.value), 1)) * 100)}%`,
                          backgroundColor: item.color 
                        }}
                      >
                        <span className="bar-value">{item.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gráfico por Tipo */}
            <div className="chart-card">
              <h3>Top 5 Tipos de Demanda</h3>
              <div className="chart-bars">
                {dashboardData.porTipo.length === 0 ? (
                  <p className="no-data">Sem dados para o período selecionado</p>
                ) : (
                  dashboardData.porTipo.map((item, index) => (
                    <div key={index} className="bar-item">
                      <div className="bar-label">{item.label}</div>
                      <div className="bar-container">
                        <div 
                          className="bar-fill" 
                          style={{ 
                            width: `${Math.max(5, (item.value / Math.max(...dashboardData.porTipo.map(s => s.value), 1)) * 100)}%`,
                            backgroundColor: '#10b981'
                          }}
                        >
                          <span className="bar-value">{item.value}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Gráfico por Mês */}
            <div className="chart-card chart-full">
              <h3>Evolução Mensal (Últimos 6 meses)</h3>
              <div className="chart-line">
                {dashboardData.porMes.map((item, index) => (
                  <div key={index} className="line-item">
                    <div 
                      className="line-bar" 
                      style={{ 
                        height: `${Math.max(20, (item.value / Math.max(...dashboardData.porMes.map(s => s.value), 1)) * 150)}px`
                      }}
                    >
                      <span className="line-value">{item.value}</span>
                    </div>
                    <span className="line-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Nova/Editar Demanda */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingDemanda ? 'Editar Demanda' : 'Nova Demanda'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>
                <Icons.X />
              </button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Digite o título da demanda"
                />
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva a demanda em detalhes"
                  rows={4}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cliente</label>
                  <select
                    value={formData.gabinete_id}
                    onChange={(e) => setFormData({ ...formData, gabinete_id: e.target.value })}
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Responsável</label>
                  <select
                    value={formData.responsavel_id}
                    onChange={(e) => setFormData({ ...formData, responsavel_id: e.target.value })}
                  >
                    <option value="">Selecione um responsável</option>
                    {usuarios.map(usuario => (
                      <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de Demanda</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  >
                    <option value="">Selecione o tipo</option>
                    {tiposDemanda.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Data Prazo</label>
                  <input
                    type="date"
                    value={formData.data_prazo}
                    onChange={(e) => setFormData({ ...formData, data_prazo: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluida">Concluída</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Urgência</label>
                  <select
                    value={formData.urgencia}
                    onChange={(e) => setFormData({ ...formData, urgencia: e.target.value })}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações adicionais"
                  rows={2}
                />
              </div>

              {/* Seção de Anexos */}
              <div className="form-group anexos-section">
                <label>
                  <Icons.Attachment /> Anexos
                </label>
                
                <div className="anexos-upload">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    style={{ display: 'none' }}
                  />
                  <button 
                    type="button" 
                    className="btn-upload"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFile}
                  >
                    {uploadingFile ? 'Enviando...' : '+ Adicionar Arquivo'}
                  </button>
                  <span className="upload-hint">PDF, DOC, XLS, imagens até 10MB</span>
                </div>

                {formData.anexos && formData.anexos.length > 0 && (
                  <div className="anexos-list">
                    {formData.anexos.map((anexo, index) => (
                      <div key={index} className="anexo-item">
                        <div className="anexo-info">
                          <Icons.Document />
                          <span className="anexo-nome">{anexo.nome}</span>
                          <span className="anexo-tamanho">{formatFileSize(anexo.tamanho)}</span>
                        </div>
                        <div className="anexo-actions">
                          {anexo.url && (
                            <a href={anexo.url} target="_blank" rel="noopener noreferrer" className="btn-anexo-download">
                              <Icons.Download />
                            </a>
                          )}
                          <button 
                            type="button" 
                            className="btn-anexo-remove"
                            onClick={() => handleRemoveAnexo(index)}
                          >
                            <Icons.X />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <p className="lgpd-notice">
                Todos os dados coletados respeitam às Normas da LGPD.
              </p>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button className="btn-save" onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : (editingDemanda ? 'Salvar Alterações' : 'Criar Demanda')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDemandas;
