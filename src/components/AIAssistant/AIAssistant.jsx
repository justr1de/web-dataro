import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MinisteriosSidebar from './MinisteriosSidebar';
import { processarConsulta } from '../../services/aiService';
import './AIAssistant.css';

const AIAssistant = ({ municipios = [], onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Olá! Sou o assistente de IA do DATA-RO. Posso ajudá-lo a:\n\n• Cruzar dados entre diferentes municípios\n• Buscar informações sobre editais e recursos federais\n• Analisar indicadores dos painéis de BI\n• Identificar oportunidades de captação de recursos\n\nComo posso ajudá-lo hoje?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await processAIRequest(inputValue, municipios);
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const processAIRequest = async (query, municipiosData) => {
    // Usar o serviço de IA para processar a consulta
    try {
      const response = await processarConsulta(query, { municipios: municipiosData });
      return response;
    } catch (error) {
      console.error('Erro no processamento:', error);
      // Fallback para resposta padrão
      return `Entendi sua pergunta sobre "${query}". 

Para fornecer uma análise mais precisa, você pode:

1. **Comparar municípios**: Digite "comparar [município1] com [município2]"
2. **Buscar editais**: Digite "editais de [área/ministério]"
3. **Ver recursos disponíveis**: Digite "recursos para [área]"
4. **Analisar indicadores**: Digite "indicadores de [município]"

Também pode acessar a aba "Ministérios" para ver informações sobre editais e programas federais disponíveis.`;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action) => {
    setInputValue(action);
  };

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="ai-assistant-overlay">
      <div className="ai-assistant-container">
        {/* Header */}
        <div className="ai-assistant-header">
          <div className="header-left">
            <div className="ai-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div className="header-info">
              <h3>Assistente DATA-RO</h3>
              <span className="status-online">Online</span>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              💬 Chat
            </button>
            <button 
              className={`tab-button ${activeTab === 'ministerios' ? 'active' : ''}`}
              onClick={() => setActiveTab('ministerios')}
            >
              🏛️ Ministérios
            </button>
            <button className="close-button" onClick={onClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="ai-assistant-content">
          {activeTab === 'chat' ? (
            <>
              {/* Messages Area */}
              <div className="messages-container">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`message ${message.type} ${message.isError ? 'error' : ''}`}
                  >
                    <div className="message-content">
                      <div className="message-text" dangerouslySetInnerHTML={{ 
                        __html: message.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }} />
                      <span className="message-time">{formatTimestamp(message.timestamp)}</span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message assistant loading">
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <button onClick={() => handleQuickAction('Quais editais estão disponíveis?')}>
                  📋 Ver Editais
                </button>
                <button onClick={() => handleQuickAction('Comparar municípios')}>
                  📊 Comparar Municípios
                </button>
                <button onClick={() => handleQuickAction('Recursos do FNDE')}>
                  💰 Recursos FNDE
                </button>
                <button onClick={() => handleQuickAction('Programas do Ministério da Saúde')}>
                  🏥 Programas MS
                </button>
              </div>

              {/* Input Area */}
              <div className="input-container">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua pergunta..."
                  rows="1"
                  disabled={isLoading}
                />
                <button 
                  className="send-button" 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <MinisteriosSidebar />
          )}
        </div>

        {/* Footer */}
        <div className="ai-assistant-footer">
          <span>Desenvolvido por DATA-RO Inteligência Territorial</span>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
