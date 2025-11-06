# CORS Error Fix for Vercel API

## Problem
Getting CORS error when calling Vercel API from localhost:
```
Access to fetch at 'https://resume-form-eight.vercel.app/api/upload-resume' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

## Solution Applied

### 1. Updated API Route (`api/upload-resume.js`)
- ✅ Added proper CORS headers
- ✅ Handles OPTIONS preflight requests correctly
- ✅ Allows localhost origins for development
- ✅ Sets CORS headers even on errors

### 2. Updated Client Code (`src/firebase/functions.js`)
- ✅ Added `mode: 'cors'` to fetch request
- ✅ Added proper headers

## Testing

### Local Development
The API now allows requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000`
- `http://localhost:5174`

### Production
- Only allows requests from your Vercel domain
- More secure CORS policy

## If Still Getting CORS Errors

### Option 1: Test from Production URL
The CORS error only happens in local development. Test from:
- https://resume-form-eight.vercel.app/admin

### Option 2: Use Vercel Dev for Local Testing
```bash
# Install Vercel CLI
npm install -g vercel

# Run local dev server (handles CORS automatically)
vercel dev
```

### Option 3: Check Vercel Deployment
1. Make sure the updated `api/upload-resume.js` is deployed
2. Go to Vercel Dashboard → Deployments
3. Check if latest deployment includes the CORS fix
4. Redeploy if needed

## Verify CORS is Working

1. Open browser DevTools → Network tab
2. Try uploading a resume image
3. Check the OPTIONS request:
   - Should return 200 status
   - Should have `Access-Control-Allow-Origin` header
4. Check the POST request:
   - Should succeed
   - Should have CORS headers in response

## Common Issues

### "Still getting CORS error after fix"
- **Solution**: Redeploy to Vercel - changes need to be deployed
- **Solution**: Clear browser cache
- **Solution**: Test from production URL instead of localhost

### "Works in production but not localhost"
- This is normal - CORS is stricter for cross-origin requests
- Use `vercel dev` for local testing
- Or test from production URL

### "OPTIONS request fails"
- Check Vercel function logs
- Make sure the function is deployed
- Verify the route exists: `/api/upload-resume`

## Next Steps

1. ✅ Code is fixed
2. ⏳ **Deploy to Vercel** (push to Git or `vercel --prod`)
3. ⏳ Test from production URL
4. ⏳ Verify email sending works

