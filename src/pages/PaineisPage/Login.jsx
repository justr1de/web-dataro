import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getBandeiraUrl } from '../../utils/bandeirasMap';
import logo from '../../assets/logo.png';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSet, setCurrentSet] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Lista completa de 36 municípios
  const todosMunicipios = [
    'Ariquemes', 'Cacoal', 'Jaru', 'Pimenta Bueno',
    'Buritis', 'Espigão d\'Oeste', 'Alta Floresta d\'Oeste', 'Alto Alegre dos Parecis',
    'Alto Paraíso', 'Alvorada d\'Oeste', 'Cacaulândia', 'Campo Novo de Rondônia',
    'Candeias do Jamari', 'Cerejeiras', 'Chupinguaia', 'Corumbiara',
    'Itapuã do Oeste', 'Machadinho d\'Oeste', 'Monte Negro', 'Nova Mamoré',
    'Nova União', 'Novo Horizonte do Oeste', 'Parecis', 'Seringueiras',
    'Alvorada d\'Oeste', 'Cabixi', 'Castanheiras', 'Colorado do Oeste',
    'Costa Marques', 'Cujubim', 'Governador Jorge Teixeira', 'Guajará-Mirim',
    'Ministro Andreazza', 'Mirante da Serra', 'Nova Brasilândia d\'Oeste', 'Ouro Preto do Oeste'
  ];

  // Dividir em grupos de 12 bandeiras
  const bandeirasPerSet = 12;
  const totalSets = Math.ceil(todosMunicipios.length / bandeirasPerSet);

  // Carrossel automático - troca o conjunto a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSet((prevSet) => (prevSet + 1) % totalSets);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSets]);

  // Obter bandeiras do conjunto atual
  const getBandeirasAtuais = () => {
    const startIndex = currentSet * bandeirasPerSet;
    return todosMunicipios.slice(startIndex, startIndex + bandeirasPerSet);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, senha);

    if (result.success) {
      navigate('/paineis/dashboard');
    } else {
      setError(result.error || 'Erro ao fazer login');
    }

    setLoading(false);
  };

  const handleVoltar = () => {
    navigate('/');
  };

  const handleContato = () => {
    navigate('/');
    setTimeout(() => {
      const contatoSection = document.getElementById('contato');
      if (contatoSection) {
        contatoSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="login-page-wrapper">
      {/* Cabeçalho da Página */}
      <header className="page-header">
        <h2>DATA-RO INTELIGÊNCIA TERRITORIAL</h2>
      </header>

      <div className="login-container">
        {/* Coluna Esquerda - Logo DATA-RO */}
        <div className="login-left">
          <div className="logo-watermark">
            <img src={logo} alt="DATA-RO" />
          </div>
        </div>

        {/* Coluna Centro - Formulário */}
        <div className="login-center">
          <div className="login-box">
            <div className="login-header">
              <h1>RONDÔNIA EM NÚMEROS</h1>
              <p>Plataforma de Gestão Integrada dos Municípios de Rondônia</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input
                  type="password"
                  id="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            {/* Botões adicionais */}
            <div className="login-actions">
              <button onClick={handleVoltar} className="action-button secondary">
                Voltar à página inicial
              </button>
              <button onClick={handleContato} className="action-button secondary">
                Para ter acesso entre em contato conosco
              </button>
            </div>

            <div className="login-footer">
              <p>TODOS OS DIREITOS RESERVADOS</p>
            </div>
          </div>
        </div>

        {/* Coluna Direita - Grid de Bandeiras com Carrossel */}
        <div className="login-right">
          <h3>Municípios de Rondônia</h3>
          <div className="bandeiras-grid-carousel">
            {getBandeirasAtuais().map((municipio, index) => (
              <div key={`${currentSet}-${index}`} className="bandeira-grid-item">
                <img
                  src={getBandeiraUrl(municipio)}
                  alt={`Bandeira de ${municipio}`}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/120x90/667eea/ffffff?text=${encodeURIComponent(municipio.substring(0, 3))}`;
                  }}
                />
                <span className="bandeira-nome">{municipio}</span>
              </div>
            ))}
          </div>
          
          {/* Indicadores do carrossel */}
          <div className="carousel-indicators">
            {Array.from({ length: totalSets }).map((_, index) => (
              <span 
                key={index}
                className={`indicator ${index === currentSet ? 'active' : ''}`}
                onClick={() => setCurrentSet(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Rodapé da Página */}
      <footer className="page-footer">
        <p>Informações atualizadas diariamente</p>
      </footer>
    </div>
  );
};

export default Login;
