import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Eye, EyeOff, Mail, Lock, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import './auth-shared.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message = params.get('message');
    
    if (message === 'verified') {
      showSuccess('Email verified successfully! You can now log in.');
    } else if (message === 'password-reset') {
      showSuccess('Password reset successful! Please log in with your new password.');
    } else if (message === 'verification-failed') {
      showError('There was an issue verifying your email. Please try again.');
    } else if (message === 'please-verify') {
      showError('Please verify your email before logging in.');
    } else if (message === 'please-login') {
      showSuccess('Please log in to continue.');
    } else if (params.get('error')) {
      showError('There was an issue verifying your email. Please try again.');
    }
  }, [location, showSuccess, showError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      showSuccess('Welcome back! Login successful.');
      navigate('/');
    } catch (error) {
      showError(error.message || 'Failed to login. Please check your credentials.');
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

      <motion.div
        className="auth-card"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/ItemIstaPink.png" alt="ItemIsta Logo" style={{ height: '100px', width: 'auto', objectFit: 'contain', margin: '0 auto 1rem' }} />
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to continue shopping</p>
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
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your email"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="form-group">
            <label htmlFor="password" className="form-label">
              Password
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
                placeholder="Enter your password"
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

          <motion.div variants={itemVariants} style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
            <Link to="/auth/forgot-password" className="auth-link">
              Forgot Password?
            </Link>
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="submit"
            className="auth-button"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </motion.button>

          <motion.p variants={itemVariants} className="auth-footer">
            Don't have an account?{' '}
            <Link to="/auth/register" className="auth-link">
              Sign Up
            </Link>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
