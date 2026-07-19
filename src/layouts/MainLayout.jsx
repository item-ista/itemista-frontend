import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import CategoryNav from '../components/common/CategoryNav';
import CategoriesDropdown from '../components/common/CategoriesDropdown';
import ScrollToTop from '../components/common/ScrollToTop';
import Chatbot from '../components/common/Chatbot';
import './MainLayout.css';

gsap.registerPlugin(ScrollTrigger);

const MainLayout = () => {
  const location = useLocation();
  const mainRef = useRef(null);
  const showCategories = location.pathname === '/flash-sale';
  const isCategoriesPage = location.pathname === '/categories';
  const isCartPage = location.pathname === '/cart';

  useEffect(() => {
    if (!mainRef.current) return;

    const ctx = gsap.context(() => {
      const selectors = [
        'section',
        '.flash-sale-product-card',
        '.jfy-card',
        '.product-card',
        '.category-card',
        ...(isCartPage ? [] : ['.cart-item']),
        '.wishlist-item',
        '.order-item',
        '.address-card',
      ];

      const targets = gsap.utils.toArray(selectors.join(', '));

      targets.forEach((el, idx) => {
        // Skip hidden/very tiny elements to avoid noisy animations.
        if (el.offsetParent === null || el.clientHeight < 8) return;

        gsap.fromTo(
          el,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 0.78,
            ease: 'power3.out',
            delay: Math.min(idx * 0.012, 0.22),
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      ScrollTrigger.refresh();
    }, mainRef);

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div className={`min-h-screen flex flex-col ${isCategoriesPage ? 'no-scroll' : ''}`}>
      <ScrollToTop />
      <Header />
      <CategoryNav />
      {showCategories && (
        <div className="categories-container">
          <CategoriesDropdown />
        </div>
      )}
      <motion.main
        ref={mainRef}
        className="flex-grow"
        key={location.pathname}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <Outlet />
      </motion.main>
      {!isCategoriesPage && <Footer />}
      {/* <Chatbot /> */}
    </div>
  );
};

export default MainLayout;
