/**
 * Serviço de integração REAL com a API do Portal da Transparência
 * https://api.portaldatransparencia.gov.br
 * 
 * Coleta dados anuais dos últimos 4 anos (2021-2024) para todos os municípios de Rondônia
 */

const API_BASE_URL = 'https://api.portaldatransparencia.gov.br/api-de-dados';
const TRANSFEREGOV_API = 'https://api.transferegov.gestao.gov.br/fundoafundo';

// Chave de API - configurada via variável de ambiente ou fallback
const API_KEY = import.meta.env.VITE_PORTAL_TRANSPARENCIA_API_KEY || 'c59b2392e33174e87d83d561179d7b46';

// Anos para coleta de dados
const ANOS_COLETA = [2021, 2022, 2023, 2024];

// Códigos IBGE dos 52 municípios de Rondônia
export const MUNICIPIOS_RO = {
  'Alta Floresta do Oeste': '1100015',
  'Alto Alegre dos Parecis': '1100379',
  'Alto Paraíso': '1100403',
  'Alvorada do Oeste': '1100346',
  'Ariquemes': '1100023',
  'Buritis': '1100452',
  'Cabixi': '1100031',
  'Cacaulândia': '1100601',
  'Cacoal': '1100049',
  'Campo Novo de Rondônia': '1100700',
  'Candeias do Jamari': '1100809',
  'Castanheiras': '1100908',
  'Cerejeiras': '1100056',
  'Chupinguaia': '1100924',
  'Colorado do Oeste': '1100064',
  'Corumbiara': '1100072',
  'Costa Marques': '1100080',
  'Cujubim': '1100940',
  'Espigão do Oeste': '1100098',
  'Governador Jorge Teixeira': '1101005',
  'Guajará-Mirim': '1100106',
  'Itapuã do Oeste': '1101104',
  'Jaru': '1100114',
  'Ji-Paraná': '1100122',
  'Machadinho do Oeste': '1100130',
  'Ministro Andreazza': '1101203',
  'Mirante da Serra': '1101302',
  'Monte Negro': '1101401',
  'Nova Brasilândia do Oeste': '1100148',
  'Nova Mamoré': '1100338',
  'Nova União': '1101435',
  'Novo Horizonte do Oeste': '1100502',
  'Ouro Preto do Oeste': '1100155',
  'Parecis': '1101450',
  'Pimenta Bueno': '1100189',
  'Pimenteiras do Oeste': '1101468',
  'Porto Velho': '1100205',
  'Presidente Médici': '1100254',
  'Primavera de Rondônia': '1101476',
  'Rio Crespo': '1100262',
  'Rolim de Moura': '1100288',
  'Santa Luzia do Oeste': '1100296',
  'São Felipe do Oeste': '1101484',
  'São Francisco do Guaporé': '1101492',
  'São Miguel do Guaporé': '1100320',
  'Seringueiras': '1101500',
  'Teixeirópolis': '1101559',
  'Theobroma': '1101609',
  'Urupá': '1101708',
  'Vale do Anari': '1101757',
  'Vale do Paraíso': '1101807',
  'Vilhena': '1100304'
};

// Cache para evitar requisições repetidas
const cache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos para dados anuais

/**
 * Função auxiliar para fazer requisições à API com cache
 */
async function fetchAPI(endpoint, params = {}) {
  const cacheKey = `${endpoint}?${JSON.stringify(params)}`;
  
  // Verificar cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const url = new URL(`${API_BASE_URL}${endpoint}`);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });

  const headers = {
    'Accept': 'application/json',
    'chave-api-dados': API_KEY
  };

  try {
    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      console.error(`Erro na API: ${response.status} - ${response.statusText}`);
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Salvar no cache
    cache.set(cacheKey, { data, timestamp: Date.now() });
    
    return data;
  } catch (error) {
    console.error('Erro ao consultar Portal da Transparência:', error);
    throw error;
  }
}

/**
 * Função auxiliar para normalizar nome de município
 */
function normalizarNomeMunicipio(nome) {
  if (!nome) return '';
  return nome.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Função auxiliar para encontrar código IBGE do município (case-insensitive)
 */
function encontrarCodigoIBGE(municipio) {
  if (MUNICIPIOS_RO[municipio]) {
    return { codigo: MUNICIPIOS_RO[municipio], nome: municipio };
  }
  
  const municipioNormalizado = normalizarNomeMunicipio(municipio);
  
  for (const [nome, codigo] of Object.entries(MUNICIPIOS_RO)) {
    if (normalizarNomeMunicipio(nome) === municipioNormalizado) {
      return { codigo, nome };
    }
  }
  
  return null;
}

/**
 * Consulta dados do Bolsa Família por município e ano
 * Busca dados de TODOS os meses do ano e soma os valores
 */
export async function getBolsaFamiliaPorAno(codigoIbge, ano) {
  let totalValor = 0;
  let maxBeneficiarios = 0;
  
  // Determinar meses disponíveis
  const mesAtual = new Date().getMonth() + 1;
  const anoAtual = new Date().getFullYear();
  const ultimoMes = ano === anoAtual ? Math.min(mesAtual - 1, 11) : 12;
  
  // Buscar dados de todos os meses do ano
  for (let mes = 1; mes <= ultimoMes; mes++) {
    const mesFormatado = String(mes).padStart(2, '0');
    try {
      const data = await fetchAPI('/novo-bolsa-familia-por-municipio', {
        codigoIbge,
        mesAno: `${ano}${mesFormatado}`,
        pagina: 1
      });
      
      if (Array.isArray(data) && data.length > 0) {
        data.forEach(item => {
          totalValor += item.valor || 0;
          maxBeneficiarios = Math.max(maxBeneficiarios, item.quantidadeBeneficiados || 0);
        });
      }
    } catch (error) {
      // Continua para o próximo mês em caso de erro
      console.log(`Bolsa Família ${ano}/${mes}: sem dados`);
    }
  }
  
  return { valor: totalValor, beneficiarios: maxBeneficiarios };
}

/**
 * Consulta dados do BPC por município e ano
 * Busca dados de TODOS os meses do ano e soma os valores
 */
export async function getBPCPorAno(codigoIbge, ano) {
  let totalValor = 0;
  let maxBeneficiarios = 0;
  
  // Determinar meses disponíveis
  const mesAtual = new Date().getMonth() + 1;
  const anoAtual = new Date().getFullYear();
  const ultimoMes = ano === anoAtual ? Math.min(mesAtual - 1, 11) : 12;
  
  // Buscar dados de todos os meses do ano
  for (let mes = 1; mes <= ultimoMes; mes++) {
    const mesFormatado = String(mes).padStart(2, '0');
    try {
      const data = await fetchAPI('/bpc-por-municipio', {
        codigoIbge,
        mesAno: `${ano}${mesFormatado}`,
        pagina: 1
      });
      
      if (Array.isArray(data) && data.length > 0) {
        data.forEach(item => {
          totalValor += item.valor || 0;
          maxBeneficiarios = Math.max(maxBeneficiarios, item.quantidadeBeneficiados || 0);
        });
      }
    } catch (error) {
      // Continua para o próximo mês em caso de erro
      console.log(`BPC ${ano}/${mes}: sem dados`);
    }
  }
  
  return { valor: totalValor, beneficiarios: maxBeneficiarios };
}

/**
 * Consulta convênios por município (todos os anos)
 */
export async function getConveniosPorMunicipio(codigoIbge) {
  try {
    const data = await fetchAPI('/convenios', {
      codigoIBGE: codigoIbge,
      pagina: 1,
      quantidade: 500
    });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro ao buscar convênios:', error);
    return [];
  }
}

/**
 * Busca dados do TransfereGov (Fundo a Fundo) para o município
 */
async function getTransfereGovDados(nomeMunicipio) {
  try {
    const response = await fetch(`${TRANSFEREGOV_API}/programa_beneficiario?uf_beneficiario_programa=eq.RO&limit=500`);
    const data = await response.json();
    
    if (!Array.isArray(data)) return { valor: 0, parlamentares: [] };
    
    // Normalizar nome do município para busca
    const nomeNormalizado = normalizarNomeMunicipio(nomeMunicipio);
    
    // Filtrar registros do município
    const registrosMunicipio = data.filter(d => {
      const nomeBenef = d.nome_beneficiario_programa || '';
      const nomeNorm = normalizarNomeMunicipio(nomeBenef.replace('MUNICIPIO DE ', '').replace('PREFEITURA DE ', ''));
      return nomeNorm.includes(nomeNormalizado) || nomeNormalizado.includes(nomeNorm);
    });
    
    // Calcular total e extrair parlamentares
    let totalValor = 0;
    const parlamentares = new Set();
    
    registrosMunicipio.forEach(r => {
      totalValor += r.valor_beneficiario_programa || 0;
      if (r.nome_parlamentar_beneficiario_programa) {
        parlamentares.add(r.nome_parlamentar_beneficiario_programa);
      }
    });
    
    return {
      valor: totalValor,
      parlamentares: Array.from(parlamentares),
      registros: registrosMunicipio.length
    };
  } catch (error) {
    console.error('Erro ao buscar TransfereGov:', error);
    return { valor: 0, parlamentares: [], registros: 0 };
  }
}

/**
 * Busca emendas parlamentares para Rondônia
 * Usa a API do Portal da Transparência
 */
async function getEmendasRondonia(ano) {
  const emendas = [];
  let pagina = 1;
  const maxPaginas = 50; // Limitar para não demorar muito
  
  while (pagina <= maxPaginas) {
    try {
      const data = await fetchAPI('/emendas', {
        ano,
        pagina
      });
      
      if (!Array.isArray(data) || data.length === 0) break;
      
      // Filtrar emendas de Rondônia
      const emendasRO = data.filter(e => {
        const local = (e.localidadeDoGasto || '').toUpperCase();
        return local.includes('RONDÔNIA') || local.includes('RONDONIA') || local.includes(' - RO');
      });
      
      emendas.push(...emendasRO);
      pagina++;
      
      // Se encontrou poucas emendas de RO, continuar buscando
      if (emendasRO.length === 0 && pagina > 10) {
        // Pular algumas páginas para acelerar
        pagina += 10;
      }
    } catch (error) {
      console.error(`Erro ao buscar emendas página ${pagina}:`, error);
      break;
    }
  }
  
  return emendas;
}

/**
 * Busca dados completos de transferências para um município - TODOS OS ANOS
 */
export async function getDadosCompletosMunicipio(municipio) {
  const resultado = encontrarCodigoIBGE(municipio);
  
  if (!resultado) {
    console.error('Município não encontrado:', municipio);
    return null;
  }
  
  const { codigo: codigoIbge, nome: nomeMunicipio } = resultado;
  console.log('Buscando dados históricos para:', nomeMunicipio, '- Código IBGE:', codigoIbge);

  try {
    // Buscar convênios e dados do TransfereGov em paralelo
    const [todosConvenios, transfereGovDados] = await Promise.all([
      getConveniosPorMunicipio(codigoIbge),
      getTransfereGovDados(nomeMunicipio)
    ]);
    
    // Organizar dados por ano
    const dadosPorAno = {};
    
    for (const ano of ANOS_COLETA) {
      console.log(`Buscando dados de ${nomeMunicipio} para ${ano}...`);
      
      // Buscar Bolsa Família e BPC do ano
      const [bolsaFamilia, bpc] = await Promise.all([
        getBolsaFamiliaPorAno(codigoIbge, ano).catch(() => ({ valor: 0, beneficiarios: 0 })),
        getBPCPorAno(codigoIbge, ano).catch(() => ({ valor: 0, beneficiarios: 0 }))
      ]);
      
      // Filtrar convênios por ano
      const conveniosAno = todosConvenios.filter(conv => {
        const dataInicio = conv.dataInicioVigencia || conv.dataInicio;
        if (!dataInicio) return false;
        const anoConvenio = new Date(dataInicio).getFullYear();
        return anoConvenio === ano;
      });
      
      const totalConveniosAno = conveniosAno.reduce((acc, conv) => 
        acc + (conv.valorGlobal || conv.valor || 0), 0);
      
      // Usar dados do TransfereGov para emendas (quando disponível)
      const emendasValor = ano === 2024 ? transfereGovDados.valor : 0;
      
      dadosPorAno[ano] = {
        bolsaFamilia: {
          valor: bolsaFamilia.valor,
          beneficiarios: bolsaFamilia.beneficiarios
        },
        bpc: {
          valor: bpc.valor,
          beneficiarios: bpc.beneficiarios
        },
        fnde: { 
          valor: 0, // API não disponível diretamente
          programas: ['PDDE', 'PNAE', 'PNATE'],
          observacao: 'Dados não disponíveis via API'
        },
        fns: { 
          valor: 0, // API não disponível diretamente
          programas: ['PAB', 'MAC', 'ESF'],
          observacao: 'Dados não disponíveis via API'
        },
        convenios: {
          valor: totalConveniosAno,
          quantidade: conveniosAno.length,
          lista: conveniosAno.map(conv => ({
            numero: conv.numero || conv.numeroConvenio || 'N/A',
            objeto: conv.objeto || 'Não informado',
            valorTotal: conv.valorGlobal || conv.valor || 0,
            valorLiberado: conv.valorLiberado || 0,
            situacao: conv.situacao || 'Não informado',
            orgao: conv.orgaoSuperior || conv.orgao || 'Não informado',
            dataInicio: conv.dataInicioVigencia || conv.dataInicio,
            dataFim: conv.dataFimVigencia || conv.dataFim
          }))
        },
        emendas: { 
          valor: emendasValor,
          quantidade: ano === 2024 ? transfereGovDados.registros : 0,
          parlamentares: ano === 2024 ? transfereGovDados.parlamentares : [],
          lista: []
        }
      };
    }
    
    // Calcular totais e variações
    const anoAtual = 2024;
    const anoAnterior = 2023;
    
    const calcularVariacao = (valorAtual, valorAnterior) => {
      if (!valorAnterior || valorAnterior === 0) return '0.0';
      return ((valorAtual - valorAnterior) / valorAnterior * 100).toFixed(1);
    };
    
    const dadosAtuais = dadosPorAno[anoAtual] || {};
    const dadosAnteriores = dadosPorAno[anoAnterior] || {};
    
    // Calcular total de todos os convênios (todos os anos)
    const totalGeralConvenios = todosConvenios.reduce((acc, conv) => 
      acc + (conv.valorGlobal || conv.valor || 0), 0);
    
    const conveniosAtivos = todosConvenios.filter(conv => 
      conv.situacao && !conv.situacao.toLowerCase().includes('conclu')).length;
    
    const conveniosEmExecucao = todosConvenios.filter(conv => 
      conv.situacao && conv.situacao.toLowerCase().includes('execu')).length;

    return {
      municipio: nomeMunicipio,
      codigoIbge,
      dadosReais: true,
      anosDisponiveis: ANOS_COLETA,
      dadosPorAno,
      resumo: {
        anoReferencia: anoAtual,
        bolsaFamilia: {
          valor: dadosAtuais.bolsaFamilia?.valor || 0,
          beneficiarios: dadosAtuais.bolsaFamilia?.beneficiarios || 0,
          variacao: calcularVariacao(
            dadosAtuais.bolsaFamilia?.valor || 0,
            dadosAnteriores.bolsaFamilia?.valor || 0
          )
        },
        bpc: {
          valor: dadosAtuais.bpc?.valor || 0,
          beneficiarios: dadosAtuais.bpc?.beneficiarios || 0,
          variacao: calcularVariacao(
            dadosAtuais.bpc?.valor || 0,
            dadosAnteriores.bpc?.valor || 0
          )
        },
        fnde: {
          valor: dadosAtuais.fnde?.valor || 0,
          variacao: '0.0',
          observacao: 'Dados não disponíveis via API'
        },
        fns: {
          valor: dadosAtuais.fns?.valor || 0,
          variacao: '0.0',
          observacao: 'Dados não disponíveis via API'
        },
        emendas: {
          valor: transfereGovDados.valor,
          parlamentares: transfereGovDados.parlamentares
        }
      },
      convenios: {
        totalGeral: totalGeralConvenios,
        ativos: conveniosAtivos,
        emExecucao: conveniosEmExecucao,
        quantidade: todosConvenios.length,
        lista: todosConvenios.slice(0, 20).map(conv => ({
          numero: conv.numero || conv.numeroConvenio || 'N/A',
          objeto: conv.objeto || 'Não informado',
          valorTotal: conv.valorGlobal || conv.valor || 0,
          valorLiberado: conv.valorLiberado || 0,
          situacao: conv.situacao || 'Não informado',
          orgao: conv.orgaoSuperior || conv.orgao || 'Não informado',
          dataInicio: conv.dataInicioVigencia || conv.dataInicio,
          dataFim: conv.dataFimVigencia || conv.dataFim
        }))
      },
      emendas: {
        quantidade: transfereGovDados.registros,
        valorTotal: transfereGovDados.valor,
        parlamentares: transfereGovDados.parlamentares
      },
      dataAtualizacao: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erro ao buscar dados completos:', error);
    return null;
  }
}

/**
 * Retorna lista de municípios de Rondônia
 */
export function getMunicipiosRO() {
  return Object.keys(MUNICIPIOS_RO);
}

/**
 * Retorna anos disponíveis para consulta
 */
export function getAnosDisponiveis() {
  return ANOS_COLETA;
}

/**
 * Exporta função de busca de código IBGE para uso externo
 */
export { encontrarCodigoIBGE };
