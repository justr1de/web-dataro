import React, { useState } from 'react';
import './MinisteriosSidebar.css';

const ministeriosData = [
  {
    id: 'mapa',
    sigla: 'MAPA',
    nome: 'Ministério da Agricultura, Pecuária e Abastecimento',
    cor: '#2e7d32',
    icone: '🌾',
    descricao: 'Responsável por políticas agrícolas, pecuárias e de abastecimento alimentar.',
    programas: [
      {
        nome: 'PAA - Programa de Aquisição de Alimentos',
        descricao: 'Compra de alimentos da agricultura familiar para doação a entidades socioassistenciais.',
        status: 'Ativo',
        link: 'https://www.gov.br/agricultura/pt-br/assuntos/agricultura-familiar/paa'
      },
      {
        nome: 'PRONAF - Programa Nacional de Fortalecimento da Agricultura Familiar',
        descricao: 'Financiamento de projetos para agricultores familiares.',
        status: 'Ativo',
        link: 'https://www.gov.br/agricultura/pt-br/assuntos/agricultura-familiar/pronaf'
      },
      {
        nome: 'Garantia-Safra',
        descricao: 'Benefício para agricultores familiares em caso de perda de safra por seca ou excesso de chuvas.',
        status: 'Ativo',
        link: 'https://www.gov.br/agricultura/pt-br/assuntos/agricultura-familiar/garantia-safra'
      }
    ],
    contato: {
      telefone: '(61) 3218-2828',
      email: 'ouvidoria@agricultura.gov.br',
      site: 'https://www.gov.br/agricultura'
    }
  },
  {
    id: 'mec',
    sigla: 'MEC',
    nome: 'Ministério da Educação',
    cor: '#1565c0',
    icone: '📚',
    descricao: 'Responsável pela política nacional de educação.',
    programas: [
      {
        nome: 'FNDE - Fundo Nacional de Desenvolvimento da Educação',
        descricao: 'Transferências de recursos para educação básica.',
        status: 'Ativo',
        link: 'https://www.fnde.gov.br'
      },
      {
        nome: 'PDDE - Programa Dinheiro Direto na Escola',
        descricao: 'Recursos financeiros diretamente às escolas públicas.',
        status: 'Ativo',
        link: 'https://www.fnde.gov.br/programas/pdde'
      },
      {
        nome: 'PNAE - Programa Nacional de Alimentação Escolar',
        descricao: 'Merenda escolar para estudantes da educação básica.',
        status: 'Ativo',
        link: 'https://www.fnde.gov.br/programas/pnae'
      },
      {
        nome: 'PNATE - Programa Nacional de Apoio ao Transporte Escolar',
        descricao: 'Recursos para transporte escolar de estudantes da zona rural.',
        status: 'Ativo',
        link: 'https://www.fnde.gov.br/programas/pnate'
      },
      {
        nome: 'Caminho da Escola',
        descricao: 'Aquisição de ônibus escolares padronizados.',
        status: 'Ativo',
        link: 'https://www.fnde.gov.br/programas/caminho-da-escola'
      }
    ],
    contato: {
      telefone: '0800 616161',
      email: 'faleconosco@mec.gov.br',
      site: 'https://www.gov.br/mec'
    }
  },
  {
    id: 'ms',
    sigla: 'MS',
    nome: 'Ministério da Saúde',
    cor: '#c62828',
    icone: '🏥',
    descricao: 'Responsável pela política nacional de saúde.',
    programas: [
      {
        nome: 'PAB - Piso da Atenção Básica',
        descricao: 'Transferência per capita para ações de atenção básica.',
        status: 'Ativo',
        link: 'https://www.gov.br/saude/pt-br/composicao/saps'
      },
      {
        nome: 'ESF - Estratégia Saúde da Família',
        descricao: 'Incentivos para equipes de saúde da família.',
        status: 'Ativo',
        link: 'https://www.gov.br/saude/pt-br/composicao/saps/esf'
      },
      {
        nome: 'MAC - Média e Alta Complexidade',
        descricao: 'Recursos para procedimentos de média e alta complexidade.',
        status: 'Ativo',
        link: 'https://www.gov.br/saude/pt-br'
      },
      {
        nome: 'Farmácia Popular',
        descricao: 'Programa de acesso a medicamentos.',
        status: 'Ativo',
        link: 'https://www.gov.br/saude/pt-br/composicao/sctie/daf/farmacia-popular'
      },
      {
        nome: 'SAMU 192',
        descricao: 'Serviço de Atendimento Móvel de Urgência.',
        status: 'Ativo',
        link: 'https://www.gov.br/saude/pt-br/composicao/saes/samu'
      }
    ],
    contato: {
      telefone: '136',
      email: 'ouvidoria@saude.gov.br',
      site: 'https://www.gov.br/saude'
    }
  },
  {
    id: 'mda',
    sigla: 'MDA',
    nome: 'Ministério do Desenvolvimento Agrário e Agricultura Familiar',
    cor: '#558b2f',
    icone: '🚜',
    descricao: 'Responsável pela reforma agrária e agricultura familiar.',
    programas: [
      {
        nome: 'PNRA - Programa Nacional de Reforma Agrária',
        descricao: 'Assentamento de famílias e regularização fundiária.',
        status: 'Ativo',
        link: 'https://www.gov.br/incra/pt-br'
      },
      {
        nome: 'Terra Legal',
        descricao: 'Regularização fundiária na Amazônia Legal.',
        status: 'Ativo',
        link: 'https://www.gov.br/incra/pt-br/assuntos/governanca-fundiaria/terra-legal'
      },
      {
        nome: 'ATER - Assistência Técnica e Extensão Rural',
        descricao: 'Assistência técnica para agricultores familiares.',
        status: 'Ativo',
        link: 'https://www.gov.br/mda/pt-br'
      }
    ],
    contato: {
      telefone: '(61) 2020-0002',
      email: 'ouvidoria@mda.gov.br',
      site: 'https://www.gov.br/mda'
    }
  },
  {
    id: 'mcidades',
    sigla: 'MCIDADES',
    nome: 'Ministério das Cidades',
    cor: '#6a1b9a',
    icone: '🏙️',
    descricao: 'Responsável por políticas de desenvolvimento urbano.',
    programas: [
      {
        nome: 'Minha Casa, Minha Vida',
        descricao: 'Programa habitacional para famílias de baixa renda.',
        status: 'Ativo',
        link: 'https://www.gov.br/cidades/pt-br/assuntos/habitacao/minha-casa-minha-vida'
      },
      {
        nome: 'PAC - Saneamento',
        descricao: 'Investimentos em água, esgoto e drenagem.',
        status: 'Ativo',
        link: 'https://www.gov.br/cidades/pt-br/assuntos/saneamento'
      },
      {
        nome: 'PAC - Mobilidade Urbana',
        descricao: 'Investimentos em transporte público.',
        status: 'Ativo',
        link: 'https://www.gov.br/cidades/pt-br/assuntos/mobilidade-urbana'
      },
      {
        nome: 'Calha Norte',
        descricao: 'Infraestrutura para municípios da região Norte.',
        status: 'Ativo',
        link: 'https://www.gov.br/defesa/pt-br/assuntos/programas-sociais/programa-calha-norte'
      }
    ],
    contato: {
      telefone: '(61) 2108-1000',
      email: 'ouvidoria@cidades.gov.br',
      site: 'https://www.gov.br/cidades'
    }
  },
  {
    id: 'mma',
    sigla: 'MMA',
    nome: 'Ministério do Meio Ambiente',
    cor: '#00695c',
    icone: '🌿',
    descricao: 'Responsável pela política nacional de meio ambiente.',
    programas: [
      {
        nome: 'Fundo Amazônia',
        descricao: 'Recursos para prevenção e combate ao desmatamento.',
        status: 'Ativo',
        link: 'https://www.fundoamazonia.gov.br'
      },
      {
        nome: 'Bolsa Verde',
        descricao: 'Transferência de renda para famílias em situação de extrema pobreza em áreas de conservação.',
        status: 'Ativo',
        link: 'https://www.gov.br/mma/pt-br'
      },
      {
        nome: 'ICMS Ecológico',
        descricao: 'Repasse de ICMS para municípios com áreas de preservação.',
        status: 'Ativo',
        link: 'https://www.gov.br/mma/pt-br'
      }
    ],
    contato: {
      telefone: '(61) 2028-1000',
      email: 'ouvidoria@mma.gov.br',
      site: 'https://www.gov.br/mma'
    }
  },
  {
    id: 'mdr',
    sigla: 'MIDR',
    nome: 'Ministério da Integração e do Desenvolvimento Regional',
    cor: '#e65100',
    icone: '🗺️',
    descricao: 'Responsável por políticas de desenvolvimento regional e defesa civil.',
    programas: [
      {
        nome: 'Defesa Civil',
        descricao: 'Recursos para prevenção e resposta a desastres naturais.',
        status: 'Ativo',
        link: 'https://www.gov.br/mdr/pt-br/assuntos/protecao-e-defesa-civil'
      },
      {
        nome: 'Cisternas',
        descricao: 'Programa de construção de cisternas no semiárido.',
        status: 'Ativo',
        link: 'https://www.gov.br/mdr/pt-br/assuntos/seguranca-hidrica/programa-cisternas'
      },
      {
        nome: 'Rotas de Integração Nacional',
        descricao: 'Desenvolvimento de cadeias produtivas regionais.',
        status: 'Ativo',
        link: 'https://www.gov.br/mdr/pt-br'
      }
    ],
    contato: {
      telefone: '(61) 2034-4000',
      email: 'ouvidoria@mdr.gov.br',
      site: 'https://www.gov.br/mdr'
    }
  },
  {
    id: 'mds',
    sigla: 'MDS',
    nome: 'Ministério do Desenvolvimento e Assistência Social',
    cor: '#ad1457',
    icone: '🤝',
    descricao: 'Responsável por políticas de assistência social e combate à fome.',
    programas: [
      {
        nome: 'Bolsa Família',
        descricao: 'Programa de transferência de renda para famílias em situação de pobreza.',
        status: 'Ativo',
        link: 'https://www.gov.br/mds/pt-br/acoes-e-programas/bolsa-familia'
      },
      {
        nome: 'BPC - Benefício de Prestação Continuada',
        descricao: 'Benefício para idosos e pessoas com deficiência de baixa renda.',
        status: 'Ativo',
        link: 'https://www.gov.br/mds/pt-br/acoes-e-programas/suas/beneficios-assistenciais/bpc'
      },
      {
        nome: 'SUAS - Sistema Único de Assistência Social',
        descricao: 'Cofinanciamento federal para serviços socioassistenciais.',
        status: 'Ativo',
        link: 'https://www.gov.br/mds/pt-br/acoes-e-programas/suas'
      },
      {
        nome: 'Cozinha Solidária',
        descricao: 'Programa de segurança alimentar e nutricional.',
        status: 'Ativo',
        link: 'https://www.gov.br/mds/pt-br'
      }
    ],
    contato: {
      telefone: '121',
      email: 'ouvidoria@mds.gov.br',
      site: 'https://www.gov.br/mds'
    }
  }
];

const MinisteriosSidebar = () => {
  const [expandedMinisterio, setExpandedMinisterio] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMinisterios = ministeriosData.filter(m => 
    m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.sigla.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.programas.some(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleMinisterio = (id) => {
    setExpandedMinisterio(expandedMinisterio === id ? null : id);
  };

  return (
    <div className="ministerios-sidebar">
      <div className="ministerios-header">
        <h3>🏛️ Ministérios e Programas Federais</h3>
        <p>Explore os programas e editais disponíveis para captação de recursos</p>
      </div>

      <div className="ministerios-search">
        <input
          type="text"
          placeholder="Buscar ministério ou programa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      </div>

      <div className="ministerios-list">
        {filteredMinisterios.map((ministerio) => (
          <div 
            key={ministerio.id} 
            className={`ministerio-card ${expandedMinisterio === ministerio.id ? 'expanded' : ''}`}
          >
            <div 
              className="ministerio-header"
              onClick={() => toggleMinisterio(ministerio.id)}
              style={{ borderLeftColor: ministerio.cor }}
            >
              <div className="ministerio-icon">{ministerio.icone}</div>
              <div className="ministerio-info">
                <span className="ministerio-sigla" style={{ color: ministerio.cor }}>
                  {ministerio.sigla}
                </span>
                <span className="ministerio-nome">{ministerio.nome}</span>
              </div>
              <svg 
                className={`expand-icon ${expandedMinisterio === ministerio.id ? 'rotated' : ''}`}
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>

            {expandedMinisterio === ministerio.id && (
              <div className="ministerio-content">
                <p className="ministerio-descricao">{ministerio.descricao}</p>
                
                <div className="programas-section">
                  <h4>📋 Programas Disponíveis</h4>
                  <div className="programas-list">
                    {ministerio.programas.map((programa, index) => (
                      <div key={index} className="programa-item">
                        <div className="programa-header">
                          <span className="programa-nome">{programa.nome}</span>
                          <span className={`programa-status ${programa.status.toLowerCase()}`}>
                            {programa.status}
                          </span>
                        </div>
                        <p className="programa-descricao">{programa.descricao}</p>
                        <a 
                          href={programa.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="programa-link"
                        >
                          Acessar programa →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="contato-section">
                  <h4>📞 Contato</h4>
                  <div className="contato-info">
                    <p><strong>Telefone:</strong> {ministerio.contato.telefone}</p>
                    <p><strong>E-mail:</strong> {ministerio.contato.email}</p>
                    <a 
                      href={ministerio.contato.site} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="site-link"
                    >
                      Visitar site oficial →
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="ministerios-footer">
        <div className="transferegov-link">
          <h4>🔗 Portal Transferegov</h4>
          <p>Acesse o portal oficial para consultar todos os programas e fazer adesão:</p>
          <a 
            href="https://transferegov.gestao.gov.br" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transferegov-button"
          >
            Acessar Transferegov
          </a>
        </div>
      </div>
    </div>
  );
};

export default MinisteriosSidebar;
