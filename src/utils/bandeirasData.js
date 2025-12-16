/**
 * Mapeamento de bandeiras dos municípios usando GitHub como CDN
 * URLs diretas do GitHub raw para garantir carregamento confiável
 */

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/ArcticRBS/IFRO/main/src/assets/bandeiras/';

// Mapeamento de municípios para arquivos de bandeiras
const bandeirasMap = {
  'ALTA FLORESTA DO OESTE': 'Alta floresta.png',
  'ALTO ALEGRE DOS PARECIS': 'Alto Alegre dos Parecis.png',
  'ALTO PARAÍSO': 'Alto Paraiso.png',
  'ALVORADA DO OESTE': 'Alvorada do Oeste.png',
  'ARIQUEMES': 'Ariquemes.png',
  'BURITIS': 'buritis-ro.png',
  'CABIXI': 'Cabixi.png',
  'CACAULÂNDIA': 'Cacaulandia .png',
  'CACOAL': 'Cacoal.png',
  'CAMPO NOVO DE RONDÔNIA': 'Campo Novo de Rondonia.png',
  'CANDEIAS DO JAMARI': 'Candeias do Jamari RO.png',
  'CASTANHEIRAS': 'Castanheiras.png',
  'CEREJEIRAS': 'Cerejeiras.png',
  'COLORADO DO OESTE': 'Colorado do Oeste.png',
  'CORUMBIARA': 'Corumbiara.png',
  'COSTA MARQUES': 'Costa Marques.png',
  'ESPIGÃO DO OESTE': 'Espigao do Oeste.png',
  'GOVERNADOR JORGE TEIXEIRA': 'Governador Jorge Teixeira.png',
  'GUAJARÀ MIRRIM': 'Guajara-Mirim.png',
  'ITAPUÃ DO OESTE': 'Itapua do Oeste.png',
  'JARU': 'jaru.png',
  'JI-PARANÁ': 'Ji-Parana.png',
  'MACHADINHO DO OESTE': 'Machadinho do Oeste.png',
  'MINISTRO ANDREAZZA': 'roMinistro Andreazza.png',
  'MIRANTE DA SERRA': 'Mirante da Serra.png',
  'MONTE NEGRO': 'Monte Negro.png',
  'NOVA BRASILÂNDIA DO OESTE': 'Nova Brasilandia do Oeste.png',
  'NOVA MAMORÉ': 'Nova Mamoré.png',
  'NOVA UNIÃO': 'Nova União RO.png',
  'NOVO HORIZONTE DO OESTE': 'Novo Horizonte do Oeste.png',
  'OURO PRETO DO OESTE': 'ouro_preto_do_oeste.png',
  'PARECIS': 'Parecis.png',
  'PIMENTA BUENO': 'Pimenta_bueno.png',
  'PIMENTEIRAS DO OESTE': 'Pimenteiras do Oeste.png',
  'PORTO VELHO': 'porto_velho.png',
  'PRESIDENTE MÉDICI': 'Presidente Medici.png',
  'PRIMAVERA DE RONDONIA': 'Primavera de Rondonia.png',
  'ROLIM DE MOURA': 'rolim_de_moura.png',
  'SANTA LUZIA D\'OESTE': 'Santa Luzia D\'Oeste.png',
  'SÃO FELIPE D\'OESTE': 'SAO FELIPE.png',
  'SÃO FRANCISCO DO GUAPORÉ': 'Sao Francisco do Guapore.png',
  'SÃO MIGUEL DO GUAPORÉ': 'São Miguel do Guaporé.png',
  'SERINGUEIRAS': 'Seringueiras.png',
  'TEIXEIRÓPOLIS': 'Teixeiropolis.png',
  'THEOBROMA': '-theobroma-ro.png',
  'URUPÁ': 'urupa.png',
  'VALE DO ANARI': 'Vale do Anari.png',
  'VALE DO PARAÍSO': 'Vale do Paraiso.png'
};

/**
 * Obtém a URL da bandeira de um município
 * @param {string} nomeMunicipio - Nome do município em maiúsculas
 * @returns {string|null} - URL da bandeira ou null se não encontrada
 */
export function getBandeira(nomeMunicipio) {
  if (!nomeMunicipio) return null;
  
  const nomeNormalizado = nomeMunicipio.toUpperCase().trim();
  const arquivo = bandeirasMap[nomeNormalizado];
  
  if (arquivo) {
    // Retorna URL direta do GitHub raw
    return `${GITHUB_RAW_BASE}${encodeURIComponent(arquivo)}`;
  }
  
  return null;
}

export default {
  getBandeira,
  bandeirasMap
};
