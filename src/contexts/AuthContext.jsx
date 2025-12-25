import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext({});

// Função para registrar log de auditoria
const registrarLogAuditoria = async (email, tipoEvento, detalhes) => {
  try {
    await supabase
      .from('log_auditoria')
      .insert({
        email: email,
        tipo_evento: tipoEvento,
        user_agent: navigator.userAgent,
        detalhes: detalhes
      });
  } catch (error) {
    console.error('Erro ao registrar log de auditoria:', error);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const storedUser = localStorage.getItem('paineis_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      // Primeiro, buscar usuário pelo email (independente do status)
      const { data: userDataCheck, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single();

      // Se usuário existe mas está inativo, mostrar mensagem personalizada
      if (userDataCheck && !userDataCheck.ativo) {
        // Registrar tentativa de acesso de usuário inativo
        await registrarLogAuditoria(
          email,
          'TENTATIVA_ACESSO_CONTA_INATIVA',
          `Tentativa de login em conta desativada. Nome: ${userDataCheck.nome}`
        );
        
        // Mensagem específica para usuários inativos
        if (userDataCheck.email === 'romuloazevedo.ro@gmail.com') {
          throw new Error('Base de dados indisponível.');
        }
        throw new Error('Conta desativada. Entre em contato com o administrador.');
      }

      // Buscar usuário ativo
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('ativo', true)
        .single();

      if (error || !data) {
        // Registrar tentativa de login com credenciais inválidas
        await registrarLogAuditoria(
          email,
          'TENTATIVA_LOGIN_FALHA',
          'Usuário não encontrado ou inativo'
        );
        throw new Error('Credenciais inválidas');
      }

      // Por simplicidade, vamos usar comparação direta de senha
      // Em produção, use bcrypt para hash de senhas
      if (data.senha_hash !== senha) {
        // Registrar tentativa de login com senha incorreta
        await registrarLogAuditoria(
          email,
          'TENTATIVA_LOGIN_SENHA_INCORRETA',
          `Senha incorreta para o usuário: ${data.nome}`
        );
        throw new Error('Credenciais inválidas');
      }

      // Login bem-sucedido - registrar
      await registrarLogAuditoria(
        email,
        'LOGIN_SUCESSO',
        `Login realizado com sucesso. Nome: ${data.nome}`
      );

      const userData = {
        id: data.id,
        email: data.email,
        nome: data.nome,
        role: data.role
      };

      setUser(userData);
      localStorage.setItem('paineis_user', JSON.stringify(userData));
      
      // Verificar se é senha padrão (requer troca)
      // Exceção para conta principal do sistema
      const isContaPrincipal = data.email === 'contato@dataro-it.com.br';
      const requerTrocaSenha = !isContaPrincipal && (data.senha_hash === '123456' || data.primeiro_acesso);
      
      return { success: true, requerTrocaSenha };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    // Registrar logout
    if (user) {
      registrarLogAuditoria(
        user.email,
        'LOGOUT',
        `Logout realizado. Nome: ${user.nome}`
      );
    }
    setUser(null);
    localStorage.removeItem('paineis_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
