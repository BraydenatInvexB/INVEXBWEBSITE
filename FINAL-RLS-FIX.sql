-- FINAL RLS FIX - Run this EXACT script in Supabase SQL Editor
-- This will fix both contact_submissions and project_configurations

-- Step 1: Drop ALL existing policies (clean slate)
DROP POLICY IF EXISTS "anon_insert_contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "anon_insert_project_configurations" ON project_configurations;
DROP POLICY IF EXISTS "anon_insert_page_visits" ON page_visits;
DROP POLICY IF EXISTS "anon_read_promotion_settings" ON promotion_settings;
DROP POLICY IF EXISTS "auth_read_contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "auth_read_project_configurations" ON project_configurations;
DROP POLICY IF EXISTS "auth_read_page_visits" ON page_visits;
DROP POLICY IF EXISTS "auth_update_promotion_settings" ON promotion_settings;
DROP POLICY IF EXISTS "auth_delete_contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "auth_delete_project_configurations" ON project_configurations;
DROP POLICY IF EXISTS "auth_delete_page_visits" ON page_visits;
DROP POLICY IF EXISTS "auth_insert_contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "auth_insert_project_configurations" ON project_configurations;
DROP POLICY IF EXISTS "auth_insert_page_visits" ON page_visits;
DROP POLICY IF EXISTS "Allow public insert on contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow public insert on project_configurations" ON project_configurations;
DROP POLICY IF EXISTS "Allow public insert on page_visits" ON page_visits;
DROP POLICY IF EXISTS "Allow public read on promotion_settings" ON promotion_settings;
DROP POLICY IF EXISTS "Allow authenticated read on contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated read on project_configurations" ON project_configurations;
DROP POLICY IF EXISTS "Allow authenticated read on page_visits" ON page_visits;
DROP POLICY IF EXISTS "Allow authenticated update on promotion_settings" ON promotion_settings;
DROP POLICY IF EXISTS "Allow authenticated delete on contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated delete on project_configurations" ON project_configurations;
DROP POLICY IF EXISTS "Allow authenticated delete on page_visits" ON page_visits;
DROP POLICY IF EXISTS "Allow authenticated insert on contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated insert on project_configurations" ON project_configurations;
DROP POLICY IF EXISTS "Allow authenticated insert on page_visits" ON page_visits;

-- Step 2: Ensure RLS is enabled
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_settings ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policies for ANONYMOUS users (public access)
-- This is what allows your website visitors to submit forms

-- Allow anonymous users to INSERT into contact_submissions
CREATE POLICY "anon_can_insert_contacts"
    ON contact_submissions
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow anonymous users to INSERT into project_configurations  
CREATE POLICY "anon_can_insert_projects"
    ON project_configurations
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow anonymous users to INSERT into page_visits
CREATE POLICY "anon_can_insert_visits"
    ON page_visits
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow anonymous users to READ promotion_settings
CREATE POLICY "anon_can_read_promotion"
    ON promotion_settings
    FOR SELECT
    TO anon
    USING (true);

-- Step 4: Create policies for AUTHENTICATED users (admin panel)
-- This allows you to read/delete data in the admin panel

-- Allow authenticated users to READ contact_submissions
CREATE POLICY "auth_can_read_contacts"
    ON contact_submissions
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to READ project_configurations
CREATE POLICY "auth_can_read_projects"
    ON project_configurations
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to READ page_visits
CREATE POLICY "auth_can_read_visits"
    ON page_visits
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to DELETE contact_submissions
CREATE POLICY "auth_can_delete_contacts"
    ON contact_submissions
    FOR DELETE
    TO authenticated
    USING (true);

-- Allow authenticated users to DELETE project_configurations
CREATE POLICY "auth_can_delete_projects"
    ON project_configurations
    FOR DELETE
    TO authenticated
    USING (true);

-- Allow authenticated users to DELETE page_visits
CREATE POLICY "auth_can_delete_visits"
    ON page_visits
    FOR DELETE
    TO authenticated
    USING (true);

-- Allow authenticated users to UPDATE promotion_settings
CREATE POLICY "auth_can_update_promotion"
    ON promotion_settings
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Step 5: Verify policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE schemaname = 'public' 
    AND tablename IN ('contact_submissions', 'project_configurations', 'page_visits', 'promotion_settings')
ORDER BY tablename, policyname;

