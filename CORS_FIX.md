# CORS Error Fix Guide

## Understanding the CORS Error

The CORS (Cross-Origin Resource Sharing) error occurs when:
- Your frontend (localhost:5173) tries to call a Cloud Function
- The Cloud Function doesn't return proper CORS headers
- The browser blocks the request for security reasons

## Solution

### For `onCall` Functions (Current Implementation)

Firebase `onCall` functions should handle CORS automatically. If you're still getting CORS errors:

1. **Ensure the function is deployed:**
   ```bash
   cd functions
   npm install
   firebase deploy --only functions
   ```

2. **Verify the region matches:**
   - The function is deployed in `us-central1`
   - The client code specifies `us-central1` in `getFunctions(app, 'us-central1')`

3. **Check authentication:**
   - Make sure the user is authenticated before calling the function
   - The function requires authentication (`context.auth` check)

### Alternative: Use `onRequest` with CORS (If needed)

If `onCall` continues to have issues, you can convert to `onRequest` with explicit CORS:

```javascript
const cors = require('cors')({ origin: true });

exports.uploadResumeImageAndEmail = functions.https.onRequest(async (req, res) => {
  // Handle CORS preflight
  cors(req, res, async () => {
    // Your function logic here
  });
});
```

**Note:** This requires installing `cors`:
```bash
cd functions
npm install cors
```

## Current Status

✅ The function is configured as `onCall` which should handle CORS automatically
✅ The client code specifies the correct region (`us-central1`)
✅ Authentication is properly checked

## Next Steps

1. **Deploy the function:**
   ```bash
   cd functions
   firebase deploy --only functions:uploadResumeImageAndEmail
   ```

2. **Test from production URL:**
   - The CORS error might only occur in local development
   - Test from your deployed Vercel URL: https://resume-form-eight.vercel.app/

3. **Check Firebase Console:**
   - Go to Firebase Console > Functions
   - Verify the function is deployed and active
   - Check function logs for any errors

## Local Development

If you want to test locally with the emulator:

1. **Start the emulator:**
   ```bash
   firebase emulators:start --only functions
   ```

2. **Update client code:**
   Uncomment the emulator connection in `src/firebase/functions.js`:
   ```javascript
   if (import.meta.env.DEV) {
     connectFunctionsEmulator(functions, 'localhost', 5001);
   }
   ```

## Common Issues

1. **Function not deployed:** Deploy the function first
2. **Wrong region:** Ensure region matches in both function and client
3. **Authentication missing:** User must be logged in as admin
4. **Function error:** Check Firebase Console logs for runtime errors

