# Supabase Setup Guide for ItemIsta

## Files in this folder:

1. **01-create-tables.sql** - Products table create karta hai
2. **02-sample-products.sql** - Sample products insert karta hai (flash sale + regular)
3. **03-useful-queries.sql** - Reference queries for later use

---

## Step-by-Step Setup:

### Step 1: Table Create Karo
1. Supabase Dashboard kholo
2. SQL Editor pe jao
3. `01-create-tables.sql` ka code copy karo
4. Paste karo aur RUN karo

### Step 2: Sample Products Add Karo
1. SQL Editor me
2. `02-sample-products.sql` ka code copy karo
3. Paste karo aur RUN karo

### Step 3: Check Karo
1. Table Editor pe jao
2. "products" table select karo
3. 14 products dikhengi (6 flash sale + 8 regular)

---

## Image URLs:

Maine Unsplash ke free images use kiye hain jo directly kaam karenge.
Baad me apne images upload kar sakte ho Supabase Storage me.

---

## RLS (Row Level Security):

- Currently anyone can READ active products
- WRITE operations sirf authenticated users ke liye hain
- Admin dashboard ke liye baad me policies add karenge

---

## Next Steps:

1. ✅ Tables create karo
2. ✅ Sample data insert karo  
3. ⏳ Frontend integration (next step)
