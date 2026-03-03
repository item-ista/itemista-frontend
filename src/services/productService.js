import { supabase } from '../lib/supabase';

export const productService = {
  // Fetch all products
  getProducts: async (params = {}) => {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'active');

      if (params.category) {
        query = query.eq('category', params.category);
      }

      if (params.limit) {
        query = query.limit(params.limit);
      }

      if (params.search) {
        query = query.ilike('name', `%${params.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Fetch flash sale products
  getFlashSaleProducts: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_flash_sale', true)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching flash sale products:', error);
      return [];
    }
  },

  // Fetch single product by slug
  getProductBySlug: async (slug) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      return null;
    }
  },

  // Fetch single product by ID
  getProduct: async (id) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Search products
  searchProducts: async (query) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .or(`name.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },
};
