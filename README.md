# Matex - Technology Solutions Company

## 🌟 Overview

Matex is a cutting-edge technology solutions company founded by Mohammad ALMESTRAH, specializing in AI, software development, and digital transformation. Our platform provides comprehensive project management, career opportunities, and client services through a modern, multilingual web application.

## 🚀 Features

### Core Functionality
- **Multilingual Support**: English, French, and Arabic with RTL support
- **Authentication System**: Secure user registration and login
- **Career Portal**: Job applications with file upload capabilities
- **Client Project Management**: Project requirements and payment processing
- **AI-Powered Chatbot**: Intelligent assistant powered by GPT-4.1
- **Responsive Design**: Mobile-first approach with modern UI/UX

### AI Chatbot Features
- **General Knowledge**: Can answer questions on any topic (technology, science, history, etc.)
- **Company Information**: Provides details about Matex services, team, and contact info
- **Programming Help**: Assists with coding questions and technical problems
- **Multi-language Support**: Responds in English, French, and Arabic
- **Safety Guardrails**: Built-in content filtering and usage guidelines
- **Rate Limiting**: Protection against abuse
- **Secure API**: Server-side API key handling (keys never exposed to browser)

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router DOM** - Client-side routing
- **i18next** - Internationalization framework

### Backend & Database
- **Vercel Serverless Functions** - API endpoints
- **Azure OpenAI (GPT-4.1)** - AI chatbot engine
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Robust relational database

## 📁 Project Structure

```
matex-website/
├── api/                      # Vercel Serverless Functions
│   └── chat.ts              # AI Chatbot API endpoint
├── public/                   # Static assets
├── src/
│   ├── components/
│   │   ├── Chatbot.tsx      # AI Chat interface
│   │   ├── Auth.tsx         # Authentication modal
│   │   └── ...
│   ├── services/
│   │   ├── aiChatbot.ts     # AI chatbot client service
│   │   ├── mlChatbot.ts     # ML fallback service
│   │   └── localChatbot.ts  # Local fallback service
│   ├── i18n/                # Translations
│   ├── pages/               # Application pages
│   └── App.tsx
├── vercel.json              # Vercel configuration
└── package.json
```

## 🤖 AI Chatbot Setup

### Environment Variables

Set these in your Vercel dashboard (Settings → Environment Variables):

```env
# Azure OpenAI Configuration (Required for AI features)
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_OPENAI_CHATGPT_DEPLOYMENT=gpt-4.1
AZURE_OPENAI_CHATGPT_MODEL=gpt-4.1
AZURE_OPENAI_API_VERSION=2025-01-01-preview

# Optional: Supabase (for database features)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### API Endpoint

**POST /api/chat**

Request:
```json
{
  "message": "What is machine learning?",
  "conversationHistory": [],
  "sessionId": "optional_session_id"
}
```

Response:
```json
{
  "response": "Machine Learning is a subset of AI...",
  "sessionId": "session_123",
  "model": "gpt-4.1"
}
```

### Safety Features

1. **Rate Limiting**: 20 requests per minute per IP
2. **Content Filtering**: Blocks harmful/illegal content requests
3. **Message Sanitization**: Removes control characters, limits length
4. **Fallback System**: Graceful degradation when API is unavailable

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohammadalmestrah/MatexCompanyProject.git
   cd MatexCompanyProject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   Open [http://localhost:5173](http://localhost:5173) in your browser

### Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage
```

### Building for Production

```bash
npm run build
npm run preview
```

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Set these in your Vercel dashboard:
- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_CHATGPT_DEPLOYMENT`
- `AZURE_OPENAI_API_VERSION`

## 🔐 Security

- API keys are stored server-side only (never exposed to browser)
- Rate limiting prevents abuse
- Content filtering blocks harmful requests
- CORS configured for allowed origins
- Input sanitization on all user inputs

## 📞 Support & Contact

- **Email**: contact@matexsolution.com
- **Phone**: +961 76162549
- **Location**: Baabda, Mount Lebanon, Lebanon
- **LinkedIn**: [Matex Company](https://www.linkedin.com/company/103787906)
- **Instagram**: [@matex.leb](https://www.instagram.com/matex.leb)

## 📄 License

This project is proprietary software owned by Matex. All rights reserved.

---

**Built with ❤️ by the Matex Team**

*Transforming businesses through innovative technology solutions*
