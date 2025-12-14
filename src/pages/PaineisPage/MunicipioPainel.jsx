import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import './MunicipioPainel.css';

const MunicipioPainel = () => {
  const { id } = useParams();
  const [municipio, setMunicipio] = useState(null);
  const [painel, setPainel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/paineis/login');
      return;
    }

    fetchMunicipioPainel();
  }, [id, user, navigate]);

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

      // Buscar painel
      const { data: painelData, error: painelError } = await supabase
        .from('paineis_bi')
        .select('*')
        .eq('municipio_id', id)
        .single();

      if (!painelError && painelData) {
        setPainel(painelData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/paineis/dashboard');
  };

  if (loading) {
    return (
      <div className="painel-container">
        <div className="loading">Carregando painel...</div>
      </div>
    );
  }

  if (!municipio || !painel) {
    return (
      <div className="painel-container">
        <div className="error-message">
          <h2>Painel não encontrado</h2>
          <button onClick={handleBack} className="back-button">
            Voltar ao Dashboard
          </button>
        </div>
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
          <h1>{municipio.nome}</h1>
          <p>{painel.titulo}</p>
        </div>
      </header>

      <main className="painel-main">
        {painel.embed_url ? (
          <iframe
            src={painel.embed_url}
            frameBorder="0"
            allowFullScreen={true}
            className="powerbi-iframe"
            title={`Painel de BI - ${municipio.nome}`}
          />
        ) : painel.url_powerbi ? (
          <div className="painel-link-container">
            <p>O painel está disponível em uma nova janela:</p>
            <a
              href={painel.url_powerbi}
              target="_blank"
              rel="noopener noreferrer"
              className="painel-link"
            >
              Abrir Painel de BI
            </a>
          </div>
        ) : (
          <div className="no-painel">
            <p>Painel em desenvolvimento</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MunicipioPainel;
