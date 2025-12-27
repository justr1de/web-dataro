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
              
              <div className="municipio-info-details">
                {municipio.prefeito && (
                  <div className="info-item">
                    <span className="info-label">Prefeito(a):</span>
                    <span className="info-value">{municipio.prefeito}</span>
                  </div>
                )}
                {municipio.telefone && (
                  <div className="info-item">
                    <span className="info-label">Telefone:</span>
                    <span className="info-value">{municipio.telefone}</span>
                  </div>
                )}
                {municipio.email && (
                  <div className="info-item">
                    <span className="info-label">E-mail:</span>
                    <span className="info-value">{municipio.email}</span>
                  </div>
                )}
                {municipio.site_prefeitura && (
                  <div className="info-item">
                    <span className="info-label">Site:</span>
                    <a 
                      href={municipio.site_prefeitura} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="info-value site-link"
                    >
                      {municipio.site_prefeitura.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="painel-copyright">
            <img src={logoDataRO} alt="DATA-RO" className="copyright-logo" />
            <span>DESENVOLVIDO POR DATA-RO INTELIGÊNCIA TERRITORIAL.<br/>TODOS OS DIREITOS RESERVADOS. ©</span>
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
          src={painel.embed_url || painel.url_powerbi}
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
            <p>
              <a href="https://wa.me/5569999080202" target="_blank" rel="noopener noreferrer" className="whatsapp-link">
                <svg className="whatsapp-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                (69) 9 9908-0202
              </a>
            </p>
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
