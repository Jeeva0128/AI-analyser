# Frontend-Backend API Integration Guide

This document describes how the frontend communicates with the backend API for resume analysis.

## Overview

The Frontend (React) communicates with the Backend (Express) via HTTP requests to analyze resumes. The backend handles file uploads, PDF processing, and AI analysis.

## Base URL

```
Development: http://localhost:5000/api
Production: https://api.yourdomain.com/api (configure in .env or environment variables)
```

## How to Configure

### For Development

The frontend is hardcoded to use `http://localhost:5000/api`:

**File:** `src/sections/UploadSection.tsx`
```typescript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### For Production

Set environment variable before building:

```bash
# .env.local
REACT_APP_API_URL=https://api.yourdomain.com/api

# Then build
npm run build
```

Or update directly in `UploadSection.tsx`:
```typescript
const API_URL = 'https://api.yourdomain.com/api';
```

## API Endpoints

### 1. Upload and Analyze Resume

**Endpoint:** `POST /api/resume/upload`

**Content-Type:** `multipart/form-data`

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| resume | File (PDF) | Yes | PDF resume file (max 2MB) |

**Request Example (JavaScript/Fetch):**
```javascript
const file = /* File object from input */;
const formData = new FormData();
formData.append('resume', file);

const response = await fetch('http://localhost:5000/api/resume/upload', {
  method: 'POST',
  body: formData,
  // Note: Don't set Content-Type header, browser will set it automatically with boundary
});

const data = await response.json();
```

**Request Example (JavaScript/Axios):**
```javascript
const file = /* File object from input */;
const formData = new FormData();
formData.append('resume', file);

const response = await axios.post(
  'http://localhost:5000/api/resume/upload',
  formData,
  {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
);

const data = response.data;
```

**Request Example (cURL):**
```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@resume.pdf"
```

### 2. Get Usage Statistics

**Endpoint:** `GET /api/usage/stats`

**Description:** Check current usage without consuming an analysis

**Request Example (JavaScript/Fetch):**
```javascript
const response = await fetch('http://localhost:5000/api/usage/stats', {
  method: 'GET'
});

const data = await response.json();
```

**Response:**
```json
{
  "success": true,
  "usage": {
    "used": 3,
    "remaining": 12,
    "limit": 15,
    "percentage": 20,
    "lastReset": "2026-04-09"
  }
}
```

### Success Response (Status: 200)

```json
{
  "success": true,
  "score": 85,
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
    "Kubernetes"
  ],
  "suggestions": [
    "Add quantifiable achievements with metrics",
    "Include relevant certifications",
    "Highlight leadership experience",
    "Add more technical depth to descriptions",
    "Include portfolio links and GitHub profile"
  ],
  "usage": {
    "used": 1,
    "remaining": 14,
    "limit": 15,
    "message": "Analysis 1 of 15 completed"
  }
}
```

**Response Schema:**
```typescript
interface AnalysisResponse {
  success: boolean;
  score: number;              // 0-100
  skills: string[];           // Up to 20 skills
  missingSkills: string[];    // Up to 10 skills
  suggestions: string[];      // Up to 10 suggestions
  usage: {
    used: number;             // Analyses used so far
    remaining: number;        // Analyses remaining
    limit: number;            // Total limit (15)
    message: string;          // Status message
  }
}
```

### Error Response (Status: 400, 429, 500, 503)

**429 - Usage Limit Reached:**
```json
{
  "success": false,
  "error": "Usage limit reached (15 resumes only)"
}
```

Limit: 15 resume analyses total (persists across server restarts)

**400 - Bad Request:**
```json
{
  "success": false,
  "error": "No file provided"
}
```

**Possible 400 Errors:**
- "No file provided"
- "File size exceeds 2MB limit"
- "Only PDF files are allowed"
- "Resume text is empty"
- "Resume text is too short"

**429 - Rate Limited:**
```json
{
  "success": false,
  "error": "Too many upload attempts, please try again later."
}
```

Limit: 20 uploads per hour per IP address

**500 - Server Error:**
```json
{
  "success": false,
  "error": "An error occurred while processing your request"
}
```

**503 - Service Unavailable:**
```json
{
  "success": false,
  "error": "AI service temporarily unavailable"
}
```

## Current Frontend Implementation

### Location
`src/sections/UploadSection.tsx`

### Key Code
```typescript
const uploadAndAnalyze = useCallback(
  async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(`${API_URL}/resume/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload resume');
      }

      const data = await response.json();

      // Transform response
      const analysisResult = {
        overallScore: data.score,
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(1) + ' KB',
        skills: data.skills || [],
        missingSkills: data.missingSkills || [],
        suggestions: data.suggestions || [],
        strengths: data.suggestions?.slice(0, 3) || [],
      };

      setAnalysisResult(analysisResult);
      // ... rest of the logic
    } catch (error) {
      addToast(error.message, 'error');
    }
  },
  [API_URL]
);
```

## Response Data Flow

```
┌─────────────────────┐
│   Resume File       │
│   (PDF upload)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   POST /api/resume/upload           │
│   (FormData with file)              │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   Backend Processing                │
│   1. Validate file                  │
│   2. Extract text from PDF          │
│   3. Call Azure OpenAI API          │
│   4. Parse analysis results         │
│   5. Clean up temp file             │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   Response JSON                     │
│   {                                 │
│     success: true,                  │
│     score: 85,                      │
│     skills: [...],                  │
│     missingSkills: [...],           │
│     suggestions: [...]              │
│   }                                 │
└──────────┬──────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│   Frontend Display Results        │
│   - Show ATS score               │
│   - List skills                  │
│   - Display suggestions          │
│   - Store in history             │
│   - Scroll to results section    │
└──────────────────────────────────┘
```

## CORS Configuration

The backend allows requests from:
- **Development:** `http://localhost:5173`
- **Production:** Configured via `FRONTEND_URL` environment variable

If you get CORS errors:
1. Check backend is running
2. Verify `FRONTEND_URL` in `.env` matches your frontend URL
3. Check browser console for exact error

```
Access to XMLHttpRequest at 'http://localhost:5000/api/resume/upload' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:** Ensure backend `.env` has:
```
FRONTEND_URL=http://localhost:5173
```

## Error Handling Best Practices

### In Frontend Code
```typescript
try {
  const response = await fetch(`${API_URL}/resume/upload`, {
    method: 'POST',
    body: formData,
  });

  // Check HTTP status code
  if (!response.ok) {
    const errorData = await response.json();
    // Use backend error message
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  // Parse success response
  const data = await response.json();
  if (data.success) {
    // Process analysis results
    setAnalysisResult({...});
  } else {
    throw new Error(data.error || 'Analysis failed');
  }
} catch (error) {
  // Show user-friendly error message
  addToast(error.message, 'error');
  console.error('Upload error:', error);
}
```

### Common Client-Side Errors

| Error Type | Cause | Solution |
|-----------|-------|----------|
| No file selected | User closed dialog | Remind user to select file |
| File too large | > 2MB | Suggest compressing/optimizing resume |
| File not PDF | Wrong format uploaded | Show supported formats clearly |
| Network error | Backend not running/unreachable | Check backend status |
| CORS error | Wrong frontend URL configured | Update FRONTEND_URL in backend .env |
| 429 Too Many Requests | Rate limit exceeded | Show "Please try again later" |
| 503 Service Unavailable | Azure OpenAI service down | Show "Please try again later" |

## Performance Considerations

### Expected Timings
- **File upload:** 0.5-2 seconds (depending on file size and network)
- **PDF extraction:** 1-3 seconds
- **AI analysis:** 5-15 seconds (depends on Azure OpenAI latency)
- **Total:** 7-20 seconds

### Optimization Tips
1. Show upload progress to user
2. Disable button during upload to prevent double-submission
3. Display "Analyzing..." message during AI processing
4. Cache results for duplicate resumes (future enhancement)
5. Consider implementing a timeout after 30 seconds

## TypeScript Types

If using TypeScript, define types for API responses:

```typescript
interface ResumeAnalysisResponse {
  success: boolean;
  score: number;
  skills: string[];
  missingSkills: string[];
  suggestions: string[];
}

interface AnalysisError {
  success: false;
  error: string;
}

type ApiResponse = ResumeAnalysisResponse | AnalysisError;
```

## Testing the Integration

### Using Postman
1. Create new POST request
2. URL: `http://localhost:5000/api/resume/upload`
3. Body → form-data
4. Add key: `resume` (File type)
5. Select a PDF file
6. Send

### Using VS Code REST Client
Create `test.http`:
```http
POST http://localhost:5000/api/resume/upload
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="resume"; filename="resume.pdf"
Content-Type: application/pdf

< ./path/to/resume.pdf
------WebKitFormBoundary--
```

## Deployment Considerations

### Environment Variables
```
# Development
REACT_APP_API_URL=http://localhost:5000/api

# Production
REACT_APP_API_URL=https://api.yourdomain.com/api
```

### CORS Headers
Backend must allow your frontend origin. In `server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### SSL/HTTPS
In production, always use HTTPS for file uploads to protect user data.

## Monitoring & Analytics

Consider adding these to track usage:
```javascript
// Log successful uploads
console.log(`Upload successful: ${file.name}, Score: ${data.score}`);

// Send analytics
analytics.track('resume_analyzed', {
  fileName: file.name,
  score: data.score,
  skillCount: data.skills.length,
  timestamp: new Date().toISOString()
});
```

## Related Documentation

- Backend API Docs: `backend/README.md`
- Setup Guide: `SETUP_GUIDE.md`
- Testing Guide: `TESTING_GUIDE.md`
- Project Overview: `project_documentation.md`

---

**Questions? Check the backend logs for detailed error information or review the SETUP_GUIDE.md for configuration help.**
