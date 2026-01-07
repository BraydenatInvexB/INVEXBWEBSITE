-- TEMPORARY FIX: Disable RLS entirely
-- Use this ONLY for testing. Re-enable RLS with proper policies for production.

-- Disable RLS on all tables
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_configurations DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_settings DISABLE ROW LEVEL SECURITY;

-- This will allow all operations without RLS checks
-- IMPORTANT: Re-enable RLS with proper policies before going to production!

