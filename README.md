# Resume Builder PWA

A high-performance, responsive Progressive Web Application (PWA) for building and submitting professional resumes using React and Firebase.

## Features

- 📱 **Progressive Web App** - Installable, works offline, fast loading
- 📝 **Multi-step Resume Form** - Guided form with validation
- 👤 **Role-based Access** - Separate flows for users and admins
- 🔐 **Firebase Authentication** - Anonymous auth for users, email/password for admins
- 📊 **Real-time Admin Dashboard** - View, edit, delete submissions
- 🖼️ **Resume to Image Conversion** - Convert resumes to images via Cloud Functions
- 📧 **Email Delivery** - Send resume images via email
- 🎨 **Responsive Design** - Mobile-first with Tailwind CSS

## Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **PWA**: Workbox, Service Worker, Web App Manifest
- **Backend**: Firebase (Auth, Firestore, Functions, Hosting)
- **Styling**: Tailwind CSS (Mobile-first responsive design)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account and project
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ResumeForm
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Anonymous and Email/Password)
   - Create a Firestore database
   - Enable Cloud Functions

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration values

5. Set up Cloud Functions:
```bash
cd functions
npm install
cd ..
```

6. Configure Firebase Functions for email:
```bash
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"
```

### Development

1. Start the development server:
```bash
npm run dev
```

2. The app will be available at `http://localhost:5173`

3. For Cloud Functions (optional, for local testing):
```bash
cd functions
npm run serve
```

### Building for Production

1. Build the application:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

### Deployment

1. Deploy to Firebase Hosting:
```bash
firebase deploy --only hosting
```

2. Deploy Cloud Functions:
```bash
firebase deploy --only functions
```

3. Deploy Firestore Rules:
```bash
firebase deploy --only firestore:rules
```

## Project Structure

```
ResumeForm/
├── public/
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker
├── src/
│   ├── components/
│   │   ├── ResumeForm/        # Multi-step form components
│   │   ├── Admin/             # Admin components
│   │   ├── Toast.jsx          # Toast notifications
│   │   ├── Modal.jsx          # Modal component
│   │   └── ConfirmModal.jsx   # Confirmation modal
│   ├── pages/
│   │   ├── Home.jsx           # Main resume submission page
│   │   ├── AdminLogin.jsx     # Admin login page
│   │   └── AdminDashboard.jsx # Admin dashboard
│   ├── firebase/
│   │   ├── config.js          # Firebase configuration
│   │   ├── auth.js            # Authentication functions
│   │   ├── firestore.js      # Firestore operations
│   │   └── functions.js      # Cloud Functions client
│   ├── hooks/
│   │   └── useAuth.js        # Authentication hook
│   ├── context/
│   │   └── ToastContext.jsx  # Toast context provider
│   ├── utils/
│   │   └── validation.js     # Form validation utilities
│   ├── App.jsx               # Main app component with routing
│   └── main.jsx              # App entry point
├── functions/
│   └── index.js              # Cloud Functions
├── firebase.json              # Firebase configuration
├── firestore.rules            # Firestore security rules
└── vite.config.js            # Vite configuration with PWA plugin
```

## Usage

### For Resume Submitters

1. Navigate to the home page
2. Fill out the multi-step form:
   - Personal Information
   - Work Experience
   - Education
   - Skills
3. Submit the resume (anonymous authentication is automatic)

### For Admins

1. Navigate to `/admin/login`
2. Sign in with admin credentials
3. View all submissions in the dashboard
4. Click "View" to see/edit a submission
5. Use "Convert & Email" to generate an image and send via email
6. Delete submissions as needed

## Setting Up Admin Users

To create an admin user:

1. Create a user account in Firebase Authentication (Email/Password)
2. In Firestore, create the following document:
   - Path: `artifacts/resume-builder/users/{userId}/roles/admin_status`
   - Data: `{ isAdmin: true }`

Replace `resume-builder` with your `APP_ID` if different.

## PWA Features

- **Installable**: Users can add the app to their home screen
- **Offline Support**: App shell and cached data work offline
- **Fast Loading**: Service worker caches assets for instant loading
- **Responsive**: Works seamlessly on mobile, tablet, and desktop

## Security

- Firestore Security Rules enforce access control
- Admin routes are protected client-side and server-side
- Anonymous authentication for public submissions
- Email/password authentication for admin access

## Environment Variables

See `.env.example` for required environment variables. Make sure to:
- Never commit `.env` to version control
- Use Firebase Functions config for sensitive data (email credentials)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
