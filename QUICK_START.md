# Quick Start Guide

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Firebase account created
- [ ] Firebase project created with required services enabled

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your Firebase config values
```

### 3. Create PWA Icons
Create two icon files in `public/`:
- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)

### 4. Set Up Firebase
```bash
# Login to Firebase
firebase login

# Initialize (if needed)
firebase init

# Install function dependencies
cd functions && npm install && cd ..
```

### 5. Create Admin User
1. Firebase Console > Authentication > Add user (Email/Password)
2. Firestore > Create document:
   - Path: `artifacts/resume-builder/users/{USER_UID}/roles/admin_status`
   - Data: `{ "isAdmin": true }`

### 6. Configure Email (for Cloud Functions)
```bash
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"
```

### 7. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 8. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` and you're ready to go!

## Testing

1. **Test Resume Submission**: Fill out the form and submit
2. **Test Admin Login**: Go to `/admin/login` and sign in
3. **Test Admin Dashboard**: View, edit, and delete submissions
4. **Test Email Function**: Click "Convert & Email" on a submission

## Common Issues

**"Permission denied" errors**: Check Firestore rules and admin user setup

**PWA not installing**: Ensure you're on HTTPS (required for PWA)

**Functions not working**: Verify billing is enabled and email config is set

For detailed setup instructions, see `SETUP.md`

