-- =============================================
-- ADD is_just_for_you COLUMN TO PRODUCTS
-- =============================================
-- Run this in Supabase SQL Editor

ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_just_for_you BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_products_just_for_you
  ON products(is_just_for_you)
  WHERE is_just_for_you = true;
