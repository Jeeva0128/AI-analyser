# 🚀 Render Deployment Guide - AI Resume Analyzer

## Prerequisites Checklist
- [ ] GitHub account (free)
- [ ] Render.com account (free)
- [ ] Gemini API Key
- [ ] Your code pushed to GitHub

---

## Step 1: Push Code to GitHub

### 1.1 Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "+" → "New repository"
3. Name it: `ai-resume-analyzer`
4. Choose **Public** (so Render can access it)
5. Click "Create repository"

### 1.2 Initialize Git Locally & Push Code

```powershell
cd "c:\Users\jeeva\OneDrive\Documents\AI reusme analyser"

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: AI Resume Analyzer"
git branch -M main

# Add your GitHub URL (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/ai-resume-analyzer.git

# Push to GitHub
git push -u origin main
```

**Verify:** Visit `https://github.com/YOUR_USERNAME/ai-resume-analyzer` and confirm files are there.

---

## Step 2: Create Backend Service on Render

### 2.1 Deploy Backend
1. Go to [**Render.com**](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Select **"Connect a repository"** → Choose your `ai-resume-analyzer` repo
4. Fill in details:
   - **Name:** `ai-resume-analyzer-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Plan:** `Free` (or Paid for production)
5. Click **"Advanced"** and add environment variables:
   - `GEMINI_API_KEY` → Your Gemini API key
   - `NODE_ENV` → `production`
   - `PORT` → `5000`
6. Click **"Create Web Service"**
7. Wait for deployment (takes 2-5 minutes)
8. **Copy the Backend URL** (e.g., `https://ai-resume-analyzer-backend.onrender.com`)

### 2.2 Verify Backend is Running
In your browser, visit:
```
https://your-backend-url.onrender.com/api/health
```
Should return: `{"status":"ok"}`

---

## Step 3: Create Frontend Service on Render

### 3.1 Deploy Frontend
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Select **same repository** (`ai-resume-analyzer`)
4. Fill in details:
   - **Name:** `ai-resume-analyzer-frontend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Publish Directory:** `dist`
5. Click **"Advanced"** and add environment variables:
   - `VITE_API_URL` → `https://your-backend-url.onrender.com/api` (use the Backend URL from Step 2.2)
   - `NODE_ENV` → `production`
6. Click **"Create Web Service"**
7. Wait for deployment (takes 3-5 minutes)
8. Your frontend will be live at something like: `https://ai-resume-analyzer-frontend.onrender.com`

---

## Step 4: Update Backend CORS for Frontend

Update the backend CORS configuration to include your frontend URL:

1. Open `backend/server.js`
2. Find the CORS section and add your frontend URL:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://your-frontend-url.onrender.com', // Add this
  process.env.FRONTEND_URL
].filter(Boolean);
```

3. Commit and push:
```powershell
git add backend/server.js
git commit -m "Update CORS for Render frontend deployment"
git push
```

4. Render will **auto-redeploy** from GitHub

---

## Step 5: Get a Custom Domain (Optional)

### 5.1 Get a Free Domain
Free domain options:
- [Freenom.com](https://www.freenom.com) - Free .tk, .ml domains
- [dot.tk](https://www.dot.tk) - Free .tk domains
- Or buy a cheap domain: [Namecheap](https://www.namecheap.com), [GoDaddy](https://godaddy.com)

### 5.2 Connect Domain to Render
1. In Render Dashboard, go to your **Frontend service**
2. Click **"Settings"** → **"Custom Domain"**
3. Add your domain: `yourdomain.com` or `www.yourdomain.com`
4. Render will show you DNS records to add
5. Go to your domain registrar and update DNS to point to Render
6. Wait 24-48 hours for DNS propagation
7. Render automatically provisions SSL (HTTPS)

---

## Step 6: Monitor & Troubleshoot

### Check Logs
- **Backend logs:** Render Dashboard → Backend service → "Logs"
- **Frontend logs:** Render Dashboard → Frontend service → "Logs"

### Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot POST /api/analyze" | Backend URL in frontend .env is wrong. Redeploy frontend after updating VITE_API_URL |
| "CORS error" | Add frontend URL to backend allowedOrigins. Commit, push, auto-redeploy |
| "Gemini API error" | Check GEMINI_API_KEY is correct. Verify quota in Google Cloud Console |
| "Service keeps crashing" | Check logs for errors. May be missing dependencies |

### Restart Services
If stuck, restart from Render Dashboard:
1. Go to service
2. Click **"Settings"** → **"Restart"**

---

## Step 7: Performance Optimization (Optional)

### Caching Static Assets
Render automatically caches your frontend assets. No additional setup needed.

### Rate Limiting
Already configured in backend (`rateLimit` middleware).

---

## ✅ Final Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed on Render
- [ ] Backend health check responds with success
- [ ] Frontend deployed on Render  
- [ ] Frontend can communicate with backend
- [ ] No CORS errors in browser console
- [ ] Upload and analyze resume works end-to-end
- [ ] Consider custom domain setup
- [ ] Set up monitoring/alerts (optional)

---

## Support & Resources

- **Render Docs:** https://render.com/docs
- **GitHub Push Help:** https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository
- **Troubleshooting:** Check service logs in Render Dashboard

---

**Need Help?** Reply with your Render dashboard URL and I can help troubleshoot!
