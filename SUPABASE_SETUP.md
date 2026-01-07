# Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: INVEXB Website (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project to be created (takes 1-2 minutes)

## Step 2: Run SQL Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click **Run** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

## Step 3: Get API Keys

1. Go to **Settings** → **API** (in left sidebar)
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys") - Keep this secret!

## Step 4: Configure Environment Variables

1. Create a `.env` file in your project root (copy from `.env.example`)
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
VITE_ADMIN_PASSWORD=admin123
```

3. **Important**: Add `.env` to your `.gitignore` file to keep secrets safe!

## Step 5: Test the Connection

1. Start your development server: `npm run dev`
2. Try submitting a contact form
3. Check your Supabase dashboard → **Table Editor** → `contact_submissions` to see if data appears

## Step 6: Configure Authentication (Optional)

If you want to use Supabase authentication instead of simple password:

1. Go to **Authentication** → **Policies** in Supabase
2. The RLS policies are already set up in the SQL schema
3. For admin access, you can either:
   - Use the service_role key (bypasses RLS)
   - Create a user account in Supabase Auth

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists in project root
- Check that variable names start with `VITE_`
- Restart your dev server after adding `.env`

### "Row Level Security policy violation"
- Make sure you ran the SQL schema completely
- Check that RLS policies were created successfully
- Verify your API keys are correct

### Data not appearing
- Check browser console for errors
- Verify Supabase project is active
- Check Table Editor in Supabase dashboard

## Security Notes

- **Never commit** `.env` file to Git
- The `anon` key is safe for client-side use
- The `service_role` key should only be used server-side (if you add a backend)
- For production, consider using environment variables in your hosting platform

## Next Steps

- Set up email notifications (using Supabase Edge Functions or external service)
- Add more tables if needed
- Configure backups in Supabase dashboard
- Set up monitoring and alerts

