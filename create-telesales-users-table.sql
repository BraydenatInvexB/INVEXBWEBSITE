-- Create Telesales Users Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS telesales_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_telesales_users_username ON telesales_users(username);
CREATE INDEX IF NOT EXISTS idx_telesales_users_is_active ON telesales_users(is_active);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_telesales_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_updated_at_telesales_users ON telesales_users;
CREATE TRIGGER set_updated_at_telesales_users
BEFORE UPDATE ON telesales_users
FOR EACH ROW
EXECUTE FUNCTION update_telesales_users_updated_at();

-- Enable RLS
ALTER TABLE telesales_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read on telesales_users" ON telesales_users;
DROP POLICY IF EXISTS "Allow public insert on telesales_users" ON telesales_users;
DROP POLICY IF EXISTS "Allow public update on telesales_users" ON telesales_users;
DROP POLICY IF EXISTS "Allow public delete on telesales_users" ON telesales_users;

-- Create policies that allow anonymous users to read (for login) and authenticated users to manage
-- Note: In production, you should hash passwords and use proper authentication
CREATE POLICY "Allow public read on telesales_users"
    ON telesales_users
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public insert on telesales_users"
    ON telesales_users
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public update on telesales_users"
    ON telesales_users
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete on telesales_users"
    ON telesales_users
    FOR DELETE
    TO anon, authenticated
    USING (true);
