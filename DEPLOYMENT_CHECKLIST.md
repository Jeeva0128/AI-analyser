# ✅ DEPLOYMENT CHECKLIST - AI Resume Analyzer

Use this checklist to track your deployment progress!

---

## Phase 1️⃣: Prerequisites (15 minutes)

- [ ] **GitHub Account**
  - Go to https://github.com/signup
  - Create free account
  - Verify email

- [ ] **Render Account**  
  - Go to https://render.com
  - Click "Get Started"
  - Sign up with GitHub (easier!) or email

- [ ] **Gemini API Key**
  - Read [GEMINI_API_SETUP.md](GEMINI_API_SETUP.md)
  - Create Google Cloud project
  - Enable Generative Language API
  - Create API key
  - ⚠️ **SAVE YOUR API KEY SOMEWHERE SAFE** ⚠️

---

## Phase 2️⃣: Push Code to GitHub (10 minutes)

### Create GitHub Repository
- [ ] Go to https://github.com/new
- [ ] Repository name: `ai-resume-analyzer`
- [ ] Make it **PUBLIC** (important for Render!)
- [ ] Click "Create repository"
- [ ] Copy the HTTPS URL (e.g., `https://github.com/YOUR_USERNAME/ai-resume-analyzer.git`)

### Push Your Code
- [ ] Open **PowerShell** in your project folder
- [ ] Run these commands **one by one**:

```powershell
# Check git is installed
git --version

# Initialize git repo
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: AI Resume Analyzer"

# Rename branch to main (if needed)
git branch -M main

# Add GitHub remote (replace YOUR_GITHUB_URL)
git remote add origin YOUR_GITHUB_URL

# Push to GitHub
git push -u origin main
```

- [ ] Go to your GitHub repo URL in browser
- [ ] Verify all files are there

---

## Phase 3️⃣: Deploy Backend on Render (10 minutes)

- [ ] Go to https://dashboard.render.com
- [ ] Click **"New +"** → **"Web Service"**
- [ ] Click **"Connect Repository"**
- [ ] Select your `ai-resume-analyzer` repo
- [ ] Fill in:
  - **Name:** `ai-resume-analyzer-backend`
  - **Branch:** `main`
  - **Root Directory:** `backend`
  - **Environment:** `Node`
  - **Build Command:** `npm install`
  - **Start Command:** `npm start`
  - **Plan:** Select `Free`

- [ ] Click **"Advanced"** and add these Environment Variables:
  ```
  GEMINI_API_KEY = [your API key from Phase 1]
  NODE_ENV = production
  PORT = 5000
  ```

- [ ] Click **"Create Web Service"**
- [ ] Wait 3-5 minutes for deployment
- [ ] Copy the backend URL (e.g., `https://ai-resume-analyzer-backend.onrender.com`)
- [ ] Test it works: Visit `https://your-backend-url.onrender.com/api/health`
  - Should show: `{"status":"ok"}`

---

## Phase 4️⃣: Deploy Frontend on Render (10 minutes)

- [ ] Go to https://dashboard.render.com
- [ ] Click **"New +"** → **"Web Service"**
- [ ] Click **"Connect Repository"**
- [ ] Select your `ai-resume-analyzer` repo
- [ ] Fill in:
  - **Name:** `ai-resume-analyzer-frontend`
  - **Branch:** `main`
  - **Root Directory:** (leave empty)
  - **Environment:** `Node`
  - **Build Command:** `npm install && npm run build`
  - **Start Command:** `npm start`
  - **Plan:** Select `Free`

- [ ] Click **"Advanced"** and add these Environment Variables:
  ```
  VITE_API_URL = https://your-backend-url.onrender.com/api
  NODE_ENV = production
  ```
  (Replace `your-backend-url` with the actual Render backend URL from Phase 3)

- [ ] Click **"Create Web Service"**
- [ ] Wait 5-10 minutes for build and deployment
- [ ] Once deployed, your frontend URL will be shown
- [ ] Click the URL to test it!

---

## Phase 5️⃣: Verify Everything Works (5 minutes)

- [ ] Open your frontend URL in browser
- [ ] You should see the Resume Analyzer app
- [ ] Try uploading a test resume (PDF)
- [ ] Check browser console for errors (F12 key)
- [ ] If you see errors:
  - [ ] Check Render logs for both services
  - [ ] Verify environment variables are correct
  - [ ] See troubleshooting in [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)

---

## Phase 6️⃣: Optional - Add Custom Domain (15 minutes)

- [ ] Get a domain:
  - Free: [Freenom.com](https://freenom.com)
  - Cheap: [Namecheap.com](https://namecheap.com)
  
- [ ] In Render Dashboard, go to your **frontend service**
- [ ] Click **"Settings"** → **"Custom Domain"**
- [ ] Add your domain name
- [ ] Copy the DNS records Render shows
- [ ] Go to your domain provider and update DNS
- [ ] Wait 24-48 hours for DNS to propagate
- [ ] Your custom domain will work automatically with HTTPS!

---

## 🎉 Deployment Complete!

### What You Now Have
✅ Production API server running on Render  
✅ Production web app running on Render  
✅ Free hosting (Render free tier)  
✅ Free SSL/HTTPS certificate (Render manages it)  
✅ Automatic deployments from GitHub (optional)  
✅ Health monitoring (Render checks status every 30 seconds)  

### Verify It's Working
- [ ] Render Dashboard shows both services as "Running" (green)
- [ ] Frontend URL loads your app
- [ ] Upload and analyze a resume works end-to-end
- [ ] No CORS errors in browser console

### Monitor Going Forward
- [ ] Check [Google Cloud Console](https://console.cloud.google.com) weekly for API usage
- [ ] Watch the Render dashboard for any red status indicators
- [ ] Check logs if users report issues

---

## ❓ Troubleshooting

### Service stuck in "Deploying"?
- [ ] Check logs (click service → "Logs" tab)
- [ ] Common causes: npm install fails, missing files, syntax errors
- [ ] Solution: Check logs, fix error, commit to GitHub, Render auto-redeploys

### CORS errors in browser?
- [ ] Backend URL in frontend env var is wrong
- [ ] Solution: 
  1. Get correct backend URL from Render
  2. Update VITE_API_URL in frontend service settings
  3. Click "Manual Deploy" or commit to GitHub to redeploy

### API key errors?
- [ ] Wrong API key or key missing
- [ ] Solution:
  1. Go to Google Cloud Console
  2. Copy correct API key
  3. Update GEMINI_API_KEY in backend service settings
  4. Redeploy backend

### Still having issues?
- [ ] Check [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) - detailed troubleshooting
- [ ] Check [DOCKER_GUIDE.md](DOCKER_GUIDE.md) - test locally first
- [ ] Visit [Render Support](https://render.com/docs)

---

## 🚀 Share With the World!

Once everything is working:
- [ ] Send your frontend URL to friends
- [ ] Test with real resumes
- [ ] Monitor performance
- [ ] Iterate based on feedback

**Your app is live! 🎉**

---

**Need help?** Read the detailed guides:
- [DEPLOYMENT_START.md](DEPLOYMENT_START.md) - Overview
- [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) - Step-by-step with screenshots
- [GEMINI_API_SETUP.md](GEMINI_API_SETUP.md) - Get your API key
