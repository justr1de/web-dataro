import React, { useState, useEffect } from 'react';
import './AdminArquivosExcluidos.css';

// Ícones SVG
const Icons = {
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  RotateCcw: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"></polyline>
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
    </svg>
  ),
  TrashX: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  ),
  FileText: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
    </svg>
  ),
  Folder: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  Clock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  AlertTriangle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  )
};

const getItemIcon = (tipo) => {
  switch (tipo) {
    case 'documento': return <Icons.FileText />;
    case 'projeto': return <Icons.Folder />;
    case 'cliente': return <Icons.User />;
    case 'evento': return <Icons.Calendar />;
    default: return <Icons.FileText />;
  }
};

const AdminArquivosExcluidos = () => {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTipo, setSelectedTipo] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Simular itens excluídos
    const itensSimulados = [
      { id: 1, nome: 'Contrato Antigo.pdf', tipo: 'documento', excluido_por: 'Hugo Nascimento', data_exclusao: '2026-01-25T14:30:00', expira_em: '2026-02-25' },
      { id: 2, nome: 'Projeto Teste', tipo: 'projeto', excluido_por: 'Kaliel Cardoso', data_exclusao: '2026-01-24T10:15:00', expira_em: '2026-02-24' },
      { id: 3, nome: 'Cliente Inativo', tipo: 'cliente', excluido_por: 'DATA-RO Admin', data_exclusao: '2026-01-23T16:45:00', expira_em: '2026-02-23' },
      { id: 4, nome: 'Evento Cancelado', tipo: 'evento', excluido_por: 'Hugo Nascimento', data_exclusao: '2026-01-22T09:00:00', expira_em: '2026-02-22' },
    ];
    setItens(itensSimulados);
    setLoading(false);
  };

  const filteredItens = itens.filter(item => {
    if (selectedTipo && item.tipo !== selectedTipo) return false;
    return true;
  });

  const handleRestaurar = (item) => {
    if (window.confirm(`Deseja restaurar "${item.nome}"?`)) {
      alert(`"${item.nome}" restaurado com sucesso!`);
      setItens(itens.filter(i => i.id !== item.id));
    }
  };

  const handleExcluirPermanente = (item) => {
    if (window.confirm(`ATENÇÃO: Esta ação é irreversível!\n\nDeseja excluir permanentemente "${item.nome}"?`)) {
      alert(`"${item.nome}" excluído permanentemente!`);
      setItens(itens.filter(i => i.id !== item.id));
    }
  };

  const handleEsvaziarLixeira = () => {
    if (window.confirm('ATENÇÃO: Esta ação é irreversível!\n\nDeseja esvaziar toda a lixeira?')) {
      alert('Lixeira esvaziada!');
      setItens([]);
    }
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysRemaining = (expiraEm) => {
    const hoje = new Date();
    const expira = new Date(expiraEm);
    const diff = Math.ceil((expira - hoje) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="admin-arquivos-excluidos">
      {/* Header */}
      <div className="excluidos-header">
        <div className="header-title">
          <Icons.Trash />
          <div className="header-text">
            <h1>Arquivos Excluídos</h1>
            <span className="header-subtitle">Itens excluídos são mantidos por 30 dias antes da exclusão permanente</span>
          </div>
        </div>
        {itens.length > 0 && (
          <button className="btn-esvaziar" onClick={handleEsvaziarLixeira}>
            <Icons.TrashX />
            Esvaziar Lixeira
          </button>
        )}
      </div>

      {/* Aviso */}
      <div className="warning-banner">
        <Icons.AlertTriangle />
        <p>Os itens serão excluídos permanentemente após 30 dias. Restaure-os antes do prazo para recuperá-los.</p>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Tipo de Item</label>
          <select value={selectedTipo} onChange={(e) => setSelectedTipo(e.target.value)}>
            <option value="">Todos os Tipos</option>
            <option value="documento">Documentos</option>
            <option value="projeto">Projetos</option>
            <option value="cliente">Clientes</option>
            <option value="evento">Eventos</option>
          </select>
        </div>
      </div>

      {/* Lista de Itens */}
      <div className="excluidos-section">
        <div className="section-header">
          <Icons.Trash />
          <h2>Itens na Lixeira ({filteredItens.length})</h2>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Carregando...</p>
          </div>
        ) : filteredItens.length === 0 ? (
          <div className="empty-state">
            <Icons.Trash />
            <p>A lixeira está vazia</p>
          </div>
        ) : (
          <div className="excluidos-list">
            {filteredItens.map(item => (
              <div key={item.id} className="excluido-item">
                <div className="item-icon">
                  {getItemIcon(item.tipo)}
                </div>
                <div className="item-content">
                  <div className="item-header">
                    <h3>{item.nome}</h3>
                    <span className="tipo-badge">{item.tipo.toUpperCase()}</span>
                  </div>
                  <div className="item-meta">
                    <span><Icons.User /> Excluído por: {item.excluido_por}</span>
                    <span><Icons.Clock /> {formatDateTime(item.data_exclusao)}</span>
                  </div>
                  <div className="item-expira">
                    <span className={getDaysRemaining(item.expira_em) <= 7 ? 'expira-urgente' : ''}>
                      Expira em {getDaysRemaining(item.expira_em)} dias
                    </span>
                  </div>
                </div>
                <div className="item-actions">
                  <button className="btn-restaurar" onClick={() => handleRestaurar(item)}>
                    <Icons.RotateCcw />
                    Restaurar
                  </button>
                  <button className="btn-excluir-permanente" onClick={() => handleExcluirPermanente(item)}>
                    <Icons.TrashX />
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminArquivosExcluidos;
