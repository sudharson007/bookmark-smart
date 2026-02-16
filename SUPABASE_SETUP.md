# Smart Bookmark App - Database Setup Guide

## Supabase Project Setup

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - **Name**: smart-bookmarks (or any name you prefer)
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to you
4. Click "Create new project" and wait for it to initialize

### 2. Set Up Google OAuth

#### A. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. If prompted, configure the OAuth consent screen:
   - User Type: External
   - App name: Smart Bookmarks
   - User support email: Your email
   - Developer contact: Your email
6. For Application type, select "Web application"
7. Add authorized redirect URIs:
   - `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - Get your project ref from Supabase dashboard URL
8. Click "Create" and copy your **Client ID** and **Client Secret**

#### B. Configure Google OAuth in Supabase

1. In your Supabase project, go to "Authentication" > "Providers"
2. Find "Google" and enable it
3. Paste your Google **Client ID** and **Client Secret**
4. Click "Save"

### 3. Create Database Schema

1. In your Supabase project, go to "SQL Editor"
2. Click "New Query"
3. Copy and paste the following SQL:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);
```

4. Click "Run" to execute the SQL

### 4. Enable Realtime

1. In your Supabase project, go to "Database" > "Replication"
2. Find the `bookmarks` table
3. Toggle the switch to enable Realtime for this table
4. Click "Save"

### 5. Get Your Supabase Credentials

1. In your Supabase project, go to "Settings" > "API"
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

### 6. Configure Environment Variables

1. In your project root, create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Replace the values with your actual Supabase credentials

## Verification

To verify everything is set up correctly:

1. Start your development server: `npm run dev`
2. Open http://localhost:3000
3. Click "Sign in with Google"
4. You should be redirected to Google login
5. After successful login, you should be redirected to the dashboard
6. Try adding a bookmark - it should appear immediately
7. Open the same page in another tab - bookmarks should sync in real-time

## Troubleshooting

### "Invalid redirect URI" error
- Make sure you added the correct redirect URI in Google Cloud Console
- The URI should be: `https://<your-project-ref>.supabase.co/auth/v1/callback`

### Bookmarks not appearing
- Check that RLS policies are created correctly
- Verify the user is authenticated (check browser console)
- Check Supabase logs in the dashboard

### Real-time not working
- Ensure Realtime is enabled for the bookmarks table
- Check browser console for WebSocket connection errors
- Verify your Supabase project is not paused
