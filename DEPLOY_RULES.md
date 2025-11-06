# Deploy Firestore Security Rules

## Current Rules Status

Your Firestore rules are currently set to deny all access. You need to deploy the updated rules to allow:
- ✅ Users to create submissions
- ✅ Admins to read/update/delete submissions
- ✅ Admins to manage admin roles

## Deploy Rules

### Option 1: Using Firebase CLI (Recommended)

1. **Make sure you're in the project directory:**
   ```bash
   cd C:\Users\Luigi Amarillo\Documents\Projects\ResumeForm
   ```

2. **Login to Firebase (if not already):**
   ```bash
   firebase login
   ```

3. **Initialize Firebase (if not done):**
   ```bash
   firebase init firestore
   ```
   - Select existing project: `resumeform-48ff7`
   - Use existing `firestore.rules` file
   - Use existing `firestore.indexes.json` file

4. **Deploy the rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```

5. **Verify deployment:**
   - Go to Firebase Console > Firestore > Rules tab
   - You should see the updated rules

### Option 2: Using Firebase Console

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select project: `resumeform-48ff7`

2. **Navigate to Firestore Rules**
   - Click "Firestore Database" in left sidebar
   - Click "Rules" tab

3. **Copy the rules from `firestore.rules` file**
   - Open `firestore.rules` in your editor
   - Copy all the content

4. **Paste into Firebase Console**
   - Replace the existing rules in the editor
   - Click "Publish"

## Verify Rules Are Working

After deploying:

1. **Test User Submission:**
   - Submit a resume from the home page
   - Should work (creates document)

2. **Test Admin Access:**
   - Login as admin
   - Should be able to view submissions
   - Should be able to edit/delete

3. **Check Rules in Console:**
   - Go to Firestore > Rules tab
   - Rules should match `firestore.rules` file

## Rules Explanation

The deployed rules:

- **Allow authenticated users to create submissions** (`allow create`)
- **Allow only admins to read submissions** (`allow read: if isAdmin()`)
- **Allow only admins to update/delete** (`allow update, delete: if isAdmin()`)
- **Allow only admins to manage admin roles**
- **Deny all other access** (default deny)

## Troubleshooting

**"Permission denied" errors:**
- ✅ Verify rules are deployed: `firebase deploy --only firestore:rules`
- ✅ Check admin documents exist in Firestore
- ✅ Verify `APP_ID` in rules matches your Firestore structure (`resume-builder`)

**Rules not updating:**
- ✅ Wait a few seconds after deploying
- ✅ Refresh Firebase Console
- ✅ Clear browser cache

**Still getting errors:**
- ✅ Check browser console for specific error messages
- ✅ Verify admin document path is correct
- ✅ Ensure `isAdmin: true` field exists

## Quick Deploy Command

```bash
firebase deploy --only firestore:rules
```

This will deploy the rules from your `firestore.rules` file to Firebase.

