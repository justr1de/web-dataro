/**
 * Serviço para buscar dados de transferências do Supabase
 * Dados reais do Portal da Transparência armazenados no banco
 */

import { supabase } from '../utils/supabaseClient';

// Códigos IBGE dos municípios de Rondônia
const MUNICIPIOS_RO = {
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

/**
 * Normaliza o nome do município para busca
 */
function normalizarNome(nome) {
  if (!nome) return '';
  return nome.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Encontra o código IBGE do município
 */
function encontrarCodigoIBGE(municipio) {
  // Busca direta
  if (MUNICIPIOS_RO[municipio]) {
    return { codigo: MUNICIPIOS_RO[municipio], nome: municipio };
  }
  
  // Busca normalizada
  const municipioNorm = normalizarNome(municipio);
  
  for (const [nome, codigo] of Object.entries(MUNICIPIOS_RO)) {
    if (normalizarNome(nome) === municipioNorm) {
      return { codigo, nome };
    }
  }
  
  return null;
}

/**
 * Busca dados de transferências de um município do Supabase
 */
export async function buscarTransferenciasSupabase(municipio) {
  const info = encontrarCodigoIBGE(municipio);
  
  if (!info) {
    console.error('Município não encontrado:', municipio);
    return null;
  }
  
  const { codigo, nome } = info;
  
  try {
    const { data, error } = await supabase
      .from('transferencias_federais')
      .select('*')
      .eq('municipio_codigo', codigo)
      .order('ano', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar dados do Supabase:', error);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.log('Nenhum dado encontrado para:', municipio);
      return null;
    }
    
    // Organizar dados por ano
    const dadosPorAno = {};
    
    data.forEach(item => {
      const ano = item.ano;
      if (!dadosPorAno[ano]) {
        dadosPorAno[ano] = {};
      }
      
      if (item.programa === 'Bolsa Família') {
        dadosPorAno[ano].bolsaFamilia = {
          valor: parseFloat(item.valor) || 0,
          beneficiarios: item.quantidade_beneficiarios || 0
        };
      } else if (item.programa === 'BPC') {
        dadosPorAno[ano].bpc = {
          valor: parseFloat(item.valor) || 0,
          beneficiarios: item.quantidade_beneficiarios || 0
        };
      } else if (item.programa === 'Fundo Nacional de Saúde') {
        dadosPorAno[ano].fns = {
          valor: parseFloat(item.valor) || 0,
          programas: ['PAB', 'MAC', 'ESF']
        };
      } else if (item.programa === 'Fundo Nacional de Desenvolvimento da Educação') {
        dadosPorAno[ano].fnde = {
          valor: parseFloat(item.valor) || 0,
          programas: ['PDDE', 'PNAE', 'PNATE']
        };
      }
    });
    
    // Calcular totais para o ano mais recente
    const anoRecente = Math.max(...Object.keys(dadosPorAno).map(Number));
    const dadosAnoRecente = dadosPorAno[anoRecente] || {};
    
    return {
      municipio: nome,
      codigoIbge: codigo,
      dadosReais: true,
      dadosPorAno,
      resumo: {
        bolsaFamilia: dadosAnoRecente.bolsaFamilia || { valor: 0, beneficiarios: 0 },
        bpc: dadosAnoRecente.bpc || { valor: 0, beneficiarios: 0 },
        fnde: dadosAnoRecente.fnde || { valor: 0, programas: ['PDDE', 'PNAE', 'PNATE'] },
        fns: dadosAnoRecente.fns || { valor: 0, programas: ['PAB', 'MAC', 'ESF'] }
      },
      convenios: {
        ativos: 0,
        valorTotal: 0,
        lista: []
      },
      emendas: {
        quantidade: 0,
        valorTotal: 0,
        parlamentares: []
      },
      dataAtualizacao: data[0]?.data_atualizacao
    };
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return null;
  }
}

/**
 * Busca todos os dados de transferências de todos os municípios
 */
export async function buscarTodosTransferencias() {
  try {
    const { data, error } = await supabase
      .from('transferencias_federais')
      .select('*')
      .eq('ano', 2024)
      .order('municipio_nome');
    
    if (error) {
      console.error('Erro ao buscar dados:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}

export { MUNICIPIOS_RO, encontrarCodigoIBGE };
