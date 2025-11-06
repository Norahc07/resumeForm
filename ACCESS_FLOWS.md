# Access Flows Documentation

This document outlines the complete user and admin access flows for the Resume Builder PWA.

## Table of Contents
1. [User Flow (Resume Submitter)](#user-flow-resume-submitter)
2. [Admin Flow](#admin-flow)
3. [Authentication Flow](#authentication-flow)
4. [Authorization Checks](#authorization-checks)
5. [Data Flow Diagrams](#data-flow-diagrams)

---

## User Flow (Resume Submitter)

### Overview
Users can submit resumes without creating an account. They use anonymous authentication for a frictionless experience.

### Step-by-Step Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER ACCESS FLOW                             │
└─────────────────────────────────────────────────────────────────┘

1. LANDING PAGE (/)
   │
   ├─> User visits the application
   ├─> Sees the Resume Builder form
   └─> No authentication required to start

2. FORM FILLING
   │
   ├─> Step 1: Personal Information
   │   ├─> Full Name (required)
   │   ├─> Email (required)
   │   ├─> Phone (optional)
   │   ├─> Address (optional)
   │   ├─> LinkedIn (optional)
   │   └─> Website (optional)
   │
   ├─> Step 2: Work Experience
   │   ├─> Add multiple experiences
   │   ├─> Job Title (required)
   │   ├─> Company (required)
   │   ├─> Start Date (required)
   │   ├─> End Date (optional)
   │   ├─> Current Position checkbox
   │   └─> Description (optional)
   │
   ├─> Step 3: Education
   │   ├─> Add multiple education entries
   │   ├─> Degree (required)
   │   ├─> Institution (required)
   │   ├─> Start Date (optional)
   │   ├─> End Date (optional)
   │   └─> GPA (optional)
   │
   └─> Step 4: Skills & Summary
       ├─> Add skills (tags)
       └─> Professional Summary (optional)

3. VALIDATION
   │
   ├─> Client-side validation on each step
   ├─> Required fields checked
   ├─> Email format validated
   ├─> URL format validated (if provided)
   └─> At least one experience and education required

4. SUBMISSION
   │
   ├─> User clicks "Submit Resume"
   ├─> System automatically signs in anonymously
   │   └─> Firebase Anonymous Authentication
   ├─> Resume data saved to Firestore
   │   └─> Path: artifacts/{APP_ID}/public/data/submissions/{submissionId}
   ├─> Success toast notification shown
   └─> Form reset for new submission

5. POST-SUBMISSION
   │
   ├─> User receives confirmation
   ├─> Can submit another resume (new anonymous session)
   └─> No access to view/edit submitted resumes
```

### User Permissions

| Action | Permission |
|--------|-----------|
| View Home Page | ✅ Public (No auth required) |
| Fill Resume Form | ✅ Public (No auth required) |
| Submit Resume | ✅ Anonymous Auth (Auto-created) |
| View Own Submissions | ❌ Not available |
| Edit Own Submissions | ❌ Not available |
| Delete Own Submissions | ❌ Not available |

### Anonymous Authentication Details

- **When**: Automatically triggered on form submission
- **Purpose**: Associate submission with a unique user ID
- **Duration**: Session-based (cleared on browser close)
- **No Password Required**: Zero friction for users
- **User ID**: Used as submission identifier until admin processes it

---

## Admin Flow

### Overview
Admins have full CRUD access to all submissions. They authenticate with email/password and must have admin status in Firestore.

### Step-by-Step Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN ACCESS FLOW                            │
└─────────────────────────────────────────────────────────────────┘

1. ADMIN LOGIN (/admin/login)
   │
   ├─> Admin navigates to /admin/login
   ├─> Enters email and password
   ├─> System authenticates with Firebase
   │   └─> Email/Password Authentication
   ├─> System checks admin status in Firestore
   │   └─> Path: artifacts/{APP_ID}/users/{userId}/roles/admin_status
   ├─> If isAdmin === true:
   │   ├─> Redirect to /admin dashboard
   │   └─> Set admin context
   └─> If not admin:
       ├─> Show error message
       └─> Stay on login page

2. ADMIN DASHBOARD (/admin)
   │
   ├─> Real-time subscription to Firestore
   │   └─> onSnapshot listener for submissions
   ├─> Display all submissions in table/cards
   │   ├─> Name
   │   ├─> Email
   │   ├─> Date Submitted
   │   └─> Status (pending/processed)
   │
   ├─> Responsive Design:
   │   ├─> Desktop: Full table view
   │   └─> Mobile: Card view with key info
   │
   └─> Actions Available:
       ├─> View Submission (opens detail view)
       ├─> Delete Submission (with confirmation)
       └─> Logout

3. VIEW/EDIT SUBMISSION
   │
   ├─> Click "View" on any submission
   ├─> Opens AdminSubmissionView component
   ├─> Displays full resume data:
   │   ├─> Personal Information
   │   ├─> Professional Summary
   │   ├─> Work Experience
   │   ├─> Education
   │   └─> Skills
   │
   ├─> Edit Mode:
   │   ├─> Click "Edit" button
   │   ├─> Form fields become editable
   │   ├─> Make changes
   │   ├─> Click "Save"
   │   ├─> Updates Firestore document
   │   └─> Success notification
   │
   └─> Actions Available:
       ├─> Edit Submission
       ├─> Convert & Email (see below)
       ├─> Delete Submission
       └─> Back to Dashboard

4. CONVERT & EMAIL RESUME
   │
   ├─> Click "Convert & Email" button
   ├─> Modal opens requesting recipient email
   ├─> Enter recipient email address
   ├─> Click "Send Email"
   │
   ├─> Cloud Function Triggered:
   │   ├─> convertResumeToImageAndEmail()
   │   ├─> Retrieves submission from Firestore
   │   ├─> Generates HTML template
   │   ├─> Uses Puppeteer to render HTML
   │   ├─> Takes screenshot (PNG image)
   │   ├─> Sends email with image attachment
   │   └─> Updates submission status to "processed"
   │
   ├─> Success/Failure feedback shown
   └─> Submission status updated in real-time

5. DELETE SUBMISSION
   │
   ├─> Click "Delete" button
   ├─> Confirmation modal appears
   ├─> Confirm deletion
   ├─> Document deleted from Firestore
   ├─> Success notification
   └─> Removed from dashboard (real-time update)

6. LOGOUT
   │
   ├─> Click "Logout" button
   ├─> Firebase signOut() called
   ├─> Admin context cleared
   ├─> Redirect to home page (/)
   └─> Must login again to access /admin
```

### Admin Permissions

| Action | Permission |
|--------|-----------|
| Access /admin/login | ✅ Public (but requires valid credentials) |
| Access /admin dashboard | ✅ Admin only (checked client & server) |
| View All Submissions | ✅ Admin only |
| Edit Submissions | ✅ Admin only |
| Delete Submissions | ✅ Admin only |
| Convert & Email | ✅ Admin only |
| Create Admin Users | ✅ Manual (via Firestore) |

### Admin Status Check

The system checks admin status in two places:

1. **Client-Side** (`useAuth` hook):
   ```javascript
   Path: artifacts/{APP_ID}/users/{userId}/roles/admin_status
   Data: { isAdmin: true }
   ```

2. **Server-Side** (Firestore Security Rules):
   ```javascript
   // Only admins can read/update/delete submissions
   allow read, update, delete: if isAdmin();
   ```

---

## Authentication Flow

### Anonymous Authentication (Users)

```
User Submits Form
    │
    ├─> signInAnonymous() called
    ├─> Firebase creates anonymous user
    ├─> Returns user object with uid
    ├─> uid used as submission identifier
    └─> No password or email required
```

### Email/Password Authentication (Admin)

```
Admin Enters Credentials
    │
    ├─> signInAdmin(email, password) called
    ├─> Firebase authenticates
    ├─> Returns user object with uid
    ├─> checkAdminStatus(uid) called
    │   └─> Queries Firestore for admin document
    ├─> If admin document exists and isAdmin === true:
    │   ├─> Set isAdmin state to true
    │   └─> Allow access to /admin routes
    └─> If not admin:
        └─> Show error, deny access
```

---

## Authorization Checks

### Route Protection

```javascript
// ProtectedRoute component checks:
1. Is user authenticated? (user !== null)
2. Is user an admin? (isAdmin === true)
3. If both true → Render admin dashboard
4. If false → Redirect to /admin/login
```

### Firestore Security Rules

```javascript
// Submissions Collection
match /artifacts/{appId}/public/data/submissions/{submissionId} {
  // Anyone authenticated can create
  allow create: if request.auth != null;
  
  // Only admins can read/update/delete
  allow read, update, delete: if isAdmin();
}

// Admin Roles Collection
match /artifacts/{appId}/users/{userId}/roles/admin_status {
  // Only admins can read/write admin status
  allow read, write: if isAdmin();
}
```

---

## Data Flow Diagrams

### User Submission Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────┐     ┌─────────────┐
│   User   │────>│ Resume Form  │────>│ Firebase │────>│  Firestore  │
│          │     │  Component   │     │   Auth   │     │  Database   │
└──────────┘     └──────────────┘     └──────────┘     └─────────────┘
     │                  │                    │                  │
     │                  │                    │                  │
     │ Fill Form        │ Validate           │ Anonymous       │ Save
     │                  │                    │ Sign In         │ Submission
     │                  │                    │                  │
     └──────────────────┴────────────────────┴──────────────────┘
                              Success Toast
```

### Admin Access Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────┐     ┌─────────────┐
│  Admin   │────>│  Login Page  │────>│ Firebase │────>│  Firestore  │
│          │     │              │     │   Auth   │     │  (Check     │
└──────────┘     └──────────────┘     └──────────┘     │  Admin)     │
     │                  │                    │          └─────────────┘
     │                  │                    │                  │
     │ Enter            │ Authenticate       │ Verify           │
     │ Credentials      │                    │ Admin Status     │
     │                  │                    │                  │
     └──────────────────┴────────────────────┴──────────────────┘
                              Access Dashboard
```

### Admin CRUD Operations Flow

```
┌─────────────┐
│   Admin     │
│  Dashboard  │
└──────┬──────┘
       │
       ├─> View: Read from Firestore (real-time)
       ├─> Edit: Update Firestore document
       ├─> Delete: Remove Firestore document
       └─> Convert & Email: Call Cloud Function
           │
           └─> Cloud Function:
               ├─> Get submission data
               ├─> Generate HTML
               ├─> Puppeteer screenshot
               ├─> Send email
               └─> Update status
```

---

## Setting Up Admin Users

### Step 1: Create User in Firebase Authentication

1. Go to Firebase Console > Authentication
2. Click "Add user"
3. Enter email and password
4. Note the User UID

### Step 2: Create Admin Document in Firestore

1. Go to Firebase Console > Firestore Database
2. Create document with path:
   ```
   artifacts/resume-builder/users/{USER_UID}/roles/admin_status
   ```
3. Add field:
   ```json
   {
     "isAdmin": true
   }
   ```

### Step 3: Verify Admin Access

1. Logout if already logged in
2. Navigate to `/admin/login`
3. Enter the email and password
4. Should redirect to `/admin` dashboard

---

## Security Considerations

### Client-Side Protection
- Protected routes check admin status before rendering
- Unauthorized users redirected to login
- Admin status checked on every route change

### Server-Side Protection
- Firestore Security Rules enforce access control
- Cloud Functions verify admin status
- No sensitive operations without proper authorization

### Best Practices
- Never expose admin credentials in code
- Use environment variables for sensitive config
- Regularly review Firestore security rules
- Monitor authentication logs in Firebase Console

---

## Troubleshooting Access Issues

### User Cannot Submit Resume
- Check Firebase Authentication is enabled
- Verify Anonymous authentication provider is enabled
- Check browser console for errors

### Admin Cannot Login
- Verify email/password authentication is enabled
- Check admin document exists in Firestore
- Verify `isAdmin: true` field is set
- Check Firestore path matches `APP_ID` in config

### Admin Cannot Access Dashboard
- Verify admin status document exists
- Check `APP_ID` matches in config and Firestore
- Review browser console for errors
- Check Firestore security rules are deployed

---

## Summary

- **Users**: Anonymous authentication, submit-only access
- **Admins**: Email/password authentication, full CRUD access
- **Security**: Multi-layer (client + server) authorization
- **Real-time**: Admin dashboard updates automatically
- **Offline**: Firestore persistence enables offline viewing

For setup instructions, see `SETUP.md`
For quick start, see `QUICK_START.md`

