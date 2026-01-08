-- Fix Promotion Settings Table - Run this in Supabase SQL Editor
-- This ensures the table exists and has the initial row

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS promotion_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enabled BOOLEAN DEFAULT TRUE,
    message TEXT,
    price VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_updated_at_promotion_settings ON promotion_settings;
CREATE TRIGGER set_updated_at_promotion_settings
BEFORE UPDATE ON promotion_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE promotion_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read on promotion_settings" ON promotion_settings;
DROP POLICY IF EXISTS "Allow authenticated update on promotion_settings" ON promotion_settings;
DROP POLICY IF EXISTS "Allow authenticated insert on promotion_settings" ON promotion_settings;

-- Create policies
CREATE POLICY "Allow public read on promotion_settings"
    ON promotion_settings
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow authenticated update on promotion_settings"
    ON promotion_settings
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated insert on promotion_settings"
    ON promotion_settings
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Insert initial row if it doesn't exist
INSERT INTO promotion_settings (id, enabled, message, price)
VALUES ('00000000-0000-0000-0000-000000000001', TRUE, 'start a business for', 'R19999')
ON CONFLICT (id) DO NOTHING;

-- Verify the row exists
SELECT * FROM promotion_settings WHERE id = '00000000-0000-0000-0000-000000000001';

