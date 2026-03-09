import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import CategoryNav from '../components/common/CategoryNav';
import CategoriesDropdown from '../components/common/CategoriesDropdown';
import ScrollToTop from '../components/common/ScrollToTop';
import Chatbot from '../components/common/Chatbot';
import './MainLayout.css';

const MainLayout = () => {
  const location = useLocation();
  const showCategories = location.pathname === '/flash-sale';
  const isCategoriesPage = location.pathname === '/categories';

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
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isCategoriesPage && <Footer />}
      {/* <Chatbot /> */}
    </div>
  );
};

export default MainLayout;
