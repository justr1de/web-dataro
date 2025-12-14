# DATA-RO - Documentação (Versão 1.2)

## Sumário
- [Visão Geral](#visão-geral)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Fluxo de Navegação](#fluxo-de-navegação)
- [Componentes Principais](#componentes-principais)
- [Páginas](#páginas)
- [Estilos e Responsividade](#estilos-e-responsividade)
- [Imagens e Assets](#imagens-e-assets)
- [Configuração e Execução](#configuração-e-execução)
- [Dependências](#dependências)
- [Customização](#customização)
- [Boas Práticas](#boas-práticas)
- [Contato](#contato)
- [Histórico de Versões](#histórico-de-versões)

---

## Visão Geral
DATA-RO é um site institucional para a empresa Dataro, desenvolvido com React e Vite. O objetivo é apresentar soluções de TI, automação, gestão, desenvolvimento web e aplicativos, com foco em clientes de Rondônia. O projeto é modular, responsivo e fácil de manter.

---

## Estrutura de Pastas
```
├── public/                # Arquivos públicos e estáticos
│   └── vite.svg           # Ícone Vite
├── src/
│   ├── assets/            # Imagens e ícones
│   ├── components/        # Componentes reutilizáveis
│   │   ├── advantagesSection/
│   │   ├── contactPopup/

│   │   └── ServicesPage/
│   ├── App.css            # Estilos globais
│   ├── main.jsx           # Ponto de entrada
│   └── index.css          # Estilos globais
├── index.html             # HTML principal
├── package.json           # Dependências e scripts
├── vite.config.js         # Configuração do Vite
└── README.md              # Informações iniciais

---

## Fluxo de Navegação
- **SPA (Single Page Application):** Navegação entre páginas sem recarregar o site.
- **Header:** Menu fixo com links para Home, Serviços e Contato. Ícone hambúrguer para mobile.
- **Popup de Contato:** Modal acionado por botão, exibindo informações de contato e animação.
- **Footer:** Informações institucionais, mapa do site e redes sociais.

---

## Componentes Principais
- **Header:** Navegação, logo, menu responsivo.
- **Hero:** Banner principal com chamada para ação.
- **HeroCarousel:** Slides automáticos com destaques dos serviços.
- **AdvantagesSection:** Lista de vantagens com ícones e textos explicativos.
- **FeatureSection:** Carrossel de imagens para áreas de atuação (Saúde, Educação, Agro, Automação).
- **ServiceItem:** Card de serviço com ícone, título e descrição.
- **ContactPopup:** Modal de contato com animação e informações.
- **Footer:** Rodapé com links, redes sociais e dados da empresa.

---

## Páginas
- **HomePage:**
  - Carrossel de destaques
  - Seção de vantagens
  - Lista de serviços oferecidos
  - Links para contato

## Estilos e Responsividade
- Utiliza CSS modular por componente.
- Layout flexível com media queries para mobile, tablet e desktop.
- Efeitos visuais: animações, hover, transições suaves.
- Utilização de variáveis CSS para cores e espaçamentos.
---

- Logos e backgrounds específicos para cada seção.

---

## Configuração e Execução
1. **Instalar dependências:**
   ```bash
   npm install
   ```
2. **Executar em modo desenvolvimento:**
   ```bash
   npm run dev
   ```
3. **Build para produção:**
   ```bash
   npm run build
   ```
4. **Pré-visualizar build:**
   ```bash
   npm run preview
   ```

---

## Dependências
- `react`, `react-dom`: Framework principal
- `vite`: Bundler e servidor de desenvolvimento
- `phosphor-react`, `react-icons`: Ícones
- `react-slick`, `slick-carousel`: Carrossel de imagens
- `@vercel/analytics`: Analytics

---

## Customização
- **Adicionar páginas:** Crie novos diretórios em `src/pages/` e registre no `App.jsx`.
- **Editar componentes:** Modifique arquivos em `src/components/`.
- **Alterar estilos:** Edite os arquivos `.css` de cada componente ou página.
- **Adicionar imagens:** Coloque em `src/assets/` e importe nos componentes.
- **Configurar rotas:** Ajuste navegação no `App.jsx`.

---

## Boas Práticas
- Componentização: Reutilize componentes para evitar duplicidade.
- Separação de estilos: Cada componente tem seu próprio arquivo CSS.
- Responsividade: Teste em diferentes dispositivos.
- Versionamento: Utilize Git para controle de versões.
- Documentação: Atualize este arquivo a cada nova versão.

---

## Contato
- E-mail: contato@dataro-it.com.br
- Telefone: (69) 99908-9202
- Instagram: [@dataro_it](https://www.instagram.com/dataro_it)

---

## Histórico de Versões
- **v1.2**
  - Documentação detalhada
  - Layout responsivo aprimorado
  - Seção de vantagens implementada
  - Carrossel hero e features revisados
  - Popup de contato com animação
  - Estrutura modular e fácil manutenção
