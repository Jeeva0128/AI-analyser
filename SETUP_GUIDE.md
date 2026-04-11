# Resume Analyzer - Complete Setup Guide

This document provides step-by-step instructions to set up and run the complete AI Resume Analyzer application.

## Project Overview

The Resume Analyzer is a full-stack web application that:
1. Accepts PDF resume uploads from users
2. Extracts text from the resume
3. Analyzes the resume using Azure OpenAI API
4. Returns ATS scores, skills analysis, and improvement suggestions

**Tech Stack:**
- **Frontend:** React + TypeScript (Vite)
- **Backend:** Node.js + Express
- **AI:** Azure OpenAI API
- **File Processing:** Multer + PDF-parse

## Prerequisites

- **Node.js** 16+ and npm
- **Azure Subscription** with OpenAI service deployed
- **Git** (optional, for version control)

## Part 1: Azure OpenAI Setup

Before running the application, you need to configure Azure OpenAI.

### Step 1: Create Azure OpenAI Resource

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new resource → Search for "Azure OpenAI" → Create
3. Fill in the resource details:
   - **Resource Group:** Create new or select existing
   - **Region:** Select a region (e.g., East US)
   - **Name:** Choose a unique name (e.g., `resume-analyzer-ai`)
   - **Pricing Tier:** Standard

4. Review and create the resource

### Step 2: Deploy a Model

1. Go to your Azure OpenAI resource
2. Click **"Model deployments"** in the left menu
3. Click **"Create new deployment"**
4. In the dialog:
   - **Deploy model:** Select `gpt-3.5-turbo` (or `gpt-4` if available)
   - **Deployment name:** `gpt-35-turbo` (or your preferred name)
   - **Model version:** Latest
5. Create the deployment (may take a few minutes)

### Step 3: Get Your Credentials

1. In your Azure OpenAI resource, go to **"Keys and Endpoint"** (left menu)
2. Copy:
   - **Endpoint:** (looks like `https://your-name.openai.azure.com/`)
   - **Key 1:** (your API key)
3. Keep the **deployment name** from Step 2

## Part 2: Backend Setup

### Step 1: Navigate to Backend

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

1. Open `backend/.env` (created during setup)
2. Fill in your Azure OpenAI credentials:

```env
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-35-turbo
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 4: Start Backend Server

**Development mode (auto-restart on changes):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The backend will start on `http://localhost:5000`

### Step 5: Verify Backend

Open your browser and visit: `http://localhost:5000/health`

You should see:
```json
{
  "status": "Backend is running 🚀",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

## Part 3: Frontend Setup

### Step 1: Navigate to Frontend

```bash
cd .. (back to root)
# or: cd ../
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Backend URL

The frontend is already configured to connect to `http://localhost:5000`. If your backend runs on a different URL, update:

**File:** `src/sections/UploadSection.tsx`

Look for:
```typescript
const API_URL = 'http://localhost:5000/api';
```

Change if needed based on your backend URL.

### Step 4: Start Frontend Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or next available port)

### Step 5: Verify Frontend

Open your browser and visit the URL shown in the terminal (e.g., `http://localhost:5173`)

You should see the Resume Analyzer homepage with the upload section.

## Complete Setup (Both Frontend & Backend)

### Option 1: Two Terminal Windows (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on port 5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Runs on port 5173
```

### Option 2: Single Terminal with Concurrency

From the root directory:
```bash
# Install concurrently (if not already installed)
npm install --save-dev concurrently

# Add to root package.json scripts:
#   "dev": "concurrently \"cd backend && npm run dev\" \"npm run dev\""

npm run dev
```

## Testing the Application

1. **Open Frontend:** `http://localhost:5173`
2. **Upload a Resume:** 
   - Click "Upload Resume" button
   - Select a PDF file (typically 0.5-2 MB)
3. **View Analysis:** 
   - Wait for processing (usually 5-15 seconds)
   - See ATS score, skills, missing skills, and suggestions

## Troubleshooting

### Issue: "Failed to connect to backend"
- **Check:** Is the backend running on port 5000?
- **Check:** CORS settings in `backend/server.js` (FRONTEND_URL must match your frontend URL)
- **Fix:** Restart both servers

### Issue: "Azure OpenAI endpoint not configured"
- **Check:** Is `.env` file in the backend folder?
- **Check:** Are `AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_API_KEY` filled in?
- **Fix:** Copy correct values from Azure Portal

### Issue: "Invalid API key"
- **Check:** Did you copy the key correctly from Azure Portal?
- **Check:** Is the key from "Keys and Endpoint" page (not the model deployment page)?
- **Fix:** Copy the correct key from Azure Portal

### Issue: "File upload fails"
- **Check:** Is the file a valid PDF?
- **Check:** Is file size less than 2MB?
- **Check:** Can the PDF be opened in your PDF reader?
- **Fix:** Try with a different PDF file

### Issue: "Port already in use"
- **Backend (5000):** 
  ```bash
  # Windows PowerShell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
  
  # Or change PORT in .env to 5001
  ```
- **Frontend (5173):** Vite will automatically use the next available port

## Project Structure

```
AI Resume Analyzer/
├── backend/                    # Express.js backend
│   ├── controllers/            # Request handlers
│   ├── services/              # Business logic (AI, PDF)
│   ├── routes/                # API routes
│   ├── middleware/            # Express middleware
│   ├── utils/                 # Utilities
│   ├── uploads/               # Temporary file storage
│   ├── server.js              # Main server
│   ├── package.json
│   ├── .env                   # Environment variables (create this)
│   └── README.md              # Backend docs
│
├── src/                        # React frontend
│   ├── components/            # Reusable React components
│   ├── sections/              # Page sections
│   ├── store/                 # State management
│   ├── lib/                   # Utilities
│   ├── App.tsx                # Main component
│   └── main.tsx               # Entry point
│
├── public/                     # Static files
├── index.html                  # HTML template
├── vite.config.ts              # Vite configuration
├── package.json                # Frontend dependencies
├── tsconfig.json               # TypeScript config
└── README.md                   # Project documentation
```

## API Reference

### Upload and Analyze Resume
```
POST /api/resume/upload
Content-Type: multipart/form-data

Body:
- resume: PDF file
```

**Success Response (200):**
```json
{
  "success": true,
  "score": 85,
  "skills": ["JavaScript", "React", "Node.js"],
  "missingSkills": ["TypeScript", "Docker"],
  "suggestions": ["Add metrics to achievements", "Include certifications"]
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Development Workflow

1. **Frontend changes:** Auto-reload in browser (Vite hot module replacement)
2. **Backend changes:** Server auto-restarts with `npm run dev` (Node.js --watch)
3. **Test API directly:** Use cURL, Postman, or VS Code REST Client:

```http
### Test health endpoint
GET http://localhost:5000/health

### Upload resume (requires actual file)
POST http://localhost:5000/api/resume/upload
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="resume"; filename="resume.pdf"
Content-Type: application/pdf

< ./path/to/resume.pdf
------WebKitFormBoundary--
```

## Production Deployment

### Backend (Node.js)
1. Set `NODE_ENV=production` in `.env`
2. Use PM2 or similar process manager
3. Deploy to: Heroku, Railway, Render, AWS EC2, etc.
4. Use environment-specific `.env` files

### Frontend (React)
1. Build: `npm run build`
2. Output in `dist/` folder
3. Deploy to: Vercel, Netlify, AWS S3 + CloudFront, etc.

### Full Deployment Example (Using Railway)
```bash
# Deploy backend
cd backend
# Connect to Railway and deploy

# Deploy frontend
cd ../
npm run build
# Connect to Railway and deploy the dist/ folder
```

## Performance Tips

1. **Resume Size:** Keep resumes under 1.5MB for faster processing
2. **AI Response:** First request may be slower (model warming up)
3. **Rate Limiting:** Maximum 20 uploads per hour per IP
4. **Caching:** Consider caching results for duplicate resumes
5. **Database:** Add MongoDB/PostgreSQL to store analysis history

## Next Steps

1. ✅ Set up Azure OpenAI
2. ✅ Configure backend
3. ✅ Configure frontend
4. ✅ Test the application
5. 📊 Add database for storing results
6. 📈 Add user authentication
7. 🚀 Deploy to production

## Support & Documentation

- **Backend Docs:** See `backend/README.md`
- **Frontend Docs:** See `project_documentation.md`
- **Issues:** Check console logs and error messages
- **Azure OpenAI Docs:** https://learn.microsoft.com/en-us/azure/ai-services/openai/

## Security Checklist

- [ ] `.env` file is in `.gitignore` (never commit secrets)
- [ ] API keys are not hardcoded
- [ ] CORS is configured correctly
- [ ] File upload is limited to PDFs
- [ ] File size limit is enforced (2MB)
- [ ] Rate limiting is enabled
- [ ] Error messages don't expose sensitive info
- [ ] HTTPS is used in production

## Common Commands

```bash
# Backend
cd backend
npm install              # Install dependencies
npm run dev             # Development with auto-restart
npm start               # Production mode
npm run build           # Build (if applicable)

# Frontend
npm install             # Install dependencies
npm run dev             # Development with hot reload
npm run build           # Production build
npm run preview         # Preview production build
npm run lint            # Run linter

# Combined (from root)
npm install             # Install all dependencies
npm run dev             # Start both frontend and backend (needs concurrently)
```

---

**Happy Resume Analyzing! 🚀**
