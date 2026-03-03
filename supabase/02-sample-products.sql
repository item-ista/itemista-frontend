-- =============================================
-- SAMPLE PRODUCTS DATA
-- =============================================
-- Run this AFTER creating the products table


-- =============================================
-- FLASH SALE PRODUCTS
-- =============================================

INSERT INTO products (name, slug, description, image, price, cut_price, category, brand, stock, is_flash_sale, flash_sale_end_time, discount_percentage, status)
VALUES 
  (
    'Wireless Bluetooth Earbuds Pro',
    'wireless-bluetooth-earbuds-pro',
    'Premium wireless earbuds with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
    4999,
    8999,
    'Electronics',
    'TechPro',
    50,
    true,
    NOW() + INTERVAL '7 days',
    44,
    'active'
  ),
  (
    'Smart Watch Series X',
    'smart-watch-series-x',
    'Feature-packed smartwatch with health monitoring, GPS, and 7-day battery life.',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    12999,
    19999,
    'Electronics',
    'SmartTech',
    30,
    true,
    NOW() + INTERVAL '7 days',
    35,
    'active'
  ),
  (
    'Designer Handbag Collection',
    'designer-handbag-collection',
    'Elegant leather handbag perfect for any occasion.',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500',
    3499,
    6999,
    'Fashion',
    'StyleHub',
    25,
    true,
    NOW() + INTERVAL '7 days',
    50,
    'active'
  ),
  (
    'Running Shoes Ultra Comfort',
    'running-shoes-ultra-comfort',
    'Lightweight running shoes with superior cushioning and breathable mesh.',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    5999,
    9999,
    'Sports',
    'SportMax',
    100,
    true,
    NOW() + INTERVAL '7 days',
    40,
    'active'
  ),
  (
    'Portable Power Bank 20000mAh',
    'portable-power-bank-20000mah',
    'High-capacity power bank with fast charging support for all devices.',
    'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
    2499,
    4499,
    'Electronics',
    'PowerUp',
    200,
    true,
    NOW() + INTERVAL '7 days',
    44,
    'active'
  ),
  (
    'Premium Skincare Set',
    'premium-skincare-set',
    'Complete skincare routine with cleanser, toner, serum, and moisturizer.',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    4999,
    8999,
    'Beauty',
    'GlowUp',
    40,
    true,
    NOW() + INTERVAL '7 days',
    44,
    'active'
  );


-- =============================================
-- REGULAR PRODUCTS (NOT FLASH SALE)
-- =============================================

INSERT INTO products (name, slug, description, image, price, cut_price, category, brand, stock, is_flash_sale, status)
VALUES 
  (
    'Classic Cotton T-Shirt',
    'classic-cotton-t-shirt',
    'Comfortable 100% cotton t-shirt available in multiple colors.',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    999,
    1499,
    'Fashion',
    'ComfortWear',
    500,
    false,
    'active'
  ),
  (
    'Laptop Backpack Pro',
    'laptop-backpack-pro',
    'Durable laptop backpack with USB charging port and anti-theft design.',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    2999,
    4499,
    'Accessories',
    'TravelPro',
    80,
    false,
    'active'
  ),
  (
    'Wireless Gaming Mouse',
    'wireless-gaming-mouse',
    'High-precision gaming mouse with RGB lighting and programmable buttons.',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    3499,
    5999,
    'Electronics',
    'GameGear',
    60,
    false,
    'active'
  ),
  (
    'Stainless Steel Water Bottle',
    'stainless-steel-water-bottle',
    'Insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours.',
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    799,
    1299,
    'Lifestyle',
    'EcoLife',
    300,
    false,
    'active'
  ),
  (
    'Mechanical Keyboard RGB',
    'mechanical-keyboard-rgb',
    'Professional mechanical keyboard with customizable RGB backlight.',
    'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500',
    6999,
    9999,
    'Electronics',
    'GameGear',
    45,
    false,
    'active'
  ),
  (
    'Yoga Mat Premium',
    'yoga-mat-premium',
    'Extra thick yoga mat with non-slip surface and carrying strap.',
    'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
    1999,
    2999,
    'Sports',
    'FitLife',
    150,
    false,
    'active'
  ),
  (
    'Sunglasses Aviator Style',
    'sunglasses-aviator-style',
    'Classic aviator sunglasses with UV400 protection.',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    1499,
    2499,
    'Fashion',
    'StyleHub',
    200,
    false,
    'active'
  ),
  (
    'Bluetooth Speaker Portable',
    'bluetooth-speaker-portable',
    'Waterproof portable speaker with 360-degree sound.',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    3999,
    5999,
    'Electronics',
    'SoundWave',
    70,
    false,
    'active'
  );
