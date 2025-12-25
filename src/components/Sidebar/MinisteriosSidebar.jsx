import { useState } from 'react';
import './MinisteriosSidebar.css';
import logoGovernoFederal from '../../assets/logo-governo-federal.png';

const MinisteriosSidebar = ({ isOpen, onToggle }) => {
  const [expandedMinisterio, setExpandedMinisterio] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const ministerios = [
    {
      id: 'mapa',
      sigla: 'MAPA',
      nome: 'Ministério da Agricultura e Pecuária',
      icone: '🌾',
      cor: '#2e7d32',
      descricao: 'Responsável pela política agrícola e pecuária nacional.',
      programas: [
        { nome: 'PAA - Programa de Aquisição de Alimentos', link: 'https://www.gov.br/agricultura/pt-br/assuntos/agricultura-familiar/paa' },
        { nome: 'PRONAF - Fortalecimento da Agricultura Familiar', link: 'https://www.gov.br/agricultura/pt-br/assuntos/agricultura-familiar/pronaf' },
        { nome: 'Garantia-Safra', link: 'https://www.gov.br/agricultura/pt-br/assuntos/agricultura-familiar/garantia-safra' },
        { nome: 'Programa ABC+ (Baixo Carbono)', link: 'https://www.gov.br/agricultura/pt-br/assuntos/sustentabilidade/plano-abc' }
      ],
      site: 'https://www.gov.br/agricultura',
      telefone: '(61) 3218-2828',
      email: 'ouvidoria@agricultura.gov.br'
    },
    {
      id: 'mec',
      sigla: 'MEC',
      nome: 'Ministério da Educação',
      icone: '📚',
      cor: '#1565c0',
      descricao: 'Responsável pela política nacional de educação.',
      programas: [
        { nome: 'FNDE - Fundo Nacional de Desenvolvimento da Educação', link: 'https://www.fnde.gov.br' },
        { nome: 'PDDE - Programa Dinheiro Direto na Escola', link: 'https://www.fnde.gov.br/programas/pdde' },
        { nome: 'PNAE - Alimentação Escolar', link: 'https://www.fnde.gov.br/programas/pnae' },
        { nome: 'PNATE - Transporte Escolar', link: 'https://www.fnde.gov.br/programas/pnate' },
        { nome: 'Caminho da Escola', link: 'https://www.fnde.gov.br/programas/caminho-da-escola' },
        { nome: 'Proinfância - Construção de Creches', link: 'https://www.fnde.gov.br/programas/proinfancia' }
      ],
      site: 'https://www.gov.br/mec',
      telefone: '(61) 2022-7000',
      email: 'ouvidoria@mec.gov.br'
    },
    {
      id: 'ms',
      sigla: 'MS',
      nome: 'Ministério da Saúde',
      icone: '🏥',
      cor: '#c62828',
      descricao: 'Responsável pela política nacional de saúde.',
      programas: [
        { nome: 'PAB - Piso da Atenção Básica', link: 'https://www.gov.br/saude/pt-br/composicao/saps/pab' },
        { nome: 'ESF - Estratégia Saúde da Família', link: 'https://www.gov.br/saude/pt-br/composicao/saps/esf' },
        { nome: 'MAC - Média e Alta Complexidade', link: 'https://www.gov.br/saude/pt-br/composicao/saes/mac' },
        { nome: 'Farmácia Popular', link: 'https://www.gov.br/saude/pt-br/composicao/sctie/farmacia-popular' },
        { nome: 'SAMU 192', link: 'https://www.gov.br/saude/pt-br/composicao/saes/samu' },
        { nome: 'Mais Médicos', link: 'https://www.gov.br/saude/pt-br/composicao/sgtes/mais-medicos' },
        { nome: 'UBS - Unidades Básicas de Saúde', link: 'https://www.gov.br/saude/pt-br/composicao/saps/ubs' }
      ],
      site: 'https://www.gov.br/saude',
      telefone: '136',
      email: 'ouvidoria@saude.gov.br'
    },
    {
      id: 'mda',
      sigla: 'MDA',
      nome: 'Ministério do Desenvolvimento Agrário',
      icone: '🚜',
      cor: '#558b2f',
      descricao: 'Responsável pela reforma agrária e agricultura familiar.',
      programas: [
        { nome: 'PRONAF - Crédito para Agricultura Familiar', link: 'https://www.gov.br/mda/pt-br/assuntos/pronaf' },
        { nome: 'Terra Brasil - Regularização Fundiária', link: 'https://www.gov.br/incra/pt-br/assuntos/governanca-fundiaria/terra-legal' },
        { nome: 'Crédito Fundiário', link: 'https://www.gov.br/mda/pt-br/assuntos/credito-fundiario' },
        { nome: 'ATER - Assistência Técnica Rural', link: 'https://www.gov.br/mda/pt-br/assuntos/ater' },
        { nome: 'Apoio a Comunidades Quilombolas', link: 'https://www.gov.br/mda/pt-br/assuntos/quilombolas' }
      ],
      site: 'https://www.gov.br/mda',
      telefone: '(61) 2020-0002',
      email: 'ouvidoria@mda.gov.br'
    },
    {
      id: 'mcidades',
      sigla: 'MCIDADES',
      nome: 'Ministério das Cidades',
      icone: '🏙️',
      cor: '#6a1b9a',
      descricao: 'Responsável pela política de desenvolvimento urbano.',
      programas: [
        { nome: 'Minha Casa, Minha Vida', link: 'https://www.gov.br/cidades/pt-br/assuntos/habitacao/minha-casa-minha-vida' },
        { nome: 'Reforma Casa Brasil', link: 'https://www.gov.br/cidades/pt-br/assuntos/habitacao/reforma-casa-brasil' },
        { nome: 'Pró-Cidades - Desenvolvimento Urbano', link: 'https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/desenvolvimento-urbano-e-metropolitano/programa-de-desenvolvimento-urbano-pro-cidades' },
        { nome: 'Avançar Cidades - Mobilidade', link: 'https://www.gov.br/cidades/pt-br/assuntos/mobilidade-urbana' },
        { nome: 'Avançar Cidades - Saneamento', link: 'https://www.gov.br/cidades/pt-br/assuntos/saneamento' },
        { nome: 'Regularização Fundiária Urbana', link: 'https://www.gov.br/cidades/pt-br/assuntos/regularizacao-fundiaria' }
      ],
      site: 'https://www.gov.br/cidades',
      telefone: '(61) 2108-1000',
      email: 'ouvidoria@cidades.gov.br'
    },
    {
      id: 'mma',
      sigla: 'MMA',
      nome: 'Ministério do Meio Ambiente',
      icone: '🌿',
      cor: '#00695c',
      descricao: 'Responsável pela política ambiental nacional.',
      programas: [
        { nome: 'Fundo Amazônia', link: 'https://www.fundoamazonia.gov.br' },
        { nome: 'Bolsa Verde', link: 'https://www.gov.br/mma/pt-br/assuntos/servicosambientais/bolsa-verde' },
        { nome: 'Programa Água Doce', link: 'https://www.gov.br/mma/pt-br/assuntos/agua/programa-agua-doce' },
        { nome: 'Gestão de Resíduos Sólidos', link: 'https://www.gov.br/mma/pt-br/assuntos/agendaambientalurbana/residuos-solidos' },
        { nome: 'Cidades Sustentáveis', link: 'https://www.gov.br/mma/pt-br/assuntos/agendaambientalurbana' }
      ],
      site: 'https://www.gov.br/mma',
      telefone: '(61) 2028-1000',
      email: 'ouvidoria@mma.gov.br'
    },
    {
      id: 'midr',
      sigla: 'MIDR',
      nome: 'Ministério da Integração e Desenvolvimento Regional',
      icone: '🗺️',
      cor: '#ef6c00',
      descricao: 'Responsável pelo desenvolvimento regional e defesa civil.',
      programas: [
        { nome: 'Cidades Intermediadoras', link: 'https://www.gov.br/mdr/pt-br/assuntos/desenvolvimento-regional/cidades-intermediadoras' },
        { nome: 'Proteção e Defesa Civil', link: 'https://www.gov.br/mdr/pt-br/assuntos/protecao-e-defesa-civil' },
        { nome: 'SUDAM - Desenvolvimento da Amazônia', link: 'https://www.gov.br/sudam' },
        { nome: 'Fundos Regionais e Incentivos Fiscais', link: 'https://www.gov.br/mdr/pt-br/assuntos/fundos-regionais-e-incentivos-fiscais' },
        { nome: 'Rotas de Integração Nacional', link: 'https://www.gov.br/mdr/pt-br/assuntos/desenvolvimento-regional/rotas-de-integracao-nacional' }
      ],
      site: 'https://www.gov.br/mdr',
      telefone: '(61) 2034-4000',
      email: 'ouvidoria@mdr.gov.br'
    },
    {
      id: 'mds',
      sigla: 'MDS',
      nome: 'Ministério do Desenvolvimento e Assistência Social',
      icone: '🤝',
      cor: '#ad1457',
      descricao: 'Responsável pelas políticas de assistência social.',
      programas: [
        { nome: 'Bolsa Família', link: 'https://www.gov.br/mds/pt-br/acoes-e-programas/bolsa-familia' },
        { nome: 'SUAS - Sistema Único de Assistência Social', link: 'https://www.gov.br/mds/pt-br/acoes-e-programas/suas' },
        { nome: 'BPC - Benefício de Prestação Continuada', link: 'https://www.gov.br/mds/pt-br/acoes-e-programas/suas/bpc' },
        { nome: 'Criança Feliz', link: 'https://www.gov.br/mds/pt-br/acoes-e-programas/crianca-feliz' },
        { nome: 'CRAS/CREAS', link: 'https://www.gov.br/mds/pt-br/acoes-e-programas/suas/cras-creas' },
        { nome: 'Cadastro Único', link: 'https://www.gov.br/mds/pt-br/acoes-e-programas/cadastro-unico' }
      ],
      site: 'https://www.gov.br/mds',
      telefone: '121',
      email: 'ouvidoria@mds.gov.br'
    },
    {
      id: 'mesporte',
      sigla: 'MESPORTE',
      nome: 'Ministério do Esporte',
      icone: '⚽',
      cor: '#ff5722',
      descricao: 'Responsável pela política nacional de esporte e lazer.',
      programas: [
        { nome: 'Bolsa Atleta', link: 'https://www.gov.br/esporte/pt-br/acoes-e-programas/bolsa-atleta' },
        { nome: 'Lei de Incentivo ao Esporte', link: 'https://www.gov.br/esporte/pt-br/acoes-e-programas/lei-de-incentivo-ao-esporte' },
        { nome: 'Segundo Tempo (PST)', link: 'https://www.gov.br/esporte/pt-br/acoes-e-programas/segundo-tempo' },
        { nome: 'PELC - Esporte e Lazer da Cidade', link: 'https://www.gov.br/esporte/pt-br/acoes-e-programas/pelc' },
        { nome: 'Infraestrutura Esportiva', link: 'https://www.gov.br/esporte/pt-br/acoes-e-programas/infraestrutura-esportiva' },
        { nome: 'Arenas Brasil', link: 'https://www.gov.br/esporte/pt-br/acoes-e-programas' }
      ],
      site: 'https://www.gov.br/esporte',
      telefone: '(61) 3217-1800',
      email: 'ouvidoria@esporte.gov.br'
    },
    {
      id: 'mturismo',
      sigla: 'MTUR',
      nome: 'Ministério do Turismo',
      icone: '✈️',
      cor: '#00bcd4',
      descricao: 'Responsável pela política nacional de turismo.',
      programas: [
        { nome: 'Programa de Regionalização do Turismo', link: 'https://www.gov.br/turismo/pt-br/assuntos/programas' },
        { nome: 'Investe Turismo', link: 'https://www.gov.br/turismo/pt-br/assuntos/investe-turismo' },
        { nome: 'Cadastur', link: 'https://cadastur.turismo.gov.br' },
        { nome: 'Qualificação Profissional', link: 'https://www.gov.br/turismo/pt-br/assuntos/qualificacao' }
      ],
      site: 'https://www.gov.br/turismo',
      telefone: '(61) 2023-7000',
      email: 'ouvidoria@turismo.gov.br'
    },
    {
      id: 'minc',
      sigla: 'MINC',
      nome: 'Ministério da Cultura',
      icone: '🎭',
      cor: '#9c27b0',
      descricao: 'Responsável pela política cultural nacional.',
      programas: [
        { nome: 'Lei Paulo Gustavo (LPG)', link: 'https://www.gov.br/cultura/pt-br/assuntos/lei-paulo-gustavo' },
        { nome: 'Lei Aldir Blanc', link: 'https://www.gov.br/cultura/pt-br/assuntos/politica-nacional-aldir-blanc' },
        { nome: 'Cultura Viva', link: 'https://www.gov.br/cultura/pt-br/assuntos/cultura-viva' },
        { nome: 'Territórios da Cultura', link: 'https://www.gov.br/cultura/pt-br/assuntos/politica-nacional-aldir-blanc/programas-nacionais' },
        { nome: 'Mapa da Cultura', link: 'https://mapa.cultura.gov.br' }
      ],
      site: 'https://www.gov.br/cultura',
      telefone: '(61) 2024-2000',
      email: 'ouvidoria@cultura.gov.br'
    },
    {
      id: 'mcom',
      sigla: 'MCOM',
      nome: 'Ministério das Comunicações',
      icone: '📡',
      cor: '#3f51b5',
      descricao: 'Responsável pela política de telecomunicações e inclusão digital.',
      programas: [
        { nome: 'Escolas Conectadas', link: 'https://www.gov.br/mcom/pt-br/assuntos/escolas-conectadas' },
        { nome: 'Internet para Todos', link: 'https://www.gov.br/mcom/pt-br/assuntos/internet-para-todos' },
        { nome: 'Wi-Fi Brasil', link: 'https://www.gov.br/mcom/pt-br/assuntos/wifi-brasil' },
        { nome: 'Digitaliza Brasil', link: 'https://www.gov.br/mcom/pt-br/assuntos/digitaliza-brasil' }
      ],
      site: 'https://www.gov.br/mcom',
      telefone: '(61) 2027-6000',
      email: 'ouvidoria@mcom.gov.br'
    },
    {
      id: 'mte',
      sigla: 'MTE',
      nome: 'Ministério do Trabalho e Emprego',
      icone: '👷',
      cor: '#795548',
      descricao: 'Responsável pela política de trabalho e emprego.',
      programas: [
        { nome: 'SINE - Sistema Nacional de Emprego', link: 'https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/sistema-nacional-de-emprego-sine' },
        { nome: 'Seguro-Desemprego', link: 'https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/seguro-desemprego' },
        { nome: 'Qualificação Profissional', link: 'https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/qualificacao-profissional' },
        { nome: 'Programa de Aprendizagem', link: 'https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/aprendizagem' }
      ],
      site: 'https://www.gov.br/trabalho-e-emprego',
      telefone: '158',
      email: 'ouvidoria@trabalho.gov.br'
    },
    {
      id: 'mcti',
      sigla: 'MCTI',
      nome: 'Ministério da Ciência, Tecnologia e Inovação',
      icone: '🔬',
      cor: '#607d8b',
      descricao: 'Responsável pela política de ciência, tecnologia e inovação.',
      programas: [
        { nome: 'MCTI Conecta', link: 'https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/mcti-conecta' },
        { nome: 'Tecnologias para Cidades Sustentáveis', link: 'https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/transformacaodigital' },
        { nome: 'Cidades Inteligentes', link: 'https://www.gov.br/mcti/pt-br/acompanhe-o-mcti/transformacaodigital/camara-cidades-programas_iniciativas' },
        { nome: 'Cemaden Educação', link: 'https://www.gov.br/mcti/pt-br/composicao/unidades-de-pesquisa/cemaden' }
      ],
      site: 'https://www.gov.br/mcti',
      telefone: '(61) 2033-7500',
      email: 'ouvidoria@mcti.gov.br'
    },
    {
      id: 'mjsp',
      sigla: 'MJSP',
      nome: 'Ministério da Justiça e Segurança Pública',
      icone: '🛡️',
      cor: '#263238',
      descricao: 'Responsável pela política de segurança pública.',
      programas: [
        { nome: 'Município Mais Seguro', link: 'https://www.gov.br/mj/pt-br/assuntos/sua-seguranca/seguranca-publica' },
        { nome: 'PRONASCI', link: 'https://www.gov.br/mj/pt-br/acesso-a-informacao/acoes-e-programas/pronasci' },
        { nome: 'Bolsa-Formação', link: 'https://www.gov.br/mj/pt-br/acesso-a-informacao/acoes-e-programas/pronasci/bolsa-formacao' },
        { nome: 'Rede EaD Senasp', link: 'https://www.gov.br/mj/pt-br/assuntos/sua-seguranca/seguranca-publica' }
      ],
      site: 'https://www.gov.br/mj',
      telefone: '(61) 2025-3000',
      email: 'ouvidoria@mj.gov.br'
    },
    {
      id: 'mdhc',
      sigla: 'MDHC',
      nome: 'Ministério dos Direitos Humanos e Cidadania',
      icone: '⚖️',
      cor: '#e91e63',
      descricao: 'Responsável pela promoção dos direitos humanos.',
      programas: [
        { nome: 'Programas de Equipagem', link: 'https://www.gov.br/mdh/pt-br/programas-de-equipagem' },
        { nome: 'Envelhecer nos Territórios', link: 'https://www.gov.br/mdh/pt-br/navegue-por-temas/pessoa-idosa/programa-envelhecer-nos-territorios' },
        { nome: 'Proteção a Crianças e Adolescentes', link: 'https://www.gov.br/mdh/pt-br/navegue-por-temas/crianca-e-adolescente' },
        { nome: 'PRÓ-DH', link: 'https://www.gov.br/mdh/pt-br/acesso-a-informacao/acoes-e-programas' }
      ],
      site: 'https://www.gov.br/mdh',
      telefone: '100',
      email: 'ouvidoria@mdh.gov.br'
    },
    {
      id: 'mme',
      sigla: 'MME',
      nome: 'Ministério de Minas e Energia',
      icone: '⚡',
      cor: '#ffc107',
      descricao: 'Responsável pela política energética e mineral.',
      programas: [
        { nome: 'Luz para Todos', link: 'https://www.gov.br/mme/pt-br/assuntos/programas/luz-para-todos' },
        { nome: 'Municípios Mais Eficientes', link: 'https://www.gov.br/mme/pt-br/assuntos/ee/guia-para-municipios' },
        { nome: 'Procel Reluz - Iluminação Pública', link: 'https://www.gov.br/mme/pt-br/assuntos/ee' },
        { nome: 'Energia Zero em Prédios Públicos', link: 'https://cpenergiazero.procel.gov.br' }
      ],
      site: 'https://www.gov.br/mme',
      telefone: '(61) 2032-5555',
      email: 'ouvidoria@mme.gov.br'
    },
    {
      id: 'mpa',
      sigla: 'MPA',
      nome: 'Ministério da Pesca e Aquicultura',
      icone: '🐟',
      cor: '#0288d1',
      descricao: 'Responsável pela política pesqueira e aquícola.',
      programas: [
        { nome: 'Povos da Pesca Artesanal', link: 'https://www.gov.br/mpa/pt-br/acesso-a-informacao/acoes-e-programas-1' },
        { nome: 'Saberes das Águas', link: 'https://www.gov.br/mpa/pt-br/assuntos/saberes-das-aguas' },
        { nome: 'PROPESC - Regularização de Embarcações', link: 'https://www.gov.br/mpa/pt-br/assuntos/propesc' },
        { nome: 'Cartilha de Fomento', link: 'https://www.gov.br/mpa/pt-br/assuntos/fomento' }
      ],
      site: 'https://www.gov.br/mpa',
      telefone: '(61) 2023-3500',
      email: 'ouvidoria@mpa.gov.br'
    },
    {
      id: 'mir',
      sigla: 'MIR',
      nome: 'Ministério da Igualdade Racial',
      icone: '✊',
      cor: '#4caf50',
      descricao: 'Responsável pela promoção da igualdade racial.',
      programas: [
        { nome: 'SINAPIR - Sistema Nacional de Igualdade Racial', link: 'https://www.gov.br/igualdaderacial/pt-br/assuntos/sinapir' },
        { nome: 'Aquilomba Brasil', link: 'https://www.gov.br/igualdaderacial/pt-br/assuntos/aquilomba-brasil' },
        { nome: 'Programa de Equipagem', link: 'https://www.gov.br/igualdaderacial/pt-br/assuntos/programa-de-equipagem' },
        { nome: 'Mais Igualdade', link: 'https://www.gov.br/igualdaderacial/pt-br/assuntos/mais-igualdade' }
      ],
      site: 'https://www.gov.br/igualdaderacial',
      telefone: '(61) 2027-3500',
      email: 'ouvidoria@igualdaderacial.gov.br'
    },
    {
      id: 'memp',
      sigla: 'MEMP',
      nome: 'Ministério do Empreendedorismo e Microempresa',
      icone: '💼',
      cor: '#ff9800',
      descricao: 'Responsável pela política de apoio às micro e pequenas empresas.',
      programas: [
        { nome: 'Pronampe', link: 'https://www.gov.br/memp/pt-br/assuntos/pronampe' },
        { nome: 'ProCred 360', link: 'https://www.gov.br/memp/pt-br/assuntos/procred360' },
        { nome: 'Contrata+Brasil', link: 'https://www.gov.br/memp/pt-br/assuntos/contrata-brasil' },
        { nome: 'Cidade Empreendedora (SEBRAE)', link: 'https://sebrae.com.br/sites/PortalSebrae/ufs/ms/sebraeaz/programa-cidade-empreendedora' }
      ],
      site: 'https://www.gov.br/memp',
      telefone: '(61) 2027-8000',
      email: 'ouvidoria@memp.gov.br'
    }
  ];

  const filteredMinisterios = ministerios.filter(m =>
    m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.sigla.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.programas.some(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleMinisterio = (id) => {
    setExpandedMinisterio(expandedMinisterio === id ? null : id);
  };

  return (
    <>
      {/* Botão de toggle para mobile */}
      <button 
        className={`sidebar-toggle ${isOpen ? 'open' : ''}`}
        onClick={onToggle}
        title={isOpen ? 'Fechar menu' : 'Abrir menu de ministérios'}
      >
        {isOpen ? '✕' : '🏛️'}
      </button>

      {/* Overlay para mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}

      {/* Sidebar */}
      <aside className={`ministerios-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2><img src={logoGovernoFederal} alt="Governo Federal" className="logo-governo-federal" /> Ministérios</h2>
          <p>Programas e Transferências Federais</p>
          <span className="ministerio-count">{ministerios.length} ministérios disponíveis</span>
        </div>

        <div className="sidebar-search">
          <input
            type="text"
            placeholder="Buscar ministério ou programa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sidebar-content">
          {filteredMinisterios.map((ministerio) => (
            <div key={ministerio.id} className="ministerio-item">
              <button
                className={`ministerio-header ${expandedMinisterio === ministerio.id ? 'expanded' : ''}`}
                onClick={() => toggleMinisterio(ministerio.id)}
                style={{ borderLeftColor: ministerio.cor }}
              >
                <span className="ministerio-icone">{ministerio.icone}</span>
                <div className="ministerio-info">
                  <span className="ministerio-sigla">{ministerio.sigla}</span>
                  <span className="ministerio-nome">{ministerio.nome}</span>
                </div>
                <span className="expand-icon">{expandedMinisterio === ministerio.id ? '▲' : '▼'}</span>
              </button>

              {expandedMinisterio === ministerio.id && (
                <div className="ministerio-details">
                  <p className="ministerio-descricao">{ministerio.descricao}</p>
                  
                  <div className="programas-lista">
                    <h4>Programas:</h4>
                    {ministerio.programas.map((programa, idx) => (
                      <a
                        key={idx}
                        href={programa.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="programa-link"
                      >
                        📋 {programa.nome}
                      </a>
                    ))}
                  </div>

                  <div className="ministerio-contato">
                    <p><strong>📞 Telefone:</strong> {ministerio.telefone}</p>
                    <p><strong>📧 E-mail:</strong> {ministerio.email}</p>
                    <a
                      href={ministerio.site}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="site-link"
                    >
                      🌐 Visitar site oficial
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="transferegov-section">
            <h3>🔗 Portal Transferegov</h3>
            <p>Acesse o portal oficial para consultar todos os programas e fazer adesão:</p>
            <a
              href="https://www.gov.br/transferegov"
              target="_blank"
              rel="noopener noreferrer"
              className="transferegov-btn"
            >
              Acessar Transferegov
            </a>
          </div>
          <div className="portais-uteis">
            <h4>Portais Úteis:</h4>
            <a href="https://portaldatransparencia.gov.br" target="_blank" rel="noopener noreferrer">Portal da Transparência</a>
            <a href="https://www.capacidades.gov.br" target="_blank" rel="noopener noreferrer">Capacidades</a>
            <a href="https://www.cnm.org.br" target="_blank" rel="noopener noreferrer">CNM</a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MinisteriosSidebar;
