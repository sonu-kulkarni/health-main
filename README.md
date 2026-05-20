# Health Vault PWA

A secure, progressive web app for managing personal medical records with QR code sharing capabilities. Users can store their medical history, upload documents, and share their records via QR codes that can be scanned with Google Lens or any QR code scanner.

## Features

- **PWA Support**: Install as a native app on iOS and Android
- **Secure Authentication**: Email/password authentication with Supabase
- **Medical Records Management**: Store personal health information, medical history, and emergency contacts
- **Document Upload**: Upload and manage medical documents (prescriptions, lab reports, imaging, etc.)
- **QR Code Generation**: Generate unique QR codes to share medical records
- **QR Code Scanning**: View patient records by scanning QR codes
- **Row Level Security**: All data is protected with Supabase RLS policies
- **Minimalist Design**: Clean, app-like interface with bottom navigation
- **Responsive**: Works seamlessly on mobile, tablet, and desktop

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **PWA**: Web App Manifest, Service Workers
- **QR Codes**: QR Server API for generation

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier available at https://supabase.com)

### Installation

1. **Clone or download the project**

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Supabase**
   - Create a new Supabase project at https://supabase.com
   - Go to Project Settings → API to get your credentials
   - Create a new storage bucket named `medical-documents`

4. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
   DATABASE_PASSWORD=your_database_password
   \`\`\`

5. **Set up the database schema**
   
   Run the SQL script in your Supabase SQL editor:
   - Go to Supabase Dashboard → SQL Editor
   - Create a new query and paste the contents of `scripts/01-init-schema.sql`
   - Execute the query

6. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

7. **Open your browser**
   - Navigate to http://localhost:3000
   - You'll see the 3-second loading screen with the Health Vault logo
   - Sign up for a new account or sign in

## Project Structure

\`\`\`
health-vault-pwa/
├── app/
│   ├── auth/
│   │   ├── signin/page.tsx          # Sign in page
│   │   ├── signup/page.tsx          # Sign up page
│   │   └── callback/route.ts        # Email confirmation callback
│   ├── dashboard/
│   │   ├── page.tsx                 # Profile & medical history
│   │   ├── documents/page.tsx       # Document management
│   │   ├── qr-code/page.tsx         # QR code generation
│   │   └── layout.tsx               # Dashboard layout with bottom nav
│   ├── view-records/[token]/page.tsx # Public records viewer
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Loading screen
│   └── globals.css                  # Global styles
├── components/
│   ├── ui/                          # shadcn/ui components
│   ├── loading-screen.tsx           # 3-second loading animation
│   ├── profile-form.tsx             # Personal info form
│   ├── medical-history-form.tsx     # Medical history form
│   ├── document-upload.tsx          # Document upload component
│   └── qr-code-generator.tsx        # QR code generation
├── lib/
│   ├── supabase-client.ts           # Browser Supabase client
│   └── supabase-server.ts           # Server Supabase client
├── public/
│   ├── manifest.json                # PWA manifest
│   └── icon-*.png                   # App icons
├── scripts/
│   └── 01-init-schema.sql           # Database schema
└── .env.local                       # Environment variables
\`\`\`

## Usage

### 1. Sign Up
- Create a new account with email and password
- Confirm your email address

### 2. Fill Your Profile
- Go to the Profile tab
- Enter personal information, emergency contacts, and medical details
- Save your profile

### 3. Add Medical History
- Go to the Profile tab
- Add medical conditions, diagnoses, and health information
- Track active, resolved, or monitoring conditions

### 4. Upload Documents
- Go to the Documents tab
- Upload medical documents (prescriptions, lab reports, imaging, etc.)
- Organize by document type

### 5. Generate QR Code
- Go to the QR Code tab
- Click "Generate QR Code"
- Download or share the QR code with healthcare providers

### 6. Share Records
- Share the QR code link or image
- Anyone can scan it with Google Lens or a QR code scanner
- They'll see your medical records without needing to log in

## Security

- **Row Level Security (RLS)**: All database tables have RLS policies
- **User Isolation**: Users can only access their own data
- **Secure Authentication**: Supabase handles password hashing and session management
- **HTTPS Only**: All data is encrypted in transit
- **QR Code Tokens**: QR codes use unique tokens that can be revoked

## PWA Installation

### On Android
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Install app" or "Add to Home screen"

### On iOS
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com and sign in
3. Click "New Project" and select your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (use your Vercel domain)
5. Click "Deploy"

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render
- DigitalOcean

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Email confirmation redirect URL | Yes |
| `DATABASE_PASSWORD` | Database password (optional) | No |

## Troubleshooting

### "Invalid or expired QR code" error
- Make sure the QR code token is valid
- Generate a new QR code if needed

### Documents not uploading
- Check file size (max 10MB)
- Ensure file type is PDF, JPG, or PNG
- Verify Supabase storage bucket exists

### Can't sign in
- Check email confirmation
- Verify credentials are correct
- Check Supabase auth settings

### PWA not installing
- Use HTTPS (required for PWA)
- Check manifest.json is accessible
- Clear browser cache and try again

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact support.

## Roadmap

- [ ] Two-factor authentication
- [ ] Appointment scheduling
- [ ] Medication reminders
- [ ] Integration with health providers
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Offline sync
- [ ] Advanced analytics

---

Built with ❤️ using Next.js, Supabase, and Tailwind CSS
