import { Link, useLocation } from 'react-router';
import { Home, ShoppingCart, User, Grid3X3 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import './MobileBottomNav.css';

const MobileBottomNav = () => {
  const location = useLocation();
  const { cartCount } = useCart();
  const { user } = useAuth();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="mobile-bottom-nav">
      <Link 
        to="/" 
        className={`nav-item ${isActive('/') ? 'active' : ''}`}
      >
        <Home size={24} />
        <span>Home</span>
      </Link>

      <Link 
        to="/categories" 
        className={`nav-item ${isActive('/categories') ? 'active' : ''}`}
      >
        <Grid3X3 size={24} />
        <span>Categories</span>
      </Link>

      <Link 
        to="/cart" 
        className={`nav-item ${isActive('/cart') ? 'active' : ''}`}
      >
        <div className="nav-icon-wrapper">
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="nav-badge">{cartCount > 99 ? '99+' : cartCount}</span>
          )}
        </div>
        <span>Cart</span>
      </Link>

      <Link 
        to="/profile" 
        className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
      >
        {user?.user_metadata?.avatar ? (
          <img 
            src={user.user_metadata.avatar} 
            alt="Profile" 
            className="nav-avatar-img"
          />
        ) : (
          <User size={24} />
        )}
        <span>Account</span>
      </Link>
    </nav>
  );
};

export default MobileBottomNav;
