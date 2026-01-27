// API Serverless para Assistente de IA
// Suporta OpenAI (ChatGPT) e Google AI (Gemini)

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { message, model, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória' });
    }

    // Contexto do sistema para o assistente
    const systemPrompt = `Você é o Assistente DATA-RO, um assistente de IA especializado em ajudar usuários do sistema "Rondônia em Números" desenvolvido pela DATA-RO Inteligência Territorial.

Suas principais funções são:
- Ajudar com dúvidas sobre o sistema administrativo
- Auxiliar na análise de dados financeiros (receitas, despesas, contratos)
- Fornecer insights sobre indicadores dos municípios de Rondônia
- Ajudar com a gestão de demandas, projetos e clientes
- Explicar funcionalidades do sistema
- Sugerir melhorias e boas práticas de gestão

Você deve ser:
- Profissional e cordial
- Objetivo e direto nas respostas
- Usar linguagem clara em português brasileiro
- Fornecer exemplos quando apropriado

Contexto: O sistema "Rondônia em Números" é uma plataforma de Business Intelligence que atende os 48 municípios de Rondônia que fazem parte do CIMCERO (Consórcio Intermunicipal da Região Centro-Leste de Rondônia).`;

    let response;

    if (model === 'gemini') {
      // Usar Google AI (Gemini)
      response = await callGemini(message, history, systemPrompt);
    } else {
      // Usar OpenAI (ChatGPT) como padrão
      response = await callOpenAI(message, history, systemPrompt);
    }

    return res.status(200).json({ response, model: model || 'chatgpt' });

  } catch (error) {
    console.error('Erro na API de chat:', error);
    return res.status(500).json({ 
      error: 'Erro ao processar mensagem', 
      details: error.message 
    });
  }
}

// Função para chamar a API da OpenAI
async function callOpenAI(message, history, systemPrompt) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    throw new Error('Chave da OpenAI não configurada');
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(h => ({
      role: h.role,
      content: h.content
    })),
    { role: 'user', content: message }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 2000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Erro na API da OpenAI');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Função para chamar a API do Google AI (Gemini)
async function callGemini(message, history, systemPrompt) {
  const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
  
  if (!GOOGLE_AI_API_KEY) {
    throw new Error('Chave do Google AI não configurada');
  }

  // Formatar histórico para o Gemini
  const contents = [];
  
  // Adicionar contexto do sistema como primeira mensagem do usuário
  contents.push({
    role: 'user',
    parts: [{ text: `Contexto: ${systemPrompt}\n\nPor favor, responda como o Assistente DATA-RO.` }]
  });
  contents.push({
    role: 'model',
    parts: [{ text: 'Entendido! Sou o Assistente DATA-RO e estou pronto para ajudar com o sistema "Rondônia em Números". Como posso ajudá-lo?' }]
  });

  // Adicionar histórico de conversa
  for (const h of history) {
    contents.push({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }]
    });
  }

  // Adicionar mensagem atual
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Erro na API do Google AI');
  }

  const data = await response.json();
  
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('Nenhuma resposta gerada pelo Gemini');
  }

  return data.candidates[0].content.parts[0].text;
}
