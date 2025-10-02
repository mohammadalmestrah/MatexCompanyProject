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


