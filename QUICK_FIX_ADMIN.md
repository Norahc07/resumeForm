# Quick Fix: Access Denied for luigiamarillo007@gmail.com

## The Problem

"Access denied" means the admin document doesn't exist in Firestore for your user.

## Your User Info
- **Email**: luigiamarillo007@gmail.com  
- **UID**: `W3UqWfTd9EP78htlMGCKNJE0my33`

## Quick Fix - Create Admin Document

### Step 1: Go to Firestore Database
1. Open Firebase Console: https://console.firebase.google.com/
2. Select project: `resumeform-48ff7`
3. Click "Firestore Database" in left sidebar

### Step 2: Create the Document (Easiest Method)

1. **Click the path bar at the top** of Firestore (where it shows the current collection path)

2. **Type this EXACT path:**
   ```
   artifacts/resume-builder/users/W3UqWfTd9EP78htlMGCKNJE0my33/roles/admin_status
   ```

3. **Press Enter**

4. **Click "Add field"**

5. **Add the field:**
   - **Field name**: `isAdmin`
   - **Type**: Select `boolean` (NOT string!)
   - **Value**: `true`

6. **Click "Save"**

### Step 3: Verify

The document should now exist at:
```
artifacts/resume-builder/users/W3UqWfTd9EP78htlMGCKNJE0my33/roles/admin_status
```

With content:
```json
{
  "isAdmin": true
}
```

### Step 4: Test Login

1. **Logout** if you're currently logged in
2. **Go to**: `http://localhost:5173/admin/login`
3. **Enter:**
   - Username: `luigiamarillo007` (or `luigiamarillo007@gmail.com`)
   - Password: (your Firebase password)
4. **Should now redirect to dashboard!**

## Troubleshooting

**Still "Access denied"?**
- ✅ Double-check the path is EXACTLY: `artifacts/resume-builder/users/W3UqWfTd9EP78htlMGCKNJE0my33/roles/admin_status`
- ✅ Verify `isAdmin` is boolean `true` (not string "true")
- ✅ Make sure Firestore rules are deployed: `firebase deploy --only firestore:rules`
- ✅ Clear browser cache and try again

**Can't create the document?**
- ✅ Make sure you're in the correct Firebase project
- ✅ Check that Email/Password auth is enabled
- ✅ Verify the UID matches exactly (case-sensitive)

## Both Admin Users Should Have Documents

Make sure BOTH users have admin documents:

1. **luigiamarillo007@gmail.com**
   - Path: `artifacts/resume-builder/users/W3UqWfTd9EP78htlMGCKNJE0my33/roles/admin_status`
   - `isAdmin: true`

2. **admin@resumeform.local**
   - Path: `artifacts/resume-builder/users/DuEg8FnY75aCGybMoJ4uvpxt0Gy2/roles/admin_status`
   - `isAdmin: true`

