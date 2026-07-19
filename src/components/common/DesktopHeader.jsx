import { Link } from 'react-router';
import { ShoppingCart, User } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import SearchBar from './SearchBar';
import './DesktopHeader.css';

const DesktopHeader = () => {
  const { cartCount } = useCart();
  const { user } = useAuth();

  return (
    <header className="header desktop-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <img src="/ItemIstaWhite.png" alt="ItemIsta" className="header-logo-img" />
        </Link>

        {/* Search Bar */}
        <SearchBar />

        {/* Right Side Icons */}
        <div className="header-icons">
          {/* Profile Icon */}
          <Link to="/profile" className="profile-icon-desktop">
            {user?.user_metadata?.avatar ? (
              <img src={user.user_metadata.avatar} alt={user.user_metadata.full_name || 'User'} className="header-avatar" />
            ) : (
              <User size={28} />
            )}
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="cart-icon-desktop">
            <ShoppingCart size={28} />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;
