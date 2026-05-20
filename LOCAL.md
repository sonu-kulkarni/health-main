# Health Vault PWA - Local Setup & Installation Guide

## Quick Start (5 Minutes)

### Prerequisites
- Node.js 18+ installed ([Download](https://nodejs.org/))
- Git installed ([Download](https://git-scm.com/))
- A Supabase account ([Sign up free](https://supabase.com))

### Step 1: Clone or Download the Project

\`\`\`bash
# If you have Git
git clone <your-repository-url>
cd health-vault-pwa

# Or download the ZIP and extract it
\`\`\`

### Step 2: Install Dependencies

\`\`\`bash
npm install
\`\`\`

### Step 3: Set Up Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

2. Open `.env.local` and fill in your Supabase credentials:
   - Get credentials from: https://app.supabase.com → Your Project → Settings → API
   - See `ENV_SETUP.md` for detailed instructions

### Step 4: Set Up Database Schema (IMPORTANT!)

**This is the critical step that fixes the "Could not find the table 'public.profiles'" error:**

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your Health Vault project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire SQL from `scripts/01-init-schema.sql` in your project folder
6. Paste it into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)
8. Wait for the query to complete (you should see "Success" message)

**What this does:**
- Creates the `profiles` table (fixes your error!)
- Creates `medical_history`, `documents`, and `qr_codes` tables
- Sets up Row Level Security to protect user data
- Creates indexes for better performance

### Step 5: Set Up Storage Bucket

1. In Supabase Dashboard, click **Storage** in the left sidebar
2. Click **Create a new bucket**
3. Name it: `medical-documents`
4. Set it to **Private** (not public)
5. Click **Create bucket**

### Step 6: Run the App Locally

\`\`\`bash
npm run dev
\`\`\`

The app will start at: **http://localhost:3000**

### Step 7: Test the App

1. Open http://localhost:3000 in your browser
2. You should see the Health Vault loading screen
3. Click **Sign Up** to create an account
4. Fill in your profile information
5. Click **Save Profile** - it should now work without errors!

---

## Detailed Setup Instructions

### Understanding the Error: "Could not find the table 'public.profiles'"

This error occurs when:
- ❌ The SQL schema script hasn't been run in Supabase
- ❌ The database tables don't exist yet
- ❌ You're trying to save data but the table isn't there

**Solution:** Run the SQL script from `scripts/01-init-schema.sql` (see Step 4 above)

### Project Structure

\`\`\`
health-vault-pwa/
├── app/                          # Next.js app directory
│   ├── auth/                     # Authentication pages (signin, signup)
│   ├── dashboard/                # Protected dashboard pages
│   │   ├── page.tsx             # Dashboard home
│   │   ├── profile/             # Profile management
│   │   ├── documents/           # Document upload & management
│   │   └── qr-code/             # QR code generation
│   ├── view-records/            # Public QR code view (no auth needed)
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/                   # Reusable React components
│   ├── profile-form.tsx         # Profile form
│   ├── medical-history-form.tsx # Medical history form
│   ├── document-upload.tsx      # Document upload
│   └── qr-code-generator.tsx    # QR code generation
├── lib/                          # Utility functions
│   ├── supabase-client.ts       # Client-side Supabase setup
│   └── supabase-server.ts       # Server-side Supabase setup
├── public/                       # Static files
│   ├── manifest.json            # PWA manifest
│   └── next.jpg                 # App logo
├── scripts/                      # Database setup scripts
│   ├── 01-init-schema.sql       # Create tables & RLS policies
│   └── 02-setup-storage.sql     # Setup storage bucket
├── .env.local.example           # Environment variables template
├── ENV_SETUP.md                 # Detailed env setup guide
└── LOCAL.md                     # This file
\`\`\`

### Database Schema Overview

The app uses 4 main tables:

1. **profiles** - User personal & medical information
2. **medical_history** - Medical conditions and history
3. **documents** - Uploaded medical documents
4. **qr_codes** - QR code tokens for sharing records

All tables have Row Level Security (RLS) enabled, meaning users can only see their own data.

---

## Common Issues & Solutions

### Issue 1: "Could not find the table 'public.profiles'"

**Cause:** SQL schema script hasn't been run

**Solution:**
1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL from `scripts/01-init-schema.sql`
3. Refresh your app and try again

### Issue 2: "Bucket not found" when uploading documents

**Cause:** Storage bucket wasn't created

**Solution:**
1. Go to Supabase Dashboard → Storage
2. Create a bucket named `medical-documents`
3. Set it to Private
4. Run SQL from `scripts/02-setup-storage.sql`

### Issue 3: "Invalid API key" error

**Cause:** Wrong credentials in `.env.local`

**Solution:**
1. Double-check your `.env.local` file
2. Make sure you're using the `anon` key (not `service_role`)
3. Copy credentials again from Supabase Dashboard → Settings → API
4. Restart the dev server: `npm run dev`

### Issue 4: "Connection refused" error

**Cause:** Database connection string is wrong

**Solution:**
1. Check your `SUPABASE_POSTGRES_URL` in `.env.local`
2. Make sure you replaced `[YOUR-PASSWORD]` with your actual database password
3. Verify the URL format is correct
4. Restart the dev server

### Issue 5: App won't load or shows blank page

**Cause:** Missing dependencies or build error

**Solution:**
\`\`\`bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Start dev server again
npm run dev
\`\`\`

### Issue 6: QR code scanning leads to sign in page

**Cause:** Public QR view page requires authentication

**Solution:**
- This is already fixed in the latest version
- Make sure you're using the latest code from the repository
- The `/view-records/[token]` page should be publicly accessible

---

## Development Commands

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
\`\`\`

---

## Testing the App Locally

### Test 1: Sign Up & Create Profile
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Enter email and password
4. Verify email (check spam folder)
5. Fill in profile information
6. Click "Save Profile"
7. ✅ Should see success message

### Test 2: Add Medical History
1. Go to Dashboard → Dashboard tab
2. Click "Add Medical History"
3. Fill in condition details
4. Click "Save"
5. ✅ Should appear in the list

### Test 3: Upload Documents
1. Go to Dashboard → Documents tab
2. Click "Upload Document"
3. Select a PDF or image file
4. Choose document type
5. Click "Upload"
6. ✅ Should appear in documents list

### Test 4: Generate QR Code
1. Go to Dashboard → QR Code tab
2. Click "Generate QR Code"
3. ✅ Should see QR code displayed
4. Click "Share" to copy link
5. Open link in new tab (without logging in)
6. ✅ Should see your profile & medical records

### Test 5: Mobile Responsiveness
1. Open DevTools (F12)
2. Click device toggle (mobile view)
3. Test all pages on mobile
4. ✅ Should be fully responsive

---

## PWA Installation

### On Desktop (Chrome/Edge)
1. Open http://localhost:3000
2. Click the install icon in the address bar
3. Click "Install"
4. ✅ App will open as a standalone window

### On Mobile (Android)
1. Open http://localhost:3000 in Chrome
2. Tap the menu (three dots)
3. Tap "Install app"
4. ✅ App will be added to home screen

### On Mobile (iOS)
1. Open http://localhost:3000 in Safari
2. Tap the share button
3. Tap "Add to Home Screen"
4. ✅ App will be added to home screen

---

## Deploying to Production

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Select your GitHub repository
5. Add environment variables from `.env.local`
6. Click "Deploy"
7. ✅ Your app is live!

### Deploy to Other Platforms

See the main `README.md` for deployment instructions for other platforms.

---

## Next Steps

1. ✅ Complete the setup above
2. ✅ Test all features locally
3. ✅ Customize the app (colors, logo, etc.)
4. ✅ Deploy to production
5. ✅ Share your QR code with others!

---

## Need Help?

- **Setup Issues:** Check `ENV_SETUP.md`
- **Database Issues:** Check Supabase Dashboard → SQL Editor for errors
- **Code Issues:** Check browser console (F12) for error messages
- **Supabase Help:** https://supabase.com/docs
- **Next.js Help:** https://nextjs.org/docs

---

## Security Reminders

⚠️ **Important:**
- Never commit `.env.local` to Git (it's in `.gitignore`)
- Never share your `SUPABASE_SERVICE_ROLE_KEY`
- Never share your database password
- Use different credentials for production
- Enable 2FA on your Supabase account

---

Happy coding! 🚀
