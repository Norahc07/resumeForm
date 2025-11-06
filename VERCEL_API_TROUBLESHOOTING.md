# Vercel API 404 Error - Troubleshooting Guide

## Problem
Getting 404 error when calling `/api/upload-resume` from Vercel deployment.

## Solutions

### 1. Verify Function is Deployed

Check Vercel Dashboard:
1. Go to your project: https://vercel.com/dashboard
2. Click on your deployment
3. Go to **Functions** tab
4. Look for `api/upload-resume.js`
5. If not there, the function wasn't deployed

### 2. Check Function Structure

The function must be:
- Located in `api/` folder
- Named correctly: `upload-resume.js` → accessible at `/api/upload-resume`
- Export correctly: `module.exports = async (req, res) => { ... }`

### 3. Verify Environment Variables

Make sure these are set in Vercel:
- `EMAIL_USER` - Your Gmail address
- `EMAIL_PASSWORD` - Gmail App Password

**Check:**
1. Vercel Dashboard → Settings → Environment Variables
2. Verify they're set for **Production**, **Preview**, and **Development**

### 4. Redeploy After Changes

After updating the function:
```bash
git add .
git commit -m "Fix API function"
git push
```

Or manually redeploy in Vercel Dashboard.

### 5. Check Function Logs

1. Go to Vercel Dashboard → Your Project
2. Click on a deployment
3. Go to **Functions** tab
4. Click on `api/upload-resume`
5. Check **Logs** for errors

### 6. Test the Function Directly

Try calling it directly:
```
https://resume-form-eight.vercel.app/api/upload-resume
```

Should return 405 (Method Not Allowed) for GET, which means the function exists.

### 7. Common Issues

#### Issue: Function not found (404)
**Cause:** Function not deployed or wrong path
**Fix:** 
- Make sure file is in `api/` folder
- Redeploy the project
- Check Vercel Functions tab

#### Issue: Email credentials error
**Cause:** Environment variables not set
**Fix:**
- Set `EMAIL_USER` and `EMAIL_PASSWORD` in Vercel
- Redeploy after setting variables

#### Issue: CORS error
**Cause:** CORS headers not set correctly
**Fix:** Already handled in the function code

#### Issue: Function timeout
**Cause:** Email sending takes too long
**Fix:** Already set to 30 seconds in `vercel.json`

## Testing Checklist

- [ ] Function appears in Vercel Functions tab
- [ ] Environment variables are set
- [ ] Function logs show no errors
- [ ] GET request to `/api/upload-resume` returns 405 (not 404)
- [ ] POST request with valid data works
- [ ] Email is sent successfully

## Next Steps

1. **Verify deployment:**
   - Check Vercel Dashboard → Functions tab
   - Should see `api/upload-resume.js`

2. **Set environment variables:**
   - `EMAIL_USER` = your Gmail
   - `EMAIL_PASSWORD` = Gmail App Password

3. **Redeploy:**
   - Push changes to Git
   - Or manually redeploy in Vercel

4. **Test:**
   - Try uploading a resume image
   - Check Vercel function logs
   - Verify email is received

