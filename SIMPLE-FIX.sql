-- SIMPLE FIX - Copy and paste this ENTIRE script into Supabase SQL Editor
-- This will fix the RLS issues immediately

-- STEP 1: Disable RLS temporarily to test
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_configurations DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_settings DISABLE ROW LEVEL SECURITY;

-- STEP 2: Re-enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_settings ENABLE ROW LEVEL SECURITY;

-- STEP 3: Create simple policies that allow EVERYONE to insert
CREATE POLICY "allow_all_insert_contacts" ON contact_submissions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "allow_all_insert_projects" ON project_configurations FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "allow_all_insert_visits" ON page_visits FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "allow_all_read_promotion" ON promotion_settings FOR SELECT TO public USING (true);

-- STEP 4: Allow authenticated users to read/delete
CREATE POLICY "allow_auth_read_contacts" ON contact_submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "allow_auth_read_projects" ON project_configurations FOR SELECT TO authenticated USING (true);
CREATE POLICY "allow_auth_read_visits" ON page_visits FOR SELECT TO authenticated USING (true);
CREATE POLICY "allow_auth_delete_contacts" ON contact_submissions FOR DELETE TO authenticated USING (true);
CREATE POLICY "allow_auth_delete_projects" ON project_configurations FOR DELETE TO authenticated USING (true);
CREATE POLICY "allow_auth_delete_visits" ON page_visits FOR DELETE TO authenticated USING (true);
CREATE POLICY "allow_auth_update_promotion" ON promotion_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

