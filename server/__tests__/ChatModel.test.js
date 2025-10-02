import { describe, it, expect, beforeEach } from 'vitest';
import { ChatModel } from '../models/ChatModel.js';

describe('ChatModel', () => {
  let chatModel;
  const mockResponseCategories = {
    help: {
      keywords: ['help', 'assist'],
      responses: ['I can help you!'],
      followUp: ['Need anything else?'],
      context: 'help_context'
    },
    greeting: {
      keywords: ['hello', 'hi'],
      responses: ['Hello!'],
      context: 'greeting_context'
    }
  };

  beforeEach(() => {
    chatModel = new ChatModel(mockResponseCategories);
  });

  describe('analyzeMessageIntent', () => {
    it('identifies question intent', () => {
      const intents = chatModel.analyzeMessageIntent('What is your service?');
      expect(intents).toContain('question');
    });

    it('identifies assistance intent', () => {
      const intents = chatModel.analyzeMessageIntent('I need help');
      expect(intents).toContain('assistance');
    });
  });

  describe('findBestMatch', () => {
    it('finds matching category based on keywords', () => {
      const match = chatModel.findBestMatch('I need help with something');
      expect(match).toBe(mockResponseCategories.help);
    });

    it('returns null when no match is found', () => {
      const match = chatModel.findBestMatch('random text');
      expect(match).toBeNull();
    });
  });

  describe('generateResponse', () => {
    it('generates response for matching category', async () => {
      const response = await chatModel.generateResponse('help me');
      expect(response).toMatch(/I can help you!/);
    });

    it('includes follow-up for questions', async () => {
      const response = await chatModel.generateResponse('what help do you offer?');
      expect(response).toContain('I can help you!');
      expect(response).toContain('Need anything else?');
    });

    it('returns fallback response when no match found', async () => {
      const response = await chatModel.generateResponse('completely random text');
      expect(response).toContain("I understand you're asking about that");
    });
  });

  describe('contextMemory', () => {
    it('updates context weights after matching', async () => {
      await chatModel.generateResponse('help me');
      const helpContextScore = chatModel.calculateContextScore('help_context');
      expect(helpContextScore).toBeGreaterThan(1);
    });

    it('maintains last context', async () => {
      await chatModel.generateResponse('help me');
      expect(chatModel.lastContext).toBe('help_context');
    });
  });
});