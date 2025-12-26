import websiteData from '../data/websiteData.json';

interface ChatResponse {
  response: string;
  session_id: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

class LocalChatbot {
  private sessionId: string;
  private conversationHistory: Message[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return 'local_' + Math.random().toString(36).substr(2, 9);
  }

  private checkComplexQuestion(message: string): boolean {
    return websiteData.escalation.complex_keywords.some(keyword => 
      message.includes(keyword.toLowerCase())
    );
  }

  private async sendEscalationEmail(question: string): Promise<void> {
    // In a real implementation, you would send an email here
    // For now, we'll just log it
    console.log(`ESCALATION EMAIL TO: almestrahmohammad@gmail.com`);
    console.log(`Subject: Complex Question from Chatbot`);
    console.log(`Question: ${question}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
  }

  private findBestAnswer(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    // Check for complex questions first
    if (this.checkComplexQuestion(message)) {
      // Send escalation email (async, but we don't await to avoid blocking)
      this.sendEscalationEmail(userMessage);
      return websiteData.escalation.complex_question_message;
    }
    
    // Machine Learning detailed information
    if (message.includes('machine learning') || message.includes('ml')) {
      const ml = websiteData.technologies.machine_learning;
      let response = `${ml.definition}\n\nTypes of Machine Learning:\n`;
      ml.types.forEach(type => {
        response += `• ${type.name}: ${type.description}\n  Examples: ${type.examples.join(', ')}\n\n`;
      });
      response += `Applications:\n${ml.applications.map(app => `• ${app}`).join('\n')}\n\n`;
      response += `Popular Frameworks: ${ml.popular_frameworks.join(', ')}`;
      return response;
    }

    // Artificial Intelligence detailed information
    if (message.includes('artificial intelligence') || message.includes('ai')) {
      const ai = websiteData.technologies.artificial_intelligence;
      let response = `${ai.definition}\n\nBranches of AI:\n`;
      ai.branches.forEach(branch => {
        response += `• ${branch.name}: ${branch.description}\n`;
      });
      response += `\nTypes of AI:\n`;
      ai.ai_types.forEach(type => {
        response += `• ${type.name}: ${type.description}\n`;
      });
      return response;
    }

    // Software Development detailed information
    if (message.includes('software development') || message.includes('programming') || message.includes('coding')) {
      const sd = websiteData.technologies.software_development;
      let response = `${sd.definition}\n\nDevelopment Methodologies:\n`;
      sd.methodologies.forEach(method => {
        response += `• ${method.name}: ${method.description}\n`;
      });
      response += `\nProgramming Languages by Category:\n`;
      Object.entries(sd.programming_languages).forEach(([category, languages]) => {
        response += `• ${category.replace('_', ' ').toUpperCase()}: ${languages.join(', ')}\n`;
      });
      response += `\nTypes of Development:\n`;
      sd.development_types.forEach(type => {
        response += `• ${type.name}: ${type.description}\n  Technologies: ${type.technologies.join(', ')}\n\n`;
      });
      return response;
    }

    // Mobile Development detailed information
    if (message.includes('mobile development') || message.includes('mobile app') || message.includes('ios') || message.includes('android')) {
      const md = websiteData.technologies.mobile_development;
      let response = `${md.definition}\n\nDevelopment Platforms:\n`;
      md.platforms.forEach(platform => {
        response += `• ${platform.name}: ${platform.description}\n`;
        if (platform.ios) {
          response += `  iOS: ${platform.ios.language} with ${platform.ios.framework} in ${platform.ios.ide}\n`;
        }
        if (platform.android) {
          response += `  Android: ${platform.android.language} with ${platform.android.framework} in ${platform.android.ide}\n`;
        }
        if (platform.frameworks) {
          platform.frameworks.forEach(framework => {
            response += `  - ${framework.name}: ${framework.description}\n`;
          });
        }
        if (platform.technologies) {
          response += `  Technologies: ${platform.technologies.join(', ')}\n`;
        }
        response += '\n';
      });
      response += `Types of Mobile Apps:\n${md.mobile_app_types.map(type => `• ${type}`).join('\n')}`;
      return response;
    }

    // Web Technologies detailed information
    if (message.includes('web development') || message.includes('frontend') || message.includes('backend') || message.includes('react') || message.includes('vue') || message.includes('angular')) {
      const wt = websiteData.technologies.web_technologies;
      let response = `Web Development Technologies:\n\nFrontend Frameworks:\n`;
      wt.frontend.frameworks.forEach(framework => {
        response += `• ${framework.name}: ${framework.description}\n  Features: ${framework.features.join(', ')}\n\n`;
      });
      response += `Frontend Libraries: ${wt.frontend.libraries.join(', ')}\n`;
      response += `Styling Technologies: ${wt.frontend.styling.join(', ')}\n\n`;
      response += `Backend Frameworks:\n`;
      wt.backend.frameworks.forEach(framework => {
        response += `• ${framework.name}: ${framework.description}\n  Frameworks: ${framework.frameworks.join(', ')}\n\n`;
      });
      response += `Databases:\n`;
      Object.entries(wt.databases).forEach(([type, databases]) => {
        response += `• ${type.toUpperCase()}: ${databases.join(', ')}\n`;
      });
      return response;
    }

    // Cloud Computing detailed information
    if (message.includes('cloud computing') || message.includes('aws') || message.includes('azure') || message.includes('gcp')) {
      const cc = websiteData.technologies.cloud_computing;
      let response = `${cc.definition}\n\nService Models:\n`;
      cc.service_models.forEach(model => {
        response += `• ${model.name}: ${model.description}\n  Examples: ${model.examples.join(', ')}\n\n`;
      });
      response += `Deployment Models: ${cc.deployment_models.join(', ')}\n\n`;
      response += `Major Cloud Providers:\n`;
      cc.major_providers.forEach(provider => {
        response += `• ${provider.name}: ${provider.services.join(', ')}\n`;
      });
      return response;
    }

    // Cybersecurity information
    if (message.includes('cybersecurity') || message.includes('security') || message.includes('hacking') || message.includes('malware')) {
      const cs = websiteData.technologies.cybersecurity;
      let response = `${cs.definition}\n\nTypes of Threats:\n`;
      cs.types_of_threats.forEach(threat => {
        response += `• ${threat}\n`;
      });
      response += `\nSecurity Measures:\n`;
      cs.security_measures.forEach(measure => {
        response += `• ${measure}\n`;
      });
      return response;
    }

    // Company information
    if (message.includes('company') || message.includes('matex') || message.includes('about')) {
      return `Matex is a technology solutions company founded by ${websiteData.company.founder}. ${websiteData.company.description} We are located in ${websiteData.company.location} and can be reached at ${websiteData.company.email} or ${websiteData.company.phone}.`;
    }

    // Founder information
    if (message.includes('founder') || message.includes('mohammad') || message.includes('almestrah') || message.includes('ceo')) {
      return `The founder of Matex is ${websiteData.about.founder.name}, who serves as the ${websiteData.about.founder.role}. ${websiteData.about.founder.description}`;
    }

    // Services
    if (message.includes('service') || message.includes('what do you do') || message.includes('offer')) {
      let servicesText = 'Matex offers the following services:\n\n';
      websiteData.services.forEach((service, index) => {
        servicesText += `${index + 1}. ${service.title}: ${service.description}\n`;
      });
      return servicesText;
    }

    // Specific service details
    if (message.includes('ai') || message.includes('artificial intelligence')) {
      const aiService = websiteData.services.find(s => s.title.toLowerCase().includes('ai'));
      return aiService ? `${aiService.title}: ${aiService.description}\n\nKey features:\n${aiService.features.map(f => `• ${f}`).join('\n')}` : 'We offer comprehensive AI solutions.';
    }

    if (message.includes('software') || message.includes('development')) {
      const devService = websiteData.services.find(s => s.title.toLowerCase().includes('software'));
      return devService ? `${devService.title}: ${devService.description}\n\nKey features:\n${devService.features.map(f => `• ${f}`).join('\n')}` : 'We offer full-stack software development services.';
    }

    if (message.includes('cloud')) {
      const cloudService = websiteData.services.find(s => s.title.toLowerCase().includes('cloud'));
      return cloudService ? `${cloudService.title}: ${cloudService.description}\n\nKey features:\n${cloudService.features.map(f => `• ${f}`).join('\n')}` : 'We offer comprehensive cloud services.';
    }

    if (message.includes('consulting') || message.includes('consult')) {
      const consultService = websiteData.services.find(s => s.title.toLowerCase().includes('consulting'));
      return consultService ? `${consultService.title}: ${consultService.description}\n\nKey features:\n${consultService.features.map(f => `• ${f}`).join('\n')}` : 'We offer expert technology consulting services.';
    }

    // Contact information
    if (message.includes('contact') || message.includes('email') || message.includes('phone') || message.includes('reach')) {
      return `You can contact Matex at:\n• Email: ${websiteData.contact.email}\n• Phone: ${websiteData.contact.phone}\n• Location: ${websiteData.contact.location}\n• Working Hours: ${websiteData.contact.working_hours}\n• Response Time: ${websiteData.contact.response_time}`;
    }

    // Pricing
    if (message.includes('price') || message.includes('cost') || message.includes('pricing')) {
      return `${websiteData.pricing.note}\n\n${websiteData.pricing.contact_for_quote}`;
    }

    // Location
    if (message.includes('location') || message.includes('where') || message.includes('address')) {
      return `Matex is located in ${websiteData.company.location}. You can reach us at ${websiteData.company.email} or ${websiteData.company.phone}.`;
    }

    // Mission/Vision
    if (message.includes('mission') || message.includes('vision') || message.includes('values')) {
      return `Our Mission: ${websiteData.about.mission}\n\nOur Vision: ${websiteData.about.vision}\n\nOur Values:\n${websiteData.about.values.map(v => `• ${v}`).join('\n')}`;
    }

    // FAQ responses
    const faqMatch = websiteData.faq.find(faq => 
      faq.question.toLowerCase().includes(message) || 
      message.includes(faq.question.toLowerCase().split(' ')[0])
    );
    if (faqMatch) {
      return faqMatch.answer;
    }

    // Default response
    return `Hello! I'm Matex's AI assistant. I can help you with information about:\n\n• Machine Learning & AI\n• Software Development\n• Mobile Development\n• Web Technologies\n• Cloud Computing\n• Cybersecurity\n• Our services and company\n• About our founder Mohammad ALMESTRAH\n• Contact information\n\nWhat would you like to know more about?`;
  }

  async chat(message: string): Promise<ChatResponse> {
    // Add user message to history
    this.conversationHistory.push({ role: 'user', content: message });
    
    // Generate response
    const response = this.findBestAnswer(message);
    
    // Add assistant response to history
    this.conversationHistory.push({ role: 'assistant', content: response });
    
    // Keep only last 20 messages
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }

    return {
      response,
      session_id: this.sessionId
    };
  }

  getSessionId(): string {
    return this.sessionId;
  }

  getConversationHistory(): Message[] {
    return [...this.conversationHistory];
  }
}

export default LocalChatbot;

