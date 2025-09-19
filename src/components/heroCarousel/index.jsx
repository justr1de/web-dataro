// src/components/heroCarousel/index.jsx

import React from 'react';
import Slider from 'react-slick';
import './index.css';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Seus imports de imagem continuam aqui
import bgImage1 from '../../assets/gestao-bg.jpg';
import bgImage2 from '../../assets/sites-bg.jpg';
import bgImage3 from '../../assets/bi-bg.jpeg';

const HeroCarousel = () => {
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

        {/* Slide 1 - Gestão */}
        <div className="slide-item">
          {/* MÉTODO NOVO: Usando a tag <img> para a imagem de fundo */}
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