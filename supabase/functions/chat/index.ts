import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400'
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ResponseCategory {
  keywords: string[];
  responses: string[];
  context?: string;
  followUp?: string[];
}

const responseCategories: Record<string, ResponseCategory> = {
  help: {
    keywords: ['help', 'can you help', 'need help', 'assist', 'support', 'guidance'],
    responses: [
      "I'd be happy to help! I can assist you with:\n\n• Information about our services\n• Project inquiries\n• Technical solutions\n• Meeting scheduling\n• Company information\n\nWhat would you like to know more about?",
      "Of course! I'm here to help with anything you need. I can provide information about:\n\n• Our technology solutions\n• Company details\n• Project management\n• Consultation scheduling\n• Contact information\n\nWhat can I help you with?",
      "I'm here to assist! I can help you with:\n\n• Learning about Matex\n• Understanding our services\n• Technical information\n• Setting up meetings\n• Getting in touch\n\nWhat would you like assistance with?"
    ],
    followUp: [
      "Would you like to know about any specific service?",
      "Shall I tell you more about our expertise?",
      "Would you like to schedule a consultation?"
    ],
    context: "general_help"
  }
};

class ChatModel {
  private conversationHistory: Message[] = [];
  private contextMemory: Map<string, number> = new Map();
  private lastContext: string | null = null;

  constructor() {
    Object.values(responseCategories).forEach(category => {
      if (category.context) {
        this.contextMemory.set(category.context, 1);
      }
    });
  }

  private calculateContextScore(context: string): number {
    return this.contextMemory.get(context) || 1;
  }

  private updateContextWeights(context: string) {
    this.contextMemory.set(context, (this.contextMemory.get(context) || 1) * 1.2);
    
    this.contextMemory.forEach((weight, ctx) => {
      if (ctx !== context) {
        this.contextMemory.set(ctx, weight * 0.95);
      }
    });

    this.lastContext = context;
  }

  private findBestMatch(message: string): ResponseCategory | null {
    const lowercaseMessage = message.toLowerCase();
    let bestMatch: { category: ResponseCategory | null; score: number } = {
      category: null,
      score: 0
    };

    for (const [_, category] of Object.entries(responseCategories)) {
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

  private analyzeMessageIntent(message: string): string[] {
    const intents: string[] = [];
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

  private shouldAddFollowUp(intents: string[]): boolean {
    return intents.includes('question') || intents.includes('assistance');
  }

  public async generateResponse(message: string): Promise<string> {
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

const chatModel = new ChatModel();

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error(`HTTP method ${req.method} is not allowed`);
    }

    const { message } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const response = await chatModel.generateResponse(message);

    return new Response(
      JSON.stringify({ response }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    );
  } catch (error) {
    console.error('Error processing request:', error);

    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      {
        status: error.status || 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      },
    );
  }
});