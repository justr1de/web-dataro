// src/pages/homePage/index.jsx

import React from 'react';

// Importando os componentes necessários para a página
import HeroCarousel from '../../components/heroCarousel';
import AdvantagesSection from '../../components/advantagesSection'; // <-- IMPLEMENTADO: Importa a nova seção
import FeatureSection from '../../components/featureSection';

// --- DADOS PARA A PÁGINA INICIAL ---
// Seus dados para os slides permanecem exatamente os mesmos
const saudeSlides = [
  { url: 'https://distrito.me/wp-content/uploads/2023/04/avancos-recentes-da-tecnologia-para-a-area-da-saude-1024x681.webp', alt: 'Médico analisando prontuário eletrônico em um tablet.' },
  { url: 'https://fia.com.br/wp-content/uploads/2022/06/tecnologia-na-saude-principais-avancos-tendencias-aplicad.jpg', alt: 'Paciente em uma consulta por vídeo com um profissional de saúde.' },
];

const educacaoSlides = [
  { url: 'https://www.itexperts.com.br/wp-content/uploads/2022/02/25161921/267114-o-que-e-educacao-40-e-como-ela-vai-mudar-o-modo-como-se-aprende-1.jpg', alt: 'Estudante interagindo com uma plataforma de ensino a distância.' },
  { url: 'https://escolaweb.com.br/wp-content/uploads/2024/03/topo-blogo_Prancheta-1.png', alt: 'Gráficos e dados de um sistema de gestão escolar.' },
];

const agroSlides = [
  { url: 'https://maxmaq.com.br/wp-content/uploads/2019/09/286624-raphael-favor-entregar-ate-1504-como-o-uso-de-drones-na-agricultura-tem-gerado-melhores-resultados-1280x720-1.jpg', alt: 'Drone monitorando uma lavoura com dados sobrepostos.' },
  { url: 'https://networdagro.com.br/blog/wp-content/uploads/2022/02/iStock-1254095794-1.jpg', alt: 'Sistema de monitoramento de gado em um dispositivo móvel.' },
];

const automacaoSlides = [
  { url: 'https://img.lovepik.com/bg/20231216/laptop-with-business-data-chart-on-table-stock-photo_2489663_wh860.png', alt: 'Braço robótico operando em uma fábrica.' },
  { url: 'https://img.freepik.com/fotos-premium/homem-de-negocios-com-laptop-notebook-portatil-no-escritorio-em-casa_10134-3.jpg', alt: 'Fluxograma de processos de negócios sendo automatizado.' },
];

function HomePage() {
  return (
    // Usamos um React.Fragment <> para agrupar todos os elementos
    <>
      <title>DATA-RO</title>

      {/* Componente do carrossel principal no topo */}
      <HeroCarousel />

      {/* IMPLEMENTADO: Nova seção de vantagens adicionada aqui */}
      <AdvantagesSection />

      {/* Suas seções de features que já existiam, continuam aqui, sem alterações */}
      <FeatureSection
        id="saude"
        title="Tecnologia a Serviço da Saúde"
        description="A digitalização está revolucionando o cuidado ao paciente. Prontuários eletrônicos agilizam diagnósticos, a telemedicina quebra barreiras geográficas e a análise de dados permite tratamentos mais precisos e preventivos. A TI garante a segurança, a agilidade e a inteligência necessárias para um sistema de saúde moderno e eficiente."
        companyMention="A DATA-RO desenvolve sistemas de gestão para clínicas e hospitais, garantindo a integridade e a acessibilidade das informações vitais para salvar vidas."
        slides={saudeSlides}
      />

      <FeatureSection
        id="educacao"
        title="Inovação na Educação"
        description="O futuro do aprendizado é interativo e acessível. Plataformas de ensino a distância (EAD), lousas digitais e sistemas de gestão acadêmica personalizam a jornada do estudante e otimizam o trabalho dos educadores. A tecnologia cria um ambiente de aprendizado mais engajador, colaborativo e alinhado às demandas do século XXI."
        companyMention="Com a DATA-RO, instituições de ensino podem implementar sistemas de gestão que simplificam a administração e enriquecem a experiência educacional."
        slides={educacaoSlides}
        reverse={true}
      />

      <FeatureSection
        id="agro"
        title="Inteligência para o Agronegócio"
        description="O campo nunca foi tão tecnológico. Drones, sensores IoT e softwares de gestão transformam dados em produtividade. A agricultura de precisão otimiza o uso de recursos, a rastreabilidade garante a qualidade do produto e a automação de maquinário aumenta a eficiência da colheita, fortalecendo um dos pilares da nossa economia."
        companyMention="A DATA-RO oferece soluções de automação e gestão de dados para o agronegócio, ajudando produtores de Rondônia a maximizar sua produção com sustentabilidade e tecnologia de ponta."
        slides={agroSlides}
      />

      <FeatureSection
        id="automacao"
        title="Automação e Gestão Empresarial"
        description="Eficiência é a chave para o crescimento. A automação de processos (RPA) elimina tarefas manuais e repetitivas, reduzindo erros e liberando equipes para atividades estratégicas. Sistemas de gestão integrados (ERPs) oferecem uma visão 360° do negócio, desde o estoque até o financeiro, permitindo decisões mais rápidas e inteligentes."
        companyMention="Seja no desenvolvimento de aplicativos customizados ou na implementação de sistemas de gestão, a DATA-RO é sua parceira para automatizar operações e impulsionar o crescimento do seu negócio."
        slides={automacaoSlides}
        reverse={true}
      />
    </>
  );
}

export default HomePage;