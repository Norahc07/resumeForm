# Firebase Authentication Setup Guide

## Error: auth/configuration-not-found

This error means **Email/Password authentication is not enabled** in your Firebase project.

## Quick Fix Steps

### Step 1: Enable Email/Password Authentication

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `resumeform-48ff7`

2. **Navigate to Authentication**
   - Click on "Authentication" in the left sidebar
   - If you see "Get started", click it

3. **Enable Email/Password Provider**
   - Click on the "Sign-in method" tab
   - Find "Email/Password" in the list
   - Click on it
   - **Toggle "Enable" to ON**
   - Click "Save"

4. **Enable Anonymous Authentication (for users)**
   - Still in "Sign-in method" tab
   - Find "Anonymous" in the list
   - Click on it
   - **Toggle "Enable" to ON**
   - Click "Save"

### Step 2: Create the Admin User

**Your admin users are already created:**

1. **luigiamarillo007@gmail.com**
   - UID: `W3UqWfTd9EP78htlMGCKNJE0my33`
   - Login username: `luigiamarillo007`

2. **admin@resumeform.local**
   - UID: `DuEg8FnY75aCGybMoJ4uvpxt0Gy2`
   - Login username: `admin`
   - Password: `michigi2025`

**If you need to create more admin users:**
1. Go to Authentication > Users tab
2. Click "Add user"
3. Enter email and password
4. Copy the User UID for Firestore setup

### Step 3: Create Admin Documents in Firestore

**You need to create admin documents for both users:**

#### For User 1: luigiamarillo007@gmail.com

1. **In Firestore, click the path bar at the top**
2. **Type this exact path:**
   ```
   artifacts/resume-builder/users/W3UqWfTd9EP78htlMGCKNJE0my33/roles/admin_status
   ```
3. **Press Enter**
4. **Add field:**
   - Field name: `isAdmin`
   - Type: `boolean`
   - Value: `true`
   - Click "Save"

#### For User 2: admin@resumeform.local

1. **In Firestore, click the path bar at the top**
2. **Type this exact path:**
   ```
   artifacts/resume-builder/users/DuEg8FnY75aCGybMoJ4uvpxt0Gy2/roles/admin_status
   ```
3. **Press Enter**
4. **Add field:**
   - Field name: `isAdmin`
   - Type: `boolean`
   - Value: `true`
   - Click "Save"

**See `FIRESTORE_ADMIN_SETUP.md` for detailed visual guide.**

### Step 4: Verify Firestore Rules

Make sure your Firestore rules allow admin access. Check `firestore.rules` file.

### Step 5: Test Login

1. Start your dev server: `npm run dev`
2. Navigate to: `http://localhost:5173/admin/login`
3. **Test User 1:**
   - Username: `luigiamarillo007` (or full email)
   - Password: (your Firebase password)
   
   **OR Test User 2:**
   - Username: `admin`
   - Password: `michigi2025`
   
4. Should redirect to dashboard!

## Alternative: Direct Firestore Path Creation

**For your specific users, use these exact paths:**

**User 1:**
```
artifacts/resume-builder/users/W3UqWfTd9EP78htlMGCKNJE0my33/roles/admin_status
```

**User 2:**
```
artifacts/resume-builder/users/DuEg8FnY75aCGybMoJ4uvpxt0Gy2/roles/admin_status
```

1. In Firestore, click the path bar at the top
2. Paste one of the paths above
3. Press Enter
4. Add field: `isAdmin` (boolean) = `true`
5. Click "Save"
6. Repeat for the second user

## Troubleshooting

### Still getting "configuration-not-found"?
- ✅ Verify Email/Password is enabled in Firebase Console
- ✅ Check that you're using the correct Firebase project
- ✅ Verify your Firebase config in `src/firebase/config.js` matches your project
- ✅ Try refreshing the page and clearing browser cache

### "User not found" error?
- ✅ Verify the user exists in Authentication > Users
- ✅ Check the email is exactly `admin@resumeform.local`
- ✅ Verify password is correct

### "Access denied" after login?
- ✅ Check admin document exists in Firestore
- ✅ Verify path: `artifacts/resume-builder/users/{UID}/roles/admin_status`
- ✅ Check `isAdmin` field is set to `true`
- ✅ Verify `APP_ID` in config.js matches Firestore path

## Visual Guide

```
Firebase Console Structure:
├── Authentication
│   ├── Sign-in method
│   │   ├── Email/Password [ENABLED] ← Must be ON
│   │   └── Anonymous [ENABLED] ← Must be ON
│   └── Users
│       └── admin@resumeform.local ← Create this user
│
└── Firestore Database
    └── artifacts
        └── resume-builder
            └── users
                └── {USER_UID}
                    └── roles
                        └── admin_status
                            └── isAdmin: true ← Create this
```

## Quick Checklist

- [ ] Email/Password authentication enabled
- [ ] Anonymous authentication enabled
- [ ] Admin documents created for both users:
  - [ ] `W3UqWfTd9EP78htlMGCKNJE0my33` (luigiamarillo007@gmail.com)
  - [ ] `DuEg8FnY75aCGybMoJ4uvpxt0Gy2` (admin@resumeform.local)
- [ ] Admin document created in Firestore
- [ ] `isAdmin: true` field set
- [ ] Firestore rules deployed
- [ ] Test login works

## Need Help?

If you're still having issues:
1. Check browser console for detailed error messages
2. Verify Firebase project ID matches in config.js
3. Make sure you're logged into the correct Firebase project
4. Check Firebase Console > Project Settings > General for your config values

