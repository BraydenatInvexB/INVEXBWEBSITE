-- Create Quotes and Invoices Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS quotes_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('quote', 'invoice')),
    document_number VARCHAR(50) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(50),
    client_address TEXT,
    billing_address TEXT,
    company_name VARCHAR(255),
    company_email VARCHAR(255),
    company_phone VARCHAR(50),
    company_address TEXT,
    company_vat VARCHAR(50),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5, 2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0,
    notes TEXT,
    terms TEXT,
    issue_date DATE NOT NULL,
    due_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on document_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_quotes_invoices_document_number ON quotes_invoices(document_number);
CREATE INDEX IF NOT EXISTS idx_quotes_invoices_type ON quotes_invoices(type);
CREATE INDEX IF NOT EXISTS idx_quotes_invoices_status ON quotes_invoices(status);
CREATE INDEX IF NOT EXISTS idx_quotes_invoices_created_at ON quotes_invoices(created_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_quotes_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_updated_at_quotes_invoices ON quotes_invoices;
CREATE TRIGGER set_updated_at_quotes_invoices
BEFORE UPDATE ON quotes_invoices
FOR EACH ROW
EXECUTE FUNCTION update_quotes_invoices_updated_at();

-- Enable RLS
ALTER TABLE quotes_invoices ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read on quotes_invoices" ON quotes_invoices;
DROP POLICY IF EXISTS "Allow authenticated insert on quotes_invoices" ON quotes_invoices;
DROP POLICY IF EXISTS "Allow authenticated update on quotes_invoices" ON quotes_invoices;
DROP POLICY IF EXISTS "Allow authenticated delete on quotes_invoices" ON quotes_invoices;

-- Create policies
CREATE POLICY "Allow public read on quotes_invoices"
    ON quotes_invoices
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert on quotes_invoices"
    ON quotes_invoices
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on quotes_invoices"
    ON quotes_invoices
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on quotes_invoices"
    ON quotes_invoices
    FOR DELETE
    TO authenticated
    USING (true);

