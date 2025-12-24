/**
 * Serviço para busca de dados federais
 * Integra com APIs do Portal da Transparência e TransfereGov
 */

const PORTAL_TRANSPARENCIA_BASE = 'https://api.portaldatransparencia.gov.br/api-de-dados';
const TRANSFEREGOV_BASE = 'https://api.transferegov.gestao.gov.br/transferenciasespeciais';

// Código IBGE de Rondônia
const UF_RONDONIA = '11';

/**
 * Busca convênios do Portal da Transparência
 * @param {Object} params - Parâmetros de busca
 * @returns {Promise<Object>} - Dados dos convênios
 */
export const buscarConvenios = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      codigoIBGE: params.codigoIBGE || '',
      codigoUF: UF_RONDONIA,
      pagina: params.pagina || 1,
      ...params
    });

    // Nota: Esta API requer chave de acesso
    // Por enquanto, retornamos dados simulados
    return getMockConvenios(params);
  } catch (error) {
    console.error('Erro ao buscar convênios:', error);
    throw error;
  }
};

/**
 * Busca programas especiais do TransfereGov
 * @returns {Promise<Array>} - Lista de programas
 */
export const buscarProgramasEspeciais = async () => {
  try {
    const response = await fetch(`${TRANSFEREGOV_BASE}/programa_especial`);
    if (!response.ok) throw new Error('Erro ao buscar programas');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar programas especiais:', error);
    return getMockProgramas();
  }
};

/**
 * Busca executores (municípios) do TransfereGov
 * @param {string} uf - Código da UF
 * @returns {Promise<Array>} - Lista de executores
 */
export const buscarExecutores = async (uf = 'RO') => {
  try {
    const response = await fetch(`${TRANSFEREGOV_BASE}/executor_especial?uf=eq.${uf}`);
    if (!response.ok) throw new Error('Erro ao buscar executores');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar executores:', error);
    return [];
  }
};

/**
 * Busca planos de ação do TransfereGov
 * @param {Object} params - Parâmetros de busca
 * @returns {Promise<Array>} - Lista de planos de ação
 */
export const buscarPlanosAcao = async (params = {}) => {
  try {
    let url = `${TRANSFEREGOV_BASE}/plano_acao_especial`;
    const queryParams = [];
    
    if (params.uf) queryParams.push(`uf=eq.${params.uf}`);
    if (params.municipio) queryParams.push(`municipio=ilike.*${params.municipio}*`);
    
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao buscar planos de ação');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar planos de ação:', error);
    return [];
  }
};

/**
 * Busca editais e oportunidades disponíveis
 * @param {Object} filtros - Filtros de busca
 * @returns {Promise<Array>} - Lista de editais
 */
export const buscarEditais = async (filtros = {}) => {
  // Por enquanto retorna dados simulados
  // Futuramente integrar com APIs reais
  return getMockEditais(filtros);
};

/**
 * Busca transferências para um município específico
 * @param {string} codigoIBGE - Código IBGE do município
 * @returns {Promise<Object>} - Dados de transferências
 */
export const buscarTransferenciasMunicipio = async (codigoIBGE) => {
  try {
    // Busca no TransfereGov
    const response = await fetch(
      `${TRANSFEREGOV_BASE}/executor_especial?codigo_ibge=eq.${codigoIBGE}`
    );
    
    if (!response.ok) throw new Error('Erro ao buscar transferências');
    const data = await response.json();
    
    return {
      transferencias: data,
      total: data.length,
      fonte: 'TransfereGov'
    };
  } catch (error) {
    console.error('Erro ao buscar transferências do município:', error);
    return { transferencias: [], total: 0, fonte: 'TransfereGov' };
  }
};

// ============ DADOS MOCK PARA DEMONSTRAÇÃO ============

const getMockConvenios = (params) => {
  const convenios = [
    {
      id: 1,
      numero: '900001/2024',
      objeto: 'Construção de Unidade Básica de Saúde',
      valor: 1500000.00,
      orgao: 'Ministério da Saúde',
      situacao: 'Em Execução',
      dataInicio: '2024-01-15',
      dataFim: '2025-01-15',
      municipio: 'Ji-Paraná'
    },
    {
      id: 2,
      numero: '900002/2024',
      objeto: 'Aquisição de Equipamentos para Escolas',
      valor: 800000.00,
      orgao: 'Ministério da Educação',
      situacao: 'Em Execução',
      dataInicio: '2024-02-01',
      dataFim: '2024-12-31',
      municipio: 'Cacoal'
    },
    {
      id: 3,
      numero: '900003/2024',
      objeto: 'Pavimentação de Estradas Rurais',
      valor: 2500000.00,
      orgao: 'Ministério das Cidades',
      situacao: 'Aguardando Liberação',
      dataInicio: '2024-03-01',
      dataFim: '2025-06-30',
      municipio: 'Vilhena'
    },
    {
      id: 4,
      numero: '900004/2024',
      objeto: 'Programa de Fortalecimento da Agricultura Familiar',
      valor: 500000.00,
      orgao: 'Ministério da Agricultura',
      situacao: 'Em Execução',
      dataInicio: '2024-01-01',
      dataFim: '2024-12-31',
      municipio: 'Ouro Preto do Oeste'
    },
    {
      id: 5,
      numero: '900005/2024',
      objeto: 'Construção de Centro de Referência de Assistência Social',
      valor: 1200000.00,
      orgao: 'Ministério do Desenvolvimento Social',
      situacao: 'Concluído',
      dataInicio: '2023-06-01',
      dataFim: '2024-06-01',
      municipio: 'Ariquemes'
    }
  ];

  if (params.municipio) {
    return convenios.filter(c => 
      c.municipio.toLowerCase().includes(params.municipio.toLowerCase())
    );
  }

  return convenios;
};

const getMockProgramas = () => {
  return [
    {
      id: 1,
      nome: 'PAC - Programa de Aceleração do Crescimento',
      ministerio: 'Ministério das Cidades',
      area: 'Infraestrutura',
      status: 'Ativo',
      descricao: 'Investimentos em infraestrutura urbana e rural'
    },
    {
      id: 2,
      nome: 'FNDE - Programas de Educação',
      ministerio: 'Ministério da Educação',
      area: 'Educação',
      status: 'Ativo',
      descricao: 'PDDE, PNAE, PNATE e outros programas educacionais'
    },
    {
      id: 3,
      nome: 'Minha Casa, Minha Vida',
      ministerio: 'Ministério das Cidades',
      area: 'Habitação',
      status: 'Ativo',
      descricao: 'Programa habitacional para famílias de baixa renda'
    },
    {
      id: 4,
      nome: 'PRONAF',
      ministerio: 'Ministério da Agricultura',
      area: 'Agricultura',
      status: 'Ativo',
      descricao: 'Financiamento para agricultura familiar'
    }
  ];
};

const getMockEditais = (filtros) => {
  const editais = [
    {
      id: 1,
      titulo: 'Edital PAC Saneamento 2024',
      orgao: 'Ministério das Cidades',
      area: 'Saneamento',
      valorMinimo: 500000,
      valorMaximo: 5000000,
      prazoInscricao: '2025-02-28',
      status: 'Aberto',
      link: 'https://www.gov.br/cidades',
      descricao: 'Recursos para obras de saneamento básico em municípios com até 50 mil habitantes.'
    },
    {
      id: 2,
      titulo: 'Caminho da Escola 2024',
      orgao: 'FNDE/MEC',
      area: 'Educação',
      valorMinimo: 100000,
      valorMaximo: 1000000,
      prazoInscricao: '2025-03-15',
      status: 'Aberto',
      link: 'https://www.fnde.gov.br',
      descricao: 'Aquisição de ônibus escolares para transporte de estudantes da zona rural.'
    },
    {
      id: 3,
      titulo: 'Equipamentos para UBS',
      orgao: 'Ministério da Saúde',
      area: 'Saúde',
      valorMinimo: 200000,
      valorMaximo: 800000,
      prazoInscricao: '2025-01-31',
      status: 'Aberto',
      link: 'https://www.gov.br/saude',
      descricao: 'Recursos para aquisição de equipamentos para Unidades Básicas de Saúde.'
    },
    {
      id: 4,
      titulo: 'PAA - Compra Institucional',
      orgao: 'Ministério da Agricultura',
      area: 'Agricultura',
      valorMinimo: 50000,
      valorMaximo: 500000,
      prazoInscricao: '2025-04-30',
      status: 'Aberto',
      link: 'https://www.gov.br/agricultura',
      descricao: 'Compra de alimentos da agricultura familiar para programas sociais.'
    },
    {
      id: 5,
      titulo: 'Defesa Civil - Prevenção',
      orgao: 'Ministério da Integração',
      area: 'Defesa Civil',
      valorMinimo: 100000,
      valorMaximo: 2000000,
      prazoInscricao: '2025-05-15',
      status: 'Aberto',
      link: 'https://www.gov.br/mdr',
      descricao: 'Recursos para obras de prevenção a desastres naturais.'
    },
    {
      id: 6,
      titulo: 'Construção de CRAS',
      orgao: 'Ministério do Desenvolvimento Social',
      area: 'Assistência Social',
      valorMinimo: 300000,
      valorMaximo: 1500000,
      prazoInscricao: '2025-02-15',
      status: 'Aberto',
      link: 'https://www.gov.br/mds',
      descricao: 'Construção de Centros de Referência de Assistência Social.'
    }
  ];

  if (filtros.area) {
    return editais.filter(e => 
      e.area.toLowerCase().includes(filtros.area.toLowerCase())
    );
  }

  if (filtros.orgao) {
    return editais.filter(e => 
      e.orgao.toLowerCase().includes(filtros.orgao.toLowerCase())
    );
  }

  return editais;
};

export default {
  buscarConvenios,
  buscarProgramasEspeciais,
  buscarExecutores,
  buscarPlanosAcao,
  buscarEditais,
  buscarTransferenciasMunicipio
};
