import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Mail, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import './auth-shared.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { resetPassword } = useAuth();
  const { showSuccess, showError } = useNotification();

  const bgShape1Ref = useRef(null);
  const bgShape2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgShape1Ref.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none',
      });

      gsap.to(bgShape2Ref.current, {
        rotation: -360,
        duration: 15,
        repeat: -1,
        ease: 'none',
      });

      gsap.to(bgShape1Ref.current, {
        x: 50,
        y: 50,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });

      gsap.to(bgShape2Ref.current, {
        x: -50,
        y: -50,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    });

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(email);
      showSuccess('Password reset link sent to your email!');
      setEmailSent(true);
    } catch (error) {
      showError(error.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <div className="auth-container">
      <div ref={bgShape1Ref} className="auth-bg-shape auth-bg-shape-1"></div>
      <div ref={bgShape2Ref} className="auth-bg-shape auth-bg-shape-2"></div>

      <AnimatePresence mode="wait">
        {emailSent ? (
          <motion.div
            key="success"
            className="auth-card"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📧</div>
            <h2 className="auth-title">Check Your Email</h2>
            <p className="auth-subtitle" style={{ marginBottom: '1.5rem' }}>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
              Please check your email and click the link to reset your password.
            </p>
            <motion.button
              className="auth-button"
              onClick={() => setEmailSent(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Try Again
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            className="auth-card"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <img src="/ItemIstaPink.png" alt="ItemIsta Logo" style={{ height: '100px', width: 'auto', objectFit: 'contain', margin: '0 auto 1rem' }} />
              <h1 className="auth-title">Forgot Password?</h1>
              <p className="auth-subtitle">
                No worries! Enter your email and we'll send you a reset link.
              </p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <motion.div variants={itemVariants} className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="Enter your email"
                  />
                </div>
              </motion.div>

              <motion.button
                variants={itemVariants}
                type="submit"
                className="auth-button"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Sending Link...' : 'Send Reset Link'}
              </motion.button>

              <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <Link to="/auth/login" className="auth-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ArrowLeft size={18} />
                  Back to Login
                </Link>
              </motion.div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForgotPassword;
