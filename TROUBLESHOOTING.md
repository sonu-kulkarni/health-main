# Health Vault PWA - Troubleshooting Guide

## Common Issues & Solutions

### Issue 1: "Could not find the table 'public.profiles'" Error

**Problem:** When trying to save profile or access data, you get this error.

**Cause:** The database schema hasn't been set up in your Supabase database.

**Solution:**
1. Go to your Supabase Dashboard → SQL Editor
2. Create a new query
3. Copy the entire SQL from `scripts/01-init-schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute
6. Wait for it to complete (you should see "Success" message)

**Verify:** Try saving a profile again - it should work now.

---

### Issue 2: "Bucket not found" Error When Uploading Documents

**Problem:** When trying to upload medical documents, you get a bucket error.

**Cause:** The Supabase storage bucket hasn't been created.

**Solution:**
1. Go to your Supabase Dashboard → Storage
2. Click "Create a new bucket"
3. Name it: `medical-documents`
4. Make it **Public** (toggle the public option)
5. Click "Create bucket"

**Verify:** Try uploading a document - it should work now.

---

### Issue 3: Can't Login - "Invalid login credentials"

**Problem:** You can't sign in even with correct email and password.

**Cause:** Either the user account doesn't exist, or there's an issue with Supabase auth setup.

**Solution:**

**Step 1: Verify Environment Variables**
- Check that these are set in your `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Go to Supabase Dashboard → Settings → API to get these values

**Step 2: Create a Test Account**
1. Go to your app and click "Sign up"
2. Enter a test email: `test@example.com`
3. Enter a password: `TestPassword123!`
4. Click "Sign up"
5. Check your email for confirmation link (or check Supabase Dashboard → Authentication → Users)
6. Confirm the email
7. Try signing in with the same credentials

**Step 3: Check Supabase Auth Settings**
1. Go to Supabase Dashboard → Authentication → Providers
2. Make sure "Email" is enabled
3. Go to Authentication → URL Configuration
4. Add your app URL to "Redirect URLs":
   - For local: `http://localhost:3000/auth/callback`
   - For production: `https://yourdomain.com/auth/callback`

---

### Issue 4: QR Code Still Redirects to Login

**Problem:** When scanning QR code, it redirects to login page instead of showing records.

**Cause:** The QR code page might not be loading properly, or there's a middleware issue.

**Solution:**
1. Make sure you're using the correct QR code link format: `https://yourdomain.com/view-records/[token]`
2. The token should be in the format: `userid-randomstring`
3. Try accessing the QR link directly in your browser
4. If it still redirects, check that the database has the user's data

**Verify:** 
- Create a profile with data
- Generate a QR code
- Scan it with your phone or open the link in a new browser
- You should see the profile data without logging in

---

### Issue 5: Profile Data Not Saving

**Problem:** You fill in the profile form but data doesn't save.

**Cause:** Either the database table doesn't exist, or there's an RLS policy issue.

**Solution:**

**Step 1: Run Database Schema**
- Follow "Issue 1" above to run the SQL schema

**Step 2: Check RLS Policies**
1. Go to Supabase Dashboard → SQL Editor
2. Run this query to check RLS is enabled:
   \`\`\`sql
   SELECT tablename FROM pg_tables WHERE schemaname = 'public';
   \`\`\`
3. You should see: `user_profiles`, `medical_records`, `documents`, `qr_access_logs`

**Step 3: Verify You're Logged In**
- Make sure you're signed in before trying to save
- Check browser console for any error messages

---

### Issue 6: Documents Not Uploading

**Problem:** Upload button doesn't work or shows errors.

**Cause:** Storage bucket not created, or file size too large.

**Solution:**

**Step 1: Create Storage Bucket**
- Follow "Issue 2" above

**Step 2: Check File Size**
- Maximum file size: 50MB
- Supported formats: PDF, JPG, PNG, GIF

**Step 3: Check Browser Console**
- Open DevTools (F12)
- Go to Console tab
- Try uploading again
- Look for error messages

---

### Issue 7: App Not Installing as PWA

**Problem:** Can't install app on mobile or desktop.

**Cause:** PWA manifest might not be loading, or HTTPS not enabled.

**Solution:**

**For Desktop (Chrome/Edge):**
1. Open the app in Chrome or Edge
2. Click the install icon in the address bar (looks like a box with arrow)
3. Click "Install"

**For Mobile (Android):**
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home screen"

**For Mobile (iOS):**
1. Open the app in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"

**If install button doesn't appear:**
- Make sure you're using HTTPS (not HTTP)
- Check that `/public/manifest.json` exists
- Clear browser cache and try again

---

### Issue 8: Dark/Light Theme Not Working

**Problem:** Theme toggle doesn't change the app appearance.

**Cause:** Theme preference not being saved or applied.

**Solution:**
1. Go to Profile tab
2. Click the theme toggle button (sun/moon icon)
3. Refresh the page
4. Theme should persist

**If still not working:**
- Clear browser localStorage: Open DevTools → Application → Local Storage → Clear All
- Refresh the page
- Try toggling theme again

---

## Setup Verification Checklist

Before reporting issues, verify:

- [ ] `.env.local` file exists with all required variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set correctly
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set correctly
- [ ] Database schema has been run (`scripts/01-init-schema.sql`)
- [ ] Storage bucket `medical-documents` has been created
- [ ] You can sign up and create an account
- [ ] You can sign in with your account
- [ ] You can save a profile
- [ ] You can upload a document
- [ ] You can generate a QR code
- [ ] You can view records via QR code without logging in

---

## Getting Help

If you're still having issues:

1. **Check the logs:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for error messages
   - Copy the full error message

2. **Check Supabase Dashboard:**
   - Go to Logs → Edge Functions
   - Look for any error messages
   - Check Authentication → Users to see if your account exists

3. **Verify credentials:**
   - Go to Supabase Dashboard → Settings → API
   - Copy the URL and Anon Key again
   - Update your `.env.local` file
   - Restart your development server

4. **Clear cache:**
   - Delete `.next` folder
   - Clear browser cache
   - Restart development server

---

## Quick Start After Cloning

1. Copy `.env.local.example` to `.env.local`
2. Fill in Supabase credentials from Dashboard → Settings → API
3. Run SQL schema: `scripts/01-init-schema.sql` in Supabase SQL Editor
4. Create storage bucket: `medical-documents` (Public)
5. Run `npm install`
6. Run `npm run dev`
7. Open `http://localhost:3000`
8. Sign up for a new account
9. Fill in your profile
10. Generate a QR code and test scanning it

That's it! Your Health Vault PWA is ready to use.
