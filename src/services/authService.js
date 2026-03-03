import { supabase } from '../lib/supabase';

export const authService = {
  // Sign up with email and password
  register: async ({ email, password, firstName, lastName, phone }) => {
    try {
      console.log('Attempting to register user:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            full_name: `${firstName} ${lastName}`
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        throw error;
      }
      
      console.log('Registration successful:', data);
      return data;
    } catch (error) {
      console.error('Register service error:', error);
      throw error;
    }
  },

  // Sign in with email and password
  login: async ({ email, password }) => {
    try {
      console.log('Attempting to login user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      console.log('Login successful:', data);
      return { user: data.user, session: data.session };
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  },

  // Sign out
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  // Get current session
  getSession: () => {
    return supabase.auth.getSession();
  },

  // Get user profile
  getProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');
    return user;
  },

  // Update user profile
  updateProfile: async (updates) => {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    });

    if (error) throw error;
    return data;
  },

  // Change password
  changePassword: async (password) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    });

    if (error) throw error;
    return data;
  },

  // Send password reset email
  forgotPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });

    if (error) throw error;
    return data;
  },

  // Reset password with token
  resetPassword: async (password) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    });

    if (error) throw error;
    return data;
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Sign in with OAuth provider
  signInWithOAuth: async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;
    return data;
  },

  // Upload avatar
  uploadAvatar: async (userId, file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }
};
