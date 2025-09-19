// src/components/advantagesSection/index.jsx

import React from 'react';
import './index.css';

// Importando os ícones que vamos usar da biblioteca 'Phosphor Icons' (parte do react-icons)
import { ChartLineUp, ShieldCheck, Cpu, Handshake, MagnifyingGlass, RocketLaunch } from 'phosphor-react';

// Criamos uma lista com os dados para deixar o código mais limpo
const advantages = [
  {
    icon: <ShieldCheck size={48} />,
    text: 'Gestão Transparente e Segura com processos otimizados e dados protegidos.'
  },
  {
    icon: <Cpu size={48} />,
    text: 'Tecnologia de Ponta para desenvolver soluções robustas e escaláveis.'
  },
  {
    icon: <ChartLineUp size={48} />,
    text: 'Decisões Inteligentes baseadas em análise de dados e Business Intelligence.'
  },
  {
    icon: <Handshake size={48} />,
    text: 'Soluções Personalizadas e parceria estratégica para entender seu desafio.'
  },
  {
    icon: <MagnifyingGlass size={48} />,
    text: 'Aumento da transparência, gestão e controle das decisões públicas e privadas.'
  },
  {
    icon: <RocketLaunch size={48} />,
    text: 'Foco em Resultados para impulsionar o crescimento e a eficiência do seu negócio.'
  }
];

const AdvantagesSection = () => {
  return (
    <section className="advantages-section">
      <div className="advantages-container">
        <h2 className="advantages-title">Por que contratar a DATA-RO?</h2>
        <hr className="separator-line" />

        <div className="advantages-grid">
          {advantages.map((advantage, index) => (
            <div className="advantage-item" key={index}>
              <div className="advantage-icon">{advantage.icon}</div>
              <p className="advantage-text">{advantage.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;