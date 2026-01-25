import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AdminAuthContext = createContext({});

// Gerar ID único para a sessão
const generateSessionId = () => {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Função para registrar log de auditoria admin
const registrarLogAuditoriaAdmin = async (email, tipoEvento, detalhes, ipAddress = null) => {
  try {
    await supabase
      .from('admin_log_auditoria')
      .insert({
        email: email,
        tipo_evento: tipoEvento,
        user_agent: navigator.userAgent,
        detalhes: detalhes,
        ip_address: ipAddress
      });
  } catch (error) {
    console.error('Erro ao registrar log de auditoria admin:', error);
  }
};

// Função para obter IP do cliente
const getClientIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Erro ao obter IP:', error);
    return null;
  }
};

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    // Verificar se há admin logado no localStorage
    const storedAdmin = localStorage.getItem('admin_user');
    const storedSessionId = localStorage.getItem('admin_session_id');
    
    if (storedAdmin && storedSessionId) {
      const adminData = JSON.parse(storedAdmin);
      setAdminUser(adminData);
      setSessionId(storedSessionId);
    }
    setLoading(false);
  }, []);

  const loginAdmin = async (email, senha) => {
    try {
      // Obter IP do cliente
      const clientIP = await getClientIP();

      // Buscar admin pelo email
      const { data, error } = await supabase
        .from('admin_usuarios')
        .select('*')
        .eq('email', email)
        .eq('ativo', true)
        .single();

      if (error || !data) {
        await registrarLogAuditoriaAdmin(
          email,
          'TENTATIVA_LOGIN_FALHA',
          'Usuário admin não encontrado ou inativo',
          clientIP
        );
        throw new Error('Credenciais inválidas');
      }

      // Verificar senha
      if (data.senha_hash !== senha) {
        await registrarLogAuditoriaAdmin(
          email,
          'TENTATIVA_LOGIN_SENHA_INCORRETA',
          `Senha incorreta para o admin: ${data.nome}`,
          clientIP
        );
        throw new Error('Credenciais inválidas');
      }

      // Gerar nova sessão
      const newSessionId = generateSessionId();

      // Login bem-sucedido
      await registrarLogAuditoriaAdmin(
        email,
        'LOGIN_SUCESSO',
        `Login admin realizado com sucesso. Nome: ${data.nome}. IP: ${clientIP}. Navegador: ${navigator.userAgent.substring(0, 100)}`,
        clientIP
      );

      // Atualizar último acesso
      await supabase
        .from('admin_usuarios')
        .update({ ultimo_acesso: new Date().toISOString() })
        .eq('id', data.id);

      const adminData = {
        id: data.id,
        email: data.email,
        nome: data.nome,
        role: data.role,
        avatar_url: data.avatar_url,
        github: data.github,
        is_super_admin: data.is_super_admin || data.email === 'contato@dataro-it.com.br',
        primeiro_acesso: data.primeiro_acesso
      };

      setAdminUser(adminData);
      setSessionId(newSessionId);
      localStorage.setItem('admin_user', JSON.stringify(adminData));
      localStorage.setItem('admin_session_id', newSessionId);
      
      return { success: true, primeiro_acesso: data.primeiro_acesso };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const atualizarSenha = async (novaSenha) => {
    try {
      if (!adminUser) {
        throw new Error('Usuário não autenticado');
      }

      const clientIP = await getClientIP();

      // Atualizar senha no banco
      const { error } = await supabase
        .from('admin_usuarios')
        .update({ 
          senha_hash: novaSenha,
          primeiro_acesso: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', adminUser.id);

      if (error) {
        throw new Error('Erro ao atualizar senha');
      }

      // Registrar log
      await registrarLogAuditoriaAdmin(
        adminUser.email,
        'SENHA_ALTERADA',
        `Senha alterada com sucesso. Nome: ${adminUser.nome}`,
        clientIP
      );

      // Atualizar estado local
      const updatedUser = { ...adminUser, primeiro_acesso: false };
      setAdminUser(updatedUser);
      localStorage.setItem('admin_user', JSON.stringify(updatedUser));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logoutAdmin = async (silent = false) => {
    if (adminUser && !silent) {
      const clientIP = await getClientIP();
      await registrarLogAuditoriaAdmin(
        adminUser.email,
        'LOGOUT',
        `Logout admin realizado. Nome: ${adminUser.nome}`,
        clientIP
      );
    }
    
    setAdminUser(null);
    setSessionId(null);
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_session_id');
  };

  const isSuperAdmin = () => {
    return adminUser?.is_super_admin || adminUser?.email === 'contato@dataro-it.com.br';
  };

  return (
    <AdminAuthContext.Provider value={{ 
      adminUser, 
      loginAdmin, 
      logoutAdmin, 
      atualizarSenha,
      loading,
      isSuperAdmin,
      sessionId
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
