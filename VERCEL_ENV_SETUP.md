# How to Set Environment Variables in Vercel

## Step-by-Step Guide

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Sign in to your account

2. **Select Your Project**
   - Click on your project: **resume-form-eight** (or your project name)

3. **Navigate to Settings**
   - Click on **Settings** tab (top navigation bar)
   - Or go directly: https://vercel.com/dashboard → Your Project → Settings

4. **Go to Environment Variables**
   - In the left sidebar, click on **Environment Variables**
   - Or scroll down to find "Environment Variables" section

5. **Add Environment Variable**
   - Click the **"Add New"** button or **"Add"** button
   - You'll see three fields:
     - **Key**: Enter `EMAIL_USER`
     - **Value**: Enter your email address (e.g., `your-email@gmail.com`)
     - **Environment**: Select which environments to apply to:
       - ✅ **Production** (for live site)
       - ✅ **Preview** (for preview deployments)
       - ✅ **Development** (for local development)

6. **Save**
   - Click **"Save"** button

7. **Add Second Variable**
   - Click **"Add New"** again
   - **Key**: `EMAIL_PASSWORD`
   - **Value**: Your Gmail App Password (see below for how to get this)
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Add environment variable
vercel env add EMAIL_USER
# When prompted, enter your email address
# Select environments: production, preview, development

vercel env add EMAIL_PASSWORD
# When prompted, enter your Gmail App Password
# Select environments: production, preview, development
```

## Getting Gmail App Password

Since you're using Gmail, you need an **App Password** (not your regular password):

### Steps:

1. **Enable 2-Step Verification**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification" if not already enabled

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords

3. **Create App Password**
   - Select "Mail" as the app
   - Select "Other (Custom name)" as device
   - Enter name: "Resume Form Vercel"
   - Click "Generate"

4. **Copy the Password**
   - You'll get a 16-character password (like: `abcd efgh ijkl mnop`)
   - Copy it (remove spaces or keep them, both work)
   - Use this as your `EMAIL_PASSWORD` value

## Environment Variables You Need

Add these two variables:

| Key | Value | Example |
|-----|-------|---------|
| `EMAIL_USER` | Your Gmail address | `yourname@gmail.com` |
| `EMAIL_PASSWORD` | Gmail App Password | `abcdefghijklmnop` |

## After Adding Variables

1. **Redeploy Your Project**
   - Go to **Deployments** tab
   - Click the **"..."** (three dots) on the latest deployment
   - Click **"Redeploy"**
   - Or push a new commit to trigger auto-deployment

2. **Verify It Works**
   - Test the upload feature from your admin dashboard
   - Check Vercel Function logs if there are issues:
     - Go to: **Deployments** → Click on deployment → **Functions** tab → View logs

## Troubleshooting

### "Environment variable not found"
- Make sure you redeployed after adding variables
- Check that you selected the correct environment (Production/Preview/Development)
- Verify the variable name is exactly `EMAIL_USER` (case-sensitive)

### "Email not sending"
- Check Vercel Function logs for errors
- Verify App Password is correct (not regular password)
- Make sure 2-Step Verification is enabled
- Check spam folder in recipient's email

### "Authentication failed"
- Double-check your App Password
- Make sure you're using App Password, not regular password
- Regenerate App Password if needed

## Quick Checklist

- [ ] Added `EMAIL_USER` in Vercel dashboard
- [ ] Added `EMAIL_PASSWORD` (Gmail App Password) in Vercel dashboard
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Enabled 2-Step Verification on Gmail
- [ ] Generated Gmail App Password
- [ ] Redeployed the project
- [ ] Tested the upload feature

## Visual Guide

```
Vercel Dashboard
  └── Your Project (resume-form-eight)
      └── Settings
          └── Environment Variables
              ├── Add New
              │   ├── Key: EMAIL_USER
              │   ├── Value: your-email@gmail.com
              │   └── Environment: ☑ Production ☑ Preview ☑ Development
              └── Add New
                  ├── Key: EMAIL_PASSWORD
                  ├── Value: your-app-password
                  └── Environment: ☑ Production ☑ Preview ☑ Development
```

## Security Notes

⚠️ **Important:**
- Never commit environment variables to Git
- App Passwords are safer than regular passwords
- Each environment variable is encrypted in Vercel
- Only you and your team (if added) can see these values

