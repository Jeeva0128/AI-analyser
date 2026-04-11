# Complete System Testing Guide

This guide walks you through testing the complete AI Resume Analyzer system from the backend API to the frontend UI.

## Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173`
- Azure OpenAI configured and API key added to `.env`

## Test 1: Backend Health Check

### Using Browser
1. Open `http://localhost:5000/health`
2. You should see:
```json
{
  "status": "Backend is running 🚀",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### Using cURL
```bash
curl http://localhost:5000/health
```

✅ **If successful:** Backend server is running correctly

## Test 2: PDF Upload with cURL

### Method 1: Using a Real Resume PDF

### Method 1: Using a Real Resume PDF

```bash
# Replace 'your-resume.pdf' with an actual resume file path
curl -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@your-resume.pdf"
```

### Method 3: Using Test PDF

If you don't have a resume, create a simple test PDF:

**On Windows (PowerShell):**
```powershell
# Create a simple PDF using .NET
$pdf_content = @"
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< >>
stream
BT /F1 12 Tf 50 750 Td (John Doe - Full Stack Developer) Tj ET
BT /F1 10 Tf 50 730 Td (Skills: JavaScript, React, Node.js, MongoDB) Tj ET
BT /F1 10 Tf 50 710 Td (Experience: 5 years in web development) Tj ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000229 00000 n
0000000441 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
534
%%EOF
"@

$pdf_content | Out-File -Encoding ASCII -FilePath "test-resume.pdf"
```

### Expected Success Response (200):
```json
{
  "success": true,
  "score": 75,
  "skills": [
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
    "Full Stack Development"
  ],
  "missingSkills": [
    "TypeScript",
    "Docker",
    "AWS",
    "CI/CD",
    "Kubernetes"
  ],
  "suggestions": [
    "Add quantifiable metrics and achievements",
    "Include relevant technical certifications",
    "Highlight leadership and team management experience",
    "Add links to GitHub profile and portfolio",
    "Include numbers showing impact (e.g., % improvement, users impacted)"
  ]
}
```

### Expected Error Responses:

**400 - No file provided:**
```json
{
  "success": false,
  "error": "No file provided"
}
```

**400 - File too large:**
```json
{
  "success": false,
  "error": "File size exceeds 2MB limit"
}
```

**400 - Invalid file type:**
```json
{
  "success": false,
  "error": "Only PDF files are allowed"
}
```

**503 - AI service error:**
```json
{
  "success": false,
  "error": "Failed to analyze resume. Please try again."
}
```

✅ **If successful:** Backend can extract PDF text and call Azure OpenAI API

## Test 3: Frontend Upload

1. **Open Frontend:** `http://localhost:5173`
2. **Upload a PDF Resume:**
   - Drag and drop a PDF file onto the upload section, OR
   - Click to browse and select a PDF file
3. **Wait for Processing:**
   - You'll see upload progress (simulated)
   - Then "AI is analyzing your resume..." message
4. **View Results:**
   - Page automatically scrolls to show results
   - You should see:
     - ATS Score (0-100)
     - Skills extracted
     - Missing skills
     - Improvement suggestions

✅ **If successful:** Full integration is working

## Test 4: Error Handling

### Test Invalid File
1. Try uploading a non-PDF file (.docx, .txt, .jpg)
2. Should see error toast: "Only PDF files are supported"

### Test Large File
1. Try uploading a file > 2MB
2. Should see error toast: "File too large. Maximum size is 2MB"

### Test Network Error
1. Stop the backend server
2. Try uploading a file
3. Should see error toast: "Failed to analyze resume..."

✅ **If successful:** Error handling works correctly

## Test 5: Rate Limiting (Backend Protection)

### Test Upload Rate Limit
```bash
# Try 21 uploads in less than 1 hour
for i in {1..21}; do
  curl -X POST http://localhost:5000/api/resume/upload \
    -F "resume=@test-resume.pdf"
done
```

Expected: On the 21st request, get 429 status:
```json
{
  "success": false,
  "error": "Too many upload attempts, please try again later."
}
```

✅ **If successful:** Rate limiting is protecting the API

## Test 5B: Usage Limit (15 Resumes)

### Check Usage Stats
```bash
curl http://localhost:5000/api/usage/stats
```

Expected response:
```json
{
  "success": true,
  "usage": {
    "used": 0,
    "remaining": 15,
    "limit": 15,
    "percentage": 0,
    "lastReset": "2026-04-09"
  }
}
```

### Test Usage Limit Enforcement
1. Before testing, check current usage:
```bash
curl http://localhost:5000/api/usage/stats
```

2. Upload 15 resumes (one at a time):
```bash
for i in {1..15}; do
  echo "Upload $i:"
  curl -X POST http://localhost:5000/api/resume/upload \
    -F "resume=@test-resume.pdf"
  sleep 2  # Wait between requests
done
```

3. Try to upload the 16th resume - should fail:
```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@test-resume.pdf"
```

Expected response on 16th upload (Status 429):
```json
{
  "success": false,
  "error": "Usage limit reached (15 resumes only)"
}
```

4. Verify usage.json file was updated:
```bash
# Windows PowerShell
Get-Content backend/usage.json | ConvertFrom-Json

# Linux/Mac
cat backend/usage.json
```

Expected content:
```json
{
  "count": 15,
  "lastReset": "2026-04-09",
  "limit": 15,
  "history": [
    {
      "fileName": "resume.pdf",
      "timestamp": "2026-04-09T10:30:45.123Z",
      "analysisNumber": 1
    },
    ...
  ]
}
```

✅ **If successful:** Usage limit is enforced and persists

### Test Usage Persistence (Restart Test)
1. Start with 15 uploads completed
2. Stop the backend server
3. Restart the backend: `npm run dev`
4. Try to upload again - should still show usage limit:
```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@test-resume.pdf"
```

Expected: Still get 429 error (usage persisted across restart)

✅ **If successful:** Usage is persistent across server restarts

## Test 6: CORS Configuration

### Test Cross-Origin Request
```bash
# From a different origin (e.g., external server)
curl -X POST http://localhost:5000/api/resume/upload \
  -H "Origin: http://example.com" \
  -F "resume=@test-resume.pdf"
```

- **Expected for `http://localhost:5173`:** CORS headers should be present
- **Expected for other origins:** CORS error or empty headers

✅ **If successful:** CORS is correctly configured

## Test 7: Performance

### Measure Response Time
```bash
# Time the entire request
time curl -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@test-resume.pdf"
```

**Expected response time:**
- Upload + PDF extraction: < 2 seconds
- AI analysis: 5-15 seconds
- Total: 7-20 seconds (depending on Azure OpenAI latency)

✅ **If successful:** Performance is acceptable

## Test 8: File Cleanup

### Verify Temporary Files Are Deleted

1. Before uploading, check `backend/uploads/` directory (should be empty)
2. Upload a file through the frontend
3. Wait for processing to complete
4. Check `backend/uploads/` directory again (should be empty - file cleaned up)

✅ **If successful:** Temporary files are properly cleaned up

## Troubleshooting Tests

### Test: Backend not responding
```bash
curl http://localhost:5000/
```
- Should return "Backend is working 🚀"
- If fails: Check if backend is running on port 5000

### Test: Frontend can't reach backend
- Open browser console (F12)
- Check Network tab for API calls
- Verify `http://localhost:5000/api/resume/upload` is being called
- Check for CORS errors

### Test: PDF extraction failing
- Try with a different, known-good PDF file
- Check that pdf-parse is installed: `npm list pdf-parse` in backend folder

### Test: Azure OpenAI API key issue
```bash
# Test directly with Azure
curl -X POST "$AZURE_OPENAI_ENDPOINT/openai/deployments/$DEPLOYMENT_NAME/chat/completions?api-version=2024-02-15-preview" \
  -H "api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 100
  }'
```

## Automated Health Check Script

Create `test-health.sh` (Linux/Mac) or `test-health.ps1` (Windows):

```powershell
# Windows PowerShell version (test-health.ps1)

$backendUrl = "http://localhost:5000"
$frontendUrl = "http://localhost:5173"

Write-Host "=== Resume Analyzer Health Check ===" -ForegroundColor Cyan

# Test backend
Write-Host "`n1. Testing Backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/health" -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is running" -ForegroundColor Green
        Write-Host $response.Content
    }
} catch {
    Write-Host "❌ Backend is not responding" -ForegroundColor Red
}

# Test frontend (just check if it responds)
Write-Host "`n2. Testing Frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$frontendUrl" -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend is running" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend is not responding" -ForegroundColor Red
}

Write-Host "`n=== Health Check Complete ===" -ForegroundColor Cyan
```

Run it:
```powershell
.\test-health.ps1
```

## Summary Checklist

- [ ] Backend health check responds
- [ ] PDF upload works and returns analysis
- [ ] Response includes usage information
- [ ] Frontend can upload and show results
- [ ] Error handling works for invalid files
- [ ] Rate limiting prevents API abuse (20 uploads/hour)
- [ ] Usage limit enforced (15 total analyses)
- [ ] Usage persists after server restart
- [ ] CORS allows frontend to communicate
- [ ] Temporary files are cleaned up
- [ ] Performance is acceptable

## Next Steps

If all tests pass:
1. ✅ Development environment is fully functional
2. 📝 Create a `.env` file for production deployment
3. 🚀 Deploy backend to cloud (Heroku, AWS, etc.)
4. 🌐 Deploy frontend to hosting (Vercel, Netlify, etc.)
5. 📊 Add monitoring and logging

If tests fail:
1. Check error logs in backend console
2. Review environment variables
3. Verify Azure OpenAI credentials
4. Check network connectivity
5. Review SETUP_GUIDE.md for configuration

---

**All tests passing? You're ready to use the Resume Analyzer! 🎉**
