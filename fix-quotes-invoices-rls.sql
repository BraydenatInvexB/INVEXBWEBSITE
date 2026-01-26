-- Fix RLS Policies for Quotes and Invoices Table
-- Allow anonymous users to insert/update/delete quotes_invoices since the app uses its own auth
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read on quotes_invoices" ON quotes_invoices;
DROP POLICY IF EXISTS "Allow authenticated insert on quotes_invoices" ON quotes_invoices;
DROP POLICY IF EXISTS "Allow authenticated update on quotes_invoices" ON quotes_invoices;
DROP POLICY IF EXISTS "Allow authenticated delete on quotes_invoices" ON quotes_invoices;

-- Create policies that allow anonymous users to read, insert, update, and delete
CREATE POLICY "Allow public read on quotes_invoices"
    ON quotes_invoices
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public insert on quotes_invoices"
    ON quotes_invoices
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public update on quotes_invoices"
    ON quotes_invoices
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow public delete on quotes_invoices"
    ON quotes_invoices
    FOR DELETE
    TO anon, authenticated
    USING (true);
