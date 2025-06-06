import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { ChatModel } from '../models/ChatModel.js';
import { responseCategories } from '../data/responseCategories.js';

describe('API Endpoints', () => {
  let app;
  let server;

  beforeAll(() => {
    app = express();
    app.use(cors());
    app.use(express.json());

    const chatModel = new ChatModel(responseCategories);

    app.post('/api/chat', async (req, res) => {
      try {
        const { message } = req.body;
        if (!message) {
          return res.status(400).json({ error: 'Message is required' });
        }
        const response = await chatModel.generateResponse(message);
        res.json({ response });
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    server = app.listen(3001);
  });

  afterAll(() => {
    server.close();
  });

  describe('POST /api/chat', () => {
    it('responds with chat message', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({ message: 'help' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('response');
      expect(typeof response.body.response).toBe('string');
    });

    it('handles missing message', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Message is required');
    });

    it('handles invalid requests', async () => {
      await request(app)
        .get('/api/chat')
        .expect(404);
    });
  });
});