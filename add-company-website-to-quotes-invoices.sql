-- Add Company Website Column to Quotes and Invoices Table
-- Run this in Supabase SQL Editor if the table already exists

ALTER TABLE quotes_invoices 
ADD COLUMN IF NOT EXISTS company_website VARCHAR(255);
