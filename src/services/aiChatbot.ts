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
  
  constructor(config: AIConfig = {}) {
    this.sessionId = this.generateSessionId();
    this.config = {
      apiKey: config.apiKey || import.meta.env.VITE_OPENAI_API_KEY,
      model: config.model || 'gpt-4.1',
      temperature: config.temperature || 0.7,
      maxTokens: config.maxTokens || 1000,
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
- Founder: Mohammad ALMESTRAH (in Arabic: محمد المستراح)
- Email: contact@matexsolution.com

IMPORTANT: When users ask about the founder's name:
- If the question is in Arabic or the user is speaking Arabic, respond with: "محمد المستراح"
- If the question is in English or other languages, respond with: "Mohammad ALMESTRAH"
- You can also mention both: "Mohammad ALMESTRAH (محمد المستراح)" to be inclusive
- Phone: +961 76162549
- Locations: Beirut, Lebanon and Paris, France

Your role:
1. Provide accurate, helpful information about Matex services and technologies
2. Answer questions about LLM algorithms, AI, ML, software development, and related topics
3. Answer general knowledge questions on any topic - you are a general-purpose AI assistant like ChatGPT
4. Be conversational, friendly, and professional
5. Use the conversation history to maintain context
6. If you don't know something, admit it and offer to help find the answer
7. Keep responses concise but informative
8. Support multiple languages (English, French, Arabic) based on user's language

Available Services:
${websiteData.services.map((s, i) => `${i + 1}. ${s.title}: ${s.description}`).join('\n')}

Specialization in LLM Algorithms:
Matex specializes in Large Language Models (LLMs) including GPT, Claude, LLaMA, BERT, and T5. We provide LLM integration, fine-tuning, deployment, and custom LLM development for various applications.

Safety Guidelines:
- Do not provide information about illegal activities
- Do not generate harmful, abusive, or inappropriate content
- Do not collect or request personal sensitive data
- Redirect harmful queries politely

Always be helpful, accurate, and maintain a professional yet friendly tone.`;

    this.conversationHistory = [
      { role: 'system', content: systemPrompt }
    ];
  }

  private async callServerAPI(messages: Message[]): Promise<string> {
    try {
      // Call server-side API endpoint (works both locally via proxy and in production)
      const apiUrl = '/api/chat';
      const requestBody = {
        message: messages[messages.length - 1]?.content || '',
        conversationHistory: messages.slice(0, -1), // All messages except last user message
        sessionId: this.sessionId
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `API error: ${response.status}`;
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          url: apiUrl
        });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Check if there's an error in the response
      if (data.error) {
        console.warn('API returned error flag:', data);
        // Still return the response message if available
        if (data.response) {
          return data.response;
        }
        throw new Error(data.errorDetails || 'API returned an error');
      }
      
      if (!data.response) {
        console.warn('API response missing response field:', data);
        throw new Error('Invalid API response format');
      }
      
      return data.response;
    } catch (error: any) {
      // More detailed error logging
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('Network Error: Could not reach API endpoint. Make sure the API is deployed correctly.');
        throw new Error('Network error: API endpoint unavailable. Please check if the server is running.');
      }
      console.error('Server API Error:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      throw error;
    }
  }

  private generateSmartFallback(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    // Greeting responses (using word boundaries)
    if (/\b(hello|hi|hey|greetings|good morning|good afternoon|good evening)\b/i.test(lowerMessage)) {
      return "Hello! I'm the Matex AI Assistant. I can help you with questions about technology, programming, AI, or our services. What would you like to know?";
    }

    // Enhanced pattern matching with context awareness
    if (/(machine learning|ml|neural network|deep learning)/.test(lowerMessage)) {
      const ml = websiteData.technologies.machine_learning;
      return `Machine Learning is ${ml.definition}\n\nAt Matex, we specialize in implementing ML solutions for businesses. Our expertise includes:\n${ml.types.map(t => `• ${t.name}: ${t.description}`).join('\n')}\n\nWould you like to know more about how we can help implement ML in your business?`;
    }

    if (/(artificial intelligence|ai|computer vision|nlp)/.test(lowerMessage)) {
      const ai = websiteData.technologies.artificial_intelligence;
      return `Artificial Intelligence (AI) is ${ai.definition}\n\nMatex offers AI solutions including:\n${ai.branches.map(b => `• ${b.name}: ${b.description}`).join('\n')}\n\nContact us at contact@matexsolution.com to discuss your AI needs.`;
    }

    if (/(service|what do you do|offer)/.test(lowerMessage)) {
      return `Matex offers comprehensive technology services:\n\n${websiteData.services.map((s, i) => `${i + 1}. ${s.title}\n   ${s.description}`).join('\n\n')}\n\nWe're here to help transform your business with cutting-edge technology. Would you like more details about any specific service?`;
    }

    if (/(contact|email|phone|reach|location)/.test(lowerMessage)) {
      return `You can reach Matex through:\n\n📧 Email: contact@matexsolution.com\n📞 Phone: +961 76162549\n📍 Locations: Beirut, Lebanon | Paris, France\n\nWe're happy to help with any questions or project inquiries!`;
    }

    if (/(price|cost|pricing|how much)/.test(lowerMessage)) {
      return `Pricing for our services varies based on project scope, complexity, and requirements. We provide customized quotes tailored to each client's needs.\n\nTo get an accurate estimate, please contact us at contact@matexsolution.com with details about your project. We'll provide a comprehensive quote within 24-48 hours.`;
    }

    if (/(web|website|frontend|backend|development)/.test(lowerMessage)) {
      return `Matex provides full-stack web development services:\n\n• Frontend: React, Vue.js, Angular, Next.js\n• Backend: Node.js, Python, Java, .NET\n• Database: PostgreSQL, MongoDB, Redis\n• Cloud: AWS, Azure, Google Cloud\n\nWe build scalable, secure, and performant web applications. Contact us to discuss your project!`;
    }

    if (/(mobile|app|ios|android|flutter|react native)/.test(lowerMessage)) {
      return `Matex develops cross-platform and native mobile applications:\n\n• iOS Development (Swift, SwiftUI)\n• Android Development (Kotlin, Jetpack Compose)\n• Cross-platform (React Native, Flutter)\n\nWe deliver high-quality mobile apps with excellent user experience. Would you like to discuss your mobile app idea?`;
    }

    if (/(cloud|aws|azure|gcp|devops|kubernetes)/.test(lowerMessage)) {
      return `Matex provides cloud computing and DevOps services:\n\n• Cloud Architecture (AWS, Azure, GCP)\n• Container Orchestration (Kubernetes, Docker)\n• CI/CD Pipeline Setup\n• Infrastructure as Code (Terraform, CloudFormation)\n• Monitoring & Logging\n\nWe help businesses scale efficiently in the cloud!`;
    }

    if (/(security|cybersecurity|hack|protect)/.test(lowerMessage)) {
      return `Matex offers comprehensive cybersecurity services:\n\n• Security Audits & Penetration Testing\n• Vulnerability Assessment\n• Security Architecture Design\n• Incident Response Planning\n• Compliance (GDPR, SOC2, ISO 27001)\n\nProtect your business with our security experts. Contact us for a security assessment!`;
    }

    // General helpful response
    return `I'm here to help you learn about Matex and our technology services. I can assist with:\n\n• Information about our services (AI/ML, Software Development, Mobile Apps, etc.)\n• Technical questions about technologies we work with\n• Company information and contact details\n• Project inquiries and consultations\n\nWhat would you like to know?`;
  }

  async chat(message: string, useAI: boolean = true): Promise<ChatResponse> {
    // Add user message to history
    this.conversationHistory.push({ role: 'user', content: message });

    let response: string;

    try {
      if (useAI && this.config.useOpenAI) {
        // Try to use server-side AI API
        response = await this.callServerAPI(this.conversationHistory);
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
    // For streaming, we'll use the non-streaming endpoint and simulate
    // since streaming requires different server setup
    const response = await this.chat(message, true);
    onChunk(response.response);
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
