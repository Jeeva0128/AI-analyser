# 🔑 Gemini API Setup - Required for Deployment

## Get Your Gemini API Key

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account (create one if needed)
3. Click the project dropdown at the top
4. Click **"NEW PROJECT"**
5. Enter name: `AI Resume Analyzer`
6. Click **"CREATE"**
7. Wait for project creation (takes a few seconds)

### Step 2: Enable Generative AI API
1. In the Cloud Console, search for: **"Generative Language API"**
2. Click on it
3. Click **"ENABLE"** button
4. Wait for it to enable

### Step 3: Create API Key
1. Go to [API Keys](https://console.cloud.google.com/apis/credentials)
2. Click **"+ CREATE CREDENTIALS"** → **"API Key"**
3. Your API key will appear in a popup (e.g., `AIzaSy...`)
4. Click the **copy icon** to copy it
5. **SAVE THIS KEY - you'll need it for both backend and frontend**

### Step 4: Understand Usage Limits (Important!)

**Gemini API Free Tier Limits:**
- **Rate Limit:** 60 requests per minute
- **Daily Limit:** 1,500 requests per day (no file uploads limit mentioned in free tier)
- **Cost:** Free! (As long as within limits)

**What happens if you exceed limits?**
- Request will fail with 429 error (Too Many Requests)
- Your application shows friendly error message to user
- No auto-charges (stays free)

**Check Your Usage:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Generative Language API**
3. Click **"QUOTAS"** tab to see current usage

### Step 5: Increase Limits (Optional - Requires Payment Method)
If you need more than free tier:
1. Click **"Edit Quotas"** in the Quotas tab
2. Request higher limit
3. Google will require billing info
4. You only pay for what you use beyond free tier

---

## Security Best Practices

✅ **DO:**
- Keep API key in `.env` file (never commit to git)
- Use different keys for development and production
- Regenerate keys periodically
- Monitor usage in Google Cloud Console

❌ **DON'T:**
- Put API key in frontend code (use backend only)
- Share API key publicly
- Commit `.env` to GitHub
- Disable rate limiting

---

## For Your Deployment

1. **Keep your API key secret** - only in Render environment variables
2. **Monitor usage** - especially first week
3. **Set up alerts** - Go to Google Cloud → Quotas → set alerts

---

**Next Step:** Copy your API key and follow the RENDER_DEPLOYMENT.md guide to deploy!
