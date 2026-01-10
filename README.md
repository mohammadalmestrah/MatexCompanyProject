<<<<<<< HEAD
Matex AI Chatbot - Development Guide

Prerequisites
- Node.js 18+ (Frontend)
- Python 3.10+ (Backend)

Setup - Frontend
1) Install deps: npm install
2) Start dev: npx vite --port 5173

Setup - Python AI Backend (FastAPI)
1) Create venv and install requirements
   - Windows PowerShell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     pip install -r server/python/requirements.txt

2) Create .env (optional for OpenAI):
   OPENAI_API_KEY=sk-...

3) Run server on 0.0.0.0:8000
   uvicorn server.python.app:app --host 0.0.0.0 --port 8000 --reload

Frontend Proxy
- Vite is configured to proxy /api to http://localhost:8000

Chat Endpoint
- POST /api/chat { message: string, session_id?: string }
- Response: { response: string, session_id: string }

Custom Email OTP (Optional)
- Backend endpoints:
  - POST /api/otp/request { email }
  - POST /api/otp/verify { email, code }
- SMTP env vars (in .env):
  - SMTP_HOST, SMTP_PORT (default 587), SMTP_USER, SMTP_PASS, SMTP_FROM
  - DEV_RETURN_OTP_IN_RESPONSE=true (dev only) returns the code in JSON
- Frontend flag:
  - VITE_USE_CUSTOM_OTP=true to use custom OTP instead of Supabase OTP

Notes
- Without OPENAI_API_KEY, a rule-based fallback responds with basic company info.
- For production: use Redis for session memory instead of in-memory storage.

Stripe Payments
- Env vars in .env:
  - STRIPE_SECRET_KEY=sk_test_...
  - STRIPE_WEBHOOK_SECRET=whsec_...
- Backend endpoints:
  - POST /api/stripe/create-checkout-session { price_id? or amount (in cents), currency?, success_url?, cancel_url? }
  - POST /api/stripe/webhook (configure in Stripe Dashboard)
- Frontend route: /pay (simple amount-based checkout)
- Test using Stripe test cards (e.g., 4242 4242 4242 4242)


=======
# Matex - Technology Solutions Company

## 🌟 Overview

Matex is a cutting-edge technology solutions company founded by Mohammad ALMESTRAH, specializing in AI, software development, and digital transformation. Our platform provides comprehensive project management, career opportunities, and client services through a modern, multilingual web application.

## 🚀 Features

### Core Functionality
- **Multilingual Support**: English, French, and Arabic with RTL support
- **Authentication System**: Secure user registration and login
- **Career Portal**: Job applications with file upload capabilities
- **Client Project Management**: Project requirements and payment processing
- **Real-time Chat**: AI-powered customer support chatbot
- **Responsive Design**: Mobile-first approach with modern UI/UX

### Technical Highlights
- **Modern React Architecture**: Built with React 18 and TypeScript
- **Real-time Database**: Supabase integration with Row Level Security
- **Payment Integration**: PayPal, Wise, and Wish Money support
- **File Storage**: Secure document upload and management
- **Edge Functions**: Serverless backend processing
- **Progressive Web App**: Optimized for performance and accessibility

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router DOM** - Client-side routing
- **i18next** - Internationalization framework
- **Lucide React** - Beautiful icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Robust relational database
- **Row Level Security (RLS)** - Database-level security
- **Edge Functions** - Serverless computing with Deno
- **Real-time Subscriptions** - Live data updates

### Development Tools
- **ESLint** - Code linting and quality
- **Vitest** - Unit testing framework
- **Testing Library** - Component testing utilities
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📁 Project Structure

```
matex-website/
├── public/                     # Static assets
│   ├── matex-logo.png         # Company logo
│   └── image.png              # Hero images
├── src/                       # Source code
│   ├── components/            # Reusable UI components
│   │   ├── Auth.tsx          # Authentication modal
│   │   ├── Chatbot.tsx       # AI chat interface
│   │   ├── Footer.tsx        # Site footer
│   │   ├── LanguageSwitcher.tsx # Language selection
│   │   └── Navbar.tsx        # Navigation header
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx   # Authentication state
│   ├── i18n/                 # Internationalization
│   │   ├── locales/          # Translation files
│   │   │   ├── en.json       # English translations
│   │   │   ├── fr.json       # French translations
│   │   │   └── ar.json       # Arabic translations
│   │   └── index.ts          # i18n configuration
│   ├── lib/                  # Utility libraries
│   │   └── supabase.ts       # Supabase client setup
│   ├── pages/                # Application pages
│   │   ├── About.tsx         # Company information
│   │   ├── Careers.tsx       # Job opportunities
│   │   ├── ClientRequirements.tsx # Project submission
│   │   ├── Clients.tsx       # Client showcase
│   │   ├── Home.tsx          # Landing page
│   │   ├── Privacy.tsx       # Privacy policy
│   │   ├── Services.tsx      # Service offerings
│   │   └── Terms.tsx         # Terms of service
│   ├── __tests__/            # Test files
│   └── App.tsx               # Main application component
├── supabase/                 # Supabase configuration
│   ├── functions/            # Edge functions
│   │   └── chat/             # Chatbot API
│   └── migrations/           # Database migrations
├── server/                   # Node.js server (alternative)
│   ├── models/               # Data models
│   ├── data/                 # Static data
│   └── __tests__/            # Server tests
└── package.json              # Dependencies and scripts
```

## 🗄️ Database Schema

### Core Tables

#### Users Management
- **users** - Extended user profiles
- **user_settings** - User preferences and configuration
- **user_sessions** - Session tracking and management
- **user_roles** - Role-based access control

#### Application Data
- **job_applications** - Career application submissions
- **client_projects** - Client project requirements and tracking

### Security Features
- **Row Level Security (RLS)** enabled on all tables
- **Admin access policies** for @matex.com email domains
- **User isolation** ensuring data privacy
- **Secure file storage** with access controls

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Supabase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/matex-website.git
   cd matex-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
   ```

4. **Database Setup**
   Run the Supabase migrations:
   ```bash
   # Ensure Supabase CLI is installed
   npx supabase db reset
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in UI mode
npm run test:ui
```

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 🌐 Internationalization

The application supports three languages:

- **English (en)** - Default language
- **French (fr)** - Complete translation
- **Arabic (ar)** - RTL support with full translation

### Adding New Languages

1. Create a new translation file in `src/i18n/locales/`
2. Add the language to the `supportedLngs` array in `src/i18n/index.ts`
3. Update the language switcher component

## 🔐 Authentication & Security

### Authentication Flow
- Email/password authentication via Supabase Auth
- Secure session management
- Automatic token refresh
- Protected routes and components

### Security Measures
- Row Level Security (RLS) policies
- Input validation and sanitization
- Secure file upload with type restrictions
- CORS protection
- Environment variable protection

## 💼 Business Features

### Career Management
- **Job Listings**: Dynamic job and internship postings
- **Application System**: Complete application workflow
- **File Management**: Resume and cover letter uploads
- **Admin Dashboard**: Application review and management

### Client Services
- **Project Submission**: Multi-step project requirement form
- **Payment Integration**: Multiple payment methods
- **Project Tracking**: Status and progress monitoring
- **Communication**: Direct client-company interaction

### Customer Support
- **AI Chatbot**: Intelligent customer service
- **Multi-language Support**: Localized assistance
- **Real-time Responses**: Instant query resolution

## 🎨 Design System

### Color Palette
- **Primary**: Indigo shades (#4F46E5 - #312E81)
- **Secondary**: Gray shades (#64748B - #0F172A)
- **Accent**: Custom brand colors
- **Status**: Success, warning, error indicators

### Typography
- **Headings**: Bold, hierarchical sizing
- **Body Text**: Readable, accessible fonts
- **Code**: Monospace for technical content

### Components
- **Consistent Spacing**: 8px grid system
- **Responsive Breakpoints**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance
- **Animations**: Smooth, purposeful transitions

## 📊 Performance

### Optimization Features
- **Code Splitting**: Lazy-loaded routes
- **Image Optimization**: WebP format support
- **Bundle Analysis**: Optimized asset delivery
- **Caching Strategy**: Efficient resource caching

### Metrics
- **Lighthouse Score**: 90+ across all categories
- **Core Web Vitals**: Optimized for user experience
- **Bundle Size**: Minimized JavaScript payload

## 🧪 Testing Strategy

### Test Coverage
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API and database testing
- **E2E Tests**: User workflow validation
- **Accessibility Tests**: Screen reader compatibility

### Testing Tools
- **Vitest**: Fast unit test runner
- **Testing Library**: Component testing utilities
- **MSW**: API mocking for tests
- **Axe**: Accessibility testing

## 🚀 Deployment

### Production Deployment
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to hosting platform**
   - Netlify (recommended)
   - Vercel
   - AWS S3 + CloudFront
   - Custom server

3. **Environment Configuration**
   - Set production environment variables
   - Configure domain and SSL
   - Set up monitoring and analytics

### CI/CD Pipeline
- **GitHub Actions**: Automated testing and deployment
- **Quality Gates**: Code quality and security checks
- **Staging Environment**: Pre-production testing

## 📈 Analytics & Monitoring

### Performance Monitoring
- **Real User Monitoring (RUM)**: User experience tracking
- **Error Tracking**: Automated error reporting
- **Performance Metrics**: Core Web Vitals monitoring

### Business Analytics
- **User Engagement**: Page views and interactions
- **Conversion Tracking**: Application and inquiry rates
- **A/B Testing**: Feature and design optimization

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

## 📞 Support & Contact

### Technical Support
- **Email**: tech@matex.com
- **Documentation**: [docs.matex.com](https://docs.matex.com)
- **GitHub Issues**: Bug reports and feature requests

### Business Inquiries
- **Email**: contact@matex.com
- **Phone**: +1 (234) 567-890
- **Address**: Baabda, Mount Lebanon, Lebanon

### Social Media
- **LinkedIn**: [Matex Company](https://www.linkedin.com/company/103787906)
- **Instagram**: [@matex.leb](https://www.instagram.com/matex.leb)

## 📄 License

This project is proprietary software owned by Matex. All rights reserved.

## 🙏 Acknowledgments

- **Mohammad ALMESTRAH** - Founder and CEO
- **Development Team** - Technical implementation
- **Design Team** - User experience and interface design
- **Open Source Community** - Tools and libraries used

---

**Built with ❤️ by the Matex Team**

*Transforming businesses through innovative technology solutions*
>>>>>>> 001752de9a00176a24dc6708dc4f166af42040c5
# MatexCompanyProject
