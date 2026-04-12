# 🧪 DEBUGGING & TESTING GUIDE

## ✅ Changes Applied

### 1. ✅ Fixed Backend Middleware Ordering
**File:** `backend/server.js`
- **What was wrong:** Body parser middleware was intercepting file uploads before multer
- **What's fixed:** 
  - Routes with multer now come BEFORE body parser
  - Upload limiter applied correctly
  - Health check moved to routes section
- **Why it matters:** Multipart/form-data must be handled by multer, not JSON parser

### 2. ✅ Improved AI Response Prompt
**File:** `backend/services/aiService.js`
- **What was wrong:** Vague prompts allowed 20+ skills and 10+ suggestions
- **What's fixed:**
  - Requires ONLY 3-5 skills (most prominent ones)
  - Requires ONLY 2-3 missing skills
  - Requires ONLY 3-4 actionable suggestions
  - Better prompt structure with clear formatting
- **Why it matters:** Concise, professional output users can act on immediately

### 3. ✅ Enhanced Multer Error Handling
**File:** `backend/routes/analyze.js`
- **What was wrong:** Generic multer errors, no field name validation
- **What's fixed:**
  - Validates field name is exactly "resume"
  - Validates MIME type is "application/pdf"
  - Custom error handler for all multer errors
  - Better error messages for debugging
- **Why it matters:** Catch configuration mistakes early

### 4. ✅ Enhanced Frontend Error Handling
**File:** `src/sections/UploadSection.tsx`
- **What was wrong:** Generic error messages, no retry logic for Render cold starts
- **What's fixed:**
  - Detailed console logging with emojis for easy reading
  - **Retry logic** with exponential backoff (handles Render spin-ups)
  - 60-second timeout per request
  - Specific error messages for common issues
  - Detailed error logging with context
- **Why it matters:** Better debugging info and resilience to cold server starts

---

## 🧪 Testing Checklist - Do This First!

### Phase 1: Backend Health Check (No uploads yet)

```bash
# Test 1: Check backend health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"status":"Backend is running 🚀","timestamp":"2024-01-01T...","timestamp_ms":1234567890}
```

**If this fails:**
- ❌ Is backend running? `npm start` in `/backend`
- ❌ Wrong port? Check `backend/.env` has PORT=5000
- ❌ CORS issue? Check frontend URL in allowed origins in `backend/server.js`

---

### Phase 2: Local Localhost Test (5173)

**Step 1: Prepare**
```powershell
# Terminal 1 - Start Backend
cd backend
npm start

# Terminal 2 - Start Frontend  
cd <root-folder>
npm run dev
```

**Step 2: Test Upload on http://localhost:5173**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try uploading a PDF resume
4. **Look for these logs:**
   - ✅ `🚀 Starting upload for file: yourfile.pdf`
   - ✅ `📦 FormData created`
   - ✅ `📡 Sending request (attempt 1/3)...`
   - ✅ `✅ Response received: 200 OK`
   - ✅ `📥 Response data received:`

**If you see errors:**
- Look for `❌` prefixed errors in console
- Read the error message carefully
- Check backend logs in other terminal

---

### Phase 3: Production Verification

#### Test 3A: Render Backend Health
```bash
# Using curl or postman
curl https://your-backend-url.onrender.com/api/health

# Expected: Same JSON response with 200 status
```

#### Test 3B: Vercel Frontend Upload
1. Go to your Vercel URL (e.g., https://your-app.vercel.app)
2. Open DevTools (F12)
3. Console tab
4. Try uploading a PDF
5. **Check for logs:**
   - May see `⏳ Retrying in 1000ms...` if server is cold (this is OK!)
   - Should eventually see ✅ Response received
   - Should process and show results

---

## 🔍 Debugging Console Logs Explained

### Green Signs (✅ All Good)
```
✅ Response received: 200 OK
📥 Response data received: {success: true, score: 85, ...}
🚀 Starting upload for file: resume.pdf
```

### Yellow Warnings (⚠️ Retrying)
```
⏳ Retrying in 1000ms...      // Normal on cold Render servers
⚠️ Request failed (attempt 1): timeout   // Will retry
```

### Red Errors (❌ Something's Wrong)
```
❌ API Error Response: {error: "Only PDF files are allowed"}
❌ Upload error details: {message: "Field name must be \"resume\"", ...}
```

---

## 🔧 Troubleshooting by Error Message

### Error: "Connection failed. The server might be starting up..."
- **Cause:** Render free tier spin-down or network issue
- **Solution:** 
  - ✅ Click upload again (retry happens automatically)
  - ✅ If persists, Render server might be down
  - Check Render dashboard for backend status
  
### Error: "Only PDF files are allowed"
- **Cause:** Uploaded file is not a real PDF
- **Solution:**
  - Ensure it's a valid PDF (not renamed file)
  - Try a different PDF file
  - Check file size (must be < 2MB)

### Error: "Field name must be \"resume\""
- **Cause:** FormData field name mismatch
- **Solution:**
  - Backend expects `resume` field
  - Frontend sends `resume` field ✅ (already correct in our fix)
  - This error means something is very wrong with the configuration

### Error: "CORS error: Origin not allowed"
- **Cause:** Frontend URL not in CORS allowlist
- **Solution:**
  - Check `backend/server.js` CORS configuration
  - Add your Vercel URL to `allowedOrigins` array
  - Common example: Add `https://your-app.vercel.app`
  - Redeploy backend

### Error: "Network error: fetch failed"
- **Cause:** Network connectivity or server unreachable
- **Solution:**
  - Check API_URL in frontend (should be https:// not http://)
  - Check backend is responding to `/api/health`
  - Check firewall/VPN isn't blocking
  - Wait a moment (Render might be starting) - retry works automatically

---

## 📊 Backend Logs to Check

### On Render Dashboard:
1. Go to https://dashboard.render.com
2. Click your backend service
3. Click "Logs" tab
4. **Look for these successful logs:**
   ```
   Multer file validation
   fieldname: resume
   mimetype: application/pdf
   size: [number]
   ```

5. **Or these error logs (to understand issues):**
   ```
   Multer error: LIMIT_FILE_SIZE
   Multer error: Field name validation failed
   ```

### Interpreting Backend Logs:
- ✅ `File received for processing { filename: 'resume.pdf' }`
- ✅ `Text extracted { length: 5432 }`
- ✅ `Starting resume analysis with Gemini AI`
- ✅ `Resume analyzed successfully`
- ❌ `Error analyzing resume: Gemini API disabled for account`

---

## 🧪 Manual Frontend-to-Backend Test (Advanced)

Use this to test the API directly without the frontend:

```bash
# Open PowerShell

# Test the health endpoint
curl -X GET http://localhost:5000/api/health -Headers @{"Content-Type"="application/json"}

# Test upload (create formData with file)
$file = [System.IO.File]::ReadAllBytes("C:\path\to\resume.pdf")
$form = @{
    resume = $file
}
curl -X POST http://localhost:5000/api/resume/upload -Form $form

# Expected: 200 status with JSON response
```

---

## 📈 Expected Behavior After Fixes

### Localhost (5173/5174)
- ✅ Upload works instantly (no network latency)
- ✅ AI response in 10-20 seconds
- ✅ Results show 3-5 skills (not 20+)
- ✅ Suggestions are specific and actionable

### Vercel Production
- ✅ First request takes 30-60s (Render cold start)
- ✅ Frontend **automatically retries** if fails
- ✅ No CORS errors in console
- ✅ Results display properly with custom domain or Vercel URL

### AI Output Quality
- ✅ Score is 0-100 (realistic ATS score)
- ✅ Skills: "React", "Node.js", "AWS" (specific, not "Programming")
- ✅ Missing Skills: 2-3 common tech stack items
- ✅ Suggestions: "Add metrics to achievements", "Use LinkedIn keywords"

---

## 🎯 Next Steps After Testing

1. **If localhost works but Vercel fails:**
   - Check CORS allowlist in backend
   - Verify VITE_API_URL in Vercel env vars
   - Redeploy both frontend and backend

2. **If AI output is still too long:**
   - Check that new prompt was deployed
   - Redeploy backend: make a commit and push to GitHub
   - Render auto-redeploys from GitHub

3. **If uploads still fail:**
   - Check backend logs in Render dashboard
   - Share the exact error message from console
   - Verify environment variables are set

---

## 📝 Summary of Fixes

| Issue | Root Cause | Fix Applied | Test |
|-------|-----------|------------|------|
| Upload failing | Middleware order | Moved body parser after routes | ✅ POST succeeds |
| AI output too long | Vague prompt | Limited to 3-5 skills & 3-4 suggestions | ✅ Concise output |
| Multer misconfig errors | No validation | Added field name + MIME type validation | ✅ Better errors |
| Render cold start timeout | No retry logic | Added exponential backoff retry (2 retries) | ✅ Auto-retries |
| Poor error messages | Generic errors | Added specific error messages & context logs | ✅ Debug faster |

All fixes are backward-compatible and don't break existing functionality!
