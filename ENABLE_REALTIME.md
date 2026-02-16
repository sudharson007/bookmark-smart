# How to Enable Realtime in Supabase

## Visual Guide

![Realtime Setup Steps](/Users/sudharsonsr/.gemini/antigravity/brain/018cc228-fb2f-44d2-84c8-3b71d31fc4a7/realtime_setup_guide_1771264611965.png)

## Step-by-Step Instructions

### 1. Navigate to Database Section

1. Open your Supabase project dashboard
2. Look at the **left sidebar**
3. Click on the **Database** icon (looks like a cylinder/database icon)

### 2. Go to Replication

1. In the secondary menu that appears, click on **Replication**
2. This will show you the replication settings for your tables

### 3. Enable Realtime for bookmarks Table

1. You'll see a list of tables in your database
2. Find the **bookmarks** table in the list
3. Look for the **Realtime** column
4. **Toggle the switch to ON** (it will turn green)
5. The table is now enabled for real-time updates!

## What This Does

Enabling Realtime for the `bookmarks` table allows your Next.js application to:
- Receive instant notifications when bookmarks are added
- Get updates when bookmarks are deleted
- Sync changes across all open browser tabs in real-time

## Verification

After enabling Realtime:
1. The toggle switch should be **green/ON**
2. You should see `supabase_realtime` in the Publication column
3. Your app will now receive real-time updates!

## Troubleshooting

**If you don't see the Replication option:**
- Make sure you're in the correct project
- Check that you have the necessary permissions
- Try refreshing the page

**If the toggle doesn't work:**
- Make sure the table exists (run the SQL schema first)
- Check your project's plan (Realtime should be available on free tier)
- Try disabling and re-enabling it

## Next Steps

After enabling Realtime:
1. Copy your Supabase URL and anon key from Settings > API
2. Update your `.env.local` file with these credentials
3. Restart your dev server
4. Test the real-time functionality!
