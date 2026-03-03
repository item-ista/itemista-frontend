-- =============================================
-- USEFUL QUERIES FOR REFERENCE
-- =============================================
-- These are for your reference, copy when needed


-- =============================================
-- FETCH ALL FLASH SALE PRODUCTS
-- =============================================
SELECT * FROM products 
WHERE is_flash_sale = true 
  AND status = 'active'
  AND (flash_sale_end_time IS NULL OR flash_sale_end_time > NOW())
ORDER BY created_at DESC;


-- =============================================
-- FETCH SINGLE PRODUCT BY SLUG
-- =============================================
SELECT * FROM products 
WHERE slug = 'wireless-bluetooth-earbuds-pro' 
  AND status = 'active';


-- =============================================
-- FETCH ALL ACTIVE PRODUCTS
-- =============================================
SELECT * FROM products 
WHERE status = 'active'
ORDER BY created_at DESC;


-- =============================================
-- FETCH PRODUCTS BY CATEGORY
-- =============================================
SELECT * FROM products 
WHERE category = 'Electronics' 
  AND status = 'active'
ORDER BY created_at DESC;


-- =============================================
-- SEARCH PRODUCTS BY NAME
-- =============================================
SELECT * FROM products 
WHERE name ILIKE '%earbuds%' 
  AND status = 'active'
ORDER BY created_at DESC;


-- =============================================
-- ADD PRODUCT TO FLASH SALE
-- =============================================
UPDATE products 
SET is_flash_sale = true, 
    flash_sale_end_time = NOW() + INTERVAL '3 days',
    discount_percentage = 30
WHERE slug = 'product-slug-here';


-- =============================================
-- REMOVE PRODUCT FROM FLASH SALE
-- =============================================
UPDATE products 
SET is_flash_sale = false, 
    flash_sale_end_time = NULL
WHERE slug = 'product-slug-here';


-- =============================================
-- DELETE A PRODUCT (SOFT DELETE - RECOMMENDED)
-- =============================================
UPDATE products 
SET status = 'inactive'
WHERE slug = 'product-slug-here';


-- =============================================
-- DELETE A PRODUCT (HARD DELETE)
-- =============================================
DELETE FROM products 
WHERE slug = 'product-slug-here';


-- =============================================
-- COUNT PRODUCTS BY CATEGORY
-- =============================================
SELECT category, COUNT(*) as count
FROM products
WHERE status = 'active'
GROUP BY category
ORDER BY count DESC;
