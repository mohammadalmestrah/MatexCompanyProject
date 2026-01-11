/**
 * Local development server for AI chatbot API
 * Run with: node server/dev-server.js
 */  



import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Rate limiting store
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30;

// Content safety patterns
const UNSAFE_PATTERNS = [
  /how to (make|create|build).*(bomb|explosive|weapon)/i,
  /how to (hack|break into|steal)/i,
  /illegal.*(drug|substance)/i,
  /child.*(abuse|pornograph)/i,
  /(kill|murder|harm).*(someone|person|people)/i,
];

// Matex context
const MATEX_CONTEXT = `
Company Information:
- Company Name: Matex
- Founder: Mohammad ALMESTRAH
- Email: almestrahmohammad@gmail.com
- Phone: +961 76162549
- Locations: Beirut, Lebanon | Paris, France
- Specializations: AI/ML, LLM Algorithms, Software Development, Mobile Apps, Web Technologies, Cloud Computing, Cybersecurity
`;

const SYSTEM_PROMPT = `You are Matex AI Assistant, a helpful and knowledgeable AI assistant. You can answer questions on any topic, similar to ChatGPT, while also being knowledgeable about Matex company services.

${MATEX_CONTEXT}

Guidelines:
1. Answer any question the user asks - you're a general-purpose AI assistant
2. Be helpful, accurate, and conversational
3. For Matex-related questions, use the company information above
4. Keep responses clear and well-structured
5. Support English, French, and Arabic languages
6. Do not provide harmful, illegal, or inappropriate content`;

app.use(cors());
app.use(express.json());

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

function isContentSafe(message) {
  return !UNSAFE_PATTERNS.some(pattern => pattern.test(message));
}

async function callOpenAI(messages) {
  // Try standard OpenAI API first
  const openaiApiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
  
  if (openaiApiKey && openaiApiKey.startsWith('sk-')) {
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const url = 'https://api.openai.com/v1/chat/completions';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: 0.7,
          max_tokens: 1000,
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API Error:', errorText);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response.';
    } catch (error) {
      console.error('OpenAI API request failed:', error.message);
      throw error;
    }
  }

  // Fallback to Azure OpenAI if OpenAI key not found
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_CHATGPT_DEPLOYMENT || 'gpt-4.1';
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2025-01-01-preview';

  if (!endpoint || !apiKey || apiKey === 'your_azure_openai_api_key_here') {
    throw new Error('OpenAI configuration missing. Please set OPENAI_API_KEY or AZURE_OPENAI_API_KEY');
  }

  const url = `${endpoint.replace(/\/$/, '')}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.95,
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Azure OpenAI Error:', errorText);
    throw new Error(`Azure OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response.';
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const clientIP = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
    
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({ 
        error: 'Too many requests. Please wait a moment before trying again.',
        retry_after: 60
      });
    }

    const { message, conversationHistory = [], sessionId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Content safety check
    if (!isContentSafe(message)) {
      return res.json({
        response: "I'm sorry, but I can't help with that request. I'm designed to be helpful, harmless, and honest. Is there something else I can assist you with?",
        session_id: sessionId || 'safe_response',
        filtered: true
      });
    }

    // Build messages array
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.filter(m => m.role !== 'system').slice(-10),
      { role: 'user', content: message }
    ];

    const aiResponse = await callOpenAI(messages);

    res.json({
      response: aiResponse,
      session_id: sessionId || `session_${Date.now()}`,
      model: process.env.AZURE_OPENAI_CHATGPT_MODEL || 'gpt-4.1'
    });

  } catch (error) {
    console.error('Chat API Error:', error.message);
    
    res.json({
      response: "I'm currently experiencing some technical difficulties. However, I can still help you with basic information:\n\n" +
                "📧 Contact Matex: almestrahmohammad@gmail.com\n" +
                "📞 Phone: +961 76162549\n" +
                "📍 Locations: Beirut, Lebanon | Paris, France\n\n" +
                "Please try again in a moment, or contact us directly for assistance.",
      session_id: 'fallback_response',
      error: true
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Matex AI Chatbot API Server running on http://localhost:${PORT}`);
  console.log(`📍 Chat endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health\n`);
  
  const openaiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
  const azureKey = process.env.AZURE_OPENAI_API_KEY;
  
  if (openaiKey && openaiKey.startsWith('sk-')) {
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    console.log(`✅ OpenAI API configured successfully (model: ${model}).\n`);
  } else if (azureKey && azureKey !== 'your_azure_openai_api_key_here') {
    console.log('✅ Azure OpenAI configured successfully.\n');
  } else {
    console.warn('⚠️  Warning: No OpenAI API key found.');
    console.warn('   Set OPENAI_API_KEY or VITE_OPENAI_API_KEY in .env file to enable AI responses.');
    console.warn('   The chatbot will use fallback responses until configured.\n');
  }
});
