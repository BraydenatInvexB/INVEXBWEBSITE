-- Supabase Database Schema for INVEXB Website
-- Run these SQL commands in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Configurations Table
CREATE TABLE IF NOT EXISTS project_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_type VARCHAR(100),
    project_name VARCHAR(255),
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    target_audience VARCHAR(255),
    timeline VARCHAR(100),
    platform JSONB DEFAULT '[]'::jsonb,
    integrations TEXT,
    design_style VARCHAR(100),
    color_scheme VARCHAR(255),
    branding TEXT,
    content_management BOOLEAN DEFAULT FALSE,
    user_authentication BOOLEAN DEFAULT FALSE,
    payment_integration BOOLEAN DEFAULT FALSE,
    analytics BOOLEAN DEFAULT FALSE,
    seo_optimization BOOLEAN DEFAULT FALSE,
    responsive_design BOOLEAN DEFAULT FALSE,
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    company_name VARCHAR(255),
    additional_notes TEXT,
    terms_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page Visits Table
CREATE TABLE IF NOT EXISTS page_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promotion Banner Settings Table
CREATE TABLE IF NOT EXISTS promotion_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enabled BOOLEAN DEFAULT TRUE,
    message TEXT DEFAULT 'start a business for',
    price VARCHAR(50) DEFAULT 'R19999',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_promotion CHECK (id = '00000000-0000-0000-0000-000000000001'::uuid)
);

-- Insert default promotion settings
INSERT INTO promotion_settings (id, enabled, message, price)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, TRUE, 'start a business for', 'R19999')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_project_configurations_created_at ON project_configurations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_configurations_contact_email ON project_configurations(contact_email);
CREATE INDEX IF NOT EXISTS idx_page_visits_created_at ON page_visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_visits_path ON page_visits(path);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_contact_submissions_updated_at
    BEFORE UPDATE ON contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_configurations_updated_at
    BEFORE UPDATE ON project_configurations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotion_settings_updated_at
    BEFORE UPDATE ON promotion_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert contact submissions
CREATE POLICY "Allow public insert on contact_submissions"
    ON contact_submissions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Policy: Allow public to insert project configurations
CREATE POLICY "Allow public insert on project_configurations"
    ON project_configurations
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Policy: Allow public to insert page visits
CREATE POLICY "Allow public insert on page_visits"
    ON page_visits
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Policy: Allow public to read promotion settings
CREATE POLICY "Allow public read on promotion_settings"
    ON promotion_settings
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Policy: Allow authenticated users to read all data (for admin panel)
-- Note: You'll need to create an authenticated user or use service role key
CREATE POLICY "Allow authenticated read on contact_submissions"
    ON contact_submissions
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated read on project_configurations"
    ON project_configurations
    FOR SELECT
    TO authenticated
    USING (true);

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

-- Policy: Allow authenticated users to delete data (for admin clear function)
CREATE POLICY "Allow authenticated delete on contact_submissions"
    ON contact_submissions
    FOR DELETE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated delete on project_configurations"
    ON project_configurations
    FOR DELETE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated delete on page_visits"
    ON page_visits
    FOR DELETE
    TO authenticated
    USING (true);

