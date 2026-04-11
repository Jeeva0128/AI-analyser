# Usage Limit Feature Documentation

## Overview

The AI Resume Analyzer backend includes a **strict usage limit of 15 resume analyses** to control API costs and manage resources. This limit is:

- ✅ **Persistent** - Stored in `usage.json` file (survives server restarts)
- ✅ **Enforced** - Returns 429 status code when limit reached
- ✅ **Trackable** - Includes history of all analyses with timestamps
- ✅ **Queryable** - `/api/usage/stats` endpoint shows current usage without consuming analyses

## How It Works

### 1. Usage Tracking

Every time a resume is successfully analyzed:

```
Request → Check usage.json → If count < 15 → Process → Increment count → Save to usage.json
```

### 2. Usage File Structure

**File:** `backend/usage.json`

```json
{
  "count": 5,
  "lastReset": "2026-04-09",
  "limit": 15,
  "history": [
    {
      "fileName": "john_doe_resume.pdf",
      "timestamp": "2026-04-09T10:30:45.123Z",
      "analysisNumber": 1
    },
    {
      "fileName": "jane_smith_resume.pdf",
      "timestamp": "2026-04-09T10:31:22.456Z",
      "analysisNumber": 2
    }
    // ... more entries
  ]
}
```

### 3. API Responses

#### Check Usage (No Analysis Consumed)
```bash
GET /api/usage/stats
```

Response:
```json
{
  "success": true,
  "usage": {
    "used": 5,
    "remaining": 10,
    "limit": 15,
    "percentage": 33,
    "lastReset": "2026-04-09"
  }
}
```

#### Upload Resume (Consumes Usage)
```bash
POST /api/resume/upload
```

Success (count < 15):
```json
{
  "success": true,
  "score": 85,
  "skills": [...],
  "missingSkills": [...],
  "suggestions": [...],
  "usage": {
    "used": 6,
    "remaining": 9,
    "limit": 15,
    "message": "Analysis 6 of 15 completed"
  }
}
```

Limit Reached (count >= 15):
```json
{
  "success": false,
  "error": "Usage limit reached (15 resumes only)"
}
Status: 429 Too Many Requests
```

## Usage Service API

The `services/usageService.js` provides these methods:

### `checkUsageLimit()`
Check if limit is reached without incrementing count.

```javascript
const usage = usageService.checkUsageLimit();
// Returns: { allowed: boolean, used: number, remaining: number, limit: number, message: string }
```

### `incrementUsage(fileName)`
Increment usage after successful analysis. Throws error if limit reached.

```javascript
const info = usageService.incrementUsage('resume.pdf');
// Returns: { used: number, remaining: number, limit: number, message: string }
// Throws: Error with statusCode 429 if limit reached
```

### `getStats()`
Get detailed statistics without modifying count.

```javascript
const stats = usageService.getStats();
// Returns: { used, remaining, limit, percentage, lastReset, totalAnalyzed }
```

### `resetUsage()` (Admin Only)
Reset count to 0. Use with caution!

```javascript
usageService.resetUsage();
// Returns: { count: 0, lastReset: ..., limit: 15, history: [] }
```

## Testing the Usage Limit

### Test 1: Check Current Usage
```bash
curl http://localhost:5000/api/usage/stats
```

### Test 2: Verify Limit Enforcement
```bash
# Upload up to 15 resumes
for i in {1..15}; do
  echo "Uploading resume $i..."
  curl -X POST http://localhost:5000/api/resume/upload \
    -F "resume=@test-resume.pdf" > response_$i.json
  sleep 2
done

# Try 16th upload - should fail with 429
curl -w "\nStatus: %{http_code}\n" -X POST http://localhost:5000/api/resume/upload \
  -F "resume=@test-resume.pdf"
```

### Test 3: Verify Persistence
```bash
# 1. Upload 5 resumes
# 2. Stop server (Ctrl+C)
# 3. Restart server (npm run dev)
# 4. Check stats - should still show 5 used
curl http://localhost:5000/api/usage/stats
```

## Resetting Usage (Development/Testing)

If you need to reset the usage counter (e.g., for testing), you have two options:

### Option 1: Delete usage.json File
```bash
# Backend will recreate it with count: 0
rm backend/usage.json

# Restart server
cd backend && npm run dev
```

### Option 2: Programmatically Reset
Create a temporary admin endpoint (development only):

```javascript
// Add to server.js temporarily
app.post('/admin/reset-usage', (req, res) => {
  // Add authentication check here!
  usageService.resetUsage();
  res.json({ message: 'Usage reset to 0' });
});
```

Then:
```bash
curl -X POST http://localhost:5000/admin/reset-usage
```

⚠️ **WARNING:** Remove this endpoint before deploying to production!

### Option 3: Edit usage.json Directly
```json
{
  "count": 0,
  "lastReset": "2026-04-09",
  "limit": 15,
  "history": []
}
```

Save the file and the next API call will recognize the new count.

## Monitoring Usage

### Check Usage Before Uploading
```typescript
// Frontend example
const response = await fetch('http://localhost:5000/api/usage/stats');
const data = await response.json();

if (data.usage.remaining === 0) {
  showMessage('Sorry, all 15 analyses have been used.');
} else {
  showMessage(`${data.usage.remaining} analyses remaining`);
}
```

### React Component Integration
```typescript
import { useState, useEffect } from 'react';

export function UsageDisplay() {
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/usage/stats')
      .then(r => r.json())
      .then(data => setUsage(data.usage));
  }, []);

  if (!usage) return <div>Loading...</div>;

  return (
    <div>
      <p>Analyses Used: {usage.used} / {usage.limit}</p>
      <p>Remaining: {usage.remaining}</p>
      <div style={{ width: '100%', background: '#eee' }}>
        <div style={{ 
          width: `${usage.percentage}%`, 
          background: '#4CAF50',
          height: '20px'
        }} />
      </div>
    </div>
  );
}
```

## Production Considerations

### 1. Display Usage to Users
Always show users how many analyses they have remaining. This improves transparency and UX.

### 2. Handle Limit Gracefully
Show a friendly message when limit is reached:
```
"You've used all 15 analyses. Please contact support to request additional analyses."
```

### 3. Monitor Usage History
Review `usage.json` history to understand:
- When analyses were used
- Which files were analyzed
- Usage patterns

### 4. Plan for Scaling
For production deployment, consider:
- **Per-user limits** - Different limit per user/account
- **Quota system** - Daily/weekly/monthly quotas
- **Database storage** - Move from JSON to database
- **Billing integration** - Charge users for additional analyses

### 5. Security
- ✅ Ensure usage.json is not publicly accessible
- ✅ Do not expose reset endpoint in production
- ✅ Log all usage changes for audit trail
- ✅ Consider rate limiting + usage limit together

## Troubleshooting

### Issue: Usage limit error on first upload
**Cause:** count is already at 15 in usage.json  
**Solution:** Reset using methods above

### Issue: Usage.json file missing
**Cause:** File was deleted or not created  
**Solution:** Restart server - it will recreate the file

### Issue: Usage doesn't increment
**Cause:** Error during analysis (before increment)  
**Solution:** Only successful analyses increment count. Check error logs.

### Issue: Usage persists after wanted reset
**Cause:** Didn't properly reset (edit still in memory)  
**Solution:** Restart server after modifying usage.json

## Future Enhancements

- [ ] Per-user/per-account limits
- [ ] Database storage for usage
- [ ] Daily/weekly/monthly quota reset options
- [ ] Usage analytics dashboard
- [ ] Payment integration for additional analyses
- [ ] Usage notifications/warnings
- [ ] Admin panel for managing user quotas

## Files Involved

- **Core:** `backend/services/usageService.js`
- **Middleware:** `backend/middleware/usageLimit.js`
- **Controller:** `backend/controllers/resumeController.js`
- **Routes:** `backend/routes/analyze.js`
- **Data:** `backend/usage.json`
- **Config:** `backend/.env` (no usage-specific config needed)

## Summary

The usage limit feature provides a simple yet effective way to control costs and manage API usage. The 15-resume limit is:
- Enforced before processing
- Persisted to survive restarts
- Queryable without consuming analyses
- Easily testable and debuggable

---

**Need to modify this limit?** Edit `USAGE_LIMIT = 15` in `backend/services/usageService.js` and restart the server.
