import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import logo from '../../assets/logo.png';
import './Login.css';

const TrocarSenha = () => {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (novaSenha.length < 6) {
      setError('A nova senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (novaSenha === '123456') {
      setError('Por segurança, não use "123456" como senha');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      // Verificar senha atual
      const { data: userData, error: fetchError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError || !userData) {
        setError('Erro ao verificar usuário');
        setLoading(false);
        return;
      }

      if (userData.senha_hash !== senhaAtual) {
        setError('Senha atual incorreta');
        setLoading(false);
        return;
      }

      // Atualizar senha
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ 
          senha_hash: novaSenha,
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        setError('Erro ao atualizar senha');
        setLoading(false);
        return;
      }

      alert('Senha alterada com sucesso! Faça login novamente.');
      logout();
      navigate('/paineis/login');
      
    } catch (error) {
      setError('Erro ao trocar senha: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="page-header">
        <h2>DATA-RO INTELIGÊNCIA TERRITORIAL</h2>
      </div>

      <div className="login-container">
        <div className="login-left">
          <div className="logo-watermark">
            <img src={logo} alt="Logo DATA-RO" />
          </div>
        </div>

        <div className="login-center">
          <div className="login-box">
            <div className="login-header">
              <h1>Trocar Senha</h1>
              <p>Por segurança, você deve alterar sua senha padrão</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label>Senha Atual</label>
                <input
                  type="password"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  placeholder="Digite sua senha atual"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Nova Senha</label>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Digite sua nova senha (mínimo 6 caracteres)"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Confirmar Nova Senha</label>
                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Digite novamente sua nova senha"
                  disabled={loading}
                />
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Alterando...' : 'Alterar Senha'}
              </button>
            </form>

            <div className="login-footer">
              <p>TODOS OS DIREITOS RESERVADOS</p>
            </div>
          </div>
        </div>

        <div className="login-right">
          {/* Vazio para manter layout simétrico */}
        </div>
      </div>

      <div className="page-footer">
        <p>Informações atualizadas diariamente</p>
      </div>
    </div>
  );
};

export default TrocarSenha;
