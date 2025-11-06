# Deployment Guide

This guide covers multiple deployment options for your Resume Form PWA.

## Option 1: Firebase Hosting (Recommended) ⭐

Firebase Hosting is the **recommended** option since your project is already configured for it and integrates seamlessly with Firebase services.

### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created: `resumeform-48ff7`
- Logged in to Firebase: `firebase login`

### Deployment Steps

1. **Build the application:**
   ```bash
   npm run build
   ```
   This creates a `dist` folder with production-ready files.

2. **Deploy to Firebase Hosting:**
   ```bash
   firebase deploy --only hosting
   ```

3. **Deploy everything (Hosting + Functions + Rules):**
   ```bash
   firebase deploy
   ```

### First-Time Setup

If you haven't initialized Firebase Hosting yet:

```bash
firebase init hosting
```

- Select existing project: `resumeform-48ff7`
- Public directory: `dist`
- Configure as single-page app: **Yes**
- Set up automatic builds: **No** (or Yes if using GitHub Actions)

### Custom Domain (Optional)

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow the DNS configuration steps

### Advantages
- ✅ Free tier available (10 GB storage, 360 MB/day transfer)
- ✅ Fast CDN delivery
- ✅ Automatic SSL certificates
- ✅ Perfect integration with Firebase services
- ✅ Easy rollback to previous versions
- ✅ Preview channels for testing

### Pricing
- **Spark Plan (Free)**: 10 GB storage, 360 MB/day transfer
- **Blaze Plan (Pay-as-you-go)**: $0.026/GB storage, $0.15/GB transfer

---

## Option 2: Vercel

Vercel is excellent for React applications with automatic deployments from Git.

### Prerequisites
- GitHub/GitLab/Bitbucket account
- Repository pushed to Git

### Deployment Steps

1. **Install Vercel CLI (optional):**
   ```bash
   npm install -g vercel
   ```

2. **Deploy via CLI:**
   ```bash
   npm run build
   vercel
   ```

3. **Or deploy via Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure:
     - Framework Preset: **Vite**
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

4. **Environment Variables:**
   Add your Firebase config in Vercel dashboard:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - etc.

### Advantages
- ✅ Free tier with generous limits
- ✅ Automatic deployments from Git
- ✅ Preview deployments for PRs
- ✅ Global CDN
- ✅ Automatic SSL

### Pricing
- **Hobby (Free)**: Unlimited deployments, 100 GB bandwidth/month
- **Pro ($20/month)**: Team features, more bandwidth

---

## Option 3: Netlify

Netlify offers great PWA support and easy deployment.

### Deployment Steps

1. **Install Netlify CLI (optional):**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy via CLI:**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Or deploy via Dashboard:**
   - Go to [netlify.com](https://netlify.com)
   - Connect your Git repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

4. **Add Environment Variables:**
   - Site settings > Environment variables
   - Add all `VITE_*` variables

### Advantages
- ✅ Free tier available
- ✅ Excellent PWA support
- ✅ Form handling (if needed)
- ✅ Split testing
- ✅ Edge functions

### Pricing
- **Starter (Free)**: 100 GB bandwidth/month
- **Pro ($19/month)**: More features and bandwidth

---

## Option 4: GitHub Pages

Free hosting for static sites, but requires some configuration.

### Deployment Steps

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json:**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/resumeForm"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

### Limitations
- ❌ No server-side features
- ❌ Requires public repository (or GitHub Pro)
- ❌ No environment variables (use build-time config)

---

## Option 5: Cloudflare Pages

Fast, free, and easy deployment.

### Deployment Steps

1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Connect your Git repository
3. Build settings:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`

4. **Environment Variables:**
   Add all `VITE_*` variables in settings

### Advantages
- ✅ Free unlimited bandwidth
- ✅ Fast global CDN
- ✅ Automatic SSL
- ✅ Preview deployments

---

## Recommended: Firebase Hosting

For this project, **Firebase Hosting is the best choice** because:

1. ✅ Already configured in `firebase.json`
2. ✅ Seamless integration with Firebase services
3. ✅ No additional setup needed
4. ✅ Free tier is sufficient for most use cases
5. ✅ Easy to deploy Functions alongside

## Quick Firebase Deployment

```bash
# 1. Build the app
npm run build

# 2. Deploy to Firebase
firebase deploy --only hosting

# 3. Your app will be live at:
# https://resumeform-48ff7.web.app
# or
# https://resumeform-48ff7.firebaseapp.com
```

## Post-Deployment Checklist

After deploying, make sure to:

- [ ] Test the live application
- [ ] Verify Firebase Authentication works
- [ ] Test Firestore operations
- [ ] Check PWA installation works
- [ ] Verify service worker is active
- [ ] Test on mobile devices
- [ ] Set up custom domain (optional)
- [ ] Configure environment variables in hosting platform
- [ ] Set up monitoring/analytics

## Environment Variables Setup

For any hosting platform, you'll need to set these environment variables:

```
VITE_FIREBASE_API_KEY=AIzaSyDlZeKBV176Ixb2Wicbj_wr-ugzpqQrBsA
VITE_FIREBASE_AUTH_DOMAIN=resumeform-48ff7.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=resumeform-48ff7
VITE_FIREBASE_STORAGE_BUCKET=resumeform-48ff7.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=424694821473
VITE_FIREBASE_APP_ID=1:424694821473:web:34565d19296b476c877020
VITE_FIREBASE_MEASUREMENT_ID=G-12XHJDF4RE
VITE_APP_ID=resume-builder
```

## Troubleshooting Deployment

### Build Errors
- Check Node.js version (should be 18+)
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run lint`

### Firebase Deployment Issues
- Verify you're logged in: `firebase login`
- Check project selection: `firebase use resumeform-48ff7`
- Verify `firebase.json` configuration

### PWA Not Working After Deployment
- Ensure HTTPS is enabled (required for PWA)
- Check service worker is registered
- Verify manifest.json is accessible
- Clear browser cache

## Need Help?

- Firebase Hosting Docs: https://firebase.google.com/docs/hosting
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com

