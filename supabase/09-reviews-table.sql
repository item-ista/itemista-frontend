-- =============================================
-- REVIEWS TABLE FOR PRODUCT REVIEWS
-- =============================================
-- Run this in your Supabase SQL Editor

-- Drop existing policies if re-running
DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
  DROP POLICY IF EXISTS "Users can create own reviews" ON reviews;
  DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
  DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;
  DROP POLICY IF EXISTS "Admins full access on reviews" ON reviews;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  images TEXT[] DEFAULT '{}',
  customer_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Unique constraint: one review per product per order
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_unique_order_product ON reviews(order_id, product_id);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- RLS POLICIES FOR REVIEWS
-- =============================================

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can view reviews (public)
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

-- Authenticated users can insert reviews (user_id must match their auth.uid())
CREATE POLICY "Users can create own reviews" ON reviews
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Admins can do everything with reviews
CREATE POLICY "Admins full access on reviews" ON reviews
  FOR ALL USING (
    coalesce(
      auth.jwt() -> 'user_metadata' ->> 'role',
      auth.jwt() -> 'app_metadata' ->> 'role'
    ) = 'admin'
  );

-- =============================================
-- STORAGE BUCKET FOR REVIEW IMAGES
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('review-images', 'review-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if re-running
DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can view review images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload review images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own review images" ON storage.objects;
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

-- Anyone can view review images
CREATE POLICY "Anyone can view review images" ON storage.objects
  FOR SELECT USING (bucket_id = 'review-images');

-- Authenticated users can upload review images
CREATE POLICY "Authenticated users can upload review images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'review-images');

-- Users can delete their own review images
CREATE POLICY "Users can delete own review images" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'review-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
