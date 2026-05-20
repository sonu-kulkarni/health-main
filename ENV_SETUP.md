# Environment Setup Guide for Health Vault PWA

This guide will help you set up the `.env.local` file with all required Supabase credentials.

## Prerequisites

Before you start, make sure you have:
- A Supabase account (sign up at https://supabase.com)
- A Supabase project created
- Node.js installed on your machine

## Step-by-Step Setup

### Step 1: Create the .env.local File

1. In the root directory of your project, create a new file named `.env.local`
2. Copy the contents from `.env.local.example` into your new `.env.local` file

\`\`\`bash
# From the project root directory
cp .env.local.example .env.local
\`\`\`

### Step 2: Get Your Supabase Credentials

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your Health Vault project
3. Click on **Settings** (gear icon) in the left sidebar
4. Click on **API** to view your credentials

### Step 3: Fill in Your Credentials

#### Public Variables (Client-Side)

**NEXT_PUBLIC_SUPABASE_URL**
- Location: Supabase Dashboard → Settings → API → Project URL
- Copy the entire URL (e.g., `https://your-project.supabase.co`)
- Paste it in your `.env.local` file

**NEXT_PUBLIC_SUPABASE_ANON_KEY**
- Location: Supabase Dashboard → Settings → API → Project API keys → `anon` key
- Copy the `anon` public key
- Paste it in your `.env.local` file

**NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL**
- For development: `http://localhost:3000/auth/callback`
- For production: Your deployed app URL + `/auth/callback` (e.g., `https://yourdomain.com/auth/callback`)

#### Server-Side Variables (Keep Secret!)

**SUPABASE_SERVICE_ROLE_KEY**
- Location: Supabase Dashboard → Settings → API → Project API keys → `service_role` key
- Copy the `service_role` secret key (⚠️ Keep this secret!)
- Paste it in your `.env.local` file
- ⚠️ Never commit this to version control

**SUPABASE_POSTGRES_URL**
- Location: Supabase Dashboard → Settings → Database → Connection string → URI (with connection pooling)
- Copy the connection string
- Replace `[YOUR-PASSWORD]` with your database password
- Paste it in your `.env.local` file

**SUPABASE_POSTGRES_URL_NON_POOLING**
- Location: Supabase Dashboard → Settings → Database → Connection string → URI (without connection pooling)
- Copy the connection string
- Replace `[YOUR-PASSWORD]` with your database password
- Paste it in your `.env.local` file

**SUPABASE_JWT_SECRET**
- Location: Supabase Dashboard → Settings → API → JWT Settings → JWT Secret
- Copy the JWT secret
- Paste it in your `.env.local` file

### Step 4: Example .env.local File

Here's what your completed `.env.local` file should look like:

\`\`\`env
# Supabase Public Keys (Safe to expose)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback

# Supabase Server Keys (Keep Secret!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_POSTGRES_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres
SUPABASE_POSTGRES_URL_NON_POOLING=postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:6543/postgres
SUPABASE_JWT_SECRET=your-jwt-secret-here
\`\`\`

### Step 5: Set Up the Database

1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. Copy the SQL from `scripts/01-init-schema.sql` in your project
4. Paste it into the SQL Editor
5. Click **Run** to create all necessary tables and set up Row Level Security

### Step 6: Set Up Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `medical-documents`
3. Set it to **Private** (not public)
4. Copy the SQL from `scripts/02-setup-storage.sql` in your project
5. Go to SQL Editor and run it to set up storage permissions

### Step 7: Verify Your Setup

1. Start your development server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Open http://localhost:3000 in your browser

3. Try to sign up with a test email and password

4. If you see the dashboard, your setup is successful! ✅

## Troubleshooting

### "Bucket not found" Error
- Make sure you created the `medical-documents` bucket in Supabase Storage
- Run the SQL from `scripts/02-setup-storage.sql` to set up permissions

### "Invalid API key" Error
- Double-check that you copied the correct `anon` key (not the `service_role` key)
- Make sure there are no extra spaces or characters

### "Connection refused" Error
- Verify your `SUPABASE_POSTGRES_URL` is correct
- Make sure you replaced `[YOUR-PASSWORD]` with your actual database password
- Check that your Supabase project is active

### "Unauthorized" Error
- Make sure your `SUPABASE_SERVICE_ROLE_KEY` is correct
- Verify that Row Level Security policies are properly set up by running the SQL scripts

## Security Best Practices

1. **Never commit `.env.local` to Git**
   - It's already in `.gitignore`, but double-check

2. **Keep server keys secret**
   - `SUPABASE_SERVICE_ROLE_KEY` and database URLs should never be exposed

3. **Use different credentials for production**
   - Create a separate Supabase project for production
   - Use different environment variables for production deployment

4. **Rotate keys regularly**
   - Periodically rotate your API keys in Supabase Dashboard

## Next Steps

Once your `.env.local` is set up:

1. Run `npm install` to install dependencies
2. Run `npm run dev` to start the development server
3. Visit http://localhost:3000 to see your app
4. Sign up and start creating your health records!

## Need Help?

- Supabase Documentation: https://supabase.com/docs
- Health Vault PWA Issues: Check the README.md file
- Supabase Support: https://supabase.com/support
