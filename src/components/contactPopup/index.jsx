import React from 'react';
import './index.css';
import logo from '../../assets/logo.png'; // Importando a logo

function ContactPopup({ handleClose }) {
  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>

        {/* Novo container principal para o layout em colunas */}
        <div className="popup-body">
          
          {/* Coluna da Esquerda: Logo */}
          <div className="popup-logo-area">
            <img src={logo} alt="Logo DATA-RO" className="popup-logo" />
          </div>

          {/* Separador Vertical */}
          <div className="popup-separator"></div>

          {/* Coluna da Direita: Detalhes de Contato */}
          <div className="popup-details-area">
            <h2>Entre em Contato</h2>
            <p className="popup-intro">Estamos prontos para ajudar a impulsionar seu negócio. Fale conosco:</p>
            <div className="contact-info">
              <div className="contact-item">
                <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <div>
                  <strong>E-mail</strong>
                  <span>contato@dataro-it.com.br</span>
                </div>
              </div>
              <div className="contact-item">
                <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <div>
                  <strong>Telefone</strong>
                  <span>(69) 99974-7809</span>
                </div>
              </div>
              <div className="contact-item">
                <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <div>
                  <strong>Endereço</strong>
                  <span>Porto Velho, Rondônia - Brasil</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ContactPopup;
