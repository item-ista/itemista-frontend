import { Link } from 'react-router';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../hooks/useWishlist';
import ProductCard from '../../components/products/ProductCard';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlistItems } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page empty">
        <div className="empty-wishlist-content">
          <div className="empty-icon-wrapper">
            <Heart size={40} strokeWidth={1.5} />
          </div>
          <h2>Your wishlist is empty</h2>
          <p>Browse our products and add your favorites here!</p>
          <Link to="/" className="btn-browse">
            <ShoppingBag size={18} />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist ({wishlistItems.length})</h1>
      </div>
      <div className="wishlist-grid">
        {wishlistItems.map((product) => (
          <ProductCard key={product.id} product={product} showRemove={true} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
