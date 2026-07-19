import { Link } from 'react-router';
import { ShoppingCart, Heart, Trash2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useNotification } from '../../hooks/useNotification';
import './ProductCard.css';

const ProductCard = ({ product, viewMode = 'grid', showRemove = false }) => {
  const { addToCart, isInCart } = useCart();
  const { isInWishlist, toggleWishlist, removeFromWishlist } = useWishlist();
  const { showCartAdded, showCartAlreadyAdded, showWishlistAdded, showWishlistRemoved } = useNotification();
  const productId = product.id ?? product.product_id;
  const inCart = isInCart(productId);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (inCart) {
      showCartAlreadyAdded('Product already added to cart');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
    });
    showCartAdded('Product added to cart');
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const productData = {
      id: productId,
      name: product.name,
      price: product.price,
      cut_price: product.cut_price,
      image: product.image,
      slug: product.slug,
      description: product.description,
      brand: product.brand,
    };
    const isAdded = toggleWishlist(productData);
    if (isAdded) {
      showWishlistAdded('Added to wishlist');
    } else {
      showWishlistRemoved('Removed from wishlist');
    }
  };

  const handleRemoveFromWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWishlist(productId);
    showWishlistRemoved('Removed from wishlist');
  };

  const discountPercent =
    product.cut_price && product.cut_price > product.price
      ? Math.round(((product.cut_price - product.price) / product.cut_price) * 100)
      : 0;

  const inWishlist = isInWishlist(productId);

  return (
    <Link to={`/product/${product.slug}`} className={`product-card ${viewMode}`}>
      {/* Image Area */}
      <div className="pc-image-wrapper">
        <img
          src={product.image || '/placeholder-product.jpg'}
          alt={product.name}
          className="pc-image"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="pc-discount-badge">SAVE {discountPercent}%</div>
        )}

        {/* Wishlist / Remove button */}
        <button
          type="button"
          className={`pc-wishlist-btn ${inWishlist ? 'wishlisted' : ''} ${showRemove ? 'remove-btn' : ''}`}
          onClick={showRemove ? handleRemoveFromWishlist : handleWishlistToggle}
          aria-label={showRemove ? 'Remove from wishlist' : 'Toggle wishlist'}
        >
          {showRemove ? (
            <Trash2 size={16} />
          ) : (
            <Heart
              size={16}
              fill={inWishlist ? '#e91e63' : 'none'}
              color={inWishlist ? '#e91e63' : '#64748b'}
            />
          )}
        </button>

        {/* Add to Cart overlay on hover */}
        <div className="pc-hover-overlay">
          <button
            type="button"
            className={`pc-cart-btn ${inCart ? 'added' : ''}`}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} />
            {inCart ? 'Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Info Area */}
      <div className="pc-info">
        {product.brand && (
          <span className="pc-brand">{product.brand}</span>
        )}

        <h3 className="pc-name" title={product.name}>
          {product.name}
        </h3>

        {viewMode === 'list' && product.description && (
          <p className="pc-description">
            {product.description.substring(0, 120)}…
          </p>
        )}

        <div className="pc-price-row">
          <span className="pc-price">
            Rs. {product.price?.toLocaleString()}
          </span>
          {discountPercent > 0 && (
            <div className="pc-price-right">
              <span className="pc-cut-price">
                Rs. {product.cut_price?.toLocaleString()}
              </span>
              <span className="pc-discount-chip">-{discountPercent}%</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
