/**
 * Serviço de Análise e Cruzamento de Dados
 * Permite comparar indicadores entre municípios de Rondônia
 */

/**
 * Compara dados entre dois ou mais municípios
 * @param {Array} municipios - Lista de municípios para comparar
 * @param {Array} indicadores - Lista de indicadores para analisar
 * @returns {Object} - Resultado da comparação
 */
export const compararMunicipios = (municipios, indicadores = []) => {
  if (!municipios || municipios.length < 2) {
    return {
      success: false,
      message: 'É necessário selecionar pelo menos 2 municípios para comparação'
    };
  }

  const comparacao = {
    success: true,
    municipios: municipios.map(m => ({
      id: m.id,
      nome: m.nome,
      prefeito: m.prefeito,
      telefone: m.telefone,
      email: m.email,
      temPainel: m.paineis_bi && m.paineis_bi.length > 0,
      statusPainel: m.paineis_bi?.[0]?.status || 'pendente'
    })),
    resumo: gerarResumoComparativo(municipios),
    recomendacoes: gerarRecomendacoes(municipios)
  };

  return comparacao;
};

/**
 * Gera um resumo comparativo entre municípios
 */
const gerarResumoComparativo = (municipios) => {
  const comPainel = municipios.filter(m => m.paineis_bi && m.paineis_bi.length > 0);
  const semPainel = municipios.filter(m => !m.paineis_bi || m.paineis_bi.length === 0);

  return {
    totalMunicipios: municipios.length,
    comPainelAtivo: comPainel.length,
    semPainel: semPainel.length,
    percentualCobertura: ((comPainel.length / municipios.length) * 100).toFixed(1)
  };
};

/**
 * Gera recomendações baseadas na análise
 */
const gerarRecomendacoes = (municipios) => {
  const recomendacoes = [];

  const semPainel = municipios.filter(m => !m.paineis_bi || m.paineis_bi.length === 0);
  if (semPainel.length > 0) {
    recomendacoes.push({
      tipo: 'painel',
      prioridade: 'alta',
      descricao: `${semPainel.length} município(s) ainda não possui(em) painel de BI ativo`,
      municipios: semPainel.map(m => m.nome)
    });
  }

  return recomendacoes;
};

/**
 * Analisa indicadores de um município específico
 * @param {Object} municipio - Dados do município
 * @returns {Object} - Análise do município
 */
export const analisarMunicipio = (municipio) => {
  if (!municipio) {
    return { success: false, message: 'Município não encontrado' };
  }

  return {
    success: true,
    municipio: {
      id: municipio.id,
      nome: municipio.nome,
      prefeito: municipio.prefeito,
      contato: {
        telefone: municipio.telefone,
        email: municipio.email
      }
    },
    painel: {
      disponivel: municipio.paineis_bi && municipio.paineis_bi.length > 0,
      status: municipio.paineis_bi?.[0]?.status || 'pendente',
      titulo: municipio.paineis_bi?.[0]?.titulo || null
    },
    sugestoes: gerarSugestoesMunicipio(municipio)
  };
};

/**
 * Gera sugestões para um município
 */
const gerarSugestoesMunicipio = (municipio) => {
  const sugestoes = [];

  if (!municipio.paineis_bi || municipio.paineis_bi.length === 0) {
    sugestoes.push({
      tipo: 'painel',
      descricao: 'Solicitar ativação do painel de BI para acesso aos indicadores'
    });
  }

  sugestoes.push({
    tipo: 'captacao',
    descricao: 'Verificar editais disponíveis para captação de recursos federais'
  });

  return sugestoes;
};

/**
 * Busca municípios por nome
 * @param {Array} municipios - Lista de todos os municípios
 * @param {string} termo - Termo de busca
 * @returns {Array} - Municípios encontrados
 */
export const buscarMunicipiosPorNome = (municipios, termo) => {
  if (!termo || termo.length < 2) return [];
  
  const termoLower = termo.toLowerCase();
  return municipios.filter(m => 
    m.nome.toLowerCase().includes(termoLower)
  );
};

/**
 * Extrai nomes de municípios de uma query
 * @param {string} query - Texto da consulta
 * @param {Array} municipios - Lista de todos os municípios
 * @returns {Array} - Municípios encontrados na query
 */
export const extrairMunicipiosDaQuery = (query, municipios) => {
  const queryLower = query.toLowerCase();
  return municipios.filter(m => 
    queryLower.includes(m.nome.toLowerCase())
  );
};

/**
 * Gera relatório de cruzamento de dados
 * @param {Array} municipios - Municípios para análise
 * @returns {string} - Relatório formatado
 */
export const gerarRelatorioComparativo = (municipios) => {
  if (!municipios || municipios.length === 0) {
    return 'Nenhum município selecionado para análise.';
  }

  let relatorio = `📊 **Relatório Comparativo**\n\n`;
  relatorio += `**Municípios analisados:** ${municipios.length}\n\n`;

  municipios.forEach((m, index) => {
    relatorio += `**${index + 1}. ${m.nome}**\n`;
    relatorio += `   • Prefeito(a): ${m.prefeito || 'Não informado'}\n`;
    relatorio += `   • Contato: ${m.telefone || 'Não informado'}\n`;
    relatorio += `   • E-mail: ${m.email || 'Não informado'}\n`;
    relatorio += `   • Painel BI: ${m.paineis_bi?.length > 0 ? '✅ Disponível' : '⏳ Em breve'}\n\n`;
  });

  const comPainel = municipios.filter(m => m.paineis_bi?.length > 0).length;
  relatorio += `\n**📈 Resumo:**\n`;
  relatorio += `• ${comPainel} de ${municipios.length} municípios com painel ativo\n`;
  relatorio += `• Cobertura: ${((comPainel / municipios.length) * 100).toFixed(1)}%\n`;

  return relatorio;
};

/**
 * Calcula estatísticas agregadas dos municípios
 * @param {Array} municipios - Lista de municípios
 * @returns {Object} - Estatísticas calculadas
 */
export const calcularEstatisticas = (municipios) => {
  const total = municipios.length;
  const comPainel = municipios.filter(m => m.paineis_bi?.length > 0).length;
  const painelAtivo = municipios.filter(m => 
    m.paineis_bi?.some(p => p.status === 'ativo')
  ).length;

  return {
    totalMunicipios: total,
    comPainel,
    semPainel: total - comPainel,
    painelAtivo,
    painelInativo: comPainel - painelAtivo,
    percentualCobertura: total > 0 ? ((comPainel / total) * 100).toFixed(1) : 0,
    percentualAtivo: total > 0 ? ((painelAtivo / total) * 100).toFixed(1) : 0
  };
};

export default {
  compararMunicipios,
  analisarMunicipio,
  buscarMunicipiosPorNome,
  extrairMunicipiosDaQuery,
  gerarRelatorioComparativo,
  calcularEstatisticas
};
