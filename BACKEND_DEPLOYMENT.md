# Backend Environment Configuration

## Local Development
```bash
# Copy this to backend/.env
NODE_ENV=development
PORT=5000
GEMINI_API_KEY=your_api_key_here
FRONTEND_URL=http://localhost:5173
```

## Production (Railway Example)
```bash
# Set these in Railway dashboard
NODE_ENV=production
PORT=5000
GEMINI_API_KEY=your_api_key_here
FRONTEND_URL=https://ai-analyser-nu.vercel.app
```

## Production (Render Example)
```bash
NODE_ENV=production
PORT=5000
GEMINI_API_KEY=your_api_key_here
FRONTEND_URL=https://ai-analyser-nu.vercel.app
```

## How CORS Works

The backend now allows:
- `http://localhost:5173` (local dev)
- `http://localhost:5174` (local dev)
- `http://localhost:5175` (local dev)
- `http://localhost:3000` (local dev)
- `https://ai-analyser-nu.vercel.app` (your Vercel frontend)
- Any URL in `FRONTEND_URL` environment variable

---

## 🚀 Quick Deploy to Railway

### Step 1: Connect Repository
```bash
# Log in to Railway
npm install -g @railway/cli
railway login

# Connect your project
cd backend
railway link  # Select your project
```

### Step 2: Set Environment Variables
```bash
railway variables set NODE_ENV=production
railway variables set GEMINI_API_KEY=your_api_key
railway variables set FRONTEND_URL=https://ai-analyser-nu.vercel.app
```

### Step 3: Deploy
```bash
railway up
```

### Step 4: Get Public URL
```bash
railway domains
# Returns something like: api-backend-production.up.railway.app
```

### Step 5: Update Frontend
Update `src/sections/UploadSection.tsx`:
```tsx
const API_URL = import.meta.env.VITE_API_URL || 'https://api-backend-production.up.railway.app/api';
```

Or via environment variable:
```bash
# .env.production
VITE_API_URL=https://api-backend-production.up.railway.app/api
```

---

## 🔧 Alternative: Use Render.com

### Step 1: Push to GitHub
Make sure your code is on GitHub

### Step 2: Create Render Service
1. Go to render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `backend` directory as the root directory
5. Set build command: `npm install`
6. Set start command: `npm start`
7. Add environment variables:
   - `GEMINI_API_KEY` = your key
   - `FRONTEND_URL` = https://ai-analyser-nu.vercel.app
   - `NODE_ENV` = production

### Step 3: Get the Backend URL
Render will provide a URL like: `https://ai-resume-backend.onrender.com`

### Step 4: Update Frontend
Add to `.env.production`:
```
VITE_API_URL=https://ai-resume-backend.onrender.com/api
```

---

## 📝 Environment Variables Setup

### Frontend (.env.production)
```bash
VITE_API_URL=https://your-backend-domain.com/api
```

### Backend (.env or Railway/Render dashboard)
```bash
NODE_ENV=production
PORT=5000
GEMINI_API_KEY=AIzaSyCX...your key
FRONTEND_URL=https://ai-analyser-nu.vercel.app
```

---

## ✅ Verify It Works

After deployment:

```bash
# Test backend is accessible
curl https://your-backend-domain.com/api/health

# Should return: {"status":"ok"}

# Then try uploading a resume on your Vercel frontend
# It should work!
```

---

## 🐛 Troubleshooting

### Still getting CORS error?
1. Verify `FRONTEND_URL` environment variable is set
2. Check backend logs: `railway logs` or `render logs`
3. Ensure backend is deployed and running

### 502 Bad Gateway on Vercel?
1. Check if backend is running
2. Verify API endpoint is correct
3. Check backend logs for errors

### Backend crashes after deploy?
1. Check environment variables are set
2. Verify `GEMINI_API_KEY` is correct
3. Look at deployment logs

---

## 📚 Next Steps

1. **For now (local testing)**: Use the updated CORS configuration with local URLs
2. **For production**: Deploy backend to Railway/Render (takes 10 minutes)
3. **Update frontend**: Set `VITE_API_URL` to your backend domain
4. **Test**: Upload a resume and verify it works

---

**Need help deploying? Let me know which platform you prefer and I'll guide you through it!**
