/**
 * Configuração de Painéis do Power BI por Município
 * 
 * Este arquivo mapeia os municípios para suas respectivas URLs do Power BI.
 * Para adicionar um novo painel, basta adicionar uma entrada no objeto abaixo.
 */

export const paineisConfig = {
  // Ji-Paraná
  'Ji-Paraná': {
    titulo: 'Inteligência Territorial de Ji-Paraná',
    powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiMzA3MGJiMTMtYjVhYy00MmE4LTgyNzktMzdjZTJlNjVjMjNmIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=1d498ca6093563e54074',
    ativo: true
  },
  'JI-PARANÁ': {
    titulo: 'Inteligência Territorial de Ji-Paraná',
    powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiMzA3MGJiMTMtYjVhYy00MmE4LTgyNzktMzdjZTJlNjVjMjNmIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=1d498ca6093563e54074',
    ativo: true
  },
  
  // Alto Paraíso
  'Alto Paraíso': {
    titulo: 'Inteligência Territorial de Alto Paraíso',
    powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiMTI2ZWU5YTQtZjM3MC00N2ZlLTk0MTEtNWY0M2IyYTA3OWVmIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=9c9c0e567e3b34dd5c66',
    ativo: true
  },
  'ALTO PARAÍSO': {
    titulo: 'Inteligência Territorial de Alto Paraíso',
    powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiMTI2ZWU5YTQtZjM3MC00N2ZlLTk0MTEtNWY0M2IyYTA3OWVmIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9&pageName=9c9c0e567e3b34dd5c66',
    ativo: true
  },
  
  // Alto Alegre dos Parecis
  'Alto Alegre dos Parecis': {
    titulo: 'Inteligência Territorial de Alto Alegre dos Parecis',
    powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiYmY0OWY3MmEtNmZjNC00M2MxLWIyMzAtODdkYjg3M2MxODRmIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9',
    ativo: true
  },
  'ALTO ALEGRE DOS PARECIS': {
    titulo: 'Inteligência Territorial de Alto Alegre dos Parecis',
    powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiYmY0OWY3MmEtNmZjNC00M2MxLWIyMzAtODdkYjg3M2MxODRmIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9',
    ativo: true
  },
  
  // Costa Marques
  'Costa Marques': {
    titulo: 'Painel de Costa Marques',
    powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiMWViNTQ4NWQtOWUyNy00MTViLTg4NjYtOWZmMzQ3MDk4MmE3IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9',
    ativo: true
  },
  'COSTA MARQUES': {
    titulo: 'Painel de Costa Marques',
    powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiMWViNTQ4NWQtOWUyNy00MTViLTg4NjYtOWZmMzQ3MDk4MmE3IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9',
    ativo: true
  },
  
  // Jaru
  'Jaru': {
    titulo: 'Inteligência Territorial de Jaru',
    powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiNzBmNDM0OTUtNjg5Zi00ZTE3LTg5MTgtYzIwYTk4NGJhOTI0IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9',
    ativo: true
  },
  'JARU': {
    titulo: 'Inteligência Territorial de Jaru',
    powerbi_url: 'https://app.powerbi.com/view?r=eyJrIjoiNzBmNDM0OTUtNjg5Zi00ZTE3LTg5MTgtYzIwYTk4NGJhOTI0IiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9',
    ativo: true
  }
};

/**
 * Obtém a configuração do painel para um município específico
 * @param {string} nomeMunicipio - Nome do município
 * @returns {object|null} Configuração do painel ou null se não encontrado
 */
export const getPainelConfig = (nomeMunicipio) => {
  // Tenta buscar diretamente
  if (paineisConfig[nomeMunicipio]) {
    return paineisConfig[nomeMunicipio];
  }
  
  // Tenta buscar em MAIÚSCULAS
  if (paineisConfig[nomeMunicipio.toUpperCase()]) {
    return paineisConfig[nomeMunicipio.toUpperCase()];
  }
  
  // Tenta buscar em Title Case
  const titleCase = nomeMunicipio
    .toLowerCase()
    .split(' ')
    .map(word => {
      // Palavras que devem ficar em minúsculo
      const lowercase = ['de', 'do', 'da', 'dos', 'das', 'e'];
      if (lowercase.includes(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
  
  return paineisConfig[titleCase] || null;
};

/**
 * Verifica se um município tem painel configurado
 * @param {string} nomeMunicipio - Nome do município
 * @returns {boolean} True se o município tem painel configurado e ativo
 */
export const hasPainel = (nomeMunicipio) => {
  const config = getPainelConfig(nomeMunicipio);
  return config && config.ativo;
};

/**
 * Lista todos os municípios com painéis ativos
 * @returns {Array<string>} Array com nomes dos municípios
 */
export const getMunicipiosComPainel = () => {
  return Object.keys(paineisConfig).filter(municipio => paineisConfig[municipio].ativo);
};
