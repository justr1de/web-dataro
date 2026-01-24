// src/components/heroCarousel/index.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import './index.css';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Imports de imagem
import bandeiraRondonia from '../../assets/bandeira-ro-hero.png';
import bgImage1 from '../../assets/gestao-bg.jpg';
import bgImage2 from '../../assets/sites-bg.jpg';
import bgImage3 from '../../assets/bi-bg.jpeg';

const HeroCarousel = () => {
  const navigate = useNavigate();

  const handleRondoniaClick = () => {
    navigate('/paineis/login');
  };

  const handleAdminClick = () => {
    navigate('/admin/login');
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
  };

  return (
    <div className="hero-carousel-container">
      <Slider {...settings}>

        {/* Slide 0 - Bandeira de Rondônia */}
        <div className="slide-item">
          <img src={bandeiraRondonia} alt="Bandeira de Rondônia" className="slide-background-image bandeira-rondonia-hero" />
          <div className="slide-content">
            <p>RONDÔNIA EM NÚMEROS</p>
            <h1>Plataforma de Gestão Integrada dos Municípios de Rondônia</h1>
            <div className="hero-buttons-container">
              <button className="cta-button cta-button-rondonia" onClick={handleRondoniaClick}>RONDÔNIA EM NÚMEROS</button>
              <button 
                className="admin-door-button" 
                onClick={handleAdminClick}
                title="Área de Gestão"
                aria-label="Acessar área de gestão administrativa"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Slide 1 - Gestão */}
        <div className="slide-item">
          <img src={bgImage1} alt="Gráficos e dados de gestão em telas digitais" className="slide-background-image" />
          <div className="slide-content">
            <p>SOLUÇÕES EM GESTÃO E TI</p>
            <h1>Eficiência e Tecnologia para seu Negócio</h1>
            <button className="cta-button">Saiba Mais</button>
          </div>
        </div>

        {/* Slide 2 - Sites */}
        <div className="slide-item">
          <img src={bgImage2} alt="Pessoa desenvolvendo um site em um laptop" className="slide-background-image" />
          <div className="slide-content">
            <p>DESENVOLVIMENTO DE SITES</p>
            <h1>Presença Digital que Gera Resultados</h1>
            <button className="cta-button">Ver Portfólio</button>
          </div>
        </div>

        {/* Slide 3 - Business Intelligence */}
        <div className="slide-item">
          <img src={bgImage3} alt="Dashboard de Business Intelligence com gráficos e métricas" className="slide-background-image" />
          <div className="slide-content">
            <p>BUSINESS INTELLIGENCE</p>
            <h1>Transformando Dados em Decisões</h1>
            <button className="cta-button">Conhecer Soluções</button>
          </div>
        </div>
        
      </Slider>
    </div>
  );
};

export default HeroCarousel;
