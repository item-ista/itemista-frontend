import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Eye, EyeOff, Mail, Lock, User, Phone, ShoppingBag, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import './auth-shared.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { register } = useAuth();
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
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      });
      
      showSuccess('Registration successful! Please check your email to verify your account.');
      setEmailSent(true);
    } catch (error) {
      showError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
            <CheckCircle size={64} style={{ color: '#22c55e', margin: '0 auto 1.5rem' }} />
            <h2 className="auth-title">Check Your Email</h2>
            <p className="auth-subtitle" style={{ marginBottom: '1.5rem' }}>
              We've sent a verification link to <strong>{formData.email}</strong>
            </p>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>
              Please check your email and click the verification link to activate your account.
            </p>
            <motion.button
              className="auth-button"
              onClick={() => navigate('/auth/login')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Go to Login
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
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">Start your shopping journey today</p>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <motion.div variants={itemVariants} className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <div className="input-wrapper">
                    <User className="input-icon" size={18} />
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="form-input"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="First Name"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <div className="input-wrapper">
                    <User className="input-icon" size={18} />
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="form-input"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="Last Name"
                    />
                  </div>
                </motion.div>
              </div>

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
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <div className="input-wrapper">
                  <Phone className="input-icon" size={18} />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Enter phone number"
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
                    placeholder="Create a password"
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
                  Confirm Password
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
                    placeholder="Confirm your password"
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </motion.button>

              <motion.p variants={itemVariants} className="auth-footer">
                Already have an account?{' '}
                <Link to="/auth/login" className="auth-link">
                  Sign In
                </Link>
              </motion.p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
