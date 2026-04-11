# Quick Testing Commands - Usage Limit Feature

Copy and paste these commands to test the usage limit feature.

## 1. Check Current Usage (No Analysis Consumed)

```bash
curl http://localhost:5000/api/usage/stats
```

**Expected Response:**
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

## 2. Upload One Resume (Consumes 1 Analysis)

First, you'll need a PDF file. If you don't have one, create a test PDF or use an existing resume.

```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@your-resume.pdf"
```

**Expected Success Response:**
```json
{
  "success": true,
  "score": 85,
  "skills": ["JavaScript", "React", "Node.js"],
  "missingSkills": ["TypeScript", "Docker"],
  "suggestions": ["Add metrics", "Include certifications"],
  "usage": {
    "used": 1,
    "remaining": 14,
    "limit": 15,
    "message": "Analysis 1 of 15 completed"
  }
}
```

## 3. Check Usage Again

```bash
curl http://localhost:5000/api/usage/stats
```

**Expected Response:**
```json
{
  "success": true,
  "usage": {
    "used": 1,
    "remaining": 14,
    "limit": 15,
    "percentage": 6,
    "lastReset": "2026-04-09"
  }
}
```

## 4. Upload Multiple Resumes (Test Sequence)

Replace `your-resume.pdf` with an actual PDF file.

```bash
# Upload #1
curl -X POST http://localhost:5000/api/resume/upload -F "resume=@your-resume.pdf" | jq

# Upload #2
curl -X POST http://localhost:5000/api/resume/upload -F "resume=@your-resume.pdf" | jq

# Upload #3
curl -X POST http://localhost:5000/api/resume/upload -F "resume=@your-resume.pdf" | jq

# Check progress
curl http://localhost:5000/api/usage/stats | jq

# etc...
```

## 5. Test Usage Limit Enforcement (All 15 Used)

This script will upload 15 resumes, then try the 16th which should fail.

**PowerShell (Windows):**
```powershell
# Upload 15 resumes
for ($i = 1; $i -le 15; $i++) {
    Write-Host "Uploading resume $i..."
    curl -X POST http://localhost:5000/api/resume/upload `
      -F "resume=@your-resume.pdf" | ConvertFrom-Json | ForEach-Object { 
        Write-Host "  Usage: $($_.usage.used)/$($_.usage.limit)"
    }
    Start-Sleep -Milliseconds 500
}

# Try the 16th - should fail with 429
Write-Host "Trying to upload resume 16 (should fail)..."
curl -w "`nStatus: %{http_code}`n" -X POST http://localhost:5000/api/resume/upload `
  -F "resume=@your-resume.pdf"
```

**Bash (Linux/Mac):**
```bash
# Upload 15 resumes
for i in {1..15}; do
    echo "Uploading resume $i..."
    curl -s -X POST http://localhost:5000/api/resume/upload \
      -F "resume=@your-resume.pdf" | jq '.usage.used'
    sleep 0.5
done

# Try the 16th - should fail with 429
echo "Trying to upload resume 16 (should fail)..."
curl -w "\nStatus: %{http_code}\n" -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@your-resume.pdf"
```

**Expected 16th Upload Response (Status 429):**
```json
{
  "success": false,
  "error": "Usage limit reached (15 resumes only)"
}

Status: 429
```

## 6. View Usage History (Check usage.json)

```bash
# Windows PowerShell
Get-Content backend/usage.json | ConvertFrom-Json | ConvertTo-Json -Depth 10

# Linux/Mac
cat backend/usage.json | jq

# Or just view raw
cat backend/usage.json
```

## 7. Reset Usage (For Testing)

### Option A: Delete the file (backend will recreate with count: 0)
```bash
# Windows
Remove-Item backend/usage.json
# Then restart: npm run dev

# Linux/Mac
rm backend/usage.json
# Then restart: npm run dev
```

### Option B: Edit the file directly
```bash
# Edit this file and set "count": 0
backend/usage.json
```

## 8. Full Integration Test

Complete workflow test:

```bash
# 1. Start backend (in one terminal)
cd backend && npm run dev

# 2. In another terminal, run these commands:

# Check initial usage
curl http://localhost:5000/api/usage/stats | jq '.usage'

# Verify health
curl http://localhost:5000/health | jq

# Upload a resume
curl -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@your-resume.pdf" | jq '.usage'

# Check updated usage
curl http://localhost:5000/api/usage/stats | jq '.usage'

# View the usage.json file
cat backend/usage.json | jq
```

## 9. Test with Frontend

```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend
npm run dev

# Browser: Visit http://localhost:5173
# Upload a resume and see the analysis
# Check the network tab in DevTools to see the usage field in response
```

## 10. Debugging Commands

### Check if backend is running
```bash
curl http://localhost:5000/health
```

### Check if CORS works
```bash
curl -i http://localhost:5000/health
# Look for Access-Control-Allow-Origin header
```

### View backend logs
```bash
# Check terminal where backend is running for logs like:
# [INFO] 2026-04-09T10:30:45.123Z - Usage incremented: 1/15
```

### Check usage.json format
```bash
# Verify JSON is valid
cat backend/usage.json | jq empty
# If no error, JSON is valid
```

## Shortcuts for jq Output Parsing

If you have `jq` installed, these commands make output more readable:

```bash
# Pretty print JSON
curl http://localhost:5000/api/usage/stats | jq

# Extract just usage info
curl http://localhost:5000/api/usage/stats | jq '.usage'

# Just the percentage
curl http://localhost:5000/api/usage/stats | jq '.usage.percentage'

# Count from usage.json
cat backend/usage.json | jq '.count'

# View history
cat backend/usage.json | jq '.history'
```

## Install jq (Optional)

```bash
# Windows (with Chocolatey)
choco install jq

# macOS (with Homebrew)
brew install jq

# Linux (Debian/Ubuntu)
sudo apt-get install jq
```

## Expected Status Codes

- **200** - Success
- **400** - Bad request (no file, wrong format, etc.)
- **429** - Usage limit reached or rate limit exceeded
- **500** - Server error
- **503** - AI service unavailable

## Common Issues & Solutions

### Issue: "Cannot find module 'usageService'"
- **Solution:** Restart the backend with `npm run dev`

### Issue: usage.json not found
- **Solution:** It will auto-create on first usage. Or restart backend.

### Issue: Usage not incrementing
- **Solution:** Check terminal logs for errors during analysis

### Issue: usage.json gets reset
- **Solution:** That's expected if you deleted and restarted. It recreates with count: 0

## Quick Reference

| Action | Command |
|--------|---------|
| Check usage | `curl http://localhost:5000/api/usage/stats` |
| Upload resume | `curl -X POST http://localhost:5000/api/resume/upload -F "resume=@file.pdf"` |
| View history | `cat backend/usage.json \| jq '.history'` |
| View file | `cat backend/usage.json` |
| Reset usage | Delete `backend/usage.json` and restart |
| Health check | `curl http://localhost:5000/health` |

---

**Pro Tip:** Use the `-s` flag with curl to suppress progress, and pipe to `jq` for pretty output:
```bash
curl -s http://localhost:5000/api/usage/stats | jq
```

**For Frontend Testing:** Open DevTools (F12) → Network tab → Upload resume → Click on the API call → View the response to see the usage field!
