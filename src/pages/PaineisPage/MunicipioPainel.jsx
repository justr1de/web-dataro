import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../utils/supabaseClient';
import { getBandeiraUrl } from '../../utils/bandeirasMap';
import ThemeToggle from '../../components/ThemeToggle';
import './MunicipioPainel.css';
import logoDataRO from '../../assets/logo-dataro-transparente.png';

const MunicipioPainel = () => {
  const { id } = useParams();
  const [municipio, setMunicipio] = useState(null);
  const [painel, setPainel] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const iframeContainerRef = useRef(null);

  useEffect(() => {
    // Aguardar o AuthContext carregar antes de verificar autenticação
    if (authLoading) return;
    
    if (!user) {
      navigate('/paineis/login');
      return;
    }

    fetchMunicipioPainel();
  }, [id, user, authLoading, navigate]);

  const fetchMunicipioPainel = async () => {
    try {
      // Buscar município
      const { data: municipioData, error: municipioError } = await supabase
        .from('municipios')
        .select('*')
        .eq('id', id)
        .single();

      if (municipioError) throw municipioError;
      setMunicipio(municipioData);

      // Buscar painel do banco de dados
      const { data: painelData, error: painelError } = await supabase
        .from('paineis_bi')
        .select('*')
        .eq('municipio_id', id)
        .eq('status', 'ativo')
        .single();

      if (!painelError && painelData) {
        setPainel(painelData);
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/paineis/dashboard');
  };

  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (iframeContainerRef.current?.requestFullscreen) {
        iframeContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="skeleton-container">
      <div className="skeleton-header">
        <div className="skeleton-bandeira"></div>
        <div className="skeleton-text">
          <div className="skeleton-title"></div>
          <div className="skeleton-subtitle"></div>
        </div>
      </div>
      <div className="skeleton-iframe">
        <div className="skeleton-spinner">
          <div className="spinner"></div>
          <p>Carregando painel...</p>
        </div>
      </div>
    </div>
  );

  // Mostrar loading enquanto AuthContext carrega
  if (authLoading || pageLoading) {
    return (
      <div className="painel-container">
        <SkeletonLoader />
      </div>
    );
  }

  if (!municipio) {
    return (
      <div className="painel-container">
        <div className="error-message">
          <h2>Município não encontrado</h2>
          <button onClick={handleBack} className="back-button">
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!painel) {
    return (
      <div className="painel-container">
        <header className="painel-header">
          <div className="header-left">
            <button onClick={handleBack} className="back-button">
              ← Voltar
            </button>
            <nav className="breadcrumb">
              <Link to="/paineis/dashboard">Dashboard</Link>
              <span className="breadcrumb-separator">›</span>
              <span>{municipio.nome}</span>
            </nav>
          </div>
          <div className="header-right">
            <ThemeToggle />
          </div>
        </header>
        <main className="painel-main">
          <div className="no-painel">
            <h2>Painel em desenvolvimento</h2>
            <p>O painel de BI para {municipio.nome} ainda não está disponível.</p>
            <button onClick={handleBack} className="back-button">
              Voltar ao Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="painel-container">
      <header className="painel-header">
        <div className="header-top">
          <div className="header-left">
            <button onClick={handleBack} className="back-button">
              ← Voltar
            </button>
            <nav className="breadcrumb">
              <Link to="/paineis/dashboard">Dashboard</Link>
              <span className="breadcrumb-separator">›</span>
              <span>{municipio.nome}</span>
            </nav>
          </div>
          <div className="header-right">
            <button onClick={toggleFullscreen} className="fullscreen-button" title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}>
              {isFullscreen ? '⛶' : '⛶'}
            </button>
            <ThemeToggle />
          </div>
        </div>
        
        <div className="painel-info">
          <div className="painel-header-content">
            {getBandeiraUrl(municipio.nome) ? (
              <img 
                src={getBandeiraUrl(municipio.nome)} 
                alt={`Bandeira de ${municipio.nome}`}
                className="painel-bandeira"
              />
            ) : (
              <div className="bandeira-placeholder-small">
                <span>{municipio.nome.substring(0, 3)}</span>
              </div>
            )}

            <div className="painel-text">
              <h1>{municipio.nome}</h1>
              <p>{painel.titulo}</p>
            </div>
          </div>
          <div className="painel-copyright">
            <img src={logoDataRO} alt="DATA-RO" className="copyright-logo" />
            <span>© DESENVOLVIDO POR DATA-RO INTELIGÊNCIA TERRITORIAL.<br/>TODOS OS DIREITOS RESERVADOS.</span>
          </div>
        </div>
      </header>

      <main className="painel-main" ref={iframeContainerRef}>
        {iframeLoading && (
          <div className="iframe-loading-overlay">
            <div className="spinner"></div>
            <p>Carregando painel de BI...</p>
          </div>
        )}
        <iframe
          src={painel.url_powerbi}
          frameBorder="0"
          allowFullScreen={true}
          className={`powerbi-iframe ${iframeLoading ? 'loading' : ''}`}
          title={`Painel de BI - ${municipio.nome}`}
          onLoad={handleIframeLoad}
        />
      </main>

      <footer className="painel-footer">
        <div className="footer-content">
          <div className="footer-info">
            <img src={logoDataRO} alt="DATA-RO" className="footer-logo" />
            <div className="footer-text">
              <strong>DATA-RO Inteligência Territorial</strong>
              <p>Plataforma de Gestão Integrada dos Municípios de Rondônia</p>
            </div>
          </div>
          <div className="footer-contact">
            <p><strong>Contato:</strong></p>
            <p>contato@dataro-it.com.br</p>
            <p>www.dataro-it.com.br</p>
          </div>
          <div className="footer-links">
            <Link to="/">Página Inicial</Link>
            <Link to="/paineis/dashboard">Dashboard</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} DATA-RO Inteligência Territorial. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default MunicipioPainel;
