-- Add Website Column to Company Settings Table
-- Run this in Supabase SQL Editor if the table already exists

ALTER TABLE company_settings 
ADD COLUMN IF NOT EXISTS company_website VARCHAR(255);

