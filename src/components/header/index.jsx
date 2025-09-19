// src/components/header/index.jsx

import React, { useState, useEffect } from 'react';
import './index.css';
import logo from '../../assets/logo.png';

const Header = ({ onNavigate, onContactClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  // NOVO ESTADO: para controlar o menu mobile (hambúrguer)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Função para abrir/fechar o menu mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Função para fechar o menu ao clicar em um link
  const handleNavClick = (page) => {
    onNavigate(page);
    setIsMenuOpen(false); // Fecha o menu
  };
  
  const handleContactClick = () => {
    onContactClick();
    setIsMenuOpen(false); // Fecha o menu
  }

  // Adiciona a classe 'scrolled' para o efeito de encolher
  const headerClassName = isScrolled ? 'header-container scrolled' : 'header-container';
  // Adiciona a classe 'open' para mostrar o menu mobile
  const navClassName = isMenuOpen ? 'nav-menu open' : 'nav-menu';

  return (
    <header className={headerClassName}>
      <div className="header-content">
        <div className="logo-container">
          <a href="#" onClick={() => handleNavClick('home')}>
            <img src={logo} alt="Logo da Empresa" className="logo" />
          </a>
        </div>
        
        {/* MENU DE NAVEGAÇÃO */}
        <nav className={navClassName}>
          <ul>
            <li><a href="#" onClick={() => handleNavClick('home')}>INÍCIO</a></li>
            <li><a href="#" onClick={() => handleNavClick('services')}>SERVIÇOS</a></li>
            <li><a href="#" onClick={handleContactClick}>CONTATO</a></li>
          </ul>
        </nav>

        {/* BOTÃO HAMBÚRGUER (só aparece em telas menores) */}
        <div className="menu-toggle" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;