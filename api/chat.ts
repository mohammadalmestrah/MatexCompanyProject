import type { VercelRequest, VercelResponse } from '@vercel/node';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute

// Content safety patterns
const UNSAFE_PATTERNS = [
  /how to (make|create|build).*(bomb|explosive|weapon)/i,
  /how to (hack|break into|steal)/i,
  /illegal.*(drug|substance)/i,
  /child.*(abuse|pornograph)/i,
  /(kill|murder|harm).*(someone|person|people)/i,
];

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: Message[];
  sessionId?: string;
}

// Matex company context for enhanced responses
const MATEX_CONTEXT = `
Company Information:
- Company Name: Matex
- Founder: Mohammad ALMESTRAH
- Email: almestrahmohammad@gmail.com
- Phone: +961 76162549
- Locations: Beirut, Lebanon | Paris, France
- Specializations: AI/ML, LLM Algorithms, Software Development, Mobile Apps, Web Technologies, Cloud Computing, Cybersecurity

Services:
1. AI & Machine Learning Solutions
2. Custom Software Development
3. Mobile App Development (iOS, Android, Cross-platform)
4. Web Development (Frontend, Backend, Full-stack)
5. Cloud Computing & DevOps
6. Cybersecurity Services
`;

const SYSTEM_PROMPT = `You are Matex AI Assistant, a helpful and knowledgeable AI assistant. You can answer questions on any topic, similar to ChatGPT, while also being knowledgeable about Matex company services.

${MATEX_CONTEXT}

Guidelines:
1. Answer any question the user asks - you're a general-purpose AI assistant
2. Be helpful, accurate, and conversational
3. For Matex-related questions, use the company information above
4. Keep responses clear and well-structured
5. Support English, French, and Arabic languages
6. Do not provide harmful, illegal, or inappropriate content
7. Do not collect personal sensitive data`;

function checkRateLimit(ip: string): boolean {
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

function isContentSafe(message: string): boolean {
  return !UNSAFE_PATTERNS.some(pattern => pattern.test(message));
}

async function callOpenAI(messages: Message[]): Promise<string> {
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
    } catch (error: any) {
      console.error('OpenAI API request failed:', error.message);
      throw error;
    }
  }

  // Fallback to Azure OpenAI if OpenAI key not found
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_CHATGPT_DEPLOYMENT || 'gpt-4.1';
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2025-01-01-preview';

  if (!endpoint || !apiKey) {
    throw new Error('OpenAI configuration missing. Please set OPENAI_API_KEY or AZURE_OPENAI_API_KEY in Vercel environment variables');
  }

  // Build Azure OpenAI API URL
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
      frequency_penalty: 0,
      presence_penalty: 0,
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Rate limiting
    const clientIP = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                     req.socket?.remoteAddress || 
                     'unknown';
    
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({ 
        error: 'Too many requests. Please wait a moment before trying again.',
        retry_after: 60
      });
    }

    const { message, conversationHistory = [], sessionId } = req.body as ChatRequest;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Content safety check
    if (!isContentSafe(message)) {
      return res.status(200).json({
        response: "I'm sorry, but I can't help with that request. I'm designed to be helpful, harmless, and honest. Is there something else I can assist you with?",
        session_id: sessionId || 'safe_response',
        filtered: true
      });
    }

    // Build messages array with system prompt
    const messages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.filter(m => m.role !== 'system').slice(-10), // Keep last 10 messages
      { role: 'user', content: message }
    ];

    // Call OpenAI (standard or Azure)
    const aiResponse = await callOpenAI(messages);
    const model = process.env.OPENAI_MODEL || process.env.AZURE_OPENAI_CHATGPT_MODEL || 'gpt-4o-mini';

    return res.status(200).json({
      response: aiResponse,
      session_id: sessionId || `session_${Date.now()}`,
      model: model
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      openaiKey: process.env.OPENAI_API_KEY ? 'Set' : 'Not set',
      viteOpenaiKey: process.env.VITE_OPENAI_API_KEY ? 'Set' : 'Not set',
      azureKey: process.env.AZURE_OPENAI_API_KEY ? 'Set' : 'Not set'
    });
    
    // Return a helpful fallback response with error details in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Error: ${error.message}. Please check Vercel environment variables (OPENAI_API_KEY).`
      : "I'm currently experiencing some technical difficulties. However, I can still help you with basic information:\n\n" +
        "📧 Contact Matex: almestrahmohammad@gmail.com\n" +
        "📞 Phone: +961 76162549\n" +
        "📍 Locations: Beirut, Lebanon | Paris, France\n\n" +
        "Please try again in a moment, or contact us directly for assistance.";
    
    return res.status(200).json({
      response: errorMessage,
      session_id: 'fallback_response',
      error: true,
      errorDetails: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
