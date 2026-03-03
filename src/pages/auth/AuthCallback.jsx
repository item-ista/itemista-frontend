import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../lib/supabase';
import { ShoppingBag, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import './auth-shared.css';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback started, checking URL for hash...');
        
        // Handle the auth callback from email verification
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/auth/login?message=verification-failed', { replace: true });
          return;
        }

        console.log('Session data:', data);

        // Check if user just got verified (has session)
        if (data.session && data.session.user) {
          console.log('User verified and logged in automatically');
          
          // Check if user's email is confirmed
          if (data.session.user.email_confirmed_at) {
            // Email is verified, but we want them to go through login page first
            // So we'll sign them out and send them to login
            await supabase.auth.signOut();
            navigate('/auth/login?message=verified', { replace: true });
          } else {
            // Still waiting for verification
            navigate('/auth/login?message=please-verify', { replace: true });
          }
        } else {
          // No session, send to login
          navigate('/auth/login?message=please-login', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth/login?message=verification-failed', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="auth-container">
      <div className="auth-bg-shape" style={{ top: '10%', left: '10%', width: '300px', height: '300px' }} />
      <div className="auth-bg-shape" style={{ bottom: '10%', right: '5%', width: '250px', height: '250px' }} />
      
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center' }}
      >
        <div className="auth-header">
          <div className="auth-logo" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>
            <ShoppingBag style={{ display: 'inline', marginRight: '8px' }} />
            Itemista
          </div>
          <h1 className="auth-title">Verifying...</h1>
          <p className="auth-subtitle">Please wait while we verify your account.</p>
        </div>
        
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ display: 'inline-block', marginTop: '1rem', color: '#ec4899' }}
        >
          <Loader size={32} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthCallback;
