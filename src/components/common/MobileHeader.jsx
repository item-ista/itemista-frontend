import { Link, useLocation } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import SearchBar from './SearchBar';
import './MobileHeader.css';

const MobileHeader = () => {
  const location = useLocation();
  const isFlashSalePage = location.pathname === '/flash-sale';

  return (
    <header className="header mobile-header">
      <div className="header-container">
        {/* Flash Sale Back Button */}
        {isFlashSalePage && (
          <Link to="/" className="back-arrow-mobile">
            <ArrowLeft size={24} />
          </Link>
        )}

        {/* Search Bar Only */}
        <SearchBar />
      </div>
    </header>
  );
};

export default MobileHeader;
