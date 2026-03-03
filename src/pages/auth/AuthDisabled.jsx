import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Lock, Home, Clock } from 'lucide-react';
import './AuthDisabled.css';

const AuthDisabled = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-disabled-container">
      <motion.div
        className="auth-disabled-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="icon-wrapper">
          <Lock size={64} className="lock-icon" />
          <Clock size={32} className="clock-icon" />
        </div>

        <h1 className="auth-disabled-title">Authentication Temporarily Unavailable</h1>
        <p className="auth-disabled-message">
          We're currently performing maintenance on our authentication system.
        </p>
        <p className="auth-disabled-submessage">
          Please check back in 24 hours. Thank you for your patience!
        </p>

        <motion.button
          className="home-btn"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home size={20} />
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AuthDisabled;
