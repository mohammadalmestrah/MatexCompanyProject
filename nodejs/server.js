import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ChatModel } from './models/ChatModel.js';
import { responseCategories } from './data/responseCategories.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const chatModel = new ChatModel(responseCategories);

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await chatModel.generateResponse(message);
    res.json({ response });
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});