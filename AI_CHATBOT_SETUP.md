# 🤖 AI Chatbot Setup Guide - ChatGPT-like Experience

This guide will help you set up the enhanced AI chatbot for Matex that works like ChatGPT.

## ✨ Features

- **ChatGPT-like Intelligence**: Uses OpenAI GPT models for natural, contextual conversations
- **Conversation Memory**: Maintains context across multiple messages
- **Streaming Responses**: Real-time typing effect (optional)
- **Smart Fallback**: Automatically falls back to pattern matching if API is unavailable
- **Multi-language Support**: Works with English, French, and Arabic
- **Company Knowledge**: Trained on Matex services and information

## 🚀 Quick Setup

### Step 1: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy your API key (you'll only see it once!)

### Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your OpenAI API key:
   ```env
   VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
   VITE_ENABLE_STREAMING=true
   ```

### Step 3: Restart Development Server

```bash
npm run dev
```

The chatbot will now use AI-powered responses!

## 📋 Configuration Options

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_OPENAI_API_KEY` | Your OpenAI API key | Yes (for AI mode) | - |
| `VITE_ENABLE_STREAMING` | Enable streaming responses | No | `false` |
| `VITE_API_BASE` | Custom API base URL | No | - |

### Model Options

The chatbot uses `gpt-3.5-turbo` by default. You can change this in `src/services/aiChatbot.ts`:

```typescript
const aiChatbot = new AIChatbot({
  model: 'gpt-4', // or 'gpt-3.5-turbo'
  temperature: 0.7, // 0-1, higher = more creative
  maxTokens: 500 // Maximum response length
});
```

## 🎯 How It Works

### AI Mode (with OpenAI API)

When `VITE_OPENAI_API_KEY` is set:
- Uses OpenAI GPT models for intelligent responses
- Maintains conversation context
- Provides natural, human-like answers
- Supports complex questions and follow-ups

### Fallback Mode (without API key)

When API key is not set:
- Uses smart pattern matching
- Still provides helpful responses
- Works offline
- No API costs

## 💡 Usage Examples

### Basic Usage

The chatbot automatically detects if OpenAI is configured and uses it. No code changes needed!

### Custom Configuration

```typescript
import AIChatbot from './services/aiChatbot';

const chatbot = new AIChatbot({
  apiKey: 'your-key',
  model: 'gpt-4',
  temperature: 0.8,
  maxTokens: 1000
});

const response = await chatbot.chat('Tell me about Matex services');
```

### Streaming Responses

```typescript
await chatbot.chatStream('Your question', (chunk) => {
  console.log('Received:', chunk);
  // Update UI with streaming text
});
```

## 🔒 Security Notes

1. **Never commit `.env` file** - It contains your API key
2. **Add `.env` to `.gitignore`** - Already included
3. **Use environment variables** - Don't hardcode API keys
4. **Monitor API usage** - Set usage limits in OpenAI dashboard

## 💰 Cost Considerations

- **GPT-3.5-turbo**: ~$0.002 per 1K tokens (very affordable)
- **GPT-4**: ~$0.03 per 1K tokens (more expensive, better quality)
- **Free tier**: OpenAI offers $5 free credit for new users

## 🐛 Troubleshooting

### Chatbot not using AI

1. Check if `VITE_OPENAI_API_KEY` is set in `.env`
2. Restart the dev server after adding the key
3. Check browser console for errors

### API Errors

- **401 Unauthorized**: Invalid API key
- **429 Rate Limit**: Too many requests, wait a moment
- **500 Server Error**: OpenAI service issue, will fallback automatically

### Streaming not working

- Ensure `VITE_ENABLE_STREAMING=true` in `.env`
- Check browser console for errors
- Streaming requires a valid API key

## 📚 Advanced Features

### Conversation History

The chatbot maintains conversation context automatically:

```typescript
const history = chatbot.getConversationHistory();
console.log(history); // Array of messages
```

### Clear History

```typescript
chatbot.clearHistory(); // Reset conversation
```

### Custom System Prompt

Modify the system prompt in `src/services/aiChatbot.ts` to customize the assistant's behavior.

## 🎨 UI Features

- **AI Indicator**: Green sparkle icon when AI mode is active
- **Streaming Animation**: Animated dots during streaming
- **Loading States**: Smooth loading indicators
- **Error Handling**: Graceful fallback to pattern matching

## 📞 Support

For issues or questions:
- Email: almestrahmohammad@gmail.com
- Check OpenAI documentation: https://platform.openai.com/docs

---

**Enjoy your ChatGPT-like AI assistant! 🚀**

