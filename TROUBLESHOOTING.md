# Troubleshooting Guide

## 404 NOT_FOUND Error

If you're seeing a `404: NOT_FOUND` error from Supabase, it usually means one of the following:

### 1. Tables Not Created
The database tables haven't been created yet.

**Solution:**
1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Run the `supabase-schema.sql` file (copy and paste the entire contents)
4. Verify tables exist in **Table Editor**

### 2. Promotion Settings Table Missing Initial Row
The `promotion_settings` table exists but doesn't have the required initial row.

**Solution:**
1. Go to Supabase dashboard → **SQL Editor**
2. Run the `fix-promotion-settings.sql` file
3. This will create the table, set up policies, and insert the initial row

### 3. Row Level Security (RLS) Policies Not Set Up
RLS is enabled but policies aren't configured correctly.

**Solution:**
1. Run `fix-promotion-settings.sql` to fix promotion_settings policies
2. For other tables, run `SIMPLE-FIX.sql` or `FINAL-RLS-FIX.sql`
3. Check **Authentication** → **Policies** in Supabase dashboard

### 4. Environment Variables Missing
The Supabase URL or API key is not configured.

**Solution:**
1. Check your `.env` file exists in the project root
2. Ensure it contains:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
3. Get these values from Supabase dashboard → **Settings** → **API**
4. Restart your development server after adding/changing `.env`

### 5. Wrong Supabase Project
You might be pointing to a different Supabase project.

**Solution:**
1. Verify the URL in `.env` matches your Supabase project URL
2. Check the API key matches the project
3. Ensure the project is active (not paused)

## Quick Diagnostic Steps

1. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Look for Supabase error messages
   - Check the Network tab for failed API calls

2. **Verify Tables Exist:**
   - Go to Supabase dashboard → **Table Editor**
   - You should see these tables:
     - `contact_submissions`
     - `project_configurations`
     - `page_visits`
     - `promotion_settings`

3. **Test Connection:**
   - The app logs connection status in the browser console (development mode)
   - Look for "✓ Supabase connection successful" or error messages

4. **Check RLS Policies:**
   - Go to Supabase dashboard → **Authentication** → **Policies**
   - Verify policies exist for all tables
   - Ensure `anon` role has INSERT permissions for public tables
   - Ensure `anon` role has SELECT permission for `promotion_settings`

## Common Error Codes

- **PGRST116**: No rows found (table empty or row doesn't exist)
- **42P01**: Table does not exist
- **42501**: Permission denied (RLS policy issue)
- **NOT_FOUND**: Resource not found (table/row/policy missing)

## Still Having Issues?

1. Check the Supabase dashboard logs: **Logs** → **API Logs**
2. Verify your Supabase project is not paused
3. Ensure you're using the correct API keys (anon key, not service role key for client-side)
4. Try running the SQL scripts in order:
   - `supabase-schema.sql` (creates tables)
   - `fix-promotion-settings.sql` (fixes promotion settings)
   - `SIMPLE-FIX.sql` (fixes RLS policies)

