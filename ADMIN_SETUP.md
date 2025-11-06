# Admin User Setup Guide

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `michigi2025`

The system uses username-based login, but Firebase requires email format internally. The username "admin" maps to `admin@resumeform.local`.

## Setting Up the Default Admin User

### Method 1: Using Firebase Console (Recommended)

1. **Create Authentication User**
   - Go to Firebase Console > Authentication
   - Click "Add user"
   - Email: `admin@resumeform.local`
   - Password: `michigi2025`
   - Click "Add user"
   - **Copy the User UID** (you'll need it for the next step)

2. **Create Admin Document in Firestore**
   - Go to Firebase Console > Firestore Database
   - Click "Start collection" or navigate to existing collection
   - Collection path: `artifacts`
   - Document ID: `resume-builder` (or your APP_ID)
   - Add subcollection: `users`
   - Document ID: `{USER_UID}` (paste the UID from step 1)
   - Add subcollection: `roles`
   - Document ID: `admin_status`
   - Add field:
     ```
     Field: isAdmin
     Type: boolean
     Value: true
     ```
   - Add field (optional):
     ```
     Field: username
     Type: string
     Value: admin
     ```
   - Click "Save"

3. **Verify Setup**
   - Go to your app: `http://localhost:5173/admin/login`
   - Username: `admin`
   - Password: `michigi2025`
   - Should redirect to dashboard

### Method 2: Using Firebase CLI

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Create user via CLI**:
   ```bash
   firebase auth:import users.json
   ```
   
   Create `users.json`:
   ```json
   {
     "users": [
       {
         "localId": "admin",
         "email": "admin@resumeform.local",
         "emailVerified": true,
         "passwordHash": "BASE64_ENCODED_PASSWORD_HASH",
         "displayName": "Admin"
       }
     ]
   }
   ```

4. **Create Firestore document** (use Method 1 step 2)

### Method 3: Using Admin SDK Script

1. **Download Service Account Key**:
   - Firebase Console > Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save as `serviceAccountKey.json` in project root

2. **Install Firebase Admin SDK**:
   ```bash
   npm install firebase-admin
   ```

3. **Run the setup script**:
   ```bash
   node scripts/create-admin-user.js
   ```

   **Note**: Make sure to update `appId` in the script to match your `APP_ID`.

## Full Firestore Path

The admin document should be located at:
```
artifacts/resume-builder/users/{USER_UID}/roles/admin_status
```

With data:
```json
{
  "isAdmin": true,
  "username": "admin"
}
```

## Creating Additional Admin Users

To create more admin users:

1. **Create user in Authentication** (any email format)
2. **Create admin document**:
   - Path: `artifacts/resume-builder/users/{NEW_USER_UID}/roles/admin_status`
   - Data: `{ isAdmin: true }`
3. **Login with**:
   - Username: The part before `@` in the email (or full email)
   - Password: The password you set

## Changing Default Password

1. Go to Firebase Console > Authentication
2. Find the user `admin@resumeform.local`
3. Click the three dots > "Reset password" or "Change password"
4. Set new password: `michigi2025` (or your preferred password)

## Troubleshooting

### "Login failed" error
- Verify user exists in Firebase Authentication
- Check email is exactly `admin@resumeform.local`
- Verify password is correct

### "Access denied" after login
- Check admin document exists in Firestore
- Verify path matches: `artifacts/{APP_ID}/users/{UID}/roles/admin_status`
- Verify `isAdmin: true` field exists
- Check `APP_ID` in `src/firebase/config.js` matches Firestore path

### User created but can't access dashboard
- Verify Firestore document was created correctly
- Check browser console for errors
- Verify `APP_ID` constant matches your Firestore structure

## Security Notes

⚠️ **Important**: 
- Change the default password in production
- Never commit `serviceAccountKey.json` to Git
- Use environment variables for sensitive data
- Regularly review admin users in Firebase Console

## Quick Reference

**Default Credentials:**
- Username: `admin`
- Password: `michigi2025`
- Email (internal): `admin@resumeform.local`

**Firestore Path:**
```
artifacts/resume-builder/users/{UID}/roles/admin_status
```

**Login URL:**
```
http://localhost:5173/admin/login
```

