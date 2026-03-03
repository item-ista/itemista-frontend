-- =============================================
-- 4. STORAGE SETUP FOR AVATARS
-- =============================================
-- Copy and paste these queries in Supabase SQL Editor

-- 1. Create the 'avatars' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on storage.objects (It is enabled by default usually, but good to ensure)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public Access for viewing images
-- Anyone can view images in the 'avatars' bucket
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- 4. Policy: Authenticated users can upload images
-- Users can upload files to 'avatars' bucket
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'avatars' );

-- 5. Policy: Users can update their own images
-- Users can update files they own in 'avatars' bucket
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'avatars' AND owner = auth.uid() );

-- 6. Policy: Users can delete their own images
-- Users can delete files they own in 'avatars' bucket
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'avatars' AND owner = auth.uid() );
