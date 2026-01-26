-- Add Billing Address Column to Quotes and Invoices Table
-- Run this in Supabase SQL Editor if the table already exists

ALTER TABLE quotes_invoices 
ADD COLUMN IF NOT EXISTS billing_address TEXT;

