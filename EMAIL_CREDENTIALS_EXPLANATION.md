# Email Credentials vs Admin Credentials - Explained

## 🔑 Two Different Sets of Credentials

### 1. **Admin Login Credentials** (Firebase Authentication)
- **Purpose**: Login to the admin dashboard
- **Where**: Firebase Authentication
- **Used for**: Accessing `/admin/login` page
- **Example**: 
  - Email: `admin@example.com`
  - Password: `your-admin-password`

### 2. **Email Service Credentials** (Vercel Environment Variables)
- **Purpose**: Send emails to users (with resume attachments)
- **Where**: Vercel Environment Variables
- **Used for**: The email service (Gmail, SendGrid, etc.) that sends emails
- **Example**:
  - EMAIL_USER: `sender@gmail.com` (the email that SENDS)
  - EMAIL_PASSWORD: `app-password-16-chars` (Gmail App Password)

## 📧 What to Put in Vercel Environment Variables

### EMAIL_USER
- **What**: The email address that will **SEND** emails to users
- **Can be**: 
  - ✅ Your personal Gmail account
  - ✅ A dedicated Gmail account for the system
  - ✅ Any email service account (SendGrid, Mailgun, etc.)
- **Example**: `resumeform@gmail.com` or `yourname@gmail.com`

### EMAIL_PASSWORD
- **What**: The password for the email service
- **For Gmail**: Must be an **App Password** (not your regular password)
- **How to get Gmail App Password**:
  1. Go to: https://myaccount.google.com/apppasswords
  2. Enable 2-Step Verification first (if not enabled)
  3. Generate App Password for "Mail"
  4. Copy the 16-character password
  5. Use that as `EMAIL_PASSWORD`

## 🎯 Real-World Example

### Scenario:
- **Admin Email** (for login): `admin@company.com`
- **Email Sender** (for sending resumes): `resumeform@gmail.com`

### Vercel Environment Variables:
```
EMAIL_USER = resumeform@gmail.com
EMAIL_PASSWORD = abcd efgh ijkl mnop  (Gmail App Password)
```

### What Happens:
1. Admin logs in with: `admin@company.com` / `admin-password`
2. Admin uploads resume image
3. System sends email FROM: `resumeform@gmail.com`
4. Email goes TO: User's email (from their resume submission)

## ✅ Recommended Setup

### Option 1: Use Your Personal Gmail (Easiest)
```
EMAIL_USER = yourname@gmail.com
EMAIL_PASSWORD = your-gmail-app-password
```
- ✅ Easy to set up
- ✅ Free
- ⚠️ Limited to 500 emails/day

### Option 2: Create Dedicated Gmail Account (Better)
```
EMAIL_USER = resumeform.sender@gmail.com
EMAIL_PASSWORD = dedicated-app-password
```
- ✅ Separate from personal email
- ✅ Better for production
- ✅ Still free

### Option 3: Use Professional Email Service (Best for Production)
```
EMAIL_USER = noreply@yourdomain.com
EMAIL_PASSWORD = service-api-key
SMTP_HOST = smtp.sendgrid.net
SMTP_PORT = 587
```
- ✅ More professional
- ✅ Better deliverability
- ✅ Higher limits

## 🔐 Security Notes

### DO:
- ✅ Use Gmail App Password (not regular password)
- ✅ Keep environment variables secret
- ✅ Never commit them to Git
- ✅ Use different email for sending vs admin login

### DON'T:
- ❌ Use admin login password as EMAIL_PASSWORD
- ❌ Use regular Gmail password (must be App Password)
- ❌ Share environment variables publicly
- ❌ Commit .env files to Git

## 📋 Quick Checklist

For Vercel Environment Variables, you need:

- [ ] **EMAIL_USER**: Email address that will send emails
  - Example: `sender@gmail.com`
  
- [ ] **EMAIL_PASSWORD**: App Password for that email
  - For Gmail: Get from https://myaccount.google.com/apppasswords
  - 16-character password (like: `abcd efgh ijkl mnop`)

## 🆚 Summary

| Type | Purpose | Location | Example |
|------|---------|----------|---------|
| **Admin Credentials** | Login to admin dashboard | Firebase Auth | `admin@company.com` / `password123` |
| **Email Credentials** | Send emails to users | Vercel Env Vars | `sender@gmail.com` / `app-password` |

## 💡 Common Confusion

**Question**: "Should I use my admin email and password?"

**Answer**: 
- **NO** - Use a separate email account for sending emails
- The admin credentials are only for logging into the dashboard
- The email credentials are for the email service that sends resume images to users
- They serve completely different purposes!

## 🎯 Recommended Approach

1. **Admin Login**: Use your admin email/password (stored in Firebase Auth)
2. **Email Sending**: Create a dedicated Gmail account or use your personal Gmail
3. **Vercel Variables**: Put the email sender credentials (not admin credentials)

This way:
- Admin can log in with their credentials
- System sends emails from a dedicated sender account
- Clear separation of concerns

