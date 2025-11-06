# Firestore Admin Setup - Quick Guide

## Your Admin Users

You have two admin users set up in Firebase Authentication:

1. **luigiamarillo007@gmail.com**
   - UID: `W3UqWfTd9EP78htlMGCKNJE0my33`
   - Login username: `luigiamarillo007` (or full email)

2. **admin@resumeform.local**
   - UID: `DuEg8FnY75aCGybMoJ4uvpxt0Gy2`
   - Login username: `admin`
   - Password: `michigi2025`

## Step-by-Step: Create Admin Documents in Firestore

### For User 1: luigiamarillo007@gmail.com

1. **In Firestore Database, click "Start collection"** (if database is empty)
   - OR click the path bar at the top if collections exist

2. **Create the document path:**
   ```
   artifacts/resume-builder/users/W3UqWfTd9EP78htlMGCKNJE0my33/roles/admin_status
   ```

3. **Steps:**
   - Collection: `artifacts`
   - Document: `resume-builder`
   - Subcollection: `users`
   - Document: `W3UqWfTd9EP78htlMGCKNJE0my33`
   - Subcollection: `roles`
   - Document: `admin_status`

4. **Add field:**
   - Field name: `isAdmin`
   - Type: `boolean`
   - Value: `true`
   - Click "Save"

### For User 2: admin@resumeform.local

1. **Create the document path:**
   ```
   artifacts/resume-builder/users/DuEg8FnY75aCGybMoJ4uvpxt0Gy2/roles/admin_status
   ```

2. **Steps:**
   - Collection: `artifacts`
   - Document: `resume-builder`
   - Subcollection: `users`
   - Document: `DuEg8FnY75aCGybMoJ4uvpxt0Gy2`
   - Subcollection: `roles`
   - Document: `admin_status`

3. **Add field:**
   - Field name: `isAdmin`
   - Type: `boolean`
   - Value: `true`
   - Click "Save"

## Quick Method: Direct Path Entry

If you prefer typing the path directly:

1. Click in the Firestore path bar at the top
2. Type: `artifacts/resume-builder/users/W3UqWfTd9EP78htlMGCKNJE0my33/roles/admin_status`
3. Press Enter
4. Add field: `isAdmin` = `true`
5. Click "Save"

Repeat for the second user:
1. Type: `artifacts/resume-builder/users/DuEg8FnY75aCGybMoJ4uvpxt0Gy2/roles/admin_status`
2. Press Enter
3. Add field: `isAdmin` = `true`
4. Click "Save"

## Final Structure Should Look Like:

```
Firestore Database
└── artifacts
    └── resume-builder
        └── users
            ├── W3UqWfTd9EP78htlMGCKNJE0my33
            │   └── roles
            │       └── admin_status
            │           └── isAdmin: true
            │
            └── DuEg8FnY75aCGybMoJ4uvpxt0Gy2
                └── roles
                    └── admin_status
                        └── isAdmin: true
```

## Testing Login

### Test User 1:
- Go to: `http://localhost:5173/admin/login`
- Username: `luigiamarillo007` (or `luigiamarillo007@gmail.com`)
- Password: (your Firebase password)
- Should redirect to dashboard

### Test User 2:
- Go to: `http://localhost:5173/admin/login`
- Username: `admin`
- Password: `michigi2025`
- Should redirect to dashboard

## Verification Checklist

- [ ] Admin document created for UID: `W3UqWfTd9EP78htlMGCKNJE0my33`
- [ ] Admin document created for UID: `DuEg8FnY75aCGybMoJ4uvpxt0Gy2`
- [ ] Both documents have `isAdmin: true`
- [ ] Both users can login successfully
- [ ] Both users can access `/admin` dashboard

## Troubleshooting

**If login fails:**
- Verify the document path is exactly: `artifacts/resume-builder/users/{UID}/roles/admin_status`
- Check `isAdmin` field is boolean `true` (not string "true")
- Verify `APP_ID` in `src/firebase/config.js` is `resume-builder`
- Check browser console for errors

**If access denied:**
- Verify Firestore rules are deployed
- Check that both documents exist
- Verify the UIDs match exactly (case-sensitive)

