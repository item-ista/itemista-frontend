-- =============================================
-- SUPABASE SQL QUERIES FOR ITEMISTA
-- =============================================
-- Copy and paste these queries in Supabase SQL Editor
-- Run them in order (1, 2, 3...)


-- =============================================
-- 1. CREATE PRODUCTS TABLE
-- =============================================

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  images TEXT[],
  price NUMERIC(10,2) NOT NULL,
  cut_price NUMERIC(10,2),
  category TEXT,
  brand TEXT,
  stock INTEGER DEFAULT 0,
  is_flash_sale BOOLEAN DEFAULT false,
  flash_sale_end_time TIMESTAMP WITH TIME ZONE,
  discount_percentage NUMERIC(5,2),
  rating NUMERIC(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_flash_sale ON products(is_flash_sale) WHERE is_flash_sale = true;
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);


-- =============================================
-- 2. AUTO-UPDATE TRIGGER
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- =============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Everyone can view active products
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (status = 'active');

-- Service role can do everything (for admin dashboard later)
CREATE POLICY "Service role full access" ON products
  FOR ALL USING (auth.role() = 'service_role');
