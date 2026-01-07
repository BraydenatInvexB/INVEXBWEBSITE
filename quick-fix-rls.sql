-- Quick Fix for RLS Policies
-- Run this in Supabase SQL Editor to immediately fix the RLS issues

-- First, let's temporarily disable RLS to see if that's the issue
-- Then we'll add proper policies

-- Drop ALL existing policies first
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- Disable RLS temporarily (for testing - we'll enable it back)
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_configurations DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_settings DISABLE ROW LEVEL SECURITY;

-- Now enable RLS and create proper policies
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_settings ENABLE ROW LEVEL SECURITY;

-- Create policies that allow anonymous users to insert
CREATE POLICY "anon_insert_contact_submissions"
    ON contact_submissions
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "anon_insert_project_configurations"
    ON project_configurations
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "anon_insert_page_visits"
    ON page_visits
    FOR INSERT
    TO anon
    WITH CHECK (true);

CREATE POLICY "anon_read_promotion_settings"
    ON promotion_settings
    FOR SELECT
    TO anon
    USING (true);

-- Allow authenticated users to read everything
CREATE POLICY "auth_read_contact_submissions"
    ON contact_submissions
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "auth_read_project_configurations"
    ON project_configurations
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "auth_read_page_visits"
    ON page_visits
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to update promotion settings
CREATE POLICY "auth_update_promotion_settings"
    ON promotion_settings
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "auth_delete_contact_submissions"
    ON contact_submissions
    FOR DELETE
    TO authenticated
    USING (true);

CREATE POLICY "auth_delete_project_configurations"
    ON project_configurations
    FOR DELETE
    TO authenticated
    USING (true);

CREATE POLICY "auth_delete_page_visits"
    ON page_visits
    FOR DELETE
    TO authenticated
    USING (true);

-- Also allow authenticated users to insert (for admin panel)
CREATE POLICY "auth_insert_contact_submissions"
    ON contact_submissions
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "auth_insert_project_configurations"
    ON project_configurations
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "auth_insert_page_visits"
    ON page_visits
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

