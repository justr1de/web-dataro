import React from 'react';
import { useLocation } from 'react-router-dom';
import './AdminPlaceholder.css';

const Icons = {
  Construction: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h20"></path>
      <path d="M5 20v-4h4v4"></path>
      <path d="M15 20v-4h4v4"></path>
      <path d="M5 16v-4h4v4"></path>
      <path d="M15 16v-4h4v4"></path>
      <path d="M9 12V8h6v4"></path>
      <path d="M12 8V4"></path>
    </svg>
  )
};

const pageNames = {
  '/admin/demandas': 'Demandas',
  '/admin/relatorios': 'Relatórios',
  '/admin/contatos': 'Contatos',
  '/admin/perfil': 'Meu Perfil',
  '/admin/usuarios': 'Usuários',
  '/admin/credenciais': 'Credenciais de Clientes',
  '/admin/busca': 'Busca de Arquivos',
  '/admin/logs': 'Logs de Acesso',
  '/admin/excluidos': 'Arquivos Excluídos',
  '/admin/configuracoes': 'Configurações'
};

const AdminPlaceholder = () => {
  const location = useLocation();
  const pageName = pageNames[location.pathname] || 'Página';

  return (
    <div className="admin-placeholder">
      <div className="placeholder-content">
        <Icons.Construction />
        <h1>{pageName}</h1>
        <p>Esta funcionalidade está em desenvolvimento.</p>
        <p className="placeholder-subtitle">Em breve estará disponível.</p>
      </div>
      <div className="placeholder-footer">
        <p>DATA-RO INTELIGÊNCIA TERRITORIAL</p>
      </div>
    </div>
  );
};

export default AdminPlaceholder;
