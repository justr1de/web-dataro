import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AIAssistant.css';

const AIAssistant = ({ municipios = [], onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Olá! Sou o Assistente DATA-RO. Posso ajudá-lo a:\n\n• Cruzar dados entre diferentes municípios\n• Buscar informações sobre editais e recursos federais\n• Analisar indicadores dos painéis de BI\n• Identificar oportunidades de captação de recursos\n• Responder dúvidas sobre o sistema\n\nComo posso ajudá-lo hoje?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('chatgpt');
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
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Preparar histórico para a API
      const history = messages.slice(1).map(m => ({
        role: m.type === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: currentInput,
          model: selectedModel,
          history: history
        })
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: data.response,
          timestamp: new Date(),
          model: data.model
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Erro ao processar mensagem');
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `Desculpe, ocorreu um erro: ${error.message}. Por favor, tente novamente.`,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
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

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        type: 'assistant',
        content: 'Conversa limpa! Como posso ajudá-lo?',
        timestamp: new Date()
      }
    ]);
  };

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="ai-assistant-overlay">
      <div className="ai-assistant-container chat-only">
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
              <span className="status-online">
                {selectedModel === 'chatgpt' ? '🟢 ChatGPT' : '🔵 Gemini'}
              </span>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="header-btn clear-btn" 
              onClick={handleClearChat} 
              title="Limpar conversa"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
            <button className="close-button" onClick={onClose} title="Fechar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Model Selector */}
        <div className="model-selector">
          <button 
            className={`model-btn ${selectedModel === 'chatgpt' ? 'active' : ''}`}
            onClick={() => setSelectedModel('chatgpt')}
          >
            <span className="model-icon">🟢</span>
            ChatGPT
          </button>
          <button 
            className={`model-btn ${selectedModel === 'gemini' ? 'active' : ''}`}
            onClick={() => setSelectedModel('gemini')}
          >
            <span className="model-icon">🔵</span>
            Gemini
          </button>
        </div>

        {/* Messages Area */}
        <div className="messages-container">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.type} ${message.isError ? 'error' : ''}`}
            >
              <div className="message-content">
                <div className="message-text" dangerouslySetInnerHTML={{ 
                  __html: message.content
                    .replace(/\n/g, '<br/>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/`(.*?)`/g, '<code>$1</code>')
                }} />
                <div className="message-meta">
                  <span className="message-time">{formatTimestamp(message.timestamp)}</span>
                  {message.model && (
                    <span className="message-model">
                      {message.model === 'chatgpt' ? '🟢' : '🔵'}
                    </span>
                  )}
                </div>
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
          <button onClick={() => handleQuickAction('Como funciona o sistema?')}>
            ❓ Ajuda
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

        {/* Footer */}
        <div className="ai-assistant-footer">
          <span>Desenvolvido por DATA-RO Inteligência Territorial</span>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
