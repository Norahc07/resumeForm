# Vercel Serverless Functions Setup Guide

Since you're on Firebase's free tier (Spark plan) which doesn't include Cloud Functions, we're using **Vercel Serverless Functions** instead - which are **completely free**!

## ✅ What's Already Done

1. ✅ Created API route: `api/upload-resume.js`
2. ✅ Updated client code to use Vercel API instead of Firebase Functions
3. ✅ Added CORS headers for cross-origin requests
4. ✅ Configured Vercel settings in `vercel.json`

## 📋 Setup Steps

### 1. Install Nodemailer in Root Directory

Since Vercel functions need dependencies in the root `package.json`:

```bash
npm install nodemailer
```

### 2. Configure Environment Variables in Vercel

Go to your Vercel project dashboard:
1. Navigate to: **Settings** → **Environment Variables**
2. Add the following variables:

#### For Gmail (Recommended for testing):
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Important for Gmail:**
- You need to use an **App Password**, not your regular password
- Enable 2-Step Verification first
- Generate App Password: [Google Account Settings](https://myaccount.google.com/apppasswords)

#### Alternative: Use SMTP (Other email services):
```
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
SMTP_HOST=smtp.example.com
SMTP_PORT=587
```

### 3. Deploy to Vercel

If not already deployed:

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Deploy
vercel
```

Or push to your connected Git repository - Vercel will auto-deploy.

## 🔧 How It Works

1. **Admin uploads resume image** → Client sends to `/api/upload-resume`
2. **Vercel Serverless Function** → Receives image, sends email via Nodemailer
3. **Firestore update** → Status changed to "completed" after successful email
4. **User receives email** → With resume image attached

## 📧 Email Service Options

### Option 1: Gmail (Free, Easy Setup)
- ✅ Free
- ✅ 500 emails/day limit
- ✅ Requires App Password

### Option 2: SendGrid (Free Tier)
- ✅ 100 emails/day free
- ✅ Better for production
- Setup: https://sendgrid.com

### Option 3: Mailgun (Free Tier)
- ✅ 5,000 emails/month free
- ✅ Good for production
- Setup: https://www.mailgun.com

### Option 4: Resend (Free Tier)
- ✅ 3,000 emails/month free
- ✅ Modern API
- Setup: https://resend.com

## 🧪 Testing Locally

To test the API route locally:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Run dev server:**
   ```bash
   vercel dev
   ```

3. **Set local environment variables:**
   Create `.env.local`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

## 🚀 Deployment Checklist

- [ ] Install `nodemailer` in root directory
- [ ] Set environment variables in Vercel dashboard
- [ ] Test email sending (check spam folder)
- [ ] Verify Firestore status updates to "completed"
- [ ] Test from production URL

## 🔍 Troubleshooting

### "Module not found: nodemailer"
- Run: `npm install nodemailer` in root directory

### "Email not sending"
- Check environment variables are set correctly
- For Gmail: Use App Password, not regular password
- Check Vercel function logs: Dashboard → Functions → Logs

### "CORS error"
- Already handled in the API route
- Make sure you're calling from the correct domain

### "Function timeout"
- Increased to 30 seconds in `vercel.json`
- For large images, consider compressing before upload

## 💰 Cost

**Vercel Serverless Functions:**
- ✅ **Free tier:** 100GB-hours/month
- ✅ **Hobby plan:** Unlimited (if you upgrade)
- ✅ Perfect for this use case!

## 📝 Notes

- The API route is at: `/api/upload-resume`
- It automatically handles CORS
- Updates Firestore after successful email
- Works with any email service that supports SMTP

## 🎉 Benefits Over Firebase Functions

1. ✅ **Free tier available** (Firebase Spark doesn't include Functions)
2. ✅ **No region restrictions**
3. ✅ **Easy environment variable management**
4. ✅ **Integrated with your Vercel deployment**
5. ✅ **Better for small projects**

