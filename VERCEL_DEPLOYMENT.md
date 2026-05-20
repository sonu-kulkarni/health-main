# Health Vault PWA - Vercel Deployment Guide

This guide will walk you through deploying your Health Vault PWA application to Vercel with all necessary configurations.

## Prerequisites

Before you begin, ensure you have:
- A GitHub account with your project repository
- A Vercel account (sign up at https://vercel.com)
- A Supabase project with database configured
- All environment variables ready (see below)

## Step 1: Prepare Your Repository

### 1.1 Push Your Code to GitHub

\`\`\`bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial Health Vault PWA commit"

# Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/health-vault-pwa.git

# Push to GitHub
git branch -M main
git push -u origin main
\`\`\`

### 1.2 Verify .gitignore

Ensure your `.gitignore` file includes:
\`\`\`
.env.local
.env*.local
node_modules/
.next/
\`\`\`

**Important:** Environment variables should NEVER be committed to Git.

## Step 2: Set Up Vercel Project

### 2.1 Import Your Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Select **Import Git Repository**
4. Paste your GitHub repository URL
5. Click **Continue**

### 2.2 Configure Build Settings

Vercel will auto-detect Next.js. Verify these settings:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (should be auto-filled)
- **Output Directory:** `.next` (should be auto-filled)
- **Install Command:** `npm install` (should be auto-filled)

Click **Continue** to proceed to environment variables.

## Step 3: Add Environment Variables to Vercel

### 3.1 Public Environment Variables (Client-Side)

These variables are safe to expose and MUST be prefixed with `NEXT_PUBLIC_`:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-vercel-domain.vercel.app/auth/callback
\`\`\`

**How to get these values:**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your Health Vault project
3. Click **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. For `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`:
   - First deploy to get your Vercel domain (format: `your-project.vercel.app`)
   - Then add `/auth/callback` to it

### 3.2 Secret Environment Variables (Server-Side)

These variables are confidential and stored securely:

\`\`\`
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_POSTGRES_URL=postgresql://postgres:[PASSWORD]@db.your-project.supabase.co:5432/postgres
SUPABASE_POSTGRES_URL_NON_POOLING=postgresql://postgres:[PASSWORD]@db.your-project.supabase.co:6543/postgres
SUPABASE_JWT_SECRET=your-jwt-secret-here
SUPABASE_POSTGRES_USER=postgres
SUPABASE_POSTGRES_PASSWORD=[YOUR-DATABASE-PASSWORD]
SUPABASE_POSTGRES_HOST=db.your-project.supabase.co
SUPABASE_POSTGRES_DATABASE=postgres
\`\`\`

**How to get these values:**

1. Go to **Supabase Dashboard** → **Settings** → **API**
2. Copy the **Service role secret key** → `SUPABASE_SERVICE_ROLE_KEY`
3. Go to **Settings** → **Database** → **Connection Pooler**
4. Copy the connection strings:
   - **Pooling On** → `SUPABASE_POSTGRES_URL`
   - Go back and copy **Non-pooling** → `SUPABASE_POSTGRES_URL_NON_POOLING`
5. Replace `[YOUR-PASSWORD]` with your actual database password
6. Go to **Settings** → **API** → **JWT Settings**
7. Copy the JWT Secret → `SUPABASE_JWT_SECRET`

### 3.3 Adding Environment Variables in Vercel Console

In the Vercel deployment screen:

1. Scroll down to **Environment Variables**
2. For each variable above, click **Add**
3. Enter the name and value
4. For secret keys, they will be masked
5. Verify all variables are added correctly

**OR** add them after deployment:

1. Go to your Vercel project dashboard
2. Click **Settings**
3. Click **Environment Variables**
4. Click **Add New**
5. Enter variable name and value
6. Select which environments (Production, Preview, Development)
7. Click **Save**

## Step 4: Deploy Your Application

### 4.1 Initial Deployment

1. After adding all environment variables
2. Click **Deploy** button
3. Wait for the build to complete (usually 2-5 minutes)
4. Once deployed, you'll see a success message with your live URL

### 4.2 Post-Deployment Checks

1. Click the preview URL to test your application
2. Test authentication:
   - Sign up with a test email
   - Verify you can log in
   - Check that you can access the dashboard
3. Test core features:
   - Upload a document
   - Generate a QR code
   - Update your profile

## Step 5: Update Production Redirect URL

Once your Vercel deployment is live:

1. Get your Vercel domain (format: `https://your-project.vercel.app`)
2. Update the environment variable:
   - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-project.vercel.app/auth/callback`
3. In Vercel:
   - Go to **Settings** → **Environment Variables**
   - Edit the variable
   - Update the value
4. Vercel will automatically trigger a redeployment

## Step 6: Set Custom Domain (Optional)

### 6.1 Add Your Custom Domain

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Click **Add**
4. Enter your domain name (e.g., `health-vault.com`)
5. Follow the DNS setup instructions provided by Vercel

### 6.2 Update Supabase Redirect URL

Once your custom domain is set up:

1. Update environment variable:
   - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-domain.com/auth/callback`
2. Redeploy in Vercel

## Step 7: Configure Production Settings

### 7.1 Enable Analytics (Optional)

The app includes Vercel Analytics. It's automatically enabled - no additional setup needed.

### 7.2 Set Up Automatic Deployments

1. In Vercel, deployments from GitHub are automatic by default
2. Any push to your `main` branch will trigger a deployment
3. You can configure this in **Settings** → **Git**

### 7.3 Environment-Specific Variables

For different environments (Production, Preview, Development):

1. Go to **Settings** → **Environment Variables**
2. When editing a variable, select which environments it applies to
3. Example:
   - Production: Use your production Supabase project
   - Preview: Can use the same production project or a staging project
   - Development: Use local `.env.local` only

## Important Code Changes for Production

### No Code Changes Required!

Your application is already configured for production deployment. However, verify these settings:

### In `next.config.mjs`:

The following is already configured:
\`\`\`javascript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '**.qrserver.com' },
    { protocol: 'https', hostname: '**.supabase.co' },
  ],
  unoptimized: true,
}
\`\`\`

This allows images from QR code server and Supabase storage.

### In `app/globals.css`:

Ensure `@import 'tailwindcss'` is present for Tailwind CSS v4.

## Troubleshooting Deployment Issues

### Issue: "Build failed"

**Solution:**
1. Check Vercel build logs: Click **Deployments** → **Failed deployment** → **View logs**
2. Common causes:
   - TypeScript errors (check console output)
   - Missing environment variables
   - Dependency conflicts

**Fix:**
- Run `npm run build` locally to identify issues
- Commit and push fixes to GitHub
- Vercel will automatically redeploy

### Issue: "Authentication not working"

**Solution:**
1. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
2. Check `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` matches your domain
3. In Supabase Dashboard → **Settings** → **Auth** → **Redirect URLs**, add:
   - `https://your-vercel-domain.vercel.app/auth/callback`
   - Your custom domain (if applicable)

### Issue: "Database connection errors"

**Solution:**
1. Verify all `SUPABASE_POSTGRES_*` variables are set correctly
2. In Supabase, check if your database is active
3. Ensure password doesn't contain special characters that need escaping
4. Test connection locally: `npm run dev`

### Issue: "Images not loading"

**Solution:**
1. Verify Supabase image URLs in browser console
2. Check `next.config.mjs` has correct image hostnames
3. Verify Supabase Storage bucket is set to **Private** but has RLS policies allowing read access

### Issue: "Environment variables not updating"

**Solution:**
1. After updating variables in Vercel, trigger a redeployment:
   - Click **Deployments** → **Redeploy** (next to the latest deployment)
   - OR push a new commit to GitHub
2. Wait 2-3 minutes for changes to take effect

### Issue: "CORS errors in browser console"

**Solution:**
1. Check Supabase Storage bucket has proper CORS configuration
2. In Supabase Dashboard → **Storage** → **medical-documents** → **CORS policies**
3. Ensure it allows your Vercel domain

## Monitoring and Maintenance

### 7.1 Enable Vercel Analytics

1. Your app includes `@vercel/analytics`
2. Analytics are automatically collected
3. View in Vercel dashboard → **Analytics** tab

### 7.2 Monitor Performance

1. Go to Vercel dashboard → **Analytics**
2. Check:
   - Response times
   - Core Web Vitals
   - Error rates
3. Optimize slow routes

### 7.3 Check Error Logs

1. Go to **Deployments**
2. Click latest deployment
3. Check **Logs** for errors
4. Review failed requests

## Production Best Practices

### Security Checklist

- [ ] All secret keys are stored in Vercel environment variables (not `.env.local`)
- [ ] `.env.local` is in `.gitignore` and never committed
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is treated as a secret (server-side only)
- [ ] Custom domain has HTTPS enabled (automatic in Vercel)
- [ ] Supabase RLS policies are enabled
- [ ] Database backups are configured in Supabase

### Performance Checklist

- [ ] Next.js Image component is used for all images
- [ ] API routes are optimized
- [ ] Database queries are efficient
- [ ] Vercel Analytics show good Core Web Vitals

### Maintenance Checklist

- [ ] Set up GitHub notifications for deployment status
- [ ] Monitor Supabase usage and quotas
- [ ] Regularly backup important data
- [ ] Update dependencies monthly
- [ ] Review and rotate API keys quarterly

## Rollback and Recovery

### Rollback to Previous Deployment

1. Go to Vercel dashboard → **Deployments**
2. Find the previous working deployment
3. Click the three dots (**...**)
4. Select **Promote to Production**
5. Application will revert to that version

### Recover from Deployment Failure

1. Check deployment logs for errors
2. Fix the issue locally
3. Commit and push to GitHub
4. Vercel will automatically create a new deployment
5. You can also manually click **Redeploy** on a previous successful version

## Getting Help

- **Vercel Support:** https://vercel.com/help
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **GitHub Issues:** Create an issue in your repository

## Summary: Quick Reference

### Environment Variables Needed:
- 3 public variables (NEXT_PUBLIC_*)
- 8 secret variables (server-side only)

### Deployment Steps:
1. Push code to GitHub
2. Create Vercel project
3. Add environment variables
4. Deploy
5. Test authentication and features
6. Update redirect URL if needed
7. Optionally add custom domain

### After Deployment:
- Monitor logs and analytics
- Keep dependencies updated
- Maintain security best practices
- Regular backups

Your Health Vault PWA is now ready for production!
