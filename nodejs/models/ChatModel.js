export class ChatModel {
  constructor(responseCategories) {
    this.conversationHistory = [];
    this.contextMemory = new Map();
    this.lastContext = null;
    this.responseCategories = responseCategories;
    
    // Initialize context memory
    Object.values(responseCategories).forEach(category => {
      if (category.context) {
        this.contextMemory.set(category.context, 1);
      }
    });
  }

  calculateContextScore(context) {
    return this.contextMemory.get(context) || 1;
  }

  updateContextWeights(context) {
    this.contextMemory.set(context, (this.contextMemory.get(context) || 1) * 1.2);
    
    this.contextMemory.forEach((weight, ctx) => {
      if (ctx !== context) {
        this.contextMemory.set(ctx, weight * 0.95);
      }
    });

    this.lastContext = context;
  }

  findBestMatch(message) {
    const lowercaseMessage = message.toLowerCase();
    let bestMatch = { category: null, score: 0 };

    for (const [_, category] of Object.entries(this.responseCategories)) {
      let score = 0;
      
      category.keywords.forEach(keyword => {
        if (lowercaseMessage.includes(keyword.toLowerCase())) {
          score += 1;
        }
      });

      if (category.context) {
        score *= this.calculateContextScore(category.context);
      }

      if (category.context === this.lastContext) {
        score *= 1.2;
      }

      if (score > bestMatch.score) {
        bestMatch = { category, score };
      }
    }

    return bestMatch.category;
  }

  analyzeMessageIntent(message) {
    const intents = [];
    const lowercaseMessage = message.toLowerCase();

    if (lowercaseMessage.includes('how') || lowercaseMessage.includes('what')) intents.push('question');
    if (lowercaseMessage.includes('help') || lowercaseMessage.includes('need')) intents.push('assistance');
    if (lowercaseMessage.includes('thanks') || lowercaseMessage.includes('thank')) intents.push('gratitude');
    if (lowercaseMessage.includes('project') || lowercaseMessage.includes('task')) intents.push('project_related');
    if (lowercaseMessage.includes('team') || lowercaseMessage.includes('member')) intents.push('team_related');
    if (lowercaseMessage.includes('deadline') || lowercaseMessage.includes('when')) intents.push('timeline_related');
    if (lowercaseMessage.includes('confused') || lowercaseMessage.includes('understand')) intents.push('clarification');
    if (lowercaseMessage.includes('feel') || lowercaseMessage.includes('are you')) intents.push('personal');

    return intents;
  }

  shouldAddFollowUp(intents) {
    return intents.includes('question') || intents.includes('assistance');
  }

  async generateResponse(message) {
    try {
      this.conversationHistory.push({ role: 'user', content: message });

      const intents = this.analyzeMessageIntent(message);
      const matchingCategory = this.findBestMatch(message);

      if (matchingCategory) {
        if (matchingCategory.context) {
          this.updateContextWeights(matchingCategory.context);
        }

        let response = matchingCategory.responses[
          Math.floor(Math.random() * matchingCategory.responses.length)
        ];

        if (this.shouldAddFollowUp(intents) && matchingCategory.followUp) {
          response += "\n\n" + matchingCategory.followUp[
            Math.floor(Math.random() * matchingCategory.followUp.length)
          ];
        }

        this.conversationHistory.push({ role: 'assistant', content: response });
        return response;
      }

      const fallbackResponse = "I understand you're asking about that. Let me help connect you with our team for more detailed information. You can also ask me about our services, locations, technologies, or schedule a consultation. Is there a specific aspect you'd like to know more about?";
      
      this.conversationHistory.push({ role: 'assistant', content: fallbackResponse });
      return fallbackResponse;
    } catch (error) {
      console.error('Error generating response:', error);
      return "I apologize, but I encountered an error while processing your request. Please try again or contact our support team.";
    }
  }
}