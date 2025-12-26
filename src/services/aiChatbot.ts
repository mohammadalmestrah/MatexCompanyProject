import websiteData from '../data/websiteData.json';

interface ChatResponse {
  response: string;
  session_id: string;
  tokens_used?: number;
  model?: string;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIConfig {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  useOpenAI?: boolean;
}

class AIChatbot {
  private sessionId: string;
  private conversationHistory: Message[] = [];
  private config: AIConfig;
  private readonly API_BASE = 'https://api.openai.com/v1';
  
  constructor(config: AIConfig = {}) {
    this.sessionId = this.generateSessionId();
    this.config = {
      apiKey: config.apiKey || import.meta.env.VITE_OPENAI_API_KEY,
      model: config.model || 'gpt-3.5-turbo',
      temperature: config.temperature || 0.7,
      maxTokens: config.maxTokens || 500,
      useOpenAI: config.useOpenAI !== false
    };
    
    // Initialize with system prompt
    this.initializeSystemPrompt();
  }

  private generateSessionId(): string {
    return 'ai_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  private initializeSystemPrompt(): void {
    const systemPrompt = `You are Matex AI Assistant, a helpful and knowledgeable AI assistant for Matex, a technology company specializing in LLM algorithms, AI, machine learning, software development, mobile apps, web technologies, cloud computing, and cybersecurity.

Company Information:
- Founder: Mohammad ALMESTRAH
- Email: almestrahmohammad@gmail.com
- Phone: +961 76162549
- Locations: Beirut, Lebanon and Paris, France

Your role:
1. Provide accurate, helpful information about Matex services and technologies
2. Answer questions about LLM algorithms, AI, ML, software development, and related topics
3. Be conversational, friendly, and professional
4. Use the conversation history to maintain context
5. If you don't know something, admit it and offer to help find the answer
6. Keep responses concise but informative
7. Support multiple languages (English, French, Arabic) based on user's language

Available Services:
${websiteData.services.map((s, i) => `${i + 1}. ${s.title}: ${s.description}`).join('\n')}

Specialization in LLM Algorithms:
Matex specializes in Large Language Models (LLMs) including GPT, Claude, LLaMA, BERT, and T5. We provide LLM integration, fine-tuning, deployment, and custom LLM development for various applications.

Always be helpful, accurate, and maintain a professional yet friendly tone.`;

    this.conversationHistory = [
      { role: 'system', content: systemPrompt }
    ];
  }

  private buildContextualPrompt(userMessage: string): string {
    // Add relevant company data to context
    const context = `
Current conversation context:
- User is asking about: ${userMessage}
- Company: Matex
- Services: AI/ML, Software Development, Mobile Apps, Web Technologies, Cloud Computing, Cybersecurity
- Contact: almestrahmohammad@gmail.com, +961 76162549

Please provide a helpful, accurate response. If the question is about Matex services, use the information above. If it's a general technical question, provide expert knowledge.
`;

    return context;
  }

  private async callOpenAI(messages: Message[]): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
    }

    try {
      const response = await fetch(`${this.API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
          stream: false
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API error');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  private generateSmartFallback(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    // Enhanced pattern matching with context awareness
    if (/(machine learning|ml|neural network|deep learning)/.test(lowerMessage)) {
      const ml = websiteData.technologies.machine_learning;
      return `Machine Learning is ${ml.definition}\n\nAt Matex, we specialize in implementing ML solutions for businesses. Our expertise includes:\n${ml.types.map(t => `• ${t.name}: ${t.description}`).join('\n')}\n\nWould you like to know more about how we can help implement ML in your business?`;
    }

    if (/(artificial intelligence|ai|computer vision|nlp)/.test(lowerMessage)) {
      const ai = websiteData.technologies.artificial_intelligence;
      return `Artificial Intelligence (AI) is ${ai.definition}\n\nMatex offers AI solutions including:\n${ai.branches.map(b => `• ${b.name}: ${b.description}`).join('\n')}\n\nContact us at almestrahmohammad@gmail.com to discuss your AI needs.`;
    }

    if (/(service|what do you do|offer)/.test(lowerMessage)) {
      return `Matex offers comprehensive technology services:\n\n${websiteData.services.map((s, i) => `${i + 1}. ${s.title}\n   ${s.description}`).join('\n\n')}\n\nWe're here to help transform your business with cutting-edge technology. Would you like more details about any specific service?`;
    }

    if (/(contact|email|phone|reach|location)/.test(lowerMessage)) {
      return `You can reach Matex through:\n\n📧 Email: almestrahmohammad@gmail.com\n📞 Phone: +961 76162549\n📍 Locations: Beirut, Lebanon | Paris, France\n\nWe're happy to help with any questions or project inquiries!`;
    }

    if (/(price|cost|pricing|how much)/.test(lowerMessage)) {
      return `Pricing for our services varies based on project scope, complexity, and requirements. We provide customized quotes tailored to each client's needs.\n\nTo get an accurate estimate, please contact us at almestrahmohammad@gmail.com with details about your project. We'll provide a comprehensive quote within 24-48 hours.`;
    }

    // General helpful response
    return `I'm here to help you learn about Matex and our technology services. I can assist with:\n\n• Information about our services (AI/ML, Software Development, Mobile Apps, etc.)\n• Technical questions about technologies we work with\n• Company information and contact details\n• Project inquiries and consultations\n\nWhat would you like to know?`;
  }

  async chat(message: string, useAI: boolean = true): Promise<ChatResponse> {
    // Add user message to history
    this.conversationHistory.push({ role: 'user', content: message });

    let response: string;

    try {
      if (useAI && this.config.apiKey && this.config.useOpenAI) {
        // Use OpenAI API for intelligent responses
        response = await this.callOpenAI(this.conversationHistory);
      } else {
        // Use smart fallback with enhanced pattern matching
        response = this.generateSmartFallback(message);
      }
    } catch (error: any) {
      console.warn('AI service unavailable, using fallback:', error.message);
      // Fallback to smart pattern matching
      response = this.generateSmartFallback(message);
    }

    // Add assistant response to history
    this.conversationHistory.push({ role: 'assistant', content: response });

    // Keep conversation history manageable (last 10 exchanges = 20 messages + system)
    const maxHistory = 21; // 1 system + 20 conversation messages
    if (this.conversationHistory.length > maxHistory) {
      // Keep system message and recent messages
      const systemMsg = this.conversationHistory[0];
      const recentMessages = this.conversationHistory.slice(-maxHistory + 1);
      this.conversationHistory = [systemMsg, ...recentMessages];
    }

    return {
      response,
      session_id: this.sessionId,
      model: this.config.model
    };
  }

  async chatStream(message: string, onChunk: (chunk: string) => void): Promise<void> {
    if (!this.config.apiKey) {
      const fallback = this.generateSmartFallback(message);
      onChunk(fallback);
      return;
    }

    this.conversationHistory.push({ role: 'user', content: message });

    try {
      const response = await fetch(`${this.API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: this.conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error('Streaming failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const json = JSON.parse(data);
                const content = json.choices[0]?.delta?.content || '';
                if (content) {
                  fullResponse += content;
                  onChunk(content);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      this.conversationHistory.push({ role: 'assistant', content: fullResponse });
    } catch (error) {
      console.error('Streaming error:', error);
      const fallback = this.generateSmartFallback(message);
      onChunk(fallback);
      this.conversationHistory.push({ role: 'assistant', content: fallback });
    }
  }

  clearHistory(): void {
    this.initializeSystemPrompt();
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getConversationHistory(): Message[] {
    return [...this.conversationHistory];
  }

  updateConfig(config: Partial<AIConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

export default AIChatbot;

