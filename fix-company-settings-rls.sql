-- Fix RLS Policies for Company Settings
-- Allow anonymous users to update company_settings since the app uses its own auth
-- Run this in Supabase SQL Editor

-- Drop ALL existing policies (handle any naming variations)
DROP POLICY IF EXISTS "Allow public read on company_settings" ON company_settings;
DROP POLICY IF EXISTS "Allow authenticated insert on company_settings" ON company_settings;
DROP POLICY IF EXISTS "Allow authenticated update on company_settings" ON company_settings;
DROP POLICY IF EXISTS "Allow public insert on company_settings" ON company_settings;
DROP POLICY IF EXISTS "Allow public update on company_settings" ON company_settings;

-- Ensure RLS is enabled
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- Create policies that allow anonymous users to read, insert, and update
CREATE POLICY "Allow public read on company_settings"
    ON company_settings
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public insert on company_settings"
    ON company_settings
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public update on company_settings"
    ON company_settings
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);
