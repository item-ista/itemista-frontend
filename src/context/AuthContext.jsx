import { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await authService.getSession();
      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { user, session } = await authService.login({ email, password });
      setUser(user);
      setSession(session);
      return user;
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      // Note: With email confirmation, user won't be logged in immediately
      return result;
    } catch (error) {
      console.error('Register error in AuthContext:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error in AuthContext:', error);
      // Still clear local state even if logout fails
      setUser(null);
      setSession(null);
    }
  };

  const resetPassword = async (email) => {
    try {
      await authService.forgotPassword(email);
    } catch (error) {
      console.error('Reset password error in AuthContext:', error);
      throw error;
    }
  };

  const updatePassword = async (password) => {
    try {
      await authService.resetPassword(password);
    } catch (error) {
      console.error('Update password error in AuthContext:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    checkAuth,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
