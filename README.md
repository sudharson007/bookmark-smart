# Smart Bookmarks

A modern, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. Features Google OAuth authentication, real-time synchronization across devices, and a beautiful gradient UI.

🔗 **Live Demo**: [Your Vercel URL will go here]

📦 **GitHub Repository**: [Your GitHub repo URL will go here]

## Features

- ✅ **Google OAuth Authentication** - Secure sign-in with Google (no email/password required)
- ✅ **Real-time Sync** - Bookmarks update instantly across all open tabs and devices
- ✅ **Private & Secure** - Row Level Security ensures users only see their own bookmarks
- ✅ **Modern UI** - Beautiful gradient design with glassmorphism effects
- ✅ **Responsive** - Works seamlessly on desktop, tablet, and mobile
- ✅ **Fast** - Built with Next.js 14+ App Router for optimal performance

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database & Auth**: Supabase (PostgreSQL + Authentication + Realtime)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account ([sign up here](https://supabase.com))
- A Google Cloud account for OAuth credentials
- A Vercel account for deployment

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd smart-bookmark-app
npm install
```

### 2. Set Up Supabase

Follow the detailed instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:

1. Create a Supabase project
2. Configure Google OAuth
3. Create the database schema
4. Enable Realtime
5. Set up Row Level Security policies

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these values in your Supabase project settings under "API".

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Test the Application

1. Click "Sign in with Google"
2. Authenticate with your Google account
3. Add a bookmark with a URL and title
4. Open the app in another tab - you should see bookmarks sync in real-time!
5. Delete a bookmark and watch it disappear across all tabs

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

### 3. Update Google OAuth Redirect URI

After deployment, add your Vercel URL to Google Cloud Console:

1. Go to Google Cloud Console > Credentials
2. Edit your OAuth 2.0 Client ID
3. Add to Authorized redirect URIs:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Save changes

## Project Structure

```
smart-bookmark-app/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── callback/          # OAuth callback handler
│   ├── auth/
│   │   └── auth-code-error/       # Auth error page
│   ├── dashboard/                 # Protected dashboard page
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Landing page
│   └── globals.css                # Global styles
├── components/
│   ├── AuthButton.tsx             # Google sign-in/out button
│   ├── BookmarkForm.tsx           # Add bookmark form
│   └── BookmarkList.tsx           # Real-time bookmark list
├── lib/
│   └── supabase/
│       ├── client.ts              # Browser Supabase client
│       └── server.ts              # Server Supabase client
├── middleware.ts                  # Auth session refresh
├── .env.local.example             # Environment variables template
├── SUPABASE_SETUP.md              # Database setup guide
└── README.md                      # This file
```

## Problems Encountered & Solutions

### 1. **Real-time Subscription Setup**

**Problem**: Initially struggled with setting up Supabase Realtime subscriptions correctly. The bookmarks weren't updating in real-time across tabs.

**Solution**: 
- Enabled Realtime replication for the `bookmarks` table in Supabase dashboard
- Used the correct channel subscription pattern with proper event filtering by `user_id`
- Ensured cleanup of subscriptions in the `useEffect` return function to prevent memory leaks

### 2. **Row Level Security (RLS) Policies**

**Problem**: Users could potentially see other users' bookmarks if RLS wasn't configured correctly.

**Solution**:
- Implemented comprehensive RLS policies for SELECT, INSERT, and DELETE operations
- Used `auth.uid() = user_id` filter to ensure users only access their own data
- Tested with multiple Google accounts to verify isolation

### 3. **OAuth Callback Handling**

**Problem**: After Google authentication, users weren't being redirected properly to the dashboard.

**Solution**:
- Created a dedicated API route at `/api/auth/callback` to handle the OAuth code exchange
- Used `exchangeCodeForSession` to properly convert the auth code to a session
- Implemented proper error handling with a dedicated error page

### 4. **Middleware for Session Management**

**Problem**: User sessions would expire and not refresh automatically, causing authentication errors.

**Solution**:
- Implemented Next.js middleware to intercept all requests
- Called `supabase.auth.getUser()` on every request to refresh expired sessions
- Properly configured cookie handling for both request and response

### 5. **Server vs Client Components**

**Problem**: Mixing server and client components incorrectly led to hydration errors and authentication issues.

**Solution**:
- Used server components for initial data fetching and authentication checks
- Marked interactive components with `'use client'` directive
- Created separate Supabase client instances for server and browser contexts

### 6. **Environment Variables in Vercel**

**Problem**: Forgot to add environment variables in Vercel deployment, causing the app to fail.

**Solution**:
- Created a checklist for deployment that includes setting environment variables
- Used `NEXT_PUBLIC_` prefix for client-side variables
- Documented all required environment variables in `.env.local.example`

### 7. **TypeScript Type Safety**

**Problem**: Supabase types weren't properly inferred, leading to type errors.

**Solution**:
- Explicitly defined the `Bookmark` type interface
- Used proper TypeScript generics with Supabase queries
- Added non-null assertions (`!`) for environment variables that are guaranteed to exist

## Key Features Implementation

### Real-time Updates

The app uses Supabase Realtime to subscribe to database changes:

```typescript
const channel = supabase
  .channel('bookmarks-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'bookmarks',
    filter: `user_id=eq.${userId}`,
  }, (payload) => {
    // Handle INSERT, UPDATE, DELETE events
  })
  .subscribe()
```

### Row Level Security

Database policies ensure data privacy:

```sql
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);
```

### Google OAuth Flow

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. Google redirects back to `/api/auth/callback` with auth code
4. Server exchanges code for session
5. User redirected to dashboard

## Testing

To verify all requirements:

1. **Google Auth**: Sign in with Google account ✅
2. **Add Bookmark**: Create a bookmark with URL and title ✅
3. **Privacy**: Sign in with different Google account - bookmarks are isolated ✅
4. **Real-time**: Open two tabs, add bookmark in one, appears in other instantly ✅
5. **Delete**: Remove bookmark and see it disappear across all tabs ✅

## License

MIT

## Author

Built as part of a technical assessment to demonstrate full-stack development skills with modern web technologies.

---

**Note**: Replace placeholder URLs with your actual Vercel deployment URL and GitHub repository URL after deployment.
