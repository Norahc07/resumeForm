# Create Admin Document for luigiamarillo007@gmail.com

## Your User Info
- **Email**: luigiamarillo007@gmail.com
- **UID**: W3UqWfTd9EP78htlMGCKNJE0my33

## Quick Steps to Create Admin Document

### Method 1: Direct Path Entry (Easiest)

1. **Go to Firestore Database** in Firebase Console
2. **Click the path bar at the top** (where it shows the current path)
3. **Type this exact path:**
   ```
   artifacts/resume-builder/users/W3UqWfTd9EP78htlMGCKNJE0my33/roles/admin_status
   ```
4. **Press Enter**
5. **Click "Add field"**
6. **Add:**
   - Field name: `isAdmin`
   - Type: Select `boolean` (NOT string!)
   - Value: `true`
7. **Click "Save"**

### Method 2: Step-by-Step Creation

1. **Create collection `artifacts`** (if doesn't exist)
   - Click "Start collection"
   - Collection ID: `artifacts`
   - Document ID: `resume-builder`
   - Click "Next" then "Save"

2. **Create subcollection `users`**
   - Click on `artifacts` collection
   - Click on `resume-builder` document
   - Click "Start collection" (subcollection)
   - Collection ID: `users`
   - Document ID: `W3UqWfTd9EP78htlMGCKNJE0my33`
   - Click "Next" then "Save"

3. **Create subcollection `roles`**
   - Click on `users` collection
   - Click on the UID document (`W3UqWfTd9EP78htlMGCKNJE0my33`)
   - Click "Start collection"
   - Collection ID: `roles`
   - Document ID: `admin_status`
   - Click "Next"

4. **Add admin field**
   - Field name: `isAdmin`
   - Type: `boolean`
   - Value: `true`
   - Click "Save"

## Verify Document Structure

After creating, the path should be:
```
artifacts/resume-builder/users/W3UqWfTd9EP78htlMGCKNJE0my33/roles/admin_status
```

And the document should contain:
```json
{
  "isAdmin": true
}
```

## Test Login Again

1. **Logout** if currently logged in
2. **Go to** `/admin/login`
3. **Enter:**
   - Username: `luigiamarillo007` (or `luigiamarillo007@gmail.com`)
   - Password: (your Firebase password)
4. **Should redirect to dashboard!**

## Troubleshooting

**Still getting "Access denied"?**
- ✅ Verify document path is EXACTLY: `artifacts/resume-builder/users/W3UqWfTd9EP78htlMGCKNJE0my33/roles/admin_status`
- ✅ Check `isAdmin` is boolean `true` (not string "true")
- ✅ Verify `APP_ID` in `src/firebase/config.js` is `resume-builder`
- ✅ Check Firestore rules are deployed
- ✅ Clear browser cache and try again

**Can't find the document?**
- ✅ Use the path bar method (Method 1) - it's the easiest
- ✅ Make sure you're in the correct Firebase project: `resumeform-48ff7`
- ✅ Check that the UID matches exactly (case-sensitive)

