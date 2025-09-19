import React from 'react';
import './index.css';
import logo from '../../assets/logo.png';

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-main">
        
        {/* Coluna 1: Logo Grande */}
        <div className="footer-column logo-area">
          <img src={logo} alt="Logo DATA-RO" className="footer-logo" />
        </div>

        {/* Coluna 2: Slogan */}
        <div className="footer-column slogan-area">
          <p>"Transformando desafios em oportunidades através da tecnologia. Soluções em automação, gestão e desenvolvimento para Rondônia."</p>
        </div>

        {/* Coluna 3: Mapa do Site */}
        <div className="footer-column links">
          <h3>Mapa do Site</h3>
          <ul>
            <li><a href="#saude">Saúde</a></li>
            <li><a href="#educacao">Educação</a></li>
            <li><a href="#agro">Agronegócio</a></li>
            <li><a href="#automacao">Automação</a></li>
          </ul>
        </div>

        {/* Coluna 4: Contato e Redes Sociais */}
        <div className="footer-column contact-social">
          <h3>Contato</h3>
          <p className="contact-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            Porto Velho, Rondônia
          </p>
          <p className="contact-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            contato@dataro-it.com.br
          </p>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="https://www.instagram.com/dataro_it" aria-label="Instagram">
              <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>

      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} DATA-RO. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
