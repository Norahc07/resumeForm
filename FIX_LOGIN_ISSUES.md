# Fix Login Issues - Quick Guide

## Issues Fixed

1. ✅ **Firestore Rules** - Now allow users to read their own admin_status document
2. ✅ **Login Redirect** - Now waits for admin status check before redirecting
3. ✅ **Protected Route** - Better handling of admin status verification

## What Changed

### 1. Firestore Rules Update

**Before:** Only admins could read admin_status (chicken-and-egg problem)
**After:** Users can read their own admin_status document to check if they're admin

```javascript
// Users can read their own admin status
allow read: if request.auth != null && request.auth.uid == userId;
// Only admins can write
allow write: if isAdmin();
```

### 2. Login Flow Update

**Before:** Redirected immediately after login, before admin check completed
**After:** Waits for admin status check, then redirects or shows error

### 3. Protected Route Update

**Before:** Redirected too quickly if admin check was still pending
**After:** Waits for admin verification before redirecting

## Next Steps

### 1. Deploy Updated Firestore Rules

**IMPORTANT:** You must deploy the updated rules for this to work!

```bash
firebase deploy --only firestore:rules
```

**OR** via Firebase Console:
1. Go to Firestore > Rules tab
2. Copy content from `firestore.rules`
3. Paste and click "Publish"

### 2. Verify Admin Documents Exist

Make sure both admin documents exist in Firestore:
- `artifacts/resume-builder/users/W3UqWfTd9EP78htlMGCKNJE0my33/roles/admin_status`
- `artifacts/resume-builder/users/DuEg8FnY75aCGybMoJ4uvpxt0Gy2/roles/admin_status`

Both should have `isAdmin: true`

### 3. Test Login

1. **Restart dev server** (if running):
   ```bash
   npm run dev
   ```

2. **Test login:**
   - Go to `/admin/login`
   - Username: `admin`
   - Password: `michigi2025`
   - Should redirect to dashboard after ~1 second

3. **Check browser console:**
   - Should see "Login successful!" toast
   - Should NOT see "Missing or insufficient permissions" errors
   - Should redirect to `/admin` dashboard

## Troubleshooting

### Still seeing "Missing or insufficient permissions"?
- ✅ Deploy the updated Firestore rules
- ✅ Verify admin documents exist in Firestore
- ✅ Check that `isAdmin: true` field exists
- ✅ Refresh browser and clear cache

### Login successful but still on login page?
- ✅ Check browser console for errors
- ✅ Verify admin document path matches exactly
- ✅ Wait a few seconds - redirect happens after admin check
- ✅ Check that `APP_ID` in config.js is `resume-builder`

### "Access denied" after login?
- ✅ Verify admin document exists for your user UID
- ✅ Check `isAdmin` field is boolean `true` (not string)
- ✅ Verify Firestore rules are deployed

## Expected Behavior After Fix

1. User enters username/password
2. Login succeeds
3. System checks admin status (reads own admin_status document)
4. If admin: Redirects to `/admin` dashboard
5. If not admin: Shows error and signs out

## Quick Checklist

- [ ] Updated Firestore rules deployed
- [ ] Admin documents exist in Firestore
- [ ] `isAdmin: true` field set for both users
- [ ] Tested login with `admin` / `michigi2025`
- [ ] Successfully redirects to dashboard
- [ ] No permission errors in console

