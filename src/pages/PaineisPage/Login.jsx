import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getBandeiraUrl } from '../../utils/bandeirasMap';
import logo from '../../assets/logo.png';
import bandeiraRondonia from '../../assets/bandeira-rondonia.png';
import headerImage from '../../assets/header-login-light-blue.svg';
import ThemeToggle from '../../components/ThemeToggle';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSet, setCurrentSet] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const { login } = useAuth();
  const navigate = useNavigate();

  // Todos os 52 municípios de Rondônia (organizados para carrossel harmônico)
  const municipiosRondonia = [
    // Página 1 (12 municípios)
    'Alta Floresta d\'Oeste', 'Alto Alegre dos Parecis', 'Alto Paraíso', 'Alvorada d\'Oeste',
    'Ariquemes', 'Buritis', 'Cabixi', 'Cacaulândia',
    'Cacoal', 'Campo Novo de Rondônia', 'Candeias do Jamari', 'Castanheiras',
    // Página 2 (12 municípios)
    'Cerejeiras', 'Chupinguaia', 'Colorado do Oeste', 'Corumbiara',
    'Costa Marques', 'Cujubim', 'Espigão d\'Oeste', 'Governador Jorge Teixeira',
    'Guajará-Mirim', 'Itapuã do Oeste', 'Jaru', 'Ji-Paraná',
    // Página 3 (12 municípios)
    'Machadinho d\'Oeste', 'Ministro Andreazza', 'Mirante da Serra', 'Monte Negro',
    'Nova Brasilândia d\'Oeste', 'Nova Mamoré', 'Nova União', 'Novo Horizonte do Oeste',
    'Ouro Preto do Oeste', 'Parecis', 'Pimenta Bueno', 'Pimenteiras do Oeste',
    // Página 4 (12 municípios)
    'Porto Velho', 'Presidente Médici', 'Primavera de Rondônia', 'Rio Crespo',
    'Rolim de Moura', 'Santa Luzia d\'Oeste', 'São Felipe d\'Oeste', 'São Francisco do Guaporé',
    'São Miguel do Guaporé', 'Seringueiras', 'Teixeirópolis', 'Theobroma',
    // Página 5 (4 municípios - organizados para visual harmônico)
    'Urupá', 'Vale do Anari', 'Vale do Paraíso', 'Vilhena'
  ];

  // Grid 3x4 = 12 bandeiras por conjunto
  const bandeirasPerSet = 12;
  const totalSets = Math.ceil(municipiosRondonia.length / bandeirasPerSet);

  // Preload de imagens para otimizar carregamento
  useEffect(() => {
    const preloadImages = () => {
      municipiosRondonia.forEach((municipio) => {
        const img = new Image();
        img.src = getBandeiraUrl(municipio);
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, municipio]));
        };
        img.onerror = () => {
          console.warn(`Falha ao carregar bandeira de ${municipio}`);
        };
      });
    };

    preloadImages();
  }, []);

  // Carrossel automático - troca o conjunto a cada 8 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSet((prevSet) => (prevSet + 1) % totalSets);
    }, 8000);

    return () => clearInterval(interval);
  }, [totalSets]);

  // Obter bandeiras do conjunto atual
  const getBandeirasAtuais = () => {
    const startIndex = currentSet * bandeirasPerSet;
    return municipiosRondonia.slice(startIndex, startIndex + bandeirasPerSet);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, senha);

    if (result.success) {
      // Se requer troca de senha, redirecionar para página de troca
      if (result.requerTrocaSenha) {
        navigate('/paineis/trocar-senha');
      } else {
        navigate('/paineis/dashboard');
      }
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
      <header className="page-header page-header-with-image">
        <img 
          src={headerImage} 
          alt="DATA-RO INTELIGÊNCIA TERRITORIAL" 
          className="header-image"
          onError={(e) => {
            console.error('Erro ao carregar imagem do header:', headerImage);
            e.target.style.display = 'none';
          }}
          onLoad={() => console.log('Imagem do header carregada com sucesso!')}
        />
        <ThemeToggle className="header-theme-toggle" />
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
              <div className="header-with-flag">
                <img 
                  src={bandeiraRondonia} 
                  alt="Bandeira de Rondônia" 
                  className="bandeira-rondonia"
                />
                <h1>RONDÔNIA EM NÚMEROS</h1>
              </div>
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
                  className={loadedImages.has(municipio) ? 'loaded' : 'loading'}
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/120x90/10b981/ffffff?text=${encodeURIComponent(municipio.substring(0, 3))}`;
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
        <p className="footer-brand">DATA-RO INTELIGÊNCIA TERRITORIAL</p>
        <p className="copyright">TODOS OS DIREITOS RESERVADOS</p>
      </footer>
    </div>
  );
};

export default Login;
