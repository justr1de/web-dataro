import React, { useState, useEffect } from 'react';
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
    observacoes: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

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

  const filteredDemandas = demandas.filter(demanda => {
    if (selectedCliente && demanda.gabinete_id !== selectedCliente) return false;
    if (selectedStatus && demanda.status !== selectedStatus) return false;
    if (selectedUrgencia && demanda.urgencia !== selectedUrgencia) return false;
    if (selectedTipo && demanda.tipo !== selectedTipo) return false;
    if (searchTerm && !demanda.titulo?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

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
        observacoes: demanda.observacoes || ''
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
        observacoes: ''
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
        updated_at: new Date().toISOString()
      };

      if (editingDemanda) {
        // Atualizar demanda existente
        const { error: updateError } = await supabase
          .from('admin_demandas')
          .update(dataToSave)
          .eq('id', editingDemanda.id);

        if (updateError) throw updateError;
      } else {
        // Criar nova demanda
        dataToSave.criado_por = adminUser?.id || null;
        dataToSave.created_at = new Date().toISOString();

        const { error: insertError } = await supabase
          .from('admin_demandas')
          .insert([dataToSave]);

        if (insertError) throw insertError;
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
    if (!window.confirm(`Tem certeza que deseja excluir a demanda "${demanda.titulo}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_demandas')
        .delete()
        .eq('id', demanda.id);

      if (error) throw error;
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

  return (
    <div className="admin-demandas">
      {/* Header */}
      <div className="demandas-header">
        <div className="header-title">
          <Icons.Document />
          <h1>Gestão de Demandas</h1>
          <span className="header-subtitle">Gerencie todas as demandas dos clientes</span>
        </div>
        <button className="btn-nova-demanda" onClick={() => handleOpenModal()}>
          <Icons.Plus />
          Nova Demanda
        </button>
      </div>

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
            placeholder="Buscar por título, descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de Demandas */}
      <div className="demandas-section">
        <div className="section-header">
          <Icons.Document />
          <h2>Lista de Demandas</h2>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Carregando demandas...</p>
          </div>
        ) : filteredDemandas.length === 0 ? (
          <div className="empty-state">
            <Icons.Document />
            <p>Nenhuma demanda encontrada</p>
            <button className="btn-nova-demanda-empty" onClick={() => handleOpenModal()}>
              <Icons.Plus />
              Criar Nova Demanda
            </button>
          </div>
        ) : (
          <div className="demandas-list">
            {filteredDemandas.map(demanda => (
              <div key={demanda.id} className="demanda-card">
                <div className="demanda-header">
                  <h3>{demanda.titulo}</h3>
                  <div className="demanda-badges">
                    <span className={`badge ${getStatusColor(demanda.status)}`}>
                      {demanda.status?.replace('_', ' ')}
                    </span>
                    <span className={`badge ${getUrgenciaColor(demanda.urgencia)}`}>
                      {demanda.urgencia}
                    </span>
                    {demanda.tipo && (
                      <span className="badge badge-tipo">
                        {formatTipoLabel(demanda.tipo)}
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
                  <div className="demanda-actions">
                    <button className="btn-action btn-edit" onClick={() => handleOpenModal(demanda)} title="Editar">
                      <Icons.Edit />
                    </button>
                    <button className="btn-action btn-delete" onClick={() => handleDelete(demanda)} title="Excluir">
                      <Icons.Trash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Nova/Editar Demanda */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
