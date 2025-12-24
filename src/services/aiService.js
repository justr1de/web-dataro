/**
 * Serviço de IA para processamento de consultas
 * Integra com OpenAI API para análise e cruzamento de dados
 */

import { buscarEditais, buscarConvenios } from './federalDataService';

// Configuração da API OpenAI (será configurada via variáveis de ambiente)
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Processa uma consulta usando IA
 * @param {string} query - Pergunta do usuário
 * @param {Object} context - Contexto adicional (municípios, dados, etc.)
 * @returns {Promise<string>} - Resposta processada
 */
export const processarConsulta = async (query, context = {}) => {
  const queryLower = query.toLowerCase();
  
  // Detectar intenção da consulta
  const intencao = detectarIntencao(queryLower);
  
  switch (intencao) {
    case 'editais':
      return await buscarInformacoesEditais(query, context);
    case 'comparacao':
      return await compararMunicipios(query, context);
    case 'ministerio':
      return await informacoesMinisterio(query);
    case 'transferencias':
      return await buscarTransferencias(query, context);
    case 'indicadores':
      return await analisarIndicadores(query, context);
    default:
      return gerarRespostaPadrao(query);
  }
};

/**
 * Detecta a intenção da consulta do usuário
 */
const detectarIntencao = (query) => {
  if (query.includes('edital') || query.includes('recurso') || query.includes('captação')) {
    return 'editais';
  }
  if (query.includes('comparar') || query.includes('versus') || query.includes('vs') || query.includes('cruzar')) {
    return 'comparacao';
  }
  if (query.includes('ministério') || query.includes('mapa') || query.includes('mec') || 
      query.includes('saúde') || query.includes('educação')) {
    return 'ministerio';
  }
  if (query.includes('transferência') || query.includes('convênio') || query.includes('repasse')) {
    return 'transferencias';
  }
  if (query.includes('indicador') || query.includes('análise') || query.includes('dados')) {
    return 'indicadores';
  }
  return 'geral';
};

/**
 * Busca informações sobre editais disponíveis
 */
const buscarInformacoesEditais = async (query, context) => {
  try {
    const editais = await buscarEditais({});
    
    let resposta = `🔍 **Editais e Oportunidades Disponíveis**\n\n`;
    resposta += `Encontrei **${editais.length} editais** abertos para captação de recursos:\n\n`;
    
    editais.slice(0, 5).forEach((edital, index) => {
      resposta += `**${index + 1}. ${edital.titulo}**\n`;
      resposta += `   • Órgão: ${edital.orgao}\n`;
      resposta += `   • Área: ${edital.area}\n`;
      resposta += `   • Valor: R$ ${edital.valorMinimo.toLocaleString('pt-BR')} a R$ ${edital.valorMaximo.toLocaleString('pt-BR')}\n`;
      resposta += `   • Prazo: ${formatarData(edital.prazoInscricao)}\n`;
      resposta += `   • ${edital.descricao}\n\n`;
    });
    
    resposta += `\n💡 **Dica:** Acesse o portal Transferegov para fazer adesão aos programas.\n`;
    resposta += `Deseja mais detalhes sobre algum edital específico?`;
    
    return resposta;
  } catch (error) {
    console.error('Erro ao buscar editais:', error);
    return 'Desculpe, não foi possível buscar os editais no momento. Tente novamente mais tarde.';
  }
};

/**
 * Compara dados entre municípios
 */
const compararMunicipios = async (query, context) => {
  const { municipios = [] } = context;
  
  // Extrair nomes de municípios da query
  const municipiosEncontrados = municipios.filter(m => 
    query.toLowerCase().includes(m.nome.toLowerCase())
  );
  
  if (municipiosEncontrados.length < 2) {
    return `📊 **Comparação de Municípios**\n\n` +
      `Para realizar uma comparação, preciso que você especifique pelo menos 2 municípios.\n\n` +
      `**Exemplo:** "Comparar Ji-Paraná com Cacoal"\n\n` +
      `**Municípios disponíveis:** ${municipios.slice(0, 10).map(m => m.nome).join(', ')}... e mais ${municipios.length - 10} municípios.`;
  }
  
  let resposta = `📊 **Análise Comparativa**\n\n`;
  resposta += `Comparando: **${municipiosEncontrados.map(m => m.nome).join(' vs ')}**\n\n`;
  
  municipiosEncontrados.forEach((municipio, index) => {
    resposta += `**${municipio.nome}**\n`;
    resposta += `• Prefeito(a): ${municipio.prefeito || 'Não informado'}\n`;
    resposta += `• Telefone: ${municipio.telefone || 'Não informado'}\n`;
    resposta += `• E-mail: ${municipio.email || 'Não informado'}\n`;
    resposta += `• Status do Painel: ${municipio.paineis_bi?.length > 0 ? 'Disponível' : 'Em breve'}\n\n`;
  });
  
  resposta += `\n💡 **Sugestão:** Acesse os painéis de BI de cada município para uma análise mais detalhada dos indicadores.`;
  
  return resposta;
};

/**
 * Retorna informações sobre ministérios
 */
const informacoesMinisterio = async (query) => {
  const ministerios = {
    'mapa': {
      nome: 'Ministério da Agricultura, Pecuária e Abastecimento',
      programas: ['PAA', 'PRONAF', 'Garantia-Safra'],
      site: 'https://www.gov.br/agricultura'
    },
    'mec': {
      nome: 'Ministério da Educação',
      programas: ['FNDE', 'PDDE', 'PNAE', 'PNATE', 'Caminho da Escola'],
      site: 'https://www.gov.br/mec'
    },
    'saúde': {
      nome: 'Ministério da Saúde',
      programas: ['PAB', 'ESF', 'MAC', 'Farmácia Popular', 'SAMU'],
      site: 'https://www.gov.br/saude'
    },
    'educação': {
      nome: 'Ministério da Educação',
      programas: ['FNDE', 'PDDE', 'PNAE', 'PNATE', 'Caminho da Escola'],
      site: 'https://www.gov.br/mec'
    }
  };
  
  let ministerioEncontrado = null;
  for (const [key, value] of Object.entries(ministerios)) {
    if (query.toLowerCase().includes(key)) {
      ministerioEncontrado = value;
      break;
    }
  }
  
  if (ministerioEncontrado) {
    return `🏛️ **${ministerioEncontrado.nome}**\n\n` +
      `**Principais Programas:**\n${ministerioEncontrado.programas.map(p => `• ${p}`).join('\n')}\n\n` +
      `**Site oficial:** ${ministerioEncontrado.site}\n\n` +
      `Acesse a aba "Ministérios" para ver todos os programas e editais disponíveis.`;
  }
  
  return `🏛️ **Ministérios Federais**\n\n` +
    `Acesse a aba "Ministérios" no menu para ver informações detalhadas sobre:\n\n` +
    `• MAPA - Agricultura\n` +
    `• MEC - Educação\n` +
    `• MS - Saúde\n` +
    `• MDA - Desenvolvimento Agrário\n` +
    `• MCIDADES - Cidades\n` +
    `• MMA - Meio Ambiente\n` +
    `• MIDR - Integração e Desenvolvimento Regional\n` +
    `• MDS - Desenvolvimento Social\n\n` +
    `Qual ministério você gostaria de conhecer melhor?`;
};

/**
 * Busca informações sobre transferências
 */
const buscarTransferencias = async (query, context) => {
  try {
    const convenios = await buscarConvenios({});
    
    let resposta = `💰 **Transferências e Convênios**\n\n`;
    resposta += `Encontrei **${convenios.length} convênios** ativos na região:\n\n`;
    
    convenios.forEach((convenio, index) => {
      resposta += `**${index + 1}. ${convenio.objeto}**\n`;
      resposta += `   • Número: ${convenio.numero}\n`;
      resposta += `   • Órgão: ${convenio.orgao}\n`;
      resposta += `   • Valor: R$ ${convenio.valor.toLocaleString('pt-BR')}\n`;
      resposta += `   • Município: ${convenio.municipio}\n`;
      resposta += `   • Situação: ${convenio.situacao}\n\n`;
    });
    
    resposta += `\n📊 **Resumo:**\n`;
    resposta += `• Total de convênios: ${convenios.length}\n`;
    resposta += `• Valor total: R$ ${convenios.reduce((acc, c) => acc + c.valor, 0).toLocaleString('pt-BR')}\n`;
    
    return resposta;
  } catch (error) {
    console.error('Erro ao buscar transferências:', error);
    return 'Desculpe, não foi possível buscar as transferências no momento.';
  }
};

/**
 * Analisa indicadores dos municípios
 */
const analisarIndicadores = async (query, context) => {
  const { municipios = [] } = context;
  
  return `📈 **Análise de Indicadores**\n\n` +
    `Para uma análise completa dos indicadores, acesse o painel de BI do município desejado.\n\n` +
    `**Indicadores disponíveis nos painéis:**\n` +
    `• Dados demográficos\n` +
    `• Indicadores de saúde\n` +
    `• Indicadores de educação\n` +
    `• Receitas e despesas\n` +
    `• Desenvolvimento econômico\n\n` +
    `**Municípios com painéis ativos:** ${municipios.filter(m => m.paineis_bi?.length > 0).length}\n\n` +
    `Qual município você gostaria de analisar?`;
};

/**
 * Gera resposta padrão para consultas não identificadas
 */
const gerarRespostaPadrao = (query) => {
  return `Entendi sua pergunta sobre "${query}".\n\n` +
    `Posso ajudá-lo com:\n\n` +
    `1. **Buscar editais**: "Quais editais estão disponíveis?"\n` +
    `2. **Comparar municípios**: "Comparar Ji-Paraná com Cacoal"\n` +
    `3. **Ver transferências**: "Transferências para municípios de RO"\n` +
    `4. **Informações de ministérios**: "Programas do Ministério da Saúde"\n` +
    `5. **Analisar indicadores**: "Indicadores de educação"\n\n` +
    `Como posso ajudá-lo?`;
};

/**
 * Formata data para exibição
 */
const formatarData = (dataString) => {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Chama a API do OpenAI para processamento avançado
 * (Requer configuração da chave de API)
 */
export const chamarOpenAI = async (mensagens, contexto = '') => {
  if (!OPENAI_API_KEY) {
    console.warn('Chave da API OpenAI não configurada');
    return null;
  }
  
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `Você é o assistente de IA do DATA-RO, especializado em dados dos municípios de Rondônia e captação de recursos federais. ${contexto}`
          },
          ...mensagens
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) throw new Error('Erro na API OpenAI');
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Erro ao chamar OpenAI:', error);
    return null;
  }
};

export default {
  processarConsulta,
  chamarOpenAI
};
