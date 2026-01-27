import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import './AdminDocumentos.css';

// Ícones SVG
const Icons = {
  FileText: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
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
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  ),
  Folder: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  ),
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Eye: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  FilePdf: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  ),
  FileDoc: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
    </svg>
  ),
  FileXls: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <rect x="8" y="12" width="8" height="6" rx="1"></rect>
    </svg>
  ),
  FileImg: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  )
};

const getFileIcon = (tipo) => {
  switch (tipo) {
    case 'pdf': return <Icons.FilePdf />;
    case 'doc':
    case 'docx': return <Icons.FileDoc />;
    case 'xls':
    case 'xlsx': return <Icons.FileXls />;
    case 'jpg':
    case 'jpeg':
    case 'png': return <Icons.FileImg />;
    default: return <Icons.FileText />;
  }
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const AdminDocumentos = () => {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedCliente, setSelectedCliente] = useState('');
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Buscar clientes
      const { data: clientesData } = await supabase
        .from('admin_gabinetes')
        .select('*')
        .order('nome', { ascending: true });
      setClientes(clientesData || []);

      // Simular documentos
      const documentosSimulados = [
        { id: 1, nome: 'Contrato de Prestação de Serviços', tipo: 'pdf', tamanho: 2456789, cliente: clientesData?.[0]?.nome, data: '2026-01-15' },
        { id: 2, nome: 'Relatório Mensal Janeiro', tipo: 'xlsx', tamanho: 1234567, cliente: clientesData?.[0]?.nome, data: '2026-01-20' },
        { id: 3, nome: 'Proposta Comercial', tipo: 'docx', tamanho: 567890, cliente: clientesData?.[1]?.nome, data: '2026-01-22' },
        { id: 4, nome: 'Logo Oficial', tipo: 'png', tamanho: 345678, cliente: clientesData?.[1]?.nome, data: '2026-01-25' },
      ];
      setDocumentos(documentosSimulados);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
    setLoading(false);
  };

  const filteredDocumentos = documentos.filter(doc => {
    if (searchTerm && !doc.nome.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedTipo && doc.tipo !== selectedTipo) return false;
    if (selectedCliente && doc.cliente !== selectedCliente) return false;
    return true;
  });

  const handleUpload = () => {
    alert('Funcionalidade de upload em desenvolvimento');
  };

  const handleDownload = (doc) => {
    alert(`Baixando: ${doc.nome}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este documento?')) {
      alert('Documento excluído!');
    }
  };

  return (
    <div className="admin-documentos">
      {/* Header */}
      <div className="documentos-header">
        <div className="header-title">
          <Icons.FileText />
          <div className="header-text">
            <h1>Documentos</h1>
            <span className="header-subtitle">Gerencie arquivos e documentos dos clientes</span>
          </div>
        </div>
        <button className="btn-upload" onClick={handleUpload}>
          <Icons.Upload />
          Enviar Documento
        </button>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="search-box">
          <Icons.Search />
          <input
            type="text"
            placeholder="Buscar documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select value={selectedTipo} onChange={(e) => setSelectedTipo(e.target.value)}>
            <option value="">Todos os Tipos</option>
            <option value="pdf">PDF</option>
            <option value="docx">Word</option>
            <option value="xlsx">Excel</option>
            <option value="png">Imagem</option>
          </select>
        </div>
        <div className="filter-group">
          <select value={selectedCliente} onChange={(e) => setSelectedCliente(e.target.value)}>
            <option value="">Todos os Clientes</option>
            {clientes.map(c => (
              <option key={c.id} value={c.nome}>{c.nome}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Documentos */}
      <div className="documentos-section">
        <div className="section-header">
          <Icons.Folder />
          <h2>Documentos ({filteredDocumentos.length})</h2>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Carregando documentos...</p>
          </div>
        ) : filteredDocumentos.length === 0 ? (
          <div className="empty-state">
            <Icons.FileText />
            <p>Nenhum documento encontrado</p>
          </div>
        ) : (
          <div className="documentos-grid">
            {filteredDocumentos.map(doc => (
              <div key={doc.id} className="documento-card">
                <div className="documento-icon">
                  {getFileIcon(doc.tipo)}
                </div>
                <div className="documento-info">
                  <h3>{doc.nome}</h3>
                  <div className="documento-meta">
                    <span className="tipo-badge">{doc.tipo.toUpperCase()}</span>
                    <span>{formatFileSize(doc.tamanho)}</span>
                    <span>{new Date(doc.data).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <span className="cliente-nome">{doc.cliente}</span>
                </div>
                <div className="documento-actions">
                  <button className="btn-action btn-view" title="Visualizar">
                    <Icons.Eye />
                  </button>
                  <button className="btn-action btn-download" onClick={() => handleDownload(doc)} title="Baixar">
                    <Icons.Download />
                  </button>
                  <button className="btn-action btn-delete" onClick={() => handleDelete(doc.id)} title="Excluir">
                    <Icons.Trash />
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

export default AdminDocumentos;
