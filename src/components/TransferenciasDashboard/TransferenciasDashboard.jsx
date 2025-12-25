import React, { useState, useEffect } from 'react';
import { buscarTransferenciasSupabase, MUNICIPIOS_RO } from '../../services/transferenciasSupabase';
import { 
  getMockTransferencias, 
  getMockBeneficiosSociais, 
  getMockConvenios 
} from '../../services/portalTransparenciaService';
import { 
  getMockProgramasDisponiveis, 
  getMockEmendasRO 
} from '../../services/transferegovService';
import './TransferenciasDashboard.css';

// Anos disponíveis para consulta
const getAnosDisponiveis = () => [2024];

const TransferenciasDashboard = ({ municipio, onClose }) => {
  const [activeTab, setActiveTab] = useState('resumo');
  const [dados, setDados] = useState(null);
  const [beneficios, setBeneficios] = useState(null);
  const [convenios, setConvenios] = useState(null);
  const [programas, setProgramas] = useState([]);
  const [emendas, setEmendas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usandoDadosReais, setUsandoDadosReais] = useState(false);
  const [erro, setErro] = useState(null);
  const [anoSelecionado, setAnoSelecionado] = useState(2024);
  const [anosDisponiveis, setAnosDisponiveis] = useState([2021, 2022, 2023, 2024]);
  const [sincronizando, setSincronizando] = useState(false);
  const [progressoSync, setProgressoSync] = useState(null);

  useEffect(() => {
    carregarDados();
    setAnosDisponiveis(getAnosDisponiveis());
  }, [municipio]);

  const carregarDados = async () => {
    setLoading(true);
    setErro(null);
    
    try {
      // Buscar dados do Supabase
      console.log('Buscando dados para:', municipio);
      const dadosSupabase = await buscarTransferenciasSupabase(municipio);
      
      if (dadosSupabase && dadosSupabase.dadosReais) {
        console.log('Dados reais obtidos do Supabase!');
        setDados(dadosSupabase);
        setUsandoDadosReais(true);
        
        // Usar dados de convênios do Supabase se disponíveis
        if (dadosSupabase.convenios && dadosSupabase.convenios.valorTotal > 0) {
          setConvenios({
            totalConvenios: dadosSupabase.convenios.ativos,
            valorTotalConvenios: dadosSupabase.convenios.valorTotal,
            valorLiberado: dadosSupabase.convenios.valorLiberado,
            convenios: dadosSupabase.convenios.lista || getMockConvenios(municipio).convenios
          });
        } else {
          setConvenios(getMockConvenios(municipio));
        }
      } else {
        // Fallback para dados mockados se não encontrar no Supabase
        console.log('Usando dados mockados como fallback');
        setDados(getMockTransferencias(municipio));
        setConvenios(getMockConvenios(municipio));
        setUsandoDadosReais(false);
      }
      
      // Dados de benefícios (ainda mockados)
      setBeneficios(getMockBeneficiosSociais(municipio));
      
      // Programas disponíveis (dados estáticos)
      setProgramas(getMockProgramasDisponiveis());
      
      // Emendas (ainda mockadas)
      setEmendas(getMockEmendasRO());
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setErro('Erro ao carregar dados. Usando dados de demonstração.');
      
      // Fallback para dados mockados
      setDados(getMockTransferencias(municipio));
      setBeneficios(getMockBeneficiosSociais(municipio));
      setConvenios(getMockConvenios(municipio));
      setProgramas(getMockProgramasDisponiveis());
      setEmendas(getMockEmendasRO());
      setUsandoDadosReais(false);
    } finally {
      setLoading(false);
    }
  };

  // Função para obter dados do ano selecionado
  const getDadosAno = (ano) => {
    if (!dados || !dados.dadosPorAno) return null;
    return dados.dadosPorAno[ano];
  };

  // Dados do ano selecionado
  const dadosAnoAtual = getDadosAno(anoSelecionado);

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor || 0);
  };

  const formatarNumero = (numero) => {
    return new Intl.NumberFormat('pt-BR').format(numero || 0);
  };

  // Calcular variação entre anos
  const calcularVariacao = (anoAtual, anoAnterior, campo) => {
    const dadosAtual = getDadosAno(anoAtual);
    const dadosAnterior = getDadosAno(anoAnterior);
    
    if (!dadosAtual || !dadosAnterior) return null;
    
    const valorAtual = dadosAtual[campo]?.valor || 0;
    const valorAnterior = dadosAnterior[campo]?.valor || 0;
    
    if (valorAnterior === 0) return null;
    
    return ((valorAtual - valorAnterior) / valorAnterior * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="transferencias-dashboard">
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Carregando dados de transferências...</p>
          <small>Consultando Portal da Transparência...</small>
        </div>
      </div>
    );
  }

  return (
    <div className="transferencias-dashboard">
      <div className="dashboard-header">
        <div className="header-info">
          <h2>📊 Painel de Transferências Federais</h2>
          <p className="municipio-nome">{municipio}</p>
          <span className="codigo-ibge">IBGE: {MUNICIPIOS_RO[municipio]}</span>
          {usandoDadosReais ? (
            <span className="badge-dados-reais">✅ Dados Reais - Portal da Transparência</span>
          ) : (
            <span className="badge-dados-demo">⚠️ Dados de Demonstração</span>
          )}
        </div>
        <button className="btn-close" onClick={onClose}>✕</button>
      </div>

      {erro && (
        <div className="erro-banner">
          <span>⚠️ {erro}</span>
        </div>
      )}

      {/* Seletor de Ano */}
      <div className="ano-selector">
        <label>Ano de Referência:</label>
        <div className="anos-buttons">
          {anosDisponiveis.map(ano => (
            <button
              key={ano}
              className={`ano-btn ${anoSelecionado === ano ? 'active' : ''}`}
              onClick={() => setAnoSelecionado(ano)}
            >
              {ano}
            </button>
          ))}
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'resumo' ? 'active' : ''}`}
          onClick={() => setActiveTab('resumo')}
        >
          📈 Resumo
        </button>
        <button 
          className={`tab ${activeTab === 'historico' ? 'active' : ''}`}
          onClick={() => setActiveTab('historico')}
        >
          📊 Histórico
        </button>
        <button 
          className={`tab ${activeTab === 'beneficios' ? 'active' : ''}`}
          onClick={() => setActiveTab('beneficios')}
        >
          👥 Benefícios Sociais
        </button>
        <button 
          className={`tab ${activeTab === 'convenios' ? 'active' : ''}`}
          onClick={() => setActiveTab('convenios')}
        >
          📋 Convênios
        </button>
        <button 
          className={`tab ${activeTab === 'programas' ? 'active' : ''}`}
          onClick={() => setActiveTab('programas')}
        >
          🎯 Programas Disponíveis
        </button>
        <button 
          className={`tab ${activeTab === 'emendas' ? 'active' : ''}`}
          onClick={() => setActiveTab('emendas')}
        >
          🏛️ Emendas Parlamentares
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'resumo' && (
          <div className="tab-content resumo">
            <div className="cards-grid">
              <div className="card card-bolsa-familia">
                <div className="card-icon">👨‍👩‍👧‍👦</div>
                <div className="card-info">
                  <h3>Bolsa Família</h3>
                  <p className="valor">
                    {formatarMoeda(
                      dadosAnoAtual?.bolsaFamilia?.valor || 
                      dados?.transferencias?.bolsaFamilia?.valor || 
                      dados?.resumo?.bolsaFamilia?.valor
                    )}
                  </p>
                  <span className="detalhe">
                    {formatarNumero(
                      dadosAnoAtual?.bolsaFamilia?.beneficiarios || 
                      dados?.transferencias?.bolsaFamilia?.beneficiarios ||
                      dados?.resumo?.bolsaFamilia?.beneficiarios
                    )} beneficiários
                  </span>
                  {anoSelecionado > 2021 && (
                    <span className={`variacao ${parseFloat(calcularVariacao(anoSelecionado, anoSelecionado - 1, 'bolsaFamilia') || 0) >= 0 ? 'positiva' : 'negativa'}`}>
                      {calcularVariacao(anoSelecionado, anoSelecionado - 1, 'bolsaFamilia') ? 
                        `${parseFloat(calcularVariacao(anoSelecionado, anoSelecionado - 1, 'bolsaFamilia')) >= 0 ? '↑' : '↓'} ${calcularVariacao(anoSelecionado, anoSelecionado - 1, 'bolsaFamilia')}% vs ${anoSelecionado - 1}` 
                        : ''}
                    </span>
                  )}
                </div>
              </div>

              <div className="card card-bpc">
                <div className="card-icon">🧓</div>
                <div className="card-info">
                  <h3>BPC</h3>
                  <p className="valor">
                    {formatarMoeda(
                      dadosAnoAtual?.bpc?.valor || 
                      dados?.transferencias?.bpc?.valor ||
                      dados?.resumo?.bpc?.valor
                    )}
                  </p>
                  <span className="detalhe">
                    {formatarNumero(
                      dadosAnoAtual?.bpc?.beneficiarios || 
                      dados?.transferencias?.bpc?.beneficiarios ||
                      dados?.resumo?.bpc?.beneficiarios
                    )} beneficiários
                  </span>
                  {anoSelecionado > 2021 && (
                    <span className={`variacao ${parseFloat(calcularVariacao(anoSelecionado, anoSelecionado - 1, 'bpc') || 0) >= 0 ? 'positiva' : 'negativa'}`}>
                      {calcularVariacao(anoSelecionado, anoSelecionado - 1, 'bpc') ? 
                        `${parseFloat(calcularVariacao(anoSelecionado, anoSelecionado - 1, 'bpc')) >= 0 ? '↑' : '↓'} ${calcularVariacao(anoSelecionado, anoSelecionado - 1, 'bpc')}% vs ${anoSelecionado - 1}` 
                        : ''}
                    </span>
                  )}
                </div>
              </div>

              <div className="card card-fnde">
                <div className="card-icon">📚</div>
                <div className="card-info">
                  <h3>FNDE (Educação)</h3>
                  <p className="valor">
                    {formatarMoeda(
                      dadosAnoAtual?.fnde?.valor || 
                      dados?.transferencias?.fnde?.valor ||
                      dados?.resumo?.fnde?.valor
                    )}
                  </p>
                  <span className="detalhe">PDDE, PNAE, PNATE</span>
                </div>
              </div>

              <div className="card card-fns">
                <div className="card-icon">🏥</div>
                <div className="card-info">
                  <h3>FNS (Saúde)</h3>
                  <p className="valor">
                    {formatarMoeda(
                      dadosAnoAtual?.fns?.valor || 
                      dados?.transferencias?.fns?.valor ||
                      dados?.resumo?.fns?.valor
                    )}
                  </p>
                  <span className="detalhe">PAB, MAC, ESF</span>
                </div>
              </div>

              <div className="card card-convenios">
                <div className="card-icon">📝</div>
                <div className="card-info">
                  <h3>Convênios ({anoSelecionado})</h3>
                  <p className="valor">
                    {formatarMoeda(
                      convenios?.valorTotalConvenios || 
                      dadosAnoAtual?.convenios?.valor || 
                      dados?.convenios?.valorTotal || 0
                    )}
                  </p>
                  <span className="detalhe">
                    {convenios?.totalConvenios || dados?.convenios?.ativos || 0} convênios
                  </span>
                </div>
              </div>

              <div className="card card-emendas">
                <div className="card-icon">🏛️</div>
                <div className="card-info">
                  <h3>Emendas Parlamentares</h3>
                  <p className="valor">
                    {formatarMoeda(
                      dadosAnoAtual?.emendas?.valor || 
                      dados?.emendas?.valorTotal
                    )}
                  </p>
                  <span className="detalhe">
                    {dadosAnoAtual?.emendas?.quantidade || dados?.emendas?.quantidade || 0} emendas
                  </span>
                  {(dados?.emendas?.parlamentares?.length > 0 || dados?.resumo?.emendas?.parlamentares?.length > 0) && (
                    <div className="parlamentares-lista">
                      <small>Parlamentares:</small>
                      <ul>
                        {(dados?.emendas?.parlamentares || dados?.resumo?.emendas?.parlamentares || []).slice(0, 3).map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                        {(dados?.emendas?.parlamentares?.length > 3 || dados?.resumo?.emendas?.parlamentares?.length > 3) && (
                          <li>e mais {(dados?.emendas?.parlamentares?.length || dados?.resumo?.emendas?.parlamentares?.length || 0) - 3}...</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="total-geral">
              <h3>Total de Transferências Federais ({anoSelecionado})</h3>
              <p className="valor-total">
                {formatarMoeda(
                  (dadosAnoAtual?.bolsaFamilia?.valor || dados?.transferencias?.bolsaFamilia?.valor || dados?.resumo?.bolsaFamilia?.valor || 0) +
                  (dadosAnoAtual?.bpc?.valor || dados?.transferencias?.bpc?.valor || dados?.resumo?.bpc?.valor || 0) +
                  (dadosAnoAtual?.fnde?.valor || dados?.transferencias?.fnde?.valor || dados?.resumo?.fnde?.valor || 0) +
                  (dadosAnoAtual?.fns?.valor || dados?.transferencias?.fns?.valor || dados?.resumo?.fns?.valor || 0) +
                  (convenios?.valorTotalConvenios || dadosAnoAtual?.convenios?.valor || dados?.convenios?.valorTotal || 0) +
                  (dadosAnoAtual?.emendas?.valor || dados?.emendas?.valorTotal || 0)
                )}
              </p>
              {usandoDadosReais && (
                <p className="fonte-dados">Fonte: Portal da Transparência do Governo Federal</p>
              )}
              {dados?.dataAtualizacao && (
                <p className="data-atualizacao">
                  Última atualização: {new Date(dados.dataAtualizacao).toLocaleString('pt-BR')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Nova aba de Histórico */}
        {activeTab === 'historico' && dados?.dadosPorAno && (
          <div className="tab-content historico">
            <h4>📊 Evolução das Transferências (2021-2024)</h4>
            
            <div className="historico-tabela">
              <table className="tabela-historico">
                <thead>
                  <tr>
                    <th>Programa</th>
                    {anosDisponiveis.map(ano => (
                      <th key={ano}>{ano}</th>
                    ))}
                    <th>Variação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>👨‍👩‍👧‍👦 Bolsa Família</strong></td>
                    {anosDisponiveis.map(ano => (
                      <td key={ano}>{formatarMoeda(dados.dadosPorAno[ano]?.bolsaFamilia?.valor)}</td>
                    ))}
                    <td className={parseFloat(calcularVariacao(2024, 2021, 'bolsaFamilia') || 0) >= 0 ? 'positiva' : 'negativa'}>
                      {calcularVariacao(2024, 2021, 'bolsaFamilia') ? `${calcularVariacao(2024, 2021, 'bolsaFamilia')}%` : '-'}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>🧓 BPC</strong></td>
                    {anosDisponiveis.map(ano => (
                      <td key={ano}>{formatarMoeda(dados.dadosPorAno[ano]?.bpc?.valor)}</td>
                    ))}
                    <td className={parseFloat(calcularVariacao(2024, 2021, 'bpc') || 0) >= 0 ? 'positiva' : 'negativa'}>
                      {calcularVariacao(2024, 2021, 'bpc') ? `${calcularVariacao(2024, 2021, 'bpc')}%` : '-'}
                    </td>
                  </tr>
                  <tr>
                    <td><strong>📚 FNDE</strong></td>
                    {anosDisponiveis.map(ano => (
                      <td key={ano}>{formatarMoeda(dados.dadosPorAno[ano]?.fnde?.valor)}</td>
                    ))}
                    <td>-</td>
                  </tr>
                  <tr>
                    <td><strong>🏥 FNS</strong></td>
                    {anosDisponiveis.map(ano => (
                      <td key={ano}>{formatarMoeda(dados.dadosPorAno[ano]?.fns?.valor)}</td>
                    ))}
                    <td>-</td>
                  </tr>
                  <tr>
                    <td><strong>📝 Convênios</strong></td>
                    {anosDisponiveis.map(ano => (
                      <td key={ano}>{formatarMoeda(dados.dadosPorAno[ano]?.convenios?.valor)}</td>
                    ))}
                    <td className={parseFloat(calcularVariacao(2024, 2021, 'convenios') || 0) >= 0 ? 'positiva' : 'negativa'}>
                      {calcularVariacao(2024, 2021, 'convenios') ? `${calcularVariacao(2024, 2021, 'convenios')}%` : '-'}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="total-row">
                    <td><strong>TOTAL</strong></td>
                    {anosDisponiveis.map(ano => {
                      const dadosAno = dados.dadosPorAno[ano];
                      const total = (dadosAno?.bolsaFamilia?.valor || 0) +
                                   (dadosAno?.bpc?.valor || 0) +
                                   (dadosAno?.fnde?.valor || 0) +
                                   (dadosAno?.fns?.valor || 0) +
                                   (dadosAno?.convenios?.valor || 0);
                      return <td key={ano}><strong>{formatarMoeda(total)}</strong></td>;
                    })}
                    <td>-</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Gráfico de barras simples */}
            <div className="historico-grafico">
              <h5>Evolução Total por Ano</h5>
              <div className="barras-container">
                {anosDisponiveis.map(ano => {
                  const dadosAno = dados.dadosPorAno[ano];
                  const total = (dadosAno?.bolsaFamilia?.valor || 0) +
                               (dadosAno?.bpc?.valor || 0) +
                               (dadosAno?.fnde?.valor || 0) +
                               (dadosAno?.fns?.valor || 0) +
                               (dadosAno?.convenios?.valor || 0);
                  
                  // Calcular altura relativa (máximo = 100%)
                  const maxTotal = Math.max(...anosDisponiveis.map(a => {
                    const d = dados.dadosPorAno[a];
                    return (d?.bolsaFamilia?.valor || 0) + (d?.bpc?.valor || 0) + 
                           (d?.fnde?.valor || 0) + (d?.fns?.valor || 0) + (d?.convenios?.valor || 0);
                  }));
                  const altura = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
                  
                  return (
                    <div key={ano} className="barra-item">
                      <div className="barra-valor">{formatarMoeda(total)}</div>
                      <div className="barra-wrapper">
                        <div 
                          className={`barra ${ano === anoSelecionado ? 'selecionado' : ''}`} 
                          style={{ height: `${altura}%` }}
                        ></div>
                      </div>
                      <div className="barra-ano">{ano}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'beneficios' && beneficios && (
          <div className="tab-content beneficios">
            <div className="info-populacao">
              <h3>População Estimada</h3>
              <p className="valor-grande">{formatarNumero(beneficios.populacaoEstimada)}</p>
            </div>

            <div className="beneficios-grid">
              <div className="beneficio-card">
                <h4>👨‍👩‍👧‍👦 Bolsa Família</h4>
                <div className="beneficio-dados">
                  <div className="dado">
                    <span className="label">Famílias Beneficiárias</span>
                    <span className="valor">{formatarNumero(beneficios.beneficios?.bolsaFamilia?.familias)}</span>
                  </div>
                  <div className="dado">
                    <span className="label">Valor Médio</span>
                    <span className="valor">{formatarMoeda(beneficios.beneficios?.bolsaFamilia?.valorMedio)}</span>
                  </div>
                  <div className="dado">
                    <span className="label">Cobertura</span>
                    <span className="valor">{beneficios.beneficios?.bolsaFamilia?.cobertura}</span>
                  </div>
                </div>
              </div>

              <div className="beneficio-card">
                <h4>🧓 BPC - Benefício de Prestação Continuada</h4>
                <div className="beneficio-dados">
                  <div className="dado">
                    <span className="label">Idosos (65+)</span>
                    <span className="valor">{formatarNumero(beneficios.beneficios?.bpc?.idosos)}</span>
                  </div>
                  <div className="dado">
                    <span className="label">PCD</span>
                    <span className="valor">{formatarNumero(beneficios.beneficios?.bpc?.pcd)}</span>
                  </div>
                  <div className="dado">
                    <span className="label">Valor do Benefício</span>
                    <span className="valor">{formatarMoeda(beneficios.beneficios?.bpc?.valorBeneficio)}</span>
                  </div>
                </div>
              </div>

              <div className="beneficio-card">
                <h4>📋 Cadastro Único</h4>
                <div className="beneficio-dados">
                  <div className="dado">
                    <span className="label">Famílias Cadastradas</span>
                    <span className="valor">{formatarNumero(beneficios.beneficios?.cadastroUnico?.familias)}</span>
                  </div>
                  <div className="dado">
                    <span className="label">Última Atualização</span>
                    <span className="valor">{beneficios.beneficios?.cadastroUnico?.atualizacao}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'convenios' && convenios && (
          <div className="tab-content convenios">
            <div className="convenios-resumo">
              <div className="resumo-item">
                <span className="numero">{convenios.totalConvenios || 0}</span>
                <span className="label">Total de Convênios</span>
              </div>
              <div className="resumo-item">
                <span className="numero">{formatarMoeda(convenios.valorTotalConvenios)}</span>
                <span className="label">Valor Total</span>
              </div>
            </div>

            <div className="convenios-lista">
              <h4>Lista de Convênios</h4>
              {convenios.convenios && convenios.convenios.length > 0 ? (
                <table className="tabela-convenios">
                  <thead>
                    <tr>
                      <th>Número</th>
                      <th>Órgão</th>
                      <th>Objeto</th>
                      <th>Valor</th>
                      <th>Situação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {convenios.convenios.map((conv, index) => (
                      <tr key={index}>
                        <td>{conv.numero}</td>
                        <td>{conv.ministerio || conv.orgao}</td>
                        <td className="objeto">{conv.objeto}</td>
                        <td>{formatarMoeda(conv.valorTotal)}</td>
                        <td>
                          <span className={`status-badge ${conv.situacao?.toLowerCase().replace(/\s/g, '-')}`}>
                            {conv.situacao}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="sem-dados">Nenhum convênio encontrado para este município.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'programas' && (
          <div className="tab-content programas">
            <h4>🎯 Programas Federais Disponíveis para Adesão</h4>
            <div className="programas-grid">
              {programas.map((programa, index) => (
                <div key={index} className="programa-card">
                  <div className="programa-header">
                    <span className="ministerio">{programa.ministerio}</span>
                    <span className={`status ${programa.status?.toLowerCase()}`}>{programa.status}</span>
                  </div>
                  <h5>{programa.nome}</h5>
                  <p className="descricao">{programa.descricao}</p>
                  <div className="programa-info">
                    <span className="valor-disponivel">💰 {formatarMoeda(programa.valorDisponivel)}</span>
                    <span className="prazo">📅 Prazo: {programa.prazo}</span>
                  </div>
                  <a href={programa.link} target="_blank" rel="noopener noreferrer" className="btn-acessar">
                    Acessar Programa →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'emendas' && emendas && (
          <div className="tab-content emendas">
            <h4>🏛️ Emendas Parlamentares para Rondônia</h4>
            <div className="emendas-resumo">
              <div className="resumo-item">
                <span className="numero">{emendas.totalEmendas || 0}</span>
                <span className="label">Total de Emendas</span>
              </div>
              <div className="resumo-item">
                <span className="numero">{formatarMoeda(emendas.valorTotal)}</span>
                <span className="label">Valor Total</span>
              </div>
              <div className="resumo-item">
                <span className="numero">{formatarMoeda(emendas.valorPago)}</span>
                <span className="label">Valor Pago</span>
              </div>
            </div>

            <div className="emendas-lista">
              <h5>Emendas por Parlamentar</h5>
              {emendas.emendas && emendas.emendas.length > 0 ? (
                <table className="tabela-emendas">
                  <thead>
                    <tr>
                      <th>Parlamentar</th>
                      <th>Partido</th>
                      <th>Tipo</th>
                      <th>Valor</th>
                      <th>Situação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emendas.emendas.map((emenda, index) => (
                      <tr key={index}>
                        <td>{emenda.parlamentar || emenda.autor}</td>
                        <td>{emenda.partido}</td>
                        <td>{emenda.tipo}</td>
                        <td>{formatarMoeda(emenda.valor)}</td>
                        <td>
                          <span className={`status-badge ${emenda.situacao?.toLowerCase().replace(/\s/g, '-')}`}>
                            {emenda.situacao}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="sem-dados">Nenhuma emenda encontrada.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferenciasDashboard;
