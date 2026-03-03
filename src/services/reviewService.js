import { supabase } from '../lib/supabase';

export const reviewService = {
  // Get all reviews for a product
  getProductReviews: async (productId) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  // Get review stats for a product (average rating, count, distribution)
  getProductReviewStats: async (productId) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', productId);

      if (error) throw error;

      const reviews = data || [];
      const total = reviews.length;
      if (total === 0) return { average: 0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };

      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      let sum = 0;
      reviews.forEach((r) => {
        sum += r.rating;
        distribution[r.rating] = (distribution[r.rating] || 0) + 1;
      });

      return {
        average: parseFloat((sum / total).toFixed(1)),
        total,
        distribution,
      };
    } catch (error) {
      console.error('Error fetching review stats:', error);
      return { average: 0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }
  },

  // Check if user has already reviewed a product for a specific order
  hasUserReviewed: async (userId, orderId, productId) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', userId)
        .eq('order_id', orderId)
        .eq('product_id', productId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking review:', error);
      return false;
    }
  },

  // Get all reviewed product IDs for a user across all orders
  getUserReviewedProducts: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('product_id, order_id')
        .eq('user_id', userId);

      if (error) throw error;
      // Return a Set-like structure: "orderId_productId"
      return (data || []).map((r) => `${r.order_id}_${r.product_id}`);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      return [];
    }
  },

  // Submit a review
  submitReview: async ({ productId, userId, orderId, rating, reviewText, images, customerName }) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            product_id: productId,
            user_id: userId,
            order_id: orderId,
            rating,
            review_text: reviewText,
            images: images || [],
            customer_name: customerName,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  },

  // Upload review image to Supabase storage
  uploadReviewImage: async (userId, file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('review-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('review-images')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading review image:', error);
      throw error;
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },
};
