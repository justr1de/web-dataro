import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { getBandeiraUrl } from '../../utils/bandeirasMap';
import './MunicipioPainel.css';
import logoDataRO from '../../assets/logo-dataro-transparente.png';

const MunicipioPainel = () => {
  const { id } = useParams();
  const [municipio, setMunicipio] = useState(null);
  const [painel, setPainel] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

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

  // Mostrar loading enquanto AuthContext carrega
  if (authLoading || pageLoading) {
    return (
      <div className="painel-container">
        <div className="loading">Carregando painel...</div>
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
          <button onClick={handleBack} className="back-button">
            ← Voltar
          </button>
          <div className="painel-info">
            <h1>{municipio.nome}</h1>
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
        <button onClick={handleBack} className="back-button">
          ← Voltar
        </button>
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
            <span>DESENVOLVIDO POR DATA-RO INTELIGÊNCIA TERRITORIAL. TODOS OS DIREITOS RESERVADOS.</span>
          </div>
        </div>
      </header>

      <main className="painel-main">
        <iframe
          src={painel.url_powerbi}
          frameBorder="0"
          allowFullScreen={true}
          className="powerbi-iframe"
          title={`Painel de BI - ${municipio.nome}`}
        />
      </main>
    </div>
  );
};

export default MunicipioPainel;
