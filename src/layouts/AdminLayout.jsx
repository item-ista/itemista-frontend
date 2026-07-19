import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import ScrollToTop from '../components/common/ScrollToTop';
import './AdminLayout.css';

gsap.registerPlugin(ScrollTrigger);

const AdminLayout = () => {
  const adminMainRef = useRef(null);

  useEffect(() => {
    if (!adminMainRef.current) return;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('section, .card, .stat-card, .table-wrap, .panel-box, .admin-card');
      targets.forEach((el, idx) => {
        if (el.offsetParent === null) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            delay: Math.min(idx * 0.02, 0.18),
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
      ScrollTrigger.refresh();
    }, adminMainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <ScrollToTop />
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <motion.main
          ref={adminMainRef}
          className="flex-grow p-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;
