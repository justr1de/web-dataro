import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { supabase } from '../../utils/supabaseClient';
import './AdminCalendario.css';

const Icons = {
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  ChevronLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  MapPin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  Bell: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  ),
  Flag: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
      <line x1="4" y1="22" x2="4" y2="15"></line>
    </svg>
  ),
  List: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  ),
  Grid: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  ),
  Sync: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"></path>
    </svg>
  ),
  Google: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
  Cloud: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
    </svg>
  )
};

const tiposEvento = [
  { id: 'tarefa', nome: 'Tarefa', cor: '#3b82f6' },
  { id: 'atividade', nome: 'Atividade', cor: '#10b981' },
  { id: 'evento', nome: 'Evento', cor: '#8b5cf6' },
  { id: 'demanda', nome: 'Demanda', cor: '#f59e0b' },
  { id: 'reuniao', nome: 'Reunião', cor: '#ef4444' },
  { id: 'lembrete', nome: 'Lembrete', cor: '#6b7280' }
];

const prioridades = [
  { id: 'baixa', nome: 'Baixa', cor: '#6b7280' },
  { id: 'media', nome: 'Média', cor: '#f59e0b' },
  { id: 'alta', nome: 'Alta', cor: '#ef4444' },
  { id: 'urgente', nome: 'Urgente', cor: '#dc2626' }
];

const AdminCalendario = () => {
  const { adminUser } = useAdminAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, list
  const [eventos, setEventos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [googleEvents, setGoogleEvents] = useState([]);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [lastSync, setLastSync] = useState(null);
  const [showGoogleEvents, setShowGoogleEvents] = useState(true);
  
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipo: 'tarefa',
    data_inicio: '',
    hora_inicio: '09:00',
    data_fim: '',
    hora_fim: '10:00',
    dia_inteiro: false,
    local: '',
    prioridade: 'media',
    responsaveis: [],
    enviar_lembrete: true
  });

  // Carregar eventos
  useEffect(() => {
    loadEventos();
    loadUsuarios();
  }, [currentDate]);

  const loadEventos = async () => {
    setLoading(true);
    try {
      // Calcular início e fim do mês atual
      const inicioMes = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const fimMes = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

      const { data, error } = await supabase
        .from('calendario_eventos')
        .select(`
          *,
          calendario_responsaveis (
            id,
            usuario_id,
            usuario_email,
            usuario_nome
          )
        `)
        .gte('data_inicio', inicioMes.toISOString())
        .lte('data_inicio', fimMes.toISOString())
        .order('data_inicio', { ascending: true });

      if (error) throw error;
      setEventos(data || []);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      // Carregar do localStorage como fallback
      const stored = localStorage.getItem('calendario_eventos');
      if (stored) {
        setEventos(JSON.parse(stored));
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_usuarios')
        .select('id, nome, email')
        .eq('ativo', true);

      if (error) throw error;
      setUsuarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  // Sincronizar com Google Calendar
  const syncGoogleCalendar = async () => {
    setSyncStatus('syncing');
    try {
      // Calcular período de 3 meses
      const timeMin = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1).toISOString();
      const timeMax = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0).toISOString();

      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'list',
          timeMin,
          timeMax
        })
      });

      const data = await response.json();

      if (data.success && data.events) {
        setGoogleEvents(data.events);
        setLastSync(new Date());
        setSyncStatus('success');
        
        // Salvar última sincronização no localStorage
        localStorage.setItem('google_calendar_last_sync', new Date().toISOString());
        localStorage.setItem('google_calendar_events', JSON.stringify(data.events));
      } else {
        throw new Error(data.error || 'Erro ao sincronizar');
      }
    } catch (error) {
      console.error('Erro ao sincronizar Google Calendar:', error);
      setSyncStatus('error');
      
      // Tentar carregar do cache local
      const cachedEvents = localStorage.getItem('google_calendar_events');
      if (cachedEvents) {
        setGoogleEvents(JSON.parse(cachedEvents));
        const cachedSync = localStorage.getItem('google_calendar_last_sync');
        if (cachedSync) setLastSync(new Date(cachedSync));
      }
    }
  };

  // Carregar eventos do Google Calendar ao iniciar
  useEffect(() => {
    const cachedEvents = localStorage.getItem('google_calendar_events');
    if (cachedEvents) {
      setGoogleEvents(JSON.parse(cachedEvents));
      const cachedSync = localStorage.getItem('google_calendar_last_sync');
      if (cachedSync) setLastSync(new Date(cachedSync));
    }
  }, []);

  const handleSaveEvento = async () => {
    try {
      const dataInicio = formData.dia_inteiro 
        ? new Date(formData.data_inicio + 'T00:00:00')
        : new Date(formData.data_inicio + 'T' + formData.hora_inicio);
      
      const dataFim = formData.dia_inteiro
        ? new Date((formData.data_fim || formData.data_inicio) + 'T23:59:59')
        : new Date((formData.data_fim || formData.data_inicio) + 'T' + formData.hora_fim);

      const eventoData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        tipo: formData.tipo,
        data_inicio: dataInicio.toISOString(),
        data_fim: dataFim.toISOString(),
        dia_inteiro: formData.dia_inteiro,
        local: formData.local,
        prioridade: formData.prioridade,
        cor: tiposEvento.find(t => t.id === formData.tipo)?.cor || '#3b82f6',
        status: 'pendente',
        created_by: adminUser?.id
      };

      if (selectedEvento) {
        // Atualizar evento existente
        const { error } = await supabase
          .from('calendario_eventos')
          .update(eventoData)
          .eq('id', selectedEvento.id);

        if (error) throw error;
      } else {
        // Criar novo evento
        const { data, error } = await supabase
          .from('calendario_eventos')
          .insert(eventoData)
          .select()
          .single();

        if (error) throw error;

        // Adicionar responsáveis
        if (formData.responsaveis.length > 0 && data) {
          const responsaveisData = formData.responsaveis.map(resp => ({
            evento_id: data.id,
            usuario_id: resp.id,
            usuario_email: resp.email,
            usuario_nome: resp.nome
          }));

          await supabase
            .from('calendario_responsaveis')
            .insert(responsaveisData);
        }
      }

      // Salvar também no localStorage como backup
      const eventosAtualizados = [...eventos];
      const novoEvento = { ...eventoData, id: selectedEvento?.id || Date.now().toString() };
      
      if (selectedEvento) {
        const index = eventosAtualizados.findIndex(e => e.id === selectedEvento.id);
        if (index >= 0) eventosAtualizados[index] = novoEvento;
      } else {
        eventosAtualizados.push(novoEvento);
      }
      
      localStorage.setItem('calendario_eventos', JSON.stringify(eventosAtualizados));

      setShowModal(false);
      resetForm();
      loadEventos();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      alert('Erro ao salvar evento. Tente novamente.');
    }
  };

  const handleDeleteEvento = async (eventoId) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
      const { error } = await supabase
        .from('calendario_eventos')
        .delete()
        .eq('id', eventoId);

      if (error) throw error;

      // Remover do localStorage
      const eventosAtualizados = eventos.filter(e => e.id !== eventoId);
      localStorage.setItem('calendario_eventos', JSON.stringify(eventosAtualizados));

      loadEventos();
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      tipo: 'tarefa',
      data_inicio: '',
      hora_inicio: '09:00',
      data_fim: '',
      hora_fim: '10:00',
      dia_inteiro: false,
      local: '',
      prioridade: 'media',
      responsaveis: [],
      enviar_lembrete: true
    });
    setSelectedEvento(null);
    setSelectedDate(null);
  };

  const handleOpenModal = (date = null, evento = null) => {
    if (evento) {
      const dataInicio = new Date(evento.data_inicio);
      const dataFim = evento.data_fim ? new Date(evento.data_fim) : dataInicio;
      
      setFormData({
        titulo: evento.titulo,
        descricao: evento.descricao || '',
        tipo: evento.tipo,
        data_inicio: dataInicio.toISOString().split('T')[0],
        hora_inicio: dataInicio.toTimeString().slice(0, 5),
        data_fim: dataFim.toISOString().split('T')[0],
        hora_fim: dataFim.toTimeString().slice(0, 5),
        dia_inteiro: evento.dia_inteiro || false,
        local: evento.local || '',
        prioridade: evento.prioridade || 'media',
        responsaveis: evento.calendario_responsaveis || [],
        enviar_lembrete: true
      });
      setSelectedEvento(evento);
    } else if (date) {
      setFormData(prev => ({
        ...prev,
        data_inicio: date.toISOString().split('T')[0],
        data_fim: date.toISOString().split('T')[0]
      }));
      setSelectedDate(date);
    }
    setShowModal(true);
  };

  // Funções de navegação do calendário
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Gerar dias do mês
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Dias do mês anterior
    const prevMonth = new Date(year, month, 0);
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false
      });
    }

    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }

    // Dias do próximo mês
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }

    return days;
  };

  const getEventosForDate = (date) => {
    // Eventos locais/Supabase
    const eventosLocais = eventos.filter(evento => {
      const eventoDate = new Date(evento.data_inicio);
      return eventoDate.toDateString() === date.toDateString();
    }).map(e => ({ ...e, source: 'local' }));

    // Eventos do Google Calendar (se habilitado)
    const eventosGoogle = showGoogleEvents ? googleEvents.filter(evento => {
      const eventoDate = new Date(evento.data_inicio);
      return eventoDate.toDateString() === date.toDateString();
    }).map(e => ({ ...e, source: 'google' })) : [];

    return [...eventosLocais, ...eventosGoogle];
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="admin-calendario">
      {/* Header */}
      <div className="calendario-header">
        <div className="header-content">
          <Icons.Calendar />
          <div className="header-text">
            <h1>Calendário</h1>
            <p>Gerencie tarefas, atividades, eventos e demandas</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-novo-evento" onClick={() => handleOpenModal(selectedDate)}>
            <Icons.Plus />
            <span>Novo Evento</span>
          </button>
        </div>
      </div>

      {/* Barra de Sincronização Google Calendar */}
      <div className="google-sync-bar">
        <div className="sync-info">
          <Icons.Google />
          <span className="sync-label">Google Agenda</span>
          {lastSync && (
            <span className="last-sync">
              Última sincronização: {lastSync.toLocaleString('pt-BR')}
            </span>
          )}
          {googleEvents.length > 0 && (
            <span className="events-count">
              {googleEvents.length} evento{googleEvents.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="sync-actions">
          <label className="toggle-google-events">
            <input
              type="checkbox"
              checked={showGoogleEvents}
              onChange={(e) => setShowGoogleEvents(e.target.checked)}
            />
            <span>Mostrar eventos do Google</span>
          </label>
          <button 
            className={`btn-sync ${syncStatus}`}
            onClick={syncGoogleCalendar}
            disabled={syncStatus === 'syncing'}
          >
            <Icons.Sync />
            <span>
              {syncStatus === 'syncing' ? 'Sincronizando...' : 
               syncStatus === 'success' ? 'Sincronizado' :
               syncStatus === 'error' ? 'Erro - Tentar novamente' :
               'Sincronizar'}
            </span>
          </button>
        </div>
      </div>

      {/* Navegação do Calendário */}
      <div className="calendario-nav">
        <div className="nav-controls">
          <button className="btn-nav" onClick={() => navigateMonth(-1)}>
            <Icons.ChevronLeft />
          </button>
          <button className="btn-hoje" onClick={goToToday}>Hoje</button>
          <button className="btn-nav" onClick={() => navigateMonth(1)}>
            <Icons.ChevronRight />
          </button>
        </div>
        <h2 className="mes-ano">{formatMonthYear(currentDate)}</h2>

      </div>

      {/* Conteúdo Principal - Layout de duas colunas */}
      <div className="calendario-content">
        {/* Coluna Esquerda - Calendário Compacto */}
        <div className="calendario-coluna-esquerda">
          <div className="calendario-grid-compact">
            {/* Cabeçalho dos dias da semana */}
            <div className="dias-semana-compact">
              {diasSemana.map(dia => (
                <div key={dia} className="dia-semana-compact">{dia}</div>
              ))}
            </div>

            {/* Grid de dias compacto */}
            <div className="dias-grid-compact">
              {getDaysInMonth().map((day, index) => {
                const eventosDay = getEventosForDate(day.date);
                const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
                return (
                  <div 
                    key={index}
                    className={`dia-cell-compact ${!day.isCurrentMonth ? 'outro-mes' : ''} ${isToday(day.date) ? 'hoje' : ''} ${isSelected ? 'selecionado' : ''} ${eventosDay.length > 0 ? 'tem-eventos' : ''}`}
                    onClick={() => setSelectedDate(day.date)}
                  >
                    <span className="dia-numero-compact">{day.date.getDate()}</span>
                    {eventosDay.length > 0 && (
                      <div className="eventos-indicador">
                        {eventosDay.slice(0, 3).map((evento, i) => (
                          <span 
                            key={i} 
                            className="evento-dot"
                            style={{ background: evento.cor || tiposEvento.find(t => t.id === evento.tipo)?.cor }}
                          ></span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legenda abaixo do calendário */}
          <div className="legenda-compact">
            {tiposEvento.map(tipo => (
              <span key={tipo.id} className="legenda-item-compact">
                <span className="legenda-cor-compact" style={{ background: tipo.cor }}></span>
                {tipo.nome}
              </span>
            ))}
          </div>
        </div>

        {/* Coluna Direita - Lista de Eventos */}
        <div className="calendario-coluna-direita">
          <div className="lista-header">
            <h3>
              <Icons.List />
              {selectedDate ? (
                <span>Eventos de {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              ) : (
                <span>Todos os Eventos do Mês</span>
              )}
            </h3>
            {selectedDate && (
              <button className="btn-ver-todos" onClick={() => setSelectedDate(null)}>
                Ver todos do mês
              </button>
            )}
          </div>

          <div className="lista-eventos-container">
            {loading ? (
              <div className="lista-loading">
                <div className="loading-spinner"></div>
                <p>Carregando eventos...</p>
              </div>
            ) : (() => {
              const eventosFiltrados = selectedDate 
                ? getEventosForDate(selectedDate)
                : [...eventos, ...(showGoogleEvents ? googleEvents : [])].sort((a, b) => new Date(a.data_inicio) - new Date(b.data_inicio));
              
              return eventosFiltrados.length === 0 ? (
                <div className="lista-vazia">
                  <Icons.Calendar />
                  <p>{selectedDate ? 'Nenhum evento neste dia' : 'Nenhum evento neste mês'}</p>
                  <button onClick={() => handleOpenModal(selectedDate)}>Criar evento</button>
                </div>
              ) : (
                <div className="lista-eventos">
                  {eventosFiltrados.map(evento => {
                    const tipoEvento = tiposEvento.find(t => t.id === evento.tipo);
                    const prioridadeEvento = prioridades.find(p => p.id === evento.prioridade);
                    return (
                      <div key={evento.id} className={`lista-evento-card ${evento.isGoogleEvent ? 'google-event' : ''}`}>
                        <div className="evento-cor-barra" style={{ background: evento.cor || tipoEvento?.cor }}></div>
                        <div className="evento-card-content">
                          <div className="evento-card-header">
                            <h4>{evento.titulo}</h4>
                            <div className="evento-badges">
                              <span className="badge-tipo" style={{ background: tipoEvento?.cor }}>
                                {tipoEvento?.nome || evento.tipo}
                              </span>
                              {prioridadeEvento && (
                                <span className={`badge-prioridade ${evento.prioridade}`}>
                                  {prioridadeEvento.nome}
                                </span>
                              )}
                              {evento.isGoogleEvent && (
                                <span className="badge-google">
                                  <Icons.Google /> Google
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="evento-card-meta">
                            <span className="meta-item">
                              <Icons.Calendar />
                              {new Date(evento.data_inicio).toLocaleDateString('pt-BR')}
                            </span>
                            {!evento.dia_inteiro && (
                              <span className="meta-item">
                                <Icons.Clock />
                                {new Date(evento.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                {evento.data_fim && ` - ${new Date(evento.data_fim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
                              </span>
                            )}
                            {evento.local && (
                              <span className="meta-item">
                                <Icons.MapPin />
                                {evento.local}
                              </span>
                            )}
                          </div>

                          {evento.descricao && (
                            <p className="evento-card-descricao">{evento.descricao}</p>
                          )}

                          {evento.responsaveis && evento.responsaveis.length > 0 && (
                            <div className="evento-card-responsaveis">
                              <Icons.Users />
                              <span>{evento.responsaveis.map(r => r.nome).join(', ')}</span>
                            </div>
                          )}
                        </div>

                        {!evento.isGoogleEvent && (
                          <div className="evento-card-acoes">
                            <button className="btn-icon-small" onClick={() => handleOpenModal(null, evento)} title="Editar">
                              <Icons.Edit />
                            </button>
                            <button className="btn-icon-small btn-danger" onClick={() => handleDeleteEvento(evento.id)} title="Excluir">
                              <Icons.Trash />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Modal de Evento */}
      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedEvento ? 'Editar Evento' : 'Novo Evento'}</h3>
              <button className="btn-close" onClick={() => { setShowModal(false); resetForm(); }}>
                <Icons.X />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={e => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Título do evento"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tipo</label>
                  <select
                    value={formData.tipo}
                    onChange={e => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
                  >
                    {tiposEvento.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Prioridade</label>
                  <select
                    value={formData.prioridade}
                    onChange={e => setFormData(prev => ({ ...prev, prioridade: e.target.value }))}
                  >
                    {prioridades.map(p => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.dia_inteiro}
                    onChange={e => setFormData(prev => ({ ...prev, dia_inteiro: e.target.checked }))}
                  />
                  <span>Dia inteiro</span>
                </label>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data Início *</label>
                  <input
                    type="date"
                    value={formData.data_inicio}
                    onChange={e => setFormData(prev => ({ ...prev, data_inicio: e.target.value }))}
                  />
                </div>
                {!formData.dia_inteiro && (
                  <div className="form-group">
                    <label>Hora Início</label>
                    <input
                      type="time"
                      value={formData.hora_inicio}
                      onChange={e => setFormData(prev => ({ ...prev, hora_inicio: e.target.value }))}
                    />
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data Fim</label>
                  <input
                    type="date"
                    value={formData.data_fim}
                    onChange={e => setFormData(prev => ({ ...prev, data_fim: e.target.value }))}
                  />
                </div>
                {!formData.dia_inteiro && (
                  <div className="form-group">
                    <label>Hora Fim</label>
                    <input
                      type="time"
                      value={formData.hora_fim}
                      onChange={e => setFormData(prev => ({ ...prev, hora_fim: e.target.value }))}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Local</label>
                <input
                  type="text"
                  value={formData.local}
                  onChange={e => setFormData(prev => ({ ...prev, local: e.target.value }))}
                  placeholder="Local do evento"
                />
              </div>

              <div className="form-group">
                <label>Responsáveis</label>
                <select
                  multiple
                  value={formData.responsaveis.map(r => r.id)}
                  onChange={e => {
                    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
                    const selectedUsers = usuarios.filter(u => selectedIds.includes(u.id));
                    setFormData(prev => ({ ...prev, responsaveis: selectedUsers }));
                  }}
                >
                  {usuarios.map(user => (
                    <option key={user.id} value={user.id}>{user.nome}</option>
                  ))}
                </select>
                <small>Segure Ctrl para selecionar múltiplos</small>
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={e => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descrição do evento"
                  rows="3"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.enviar_lembrete}
                    onChange={e => setFormData(prev => ({ ...prev, enviar_lembrete: e.target.checked }))}
                  />
                  <span>Enviar lembrete 48h antes</span>
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={() => { setShowModal(false); resetForm(); }}>
                Cancelar
              </button>
              <button 
                className="btn-salvar" 
                onClick={handleSaveEvento}
                disabled={!formData.titulo || !formData.data_inicio}
              >
                <Icons.Check />
                <span>{selectedEvento ? 'Atualizar' : 'Criar Evento'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rodapé */}
      <div className="calendario-footer">
        <p>DATA-RO INTELIGÊNCIA TERRITORIAL</p>
        <small>Todos os dados coletados respeitam às Normas da LGPD</small>
      </div>
    </div>
  );
};

export default AdminCalendario;
