import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Eye, EyeOff, Lock, CheckCircle, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import './auth-shared.css';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { updatePassword, logout } = useAuth();
  const navigate = useNavigate();
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      showError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await updatePassword(formData.password);

      showSuccess('Password reset successful!');
      setSuccess(true);

      // Sign out the user so they can login with new password
      await logout();

      setTimeout(() => {
        navigate('/auth/login?message=password-reset');
      }, 2000);
    } catch (error) {
      showError(error.message || 'Failed to reset password. Please try again.');
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
        {success ? (
          <motion.div
            key="success"
            className="auth-card"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            style={{ textAlign: 'center' }}
          >
            <CheckCircle size={64} style={{ color: '#22c55e', margin: '0 auto 1.5rem' }} />
            <h2 className="auth-title">Password Reset Successful!</h2>
            <p className="auth-subtitle">
              Your password has been updated successfully.
            </p>
            <p style={{ color: '#64748b', marginTop: '1rem' }}>
              Redirecting to login page...
            </p>
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
              <img src="/logos/ItemIstaPink.png" alt="ItemIsta Logo" style={{ height: '100px', width: 'auto', objectFit: 'contain', margin: '0 auto 1rem' }} />
              <h1 className="auth-title">Reset Password</h1>
              <p className="auth-subtitle">Enter your new password below</p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <motion.div variants={itemVariants} className="form-group">
                <label htmlFor="password" className="form-label">
                  New Password
                </label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm New Password
                </label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-input"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
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
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResetPassword;
