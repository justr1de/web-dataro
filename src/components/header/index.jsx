// src/components/header/index.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';
import logo from '../../assets/logo.png';

const Header = ({ onContactClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleNavClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };
  
  const handleContactClick = () => {
    onContactClick();
    setIsMenuOpen(false);
  }

  const headerClassName = isScrolled ? 'header-container scrolled' : 'header-container';
  const navClassName = isMenuOpen ? 'nav-menu open' : 'nav-menu';

  return (
    <header className={headerClassName}>
      <div className="header-content">
        <div className="logo-container">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <img src={logo} alt="Logo da Empresa" className="logo" />
          </Link>
        </div>
        
        <nav className={navClassName}>
          <ul>
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>INÍCIO</Link></li>
            <li><Link to="/services" onClick={() => setIsMenuOpen(false)}>SERVIÇOS</Link></li>
            <li><a href="#" onClick={handleContactClick}>CONTATO</a></li>
            <li><Link to="/paineis/login" className="paineis-link" onClick={() => setIsMenuOpen(false)}>PAINÉIS BI</Link></li>
          </ul>
        </nav>

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
