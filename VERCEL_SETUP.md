# Vercel Deployment Setup Guide

This guide will help you deploy your INVEXB website to Vercel with proper environment variable configuration.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A Supabase project with tables created
3. Your Supabase API credentials

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard: [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (this is the `anon` key, NOT the `service_role` key)

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository:
   - Connect your GitHub account if not already connected
   - Select the `INVEXBWEBSITE` repository
   - Click **"Import"**

4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should be auto-detected)
   - **Output Directory**: `dist` (should be auto-detected)
   - **Install Command**: `npm install` (should be auto-detected)

5. **IMPORTANT**: Add Environment Variables:
   - Click **"Environment Variables"** section
   - Add the following variables:

     ```
     Name: VITE_SUPABASE_URL
     Value: https://your-project-id.supabase.co
     ```

     ```
     Name: VITE_SUPABASE_ANON_KEY
     Value: your-anon-key-here
     ```

   - Make sure to add them for **Production**, **Preview**, and **Development** environments
   - Click **"Save"** after adding each variable

6. Click **"Deploy"**

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Navigate to your project directory:
   ```bash
   cd "software company website"
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. When prompted, add environment variables:
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

6. Deploy to production:
   ```bash
   vercel --prod
   ```

## Step 3: Verify Environment Variables

After deployment, verify your environment variables are set:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Verify both variables are present:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Step 4: Test Your Deployment

1. Visit your deployed site URL (provided by Vercel)
2. Open browser DevTools (F12) → Console
3. Check for any Supabase connection errors
4. Test the contact form and project configurator to ensure they work

## Troubleshooting

### Error: 404 NOT_FOUND

If you're seeing `404: NOT_FOUND` errors:

1. **Check Environment Variables**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
   - Make sure they're added for the correct environment (Production/Preview)

2. **Redeploy After Adding Variables**:
   - After adding/changing environment variables, you MUST redeploy
   - Go to Deployments → Click the three dots → Redeploy

3. **Verify Supabase Tables**:
   - Make sure you've run the SQL scripts in Supabase:
     - `supabase-schema.sql` (creates tables)
     - `fix-promotion-settings.sql` (fixes promotion settings)

4. **Check Supabase Project Status**:
   - Ensure your Supabase project is active (not paused)
   - Verify the project URL is correct

### Environment Variables Not Working

- **Important**: Vite requires the `VITE_` prefix for environment variables to be exposed to the client
- Make sure your variables start with `VITE_` (e.g., `VITE_SUPABASE_URL`)
- After adding variables, redeploy your application

### Build Fails

If the build fails:

1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version compatibility (Vercel uses Node 18+ by default)

## Updating Environment Variables

To update environment variables:

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Edit the variable value
3. Click **Save**
4. **Redeploy** your application (Deployments → Redeploy)

## Security Notes

- ✅ **DO** use the `anon` key for client-side code (it's safe for public use)
- ❌ **DON'T** use the `service_role` key in client-side code (it has admin access)
- ✅ **DO** keep your `.env` file in `.gitignore` (already configured)
- ✅ **DO** use Vercel's environment variables for production secrets

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase Documentation](https://supabase.com/docs)

