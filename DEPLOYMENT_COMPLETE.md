# 🚀 Complete Deployment Guide - Chatbot for matexsolution.com

## ✅ Local Setup (Already Done)

Your `.env` file is configured with:
- ✅ `OPENAI_API_KEY` - Set
- ✅ `VITE_OPENAI_API_KEY` - Set  
- ✅ `OPENAI_MODEL` - Set to `gpt-4o-mini`

**To run locally:**
```bash
npm run dev:all
```

This starts:
- API server on port 8000
- Vite dev server on port 5173

## 🌐 Production Deployment on Vercel

### Step 1: Set Environment Variables in Vercel

**CRITICAL - This is required for production!**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (matexsolution.com)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add these variables one by one:

#### Variable 1:
- **Name:** `OPENAI_API_KEY`
- **Value:** `sk-proj-your-openai-api-key-here` (Get this from your `.env` file or OpenAI dashboard)
- **Environment:** Select ALL (Production, Preview, Development)
- Click **Save**

#### Variable 2 (Optional but recommended):
- **Name:** `OPENAI_MODEL`
- **Value:** `gpt-4o-mini`
- **Environment:** Select ALL (Production, Preview, Development)
- Click **Save**

### Step 2: Redeploy Your Project

**IMPORTANT:** Environment variables only take effect after redeployment!

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Click the **⋯** (three dots) on the latest deployment
4. Click **Redeploy**
5. Wait 1-2 minutes for deployment to complete

### Step 3: Verify Deployment

1. Visit **matexsolution.com**
2. Open the chatbot
3. Send a test message: "Hello, what can you do?"
4. You should get an AI response!

## 🔍 Troubleshooting

### Chatbot Not Working on Production?

#### Check 1: Environment Variables
- Go to Vercel → Settings → Environment Variables
- Verify `OPENAI_API_KEY` is set
- Verify it's set for **Production** environment
- Make sure you **redeployed** after setting it

#### Check 2: Vercel Function Logs
1. Vercel Dashboard → Your Project → **Deployments**
2. Click latest deployment → **Functions** tab
3. Click `/api/chat` → **Logs** tab
4. Look for errors

#### Check 3: Browser Console
1. Open matexsolution.com
2. Press F12 (DevTools)
3. Go to **Console** tab
4. Try sending a message
5. Look for errors

#### Check 4: Network Tab
1. Open DevTools (F12)
2. Go to **Network** tab
3. Send a message in chatbot
4. Find `/api/chat` request
5. Check:
   - Status should be **200 OK**
   - Response should have `response` field

### Common Errors:

| Error | Solution |
|-------|----------|
| "OpenAI configuration missing" | Set `OPENAI_API_KEY` in Vercel and redeploy |
| "401 Unauthorized" | API key is invalid - check if it's correct |
| "429 Rate Limit" | Too many requests - wait a few minutes |
| "Network Error" | API endpoint not deployed - check Vercel logs |

## 📝 Quick Reference

### Local Development:
```bash
# Start both servers
npm run dev:all

# Or separately:
npm run dev:api    # API server (port 8000)
npm run dev        # Frontend (port 5173)
```

### Production:
- Environment variables set in Vercel ✅
- Code deployed to Vercel ✅
- Domain: matexsolution.com ✅

## 🔐 Security Notes

- ✅ `.env` file is in `.gitignore` (not committed)
- ✅ API keys are secure in Vercel (encrypted)
- ✅ Never commit API keys to git
- ✅ Production uses Vercel environment variables

## ✨ What's Configured

- ✅ Local development server (dev-server.js)
- ✅ Production API endpoint (api/chat.ts)
- ✅ OpenAI API integration
- ✅ Error handling and fallbacks
- ✅ CORS configuration
- ✅ Rate limiting

## 🎯 Next Steps

1. **Set environment variables in Vercel** (Step 1 above)
2. **Redeploy** (Step 2 above)
3. **Test on matexsolution.com** (Step 3 above)

That's it! Your chatbot should now work both locally and in production! 🎉
