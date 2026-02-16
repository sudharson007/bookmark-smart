# Smart Bookmarks - Deployment Checklist

## Pre-Deployment Checklist

### Supabase Setup
- [ ] Created Supabase project
- [ ] Configured Google OAuth in Supabase
- [ ] Created bookmarks table with SQL schema
- [ ] Enabled Row Level Security (RLS) policies
- [ ] Enabled Realtime for bookmarks table
- [ ] Copied Supabase URL and anon key

### Google OAuth Setup
- [ ] Created Google Cloud project
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 Client ID
- [ ] Added Supabase callback URL to authorized redirect URIs
- [ ] Copied Client ID and Client Secret to Supabase

### Local Testing
- [ ] Created `.env.local` with Supabase credentials
- [ ] Ran `npm install` successfully
- [ ] Ran `npm run dev` without errors
- [ ] Tested Google sign-in locally
- [ ] Tested adding bookmarks
- [ ] Tested deleting bookmarks
- [ ] Tested real-time sync (two tabs)
- [ ] Tested privacy (different Google accounts)

### GitHub Setup
- [ ] Created public GitHub repository
- [ ] Initialized git in project directory
- [ ] Added all files to git
- [ ] Committed changes
- [ ] Pushed to GitHub

### Vercel Deployment
- [ ] Signed up/logged in to Vercel
- [ ] Connected GitHub repository
- [ ] Added environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Deployed successfully
- [ ] Copied Vercel deployment URL

### Post-Deployment
- [ ] Tested live URL with Google sign-in
- [ ] Verified bookmarks work on production
- [ ] Verified real-time sync on production
- [ ] Updated README.md with live URL
- [ ] Updated README.md with GitHub repo URL
- [ ] Committed and pushed README updates

## Quick Commands

### Local Development
```bash
npm install
npm run dev
```

### Git Commands
```bash
git init
git add .
git commit -m "Initial commit: Smart Bookmark App"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Build Test (Optional)
```bash
npm run build
npm start
```

## Environment Variables

Required for both local and production:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Troubleshooting

### Build Fails
- Check all TypeScript errors: `npm run build`
- Verify all imports are correct
- Ensure environment variables are set

### Auth Not Working
- Verify Google OAuth redirect URI includes Supabase callback
- Check Supabase Google provider is enabled
- Verify Client ID and Secret are correct

### Real-time Not Working
- Ensure Realtime is enabled for bookmarks table
- Check browser console for WebSocket errors
- Verify Supabase project is not paused

### Deployment Issues
- Check Vercel deployment logs
- Verify environment variables are set in Vercel
- Ensure build completes successfully
