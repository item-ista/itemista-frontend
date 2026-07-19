import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollToTop from '../components/common/ScrollToTop';
import './AuthLayout.css';

gsap.registerPlugin(ScrollTrigger);

const AuthLayout = () => {
  const location = useLocation();
  const authRef = useRef(null);

  useEffect(() => {
    if (!authRef.current) return;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('form, .auth-card, .login-card, .register-card, .forgot-card, .reset-card');
      targets.forEach((el) => {
        if (el.offsetParent === null) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.72,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
      ScrollTrigger.refresh();
    }, authRef);

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <motion.div
      ref={authRef}
      className="auth-layout"
      key={location.pathname}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: 'easeOut' }}
    >
      <ScrollToTop />
      <Outlet />
    </motion.div>
  );
};

export default AuthLayout;
