# AI Resume Analyzer - Backend API

A production-ready Node.js/Express backend for analyzing resumes using Azure OpenAI API. This service extracts resume content from PDFs and provides AI-powered analysis including ATS scores, skills extraction, and improvement suggestions.

## Project Structure

```
backend/
├── controllers/          # Request handlers
│   └── resumeController.js
├── services/            # Business logic
│   ├── aiService.js     # Azure OpenAI integration
│   └── pdfService.js    # PDF extraction
├── middleware/          # Express middleware
│   └── errorHandler.js  # Global error handling
├── utils/               # Utility functions
│   ├── logger.js        # Logging utility
│   └── validators.js    # Validation functions
├── routes/              # API routes
│   └── analyze.js       # Resume analysis endpoint
├── uploads/             # Temporary file storage
├── server.js            # Main server file
├── package.json         # Dependencies
├── .env.example         # Environment variables template
└── .gitignore          # Git ignore rules
```

## Features

✅ **PDF Resume Upload** - Handle PDF file uploads with validation  
✅ **Text Extraction** - Extract text from PDF files  
✅ **AI Analysis** - Analyze resumes using Azure OpenAI  
✅ **Structured Output** - Return ATS score, skills, missing skills, suggestions  
✅ **Usage Limit** - 15 resume analyses with persistent tracking  
✅ **Error Handling** - Comprehensive error handling with meaningful messages  
✅ **Rate Limiting** - Protect API from abuse  
✅ **CORS Support** - Cross-origin request handling  
✅ **File Cleanup** - Automatic cleanup of temporary files  
✅ **Logging** - Request and error logging  

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Azure OpenAI API key and endpoint
- Deployment ID for your Azure OpenAI model

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your Azure OpenAI credentials:
     ```
     AZURE_OPENAI_ENDPOINT=your_endpoint
     AZURE_OPENAI_API_KEY=your_api_key
     AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
     ```

3. **Create uploads folder** (if not already created):
```bash
mkdir -p uploads
```

## Running the Server

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`)

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and timestamp.

### Upload and Analyze Resume
```
POST /api/resume/upload
Content-Type: multipart/form-data

Field: resume (file, PDF only, max 2MB)
```

**Request:**
```bash
curl -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@your-resume.pdf"
```

**Success Response (200):**
```json
{
  "success": true,
  "score": 85,
  "skills": [
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB"
  ],
  "missingSkills": [
    "TypeScript",
    "Docker",
    "AWS"
  ],
  "suggestions": [
    "Add quantifiable achievements with metrics",
    "Include relevant certifications",
    "Highlight leadership experience"
  ],
  "usage": {
    "used": 1,
    "remaining": 14,
    "limit": 15,
    "message": "Analysis 1 of 15 completed"
  }
}
```

**Error Response (4xx/5xx):**
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Get Usage Statistics
```
GET /api/usage/stats
```

**Response:**
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

This endpoint allows checking usage without consuming an analysis.

## Error Handling

The API returns appropriate HTTP status codes:

- **400** - Bad request (invalid file, missing data)
- **413** - Payload too large (file exceeds 2MB)
- **429** - Too many requests (rate limit or usage limit exceeded)
  - Rate limit: 20 uploads per hour per IP
  - Usage limit: 15 total analyses (strict limit)
- **500** - Server error
- **503** - Service unavailable (AI service error)

## Configuration

### File Upload Limits
- **Max file size:** 2MB
- **Allowed formats:** PDF only
- **Rate limit:** 20 uploads per hour per IP

### Usage Limits
- **Total limit:** 15 resume analyses
- **Tracking:** Persists in `usage.json` file
- **Reset:** Manual only (admin can use `usageService.resetUsage()`)
- **Behavior:** Returns 429 status code when limit reached

### Rate Limiting
- **General API:** 100 requests per 15 minutes per IP
- **Upload endpoint:** 20 requests per 1 hour per IP

### CORS Configuration
- **Default origin:** `http://localhost:5173` (Vite dev server)
- **Configurable via:** `FRONTEND_URL` in `.env`

## Security Best Practices

1. **Environment Variables** - Never commit `.env` file
2. **API Keys** - Keep Azure OpenAI credentials secure
3. **File Validation** - Only PDF files are accepted
4. **File Size Limits** - Prevents resource exhaustion
5. **Rate Limiting** - Prevents abuse and DOS attacks
6. **CORS** - Restrict to trusted origins in production
7. **Input Validation** - All inputs are validated before processing

## Performance Considerations

- Temporary files are automatically cleaned up after processing
- Azure OpenAI API calls may take a few seconds - consider implementing timeouts
- Consider implementing caching for frequently analyzed resume patterns
- Monitor API quotas and implement queuing for high-volume scenarios

## Troubleshooting

### Issue: "Azure OpenAI endpoint not configured"
- **Solution:** Ensure `AZURE_OPENAI_ENDPOINT` is set in `.env`

### Issue: "Invalid API key"
- **Solution:** Verify your `AZURE_OPENAI_API_KEY` is correct and not expired

### Issue: "File size exceeds limit"
- **Solution:** Use a PDF file smaller than 2MB (usually resumes are 0.5-1MB)

### Issue: "CORS error from frontend"
- **Solution:** Update `FRONTEND_URL` in `.env` to match your frontend URL

## Deployment

### For Production
1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "resume-analyzer"
   ```
3. Configure reverse proxy (Nginx) to handle CORS and SSL
4. Use environment-specific `.env` files (`.env.production`)
5. Set up monitoring and logging
6. Implement CI/CD pipeline for automated deployments

### Environment Variables for Production
```
NODE_ENV=production
PORT=5000
AZURE_OPENAI_ENDPOINT=production_endpoint
AZURE_OPENAI_API_KEY=production_key
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-35-turbo
FRONTEND_URL=https://yourdomaincom
```

## Future Enhancements

- [ ] Resume history storage (database integration)
- [ ] User authentication and profiles
- [ ] Batch resume processing
- [ ] CSV export of results
- [ ] Caching layer for similar resumes
- [ ] Webhook notifications
- [ ] Advanced analytics dashboard
- [ ] Multiple language support
- [ ] Different analysis templates
- [ ] Integration with job posting data

## API Response Schema

```typescript
interface AnalysisResponse {
  success: boolean;
  score: number;           // 0-100 ATS compatibility score
  skills: string[];        // Extracted skills
  missingSkills: string[]; // Recommended skills to add
  suggestions: string[];   // Improvement recommendations
}

interface ErrorResponse {
  success: false;
  error: string; // Error message
}
```

## Dependencies

- **@azure/openai** - Azure OpenAI SDK
- **express** - Web framework
- **multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **cors** - Cross-origin request handling
- **dotenv** - Environment variable management
- **express-rate-limit** - Rate limiting middleware

## License

ISC

## Support

For issues or questions, please check:
1. `.env` configuration is correct
2. Azure OpenAI API key is valid
3. File is a valid PDF (not corrupted)
4. File size is under 2MB
5. Backend logs for detailed error messages
