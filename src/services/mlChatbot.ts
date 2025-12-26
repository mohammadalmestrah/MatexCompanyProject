import websiteData from '../data/websiteData.json';

interface ChatResponse {
  response: string;
  session_id: string;
  predicted_category?: string;
  confidence?: number;
  confidence_level?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

class MLChatbot {
  private sessionId: string;
  private conversationHistory: Message[] = [];
  private keywordWeights: Map<string, number> = new Map();

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeKeywordWeights();
  }

  private generateSessionId(): string {
    return 'ml_' + Math.random().toString(36).substr(2, 9);
  }

  private initializeKeywordWeights(): void {
    // Initialize keyword weights for better matching
    const keywordMap = new Map();
    
    // Machine Learning keywords
    ['machine learning', 'ml', 'neural network', 'deep learning', 'supervised', 'unsupervised', 'reinforcement', 'tensorflow', 'pytorch'].forEach(keyword => {
      keywordMap.set(keyword, 10);
    });
    
    // AI keywords
    ['artificial intelligence', 'ai', 'computer vision', 'nlp', 'natural language', 'robotics'].forEach(keyword => {
      keywordMap.set(keyword, 10);
    });
    
    // Software Development keywords
    ['software development', 'programming', 'coding', 'frontend', 'backend', 'full stack', 'agile', 'devops'].forEach(keyword => {
      keywordMap.set(keyword, 9);
    });
    
    // Mobile Development keywords
    ['mobile development', 'mobile app', 'ios', 'android', 'react native', 'flutter', 'xamarin', 'ionic'].forEach(keyword => {
      keywordMap.set(keyword, 9);
    });
    
    // Web Technologies keywords
    ['web development', 'react', 'vue', 'angular', 'node.js', 'javascript', 'html', 'css', 'database'].forEach(keyword => {
      keywordMap.set(keyword, 8);
    });
    
    // Cloud Computing keywords
    ['cloud computing', 'aws', 'azure', 'gcp', 'google cloud', 'iaas', 'paas', 'saas'].forEach(keyword => {
      keywordMap.set(keyword, 8);
    });
    
    // Cybersecurity keywords
    ['cybersecurity', 'security', 'hacking', 'malware', 'phishing', 'firewall', 'encryption'].forEach(keyword => {
      keywordMap.set(keyword, 8);
    });
    
    // Business keywords
    ['services', 'company', 'contact', 'pricing', 'help', 'support', 'consultation'].forEach(keyword => {
      keywordMap.set(keyword, 7);
    });

    this.keywordWeights = keywordMap;
  }

  private preprocessText(text: string): string {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private calculateCategoryScore(message: string, categoryKeywords: string[]): number {
    const processedMessage = this.preprocessText(message);
    const words = processedMessage.split(' ');
    
    let score = 0;
    let matches = 0;
    
    categoryKeywords.forEach(keyword => {
      const processedKeyword = this.preprocessText(keyword);
      const keywordWords = processedKeyword.split(' ');
      
      // Check for exact phrase match
      if (processedMessage.includes(processedKeyword)) {
        const weight = this.keywordWeights.get(processedKeyword) || 5;
        score += weight * 2; // Boost for phrase matches
        matches++;
      }
      
      // Check for individual word matches
      keywordWords.forEach(word => {
        if (words.includes(word) && word.length > 2) {
          const weight = this.keywordWeights.get(word) || 1;
          score += weight;
          matches++;
        }
      });
    });
    
    // Normalize score based on message length and number of matches
    const normalizedScore = matches > 0 ? score / Math.max(words.length * 0.1, 1) : 0;
    return Math.min(normalizedScore, 100); // Cap at 100
  }

  private predictCategory(message: string): { category: string; confidence: number; confidenceLevel: string } {
    const categories = {
      machine_learning: ['machine learning', 'ml', 'neural network', 'deep learning', 'supervised learning', 'unsupervised learning', 'reinforcement learning', 'tensorflow', 'pytorch', 'scikit-learn', 'keras'],
      artificial_intelligence: ['artificial intelligence', 'ai', 'computer vision', 'natural language processing', 'nlp', 'robotics', 'machine intelligence'],
      software_development: ['software development', 'programming', 'coding', 'frontend development', 'backend development', 'full stack', 'agile', 'scrum', 'devops', 'api development'],
      mobile_development: ['mobile development', 'mobile app', 'ios development', 'android development', 'react native', 'flutter', 'xamarin', 'ionic', 'cross platform'],
      web_technologies: ['web development', 'frontend', 'backend', 'react', 'vue', 'angular', 'node.js', 'javascript', 'html', 'css', 'database', 'api'],
      cloud_computing: ['cloud computing', 'aws', 'azure', 'gcp', 'google cloud', 'iaas', 'paas', 'saas', 'cloud migration', 'cloud services'],
      cybersecurity: ['cybersecurity', 'security', 'hacking', 'malware', 'phishing', 'firewall', 'encryption', 'data protection', 'cyber security'],
      services: ['services', 'what do you do', 'offer', 'company services', 'what services'],
      contact: ['contact', 'email', 'phone', 'reach', 'get in touch', 'location', 'address', 'where'],
      pricing: ['price', 'cost', 'pricing', 'how much', 'fee', 'budget'],
      help: ['help', 'assist', 'support', 'guidance', 'can you help']
    };

    let bestCategory = 'help';
    let bestScore = 0;

    Object.entries(categories).forEach(([category, keywords]) => {
      const score = this.calculateCategoryScore(message, keywords);
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    });

    // Convert score to confidence percentage
    const confidence = Math.min(bestScore / 10, 1); // Normalize to 0-1
    let confidenceLevel = 'very_low';
    
    if (confidence >= 0.8) confidenceLevel = 'high';
    else if (confidence >= 0.6) confidenceLevel = 'medium';
    else if (confidence >= 0.4) confidenceLevel = 'low';

    return { category: bestCategory, confidence, confidenceLevel };
  }

  private checkComplexQuestion(message: string): boolean {
    const complexKeywords = [
      'advanced machine learning', 'deep learning architecture', 'neural network optimization',
      'custom ai model', 'complex algorithm', 'enterprise solution', 'large scale system',
      'security implementation', 'performance optimization', 'advanced analytics',
      'blockchain development', 'microservices architecture', 'distributed systems',
      'real-time processing', 'high availability', 'disaster recovery',
      'compliance requirements', 'integration complexity', 'legacy system migration',
      'multi-tenant architecture'
    ];

    const processedMessage = this.preprocessText(message);
    return complexKeywords.some(keyword => 
      processedMessage.includes(this.preprocessText(keyword))
    );
  }

  private generateResponse(message: string, prediction: { category: string; confidence: number; confidenceLevel: string }): string {
    const { category, confidence, confidenceLevel } = prediction;

    // Check for complex questions first
    if (this.checkComplexQuestion(message)) {
      return websiteData.escalation.complex_question_message;
    }

    // Generate response based on category
    switch (category) {
      case 'machine_learning':
        const ml = websiteData.technologies.machine_learning;
        let mlResponse = `${ml.definition}\n\nTypes of Machine Learning:\n`;
        ml.types.forEach(type => {
          mlResponse += `• ${type.name}: ${type.description}\n  Examples: ${type.examples.join(', ')}\n\n`;
        });
        mlResponse += `Applications:\n${ml.applications.map(app => `• ${app}`).join('\n')}\n\n`;
        mlResponse += `Popular Frameworks: ${ml.popular_frameworks.join(', ')}`;
        return confidenceLevel === 'very_low' ? "I'm not entirely sure about your question, but " + mlResponse.toLowerCase() : mlResponse;

      case 'artificial_intelligence':
        const ai = websiteData.technologies.artificial_intelligence;
        let aiResponse = `${ai.definition}\n\nBranches of AI:\n`;
        ai.branches.forEach(branch => {
          aiResponse += `• ${branch.name}: ${branch.description}\n`;
        });
        aiResponse += `\nTypes of AI:\n`;
        ai.ai_types.forEach(type => {
          aiResponse += `• ${type.name}: ${type.description}\n`;
        });
        return confidenceLevel === 'very_low' ? "I'm not entirely sure about your question, but " + aiResponse.toLowerCase() : aiResponse;

      case 'software_development':
        const sd = websiteData.technologies.software_development;
        let sdResponse = `${sd.definition}\n\nDevelopment Methodologies:\n`;
        sd.methodologies.forEach(method => {
          sdResponse += `• ${method.name}: ${method.description}\n`;
        });
        sdResponse += `\nProgramming Languages by Category:\n`;
        Object.entries(sd.programming_languages).forEach(([category, languages]) => {
          sdResponse += `• ${category.replace('_', ' ').toUpperCase()}: ${languages.join(', ')}\n`;
        });
        return confidenceLevel === 'very_low' ? "I'm not entirely sure about your question, but " + sdResponse.toLowerCase() : sdResponse;

      case 'mobile_development':
        const md = websiteData.technologies.mobile_development;
        let mdResponse = `${md.definition}\n\nDevelopment Platforms:\n`;
        md.platforms.forEach(platform => {
          mdResponse += `• ${platform.name}: ${platform.description}\n`;
          if (platform.ios) {
            mdResponse += `  iOS: ${platform.ios.language} with ${platform.ios.framework} in ${platform.ios.ide}\n`;
          }
          if (platform.android) {
            mdResponse += `  Android: ${platform.android.language} with ${platform.android.framework} in ${platform.android.ide}\n`;
          }
        });
        return confidenceLevel === 'very_low' ? "I'm not entirely sure about your question, but " + mdResponse.toLowerCase() : mdResponse;

      case 'web_technologies':
        const wt = websiteData.technologies.web_technologies;
        let wtResponse = `Web Development Technologies:\n\nFrontend Frameworks:\n`;
        wt.frontend.frameworks.forEach(framework => {
          wtResponse += `• ${framework.name}: ${framework.description}\n  Features: ${framework.features.join(', ')}\n\n`;
        });
        wtResponse += `Backend Frameworks:\n`;
        wt.backend.frameworks.forEach(framework => {
          wtResponse += `• ${framework.name}: ${framework.description}\n  Frameworks: ${framework.frameworks.join(', ')}\n\n`;
        });
        return confidenceLevel === 'very_low' ? "I'm not entirely sure about your question, but " + wtResponse.toLowerCase() : wtResponse;

      case 'cloud_computing':
        const cc = websiteData.technologies.cloud_computing;
        let ccResponse = `${cc.definition}\n\nService Models:\n`;
        cc.service_models.forEach(model => {
          ccResponse += `• ${model.name}: ${model.description}\n  Examples: ${model.examples.join(', ')}\n\n`;
        });
        ccResponse += `Major Cloud Providers:\n`;
        cc.major_providers.forEach(provider => {
          ccResponse += `• ${provider.name}: ${provider.services.join(', ')}\n`;
        });
        return confidenceLevel === 'very_low' ? "I'm not entirely sure about your question, but " + ccResponse.toLowerCase() : ccResponse;

      case 'cybersecurity':
        const cs = websiteData.technologies.cybersecurity;
        let csResponse = `${cs.definition}\n\nTypes of Threats:\n`;
        cs.types_of_threats.forEach(threat => {
          csResponse += `• ${threat}\n`;
        });
        csResponse += `\nSecurity Measures:\n`;
        cs.security_measures.forEach(measure => {
          csResponse += `• ${measure}\n`;
        });
        return confidenceLevel === 'very_low' ? "I'm not entirely sure about your question, but " + csResponse.toLowerCase() : csResponse;

      case 'services':
        let servicesResponse = 'Matex offers the following services:\n\n';
        websiteData.services.forEach((service, index) => {
          servicesResponse += `${index + 1}. ${service.title}: ${service.description}\n`;
        });
        return servicesResponse;

      case 'contact':
        return `You can contact Matex at:\n• Email: ${websiteData.contact.email}\n• Phone: ${websiteData.contact.phone}\n• Location: ${websiteData.contact.location}\n• Working Hours: ${websiteData.contact.working_hours}\n• Response Time: ${websiteData.contact.response_time}`;

      case 'pricing':
        return `${websiteData.pricing.note}\n\n${websiteData.pricing.contact_for_quote}`;

      case 'help':
      default:
        return `Hello! I'm Matex's AI assistant with machine learning capabilities. I can help you with information about:\n\n• Machine Learning & AI\n• Software Development\n• Mobile Development\n• Web Technologies\n• Cloud Computing\n• Cybersecurity\n• Our services and company\n• About our founder Mohammad ALMESTRAH\n• Contact information\n\nWhat would you like to know more about?`;
    }
  }

  async chat(message: string): Promise<ChatResponse> {
    // Add user message to history
    this.conversationHistory.push({ role: 'user', content: message });
    
    // Predict category using ML-like algorithm
    const prediction = this.predictCategory(message);
    
    // Generate response
    const response = this.generateResponse(message, prediction);
    
    // Add assistant response to history
    this.conversationHistory.push({ role: 'assistant', content: response });
    
    // Keep only last 20 messages
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }

    return {
      response,
      session_id: this.sessionId,
      predicted_category: prediction.category,
      confidence: prediction.confidence,
      confidence_level: prediction.confidenceLevel
    };
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getConversationHistory(): Message[] {
    return [...this.conversationHistory];
  }
}

export default MLChatbot;


