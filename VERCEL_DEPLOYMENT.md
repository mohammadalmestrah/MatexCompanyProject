# 🚀 Vercel Deployment Guide for Chatbot

## Why the Chatbot Isn't Working on Production

The chatbot on **matexsolution.com** isn't working because:

1. **Environment variables are not set in Vercel** - The API key needs to be configured in Vercel dashboard
2. **Production API code needs to be updated** - The `api/chat.ts` file has been updated to support OpenAI API
3. **New deployment needs to be triggered** - After setting environment variables, you need to redeploy

## ✅ Step-by-Step Fix

### Step 1: Set Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (matexsolution.com)
3. Go to **Settings** → **Environment Variables**
4. Add the following environment variables:

#### Required for OpenAI API:
```
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
```

#### Optional (for better configuration):
```
OPENAI_MODEL=gpt-4o-mini
VITE_OPENAI_API_KEY=sk-proj-your-openai-api-key-here
```

**Note:** Replace `sk-proj-your-openai-api-key-here` with your actual OpenAI API key from your `.env` file or OpenAI dashboard.

**Important:**
- Set these for **Production**, **Preview**, and **Development** environments
- After adding, you MUST redeploy (see Step 2)

### Step 2: Commit and Push Changes

The `api/chat.ts` file has been updated to support OpenAI API. You need to commit and push:

```bash
git add api/chat.ts
git commit -m "Update chatbot API to support OpenAI API"
git push
```

This will automatically trigger a new Vercel deployment.

### Step 3: Redeploy in Vercel (if needed)

If the automatic deployment doesn't happen:

1. Go to Vercel Dashboard → Your Project
2. Click on **Deployments** tab
3. Click **Redeploy** on the latest deployment
4. Or go to **Settings** → **Git** and click **Redeploy**

**Important:** After setting environment variables, you MUST redeploy for them to take effect!

## 🔍 Verify It's Working

1. Wait for deployment to complete (usually 1-2 minutes)
2. Visit **matexsolution.com**
3. Open the chatbot
4. Try asking a question
5. Check browser console (F12) for any errors

## 🐛 Troubleshooting

### Chatbot still not working?

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Your Project → **Deployments**
   - Click on the latest deployment
   - Click **Functions** tab
   - Check `/api/chat` function logs for errors

2. **Verify Environment Variables:**
   - Go to Settings → Environment Variables
   - Make sure `OPENAI_API_KEY` is set
   - Make sure it's set for **Production** environment

3. **Check API Response:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try sending a message in chatbot
   - Check the `/api/chat` request
   - Look at the response - it should contain a `response` field

4. **Common Issues:**
   - **401 Unauthorized**: API key is invalid or expired
   - **429 Rate Limit**: Too many requests, wait a moment
   - **500 Server Error**: Check Vercel function logs

## 📝 Notes

- Environment variables in `.env` file are for **local development only**
- For production, you MUST set them in Vercel dashboard
- After changing environment variables, always redeploy
- The API key should start with `sk-` for OpenAI API

## 🔐 Security

- Never commit `.env` file to git (it's already in `.gitignore`)
- API keys in Vercel are encrypted and secure
- Only set environment variables in Vercel dashboard, not in code
