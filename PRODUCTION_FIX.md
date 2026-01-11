# 🔧 Production Chatbot Fix Guide

## Problem: Chatbot Works Locally But Not on Production Domain

If the chatbot works locally but not on **matexsolution.com**, follow these steps:

## ✅ Step 1: Set Environment Variables in Vercel (CRITICAL)

**This is the most common issue!**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

### Required:
```
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
```

**Note:** Replace `sk-proj-your-openai-api-key-here` with your actual OpenAI API key from your `.env` file or OpenAI dashboard.

### Optional:
```
OPENAI_MODEL=gpt-4o-mini
```

**IMPORTANT:**
- ✅ Select **ALL environments**: Production, Preview, Development
- ✅ After adding, you MUST redeploy (see Step 2)

## ✅ Step 2: Redeploy in Vercel

**Environment variables only take effect after redeployment!**

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Click the **⋯** (three dots) on the latest deployment
4. Click **Redeploy**
5. Wait for deployment to complete (1-2 minutes)

## ✅ Step 3: Test the API Endpoint

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try sending a message in the chatbot
4. Look for `/api/chat` request
5. Check the response:
   - ✅ **200 OK** with `response` field = Working!
   - ❌ **500 Error** = Check Vercel logs (see Step 4)
   - ❌ **Network Error** = API not deployed correctly

## ✅ Step 4: Check Vercel Function Logs

If still not working:

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** tab
3. Click on the latest deployment
4. Click **Functions** tab
5. Click on `/api/chat` function
6. Check **Logs** tab for errors

### Common Errors:

#### Error: "OpenAI configuration missing"
**Solution:** Environment variable `OPENAI_API_KEY` is not set in Vercel

#### Error: "401 Unauthorized"
**Solution:** API key is invalid or expired. Get a new key from OpenAI

#### Error: "429 Rate Limit"
**Solution:** Too many requests. Wait a few minutes and try again

## ✅ Step 5: Verify Environment Variables

Double-check in Vercel:

1. Settings → Environment Variables
2. Make sure `OPENAI_API_KEY` exists
3. Make sure it's set for **Production** environment
4. The value should start with `sk-proj-`

## 🔍 Debugging Checklist

- [ ] Environment variable `OPENAI_API_KEY` is set in Vercel
- [ ] Environment variable is set for **Production** environment
- [ ] Project has been **redeployed** after setting environment variables
- [ ] Deployment completed successfully (check Deployments tab)
- [ ] Browser console shows no errors (F12 → Console)
- [ ] Network tab shows `/api/chat` request (F12 → Network)
- [ ] Vercel function logs show no errors (Deployments → Functions → Logs)

## 🚨 Quick Fix Commands

If you have Vercel CLI installed:

```bash
# Set environment variable
vercel env add OPENAI_API_KEY production

# Redeploy
vercel --prod
```

## 📞 Still Not Working?

1. **Check Vercel Logs** - Most errors will show here
2. **Check Browser Console** - Look for JavaScript errors
3. **Test API Directly** - Use curl or Postman to test `/api/chat`
4. **Verify Domain** - Make sure you're testing on the correct domain

## 💡 Pro Tips

- Environment variables in `.env` file are **ONLY for local development**
- Production uses environment variables from **Vercel Dashboard**
- Always redeploy after changing environment variables
- Check Vercel logs first - they usually show the exact error
