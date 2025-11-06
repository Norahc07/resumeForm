# Setup Guide

## Initial Setup Steps

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable the following services:
   - **Authentication**: Enable Anonymous and Email/Password providers
   - **Firestore Database**: Create database in production mode (we'll add rules)
   - **Cloud Functions**: Enable billing (required for Cloud Functions)
   - **Hosting**: Will be used for deployment

### 2. Environment Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click the web icon (`</>`) to add a web app
   - Copy the config values to your `.env` file

3. Update `VITE_APP_ID` in `.env` to match your project identifier (default: `resume-builder`)

### 3. Create PWA Icons

You need to create two icon files in the `public` folder:

- `public/icon-192.png` (192x192 pixels)
- `public/icon-512.png` (512x512 pixels)

You can use any image editing tool or online icon generator. These icons will be used for the PWA install prompt.

### 4. Firestore Security Rules

1. Deploy the security rules:
```bash
firebase deploy --only firestore:rules
```

2. The rules are configured in `firestore.rules` and enforce:
   - Anyone authenticated can create submissions
   - Only admins can read/update/delete submissions
   - Only admins can manage admin roles

### 5. Create Your First Admin User

1. Go to Firebase Console > Authentication
2. Add a user with Email/Password authentication
3. Note the User UID

4. In Firestore, create a document:
   - Collection path: `artifacts/resume-builder/users/{USER_UID}/roles/admin_status`
   - Document data:
     ```json
     {
       "isAdmin": true
     }
     ```
   - Replace `resume-builder` with your `APP_ID` if different
   - Replace `{USER_UID}` with the actual user UID

### 6. Cloud Functions Setup

1. Install Firebase CLI globally (if not already installed):
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in the project (if not already done):
```bash
firebase init
```
   - Select Functions and Hosting
   - Use existing project
   - Choose JavaScript
   - Install dependencies: Yes

4. Install function dependencies:
```bash
cd functions
npm install
cd ..
```

5. Configure email settings for Cloud Functions:
```bash
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"
```

   **Note for Gmail**: You'll need to use an "App Password" instead of your regular password:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate an app password for "Mail"
   - Use that password in the config

### 7. Development

1. Start the development server:
```bash
npm run dev
```

2. The app will be available at `http://localhost:5173`

3. Test the application:
   - Submit a resume as an anonymous user
   - Login as admin at `/admin/login`
   - View and manage submissions

### 8. Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to Firebase:
```bash
# Deploy hosting
firebase deploy --only hosting

# Deploy functions
firebase deploy --only functions

# Deploy everything
firebase deploy
```

## Troubleshooting

### PWA Not Installing
- Make sure you're using HTTPS (required for PWA)
- Check that `manifest.json` is accessible
- Verify service worker is registered (check browser DevTools > Application > Service Workers)

### Cloud Functions Not Working
- Ensure billing is enabled in Firebase
- Check function logs: `firebase functions:log`
- Verify email configuration: `firebase functions:config:get`

### Authentication Issues
- Verify Authentication providers are enabled in Firebase Console
- Check that Firestore rules allow the operations you're trying to perform

### Firestore Permission Denied
- Verify admin user document exists in Firestore
- Check that `APP_ID` in code matches the one in Firestore
- Review Firestore rules in `firestore.rules`

## Next Steps

- Customize the resume HTML template in `functions/index.js`
- Adjust email template in Cloud Functions
- Add more validation rules
- Customize styling with Tailwind CSS
- Add more features as needed

