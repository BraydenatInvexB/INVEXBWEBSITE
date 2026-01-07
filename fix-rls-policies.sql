-- Fix RLS Policies for INVEXB Website
-- Run this in Supabase SQL Editor to fix Row Level Security issues

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public insert on project_configurations" ON project_configurations;
DROP POLICY IF EXISTS "Allow public insert on contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow public insert on page_visits" ON page_visits;
DROP POLICY IF EXISTS "Allow public read on promotion_settings" ON promotion_settings;
DROP POLICY IF EXISTS "Allow authenticated read on contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated read on project_configurations" ON project_configurations;
DROP POLICY IF EXISTS "Allow authenticated read on page_visits" ON page_visits;
DROP POLICY IF EXISTS "Allow authenticated update on promotion_settings" ON promotion_settings;
DROP POLICY IF EXISTS "Allow authenticated delete on contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated delete on project_configurations" ON project_configurations;
DROP POLICY IF EXISTS "Allow authenticated delete on page_visits" ON page_visits;

-- Ensure RLS is enabled
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public (anon) to insert contact submissions
CREATE POLICY "Allow public insert on contact_submissions"
    ON contact_submissions
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Allow public (anon) to insert project configurations
CREATE POLICY "Allow public insert on project_configurations"
    ON project_configurations
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Allow public (anon) to insert page visits
CREATE POLICY "Allow public insert on page_visits"
    ON page_visits
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Allow public (anon) to read promotion settings
CREATE POLICY "Allow public read on promotion_settings"
    ON promotion_settings
    FOR SELECT
    TO anon
    USING (true);

-- Policy: Allow authenticated users to read contact submissions
CREATE POLICY "Allow authenticated read on contact_submissions"
    ON contact_submissions
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to read project configurations
CREATE POLICY "Allow authenticated read on project_configurations"
    ON project_configurations
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to read page visits
CREATE POLICY "Allow authenticated read on page_visits"
    ON page_visits
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to update promotion settings
CREATE POLICY "Allow authenticated update on promotion_settings"
    ON promotion_settings
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Allow authenticated users to delete contact submissions
CREATE POLICY "Allow authenticated delete on contact_submissions"
    ON contact_submissions
    FOR DELETE
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to delete project configurations
CREATE POLICY "Allow authenticated delete on project_configurations"
    ON project_configurations
    FOR DELETE
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to delete page visits
CREATE POLICY "Allow authenticated delete on page_visits"
    ON page_visits
    FOR DELETE
    TO authenticated
    USING (true);

-- Also allow authenticated users to insert (for admin panel if needed)
CREATE POLICY "Allow authenticated insert on contact_submissions"
    ON contact_submissions
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated insert on project_configurations"
    ON project_configurations
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated insert on page_visits"
    ON page_visits
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

