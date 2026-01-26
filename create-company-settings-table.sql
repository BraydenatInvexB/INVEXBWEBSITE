-- Create Company Settings Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS company_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_prefix VARCHAR(20) DEFAULT 'QUO',
    invoice_prefix VARCHAR(20) DEFAULT 'INV',
    quote_prefix_type VARCHAR(20) DEFAULT 'custom' CHECK (quote_prefix_type IN ('custom', 'random')),
    invoice_prefix_type VARCHAR(20) DEFAULT 'custom' CHECK (invoice_prefix_type IN ('custom', 'random')),
    company_name VARCHAR(255) DEFAULT 'INVEXB',
    company_email VARCHAR(255),
    company_phone VARCHAR(50),
    company_website VARCHAR(255),
    company_address TEXT,
    company_vat VARCHAR(50),
    bank_name VARCHAR(255),
    bank_account_number VARCHAR(100),
    bank_account_type VARCHAR(50),
    bank_branch_code VARCHAR(50),
    bank_swift_code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_company_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_updated_at_company_settings ON company_settings;
CREATE TRIGGER set_updated_at_company_settings
BEFORE UPDATE ON company_settings
FOR EACH ROW
EXECUTE FUNCTION update_company_settings_updated_at();

-- Enable RLS
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read on company_settings" ON company_settings;
DROP POLICY IF EXISTS "Allow authenticated insert on company_settings" ON company_settings;
DROP POLICY IF EXISTS "Allow authenticated update on company_settings" ON company_settings;

-- Create policies
CREATE POLICY "Allow public read on company_settings"
    ON company_settings
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert on company_settings"
    ON company_settings
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on company_settings"
    ON company_settings
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert default row if it doesn't exist
INSERT INTO company_settings (id, quote_prefix, invoice_prefix, quote_prefix_type, invoice_prefix_type, company_name, company_email)
VALUES ('00000000-0000-0000-0000-000000000002', 'QUO', 'INV', 'custom', 'custom', 'INVEXB', 'info@invexb.com')
ON CONFLICT (id) DO NOTHING;

