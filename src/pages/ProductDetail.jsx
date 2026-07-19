import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { Star, Heart, Share2, Check, Truck, ShieldCheck, Undo2, Info, Plus, Minus, Home, ShoppingCart, Loader2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AddressSelector from '../components/common/AddressSelector';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useNotification } from '../hooks/useNotification';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import './ProductDetail.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
  const [zoomBgPosition, setZoomBgPosition] = useState('0% 0%');
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ average: 0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [reviewFilter, setReviewFilter] = useState('all');
  const [reviewSort, setReviewSort] = useState('recent');
  const [reviewImageModal, setReviewImageModal] = useState(null);
  const imageContainerRef = useRef(null);
  const thumbVertRef = useRef(null);
  const thumbHorizRef = useRef(null);

  // Touch swipe handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50; // Swipe threshold
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      // Swipe left - show next image
      setSelectedImage(prev => (prev + 1) % (product?.images?.length || 1));
    }
    if (isRightSwipe) {
      // Swipe right - show previous image
      setSelectedImage(prev => (prev - 1 + (product?.images?.length || 1)) % (product?.images?.length || 1));
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const scrollThumbs = (ref, direction) => {
    if (!ref.current) return;
    const amount = 160;
    ref.current.scrollBy({
      top: direction === 'up' || direction === 'down' ? (direction === 'up' ? -amount : amount) : 0,
      left: direction === 'left' || direction === 'right' ? (direction === 'left' ? -amount : amount) : 0,
      behavior: 'smooth',
    });
  };

  const { deliveryAddress, setDeliveryAddress, addToCart, cartItems, setBuyNowProduct } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showSuccess, showError, showWishlistAdded, showWishlistRemoved } = useNotification();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductBySlug(slug);
        if (!data) {
          setError('Product not found');
          return;
        }
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Fetch reviews when product loads
  useEffect(() => {
    if (!product?.id) return;
    const fetchReviews = async () => {
      const [reviewsData, stats] = await Promise.all([
        reviewService.getProductReviews(product.id),
        reviewService.getProductReviewStats(product.id),
      ]);
      setReviews(reviewsData);
      setReviewStats(stats);
    };
    fetchReviews();
  }, [product?.id]);

  const handleAddressChange = (addressData) => {
    setDeliveryAddress(addressData);
  };

  const handleQuantityChange = (type) => {
    if (type === 'inc') {
      if (product?.stock && quantity >= product.stock) {
        showError('Maximum stock reached');
        return;
      }
      setQuantity(prev => prev + 1);
    } else {
      if (quantity > 1) {
        setQuantity(prev => prev - 1);
      }
    }
  };

  // Check if product is already in cart
  const isInCart = product ? cartItems.some(item => item.id === product.id) : false;

  const handleAddToCart = () => {
    if (!product || isInCart) return;
    
    const productToAdd = {
      id: product.id,
      name: product.name,
      title: product.name,
      price: product.price,
      originalPrice: product.cut_price,
      image: product.image,
      slug: product.slug,
    };
    addToCart(productToAdd, quantity);
    showSuccess('Successfully added to cart');
  };

  const handleBuyNow = () => {
    if (!product) return;

    const productToCheckout = {
      id: product.id,
      name: product.name,
      title: product.name,
      price: product.price,
      originalPrice: product.cut_price,
      image: product.image,
      slug: product.slug,
    };

    setBuyNowProduct(productToCheckout, quantity);
    navigate('/checkout');
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/product/${product.slug}`;
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on ItemIsta — Rs. ${product.price?.toLocaleString()}`,
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        showSuccess('Link copied to clipboard!');
        setTimeout(() => setShareCopied(false), 2500);
      } catch {
        showError('Could not copy link');
      }
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      cut_price: product.cut_price, // Needed for discount calculation in cards
      image: product.image,
      slug: product.slug,
      description: product.description,
      brand: product.brand,
      rating: product.rating,
      reviews_count: product.reviews_count,
    };

    const isAdded = toggleWishlist(productData);
    if (isAdded) {
      showWishlistAdded('Added to wishlist');
    } else {
      showWishlistRemoved('Removed from wishlist');
    }
  };

  // Zoom handlers
  const handleMouseMove = (e) => {
    const container = imageContainerRef.current;
    if (!container) return;
    const { left, top, width, height } = container.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomBgPosition(`${x}% ${y}%`);
    setZoomStyle({ display: 'block' });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  // Loading State
  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="pd-loading">
          <Loader2 className="loading-spinner" size={48} />
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="pd-error">
          <h2>Product Not Found</h2>
          <p>{error || 'The product you are looking for does not exist.'}</p>
          <Link to="/flash-sale" className="btn-back-to-products">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // Calculate discount percentage
  const discountPercentage = product.discount_percentage || 
    (product.cut_price ? Math.round(((product.cut_price - product.price) / product.cut_price) * 100) : 0);

  // Product images array - use images array from DB, fallback to single image
  const productImages = (product.images && product.images.length > 0) 
    ? product.images 
    : [product.image];

  return (
    <motion.div 
      className="product-detail-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="pd-container">
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <Link to="/">Home</Link> 
          <span>&gt;</span>
          <Link to="/flash-sale">Products</Link> 
          {product.category && (
            <>
              <span>&gt;</span>
              <Link to={`/products?category=${product.category}`}>{product.category}</Link>
            </>
          )}
          <span>&gt;</span>
          <span className="current-crumb">{product.name}</span>
        </div>

        <div className="pd-main-layout">
          {/* Left Column - Images */}
          <div className="pd-gallery">
            <div className="pd-thumbnails-vertical-wrap">
              <button className="pd-thumb-nav up" onClick={() => scrollThumbs(thumbVertRef, 'up')} aria-label="Scroll up">
                <ChevronUp size={16} />
              </button>
              <div className="pd-thumbnails-vertical" ref={thumbVertRef}>
                {productImages.map((img, index) => (
                  <div 
                    key={index} 
                    className={`pd-thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                    onMouseEnter={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
              <button className="pd-thumb-nav down" onClick={() => scrollThumbs(thumbVertRef, 'down')} aria-label="Scroll down">
                <ChevronDown size={16} />
              </button>
            </div>
            
            <div 
              className="pd-main-image-container"
              ref={imageContainerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img src={productImages[selectedImage]} alt={product.name} className="pd-main-image" />
            </div>

            {/* Zoom Preview - shown on right side of image on hover */}
            <div 
              className="pd-zoom-preview" 
              style={{
                ...zoomStyle,
                backgroundImage: `url(${productImages[selectedImage]})`,
                backgroundPosition: zoomBgPosition,
              }}
            />

            {/* Mobile thumbnails - horizontal scroll */}
            <div className="pd-thumbnails-horizontal-wrap">
              <button className="pd-thumb-nav-horiz left" onClick={() => scrollThumbs(thumbHorizRef, 'left')} aria-label="Scroll left">
                <ChevronLeft size={16} />
              </button>
              <div className="pd-thumbnails-horizontal" ref={thumbHorizRef}>
                {productImages.map((img, index) => (
                  <div 
                    key={index} 
                    className={`pd-thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
              <button className="pd-thumb-nav-horiz right" onClick={() => scrollThumbs(thumbHorizRef, 'right')} aria-label="Scroll right">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Middle Column - Product Info */}
          <div className="pd-info">
            <h1 className="pd-title">{product.name}</h1>
            
            <div className="pd-meta">
              <div className="pd-rating">
                <div className="stars">
                  {[1, 2, 3, 4, 5].map(star => {
                    const displayRating = reviewStats.total > 0 ? reviewStats.average : 0;
                    const fillPercent = Math.min(1, Math.max(0, displayRating - (star - 1)));
                    return (
                      <div key={star} className="star-wrapper">
                        {/* Background grey star */}
                        <Star size={14} fill="#ddd" color="#ddd" className="star-bg" />
                        {/* Foreground yellow star with clip */}
                        <div className="star-fill" style={{ width: `${fillPercent * 100}%` }}>
                          <Star size={14} fill="#FFC107" color="#FFC107" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <span className="rating-value">{reviewStats.total > 0 ? reviewStats.average : '—'}</span>
                {reviewStats.total > 0 && (
                  <span className="rating-count">{reviewStats.total} Ratings</span>
                )}
              </div>
              <div className="pd-actions">
                <button
                  className={`icon-btn share-btn${shareCopied ? ' copied' : ''}`}
                  onClick={handleShare}
                  title="Share this product"
                >
                  {shareCopied ? <Check size={18} /> : <Share2 size={18} />}
                </button>
                <button 
                  className={`icon-btn wishlist-btn ${isInWishlist(product.id) ? 'wishlisted' : ''}`}
                  onClick={handleWishlistToggle}
                  title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart 
                    size={20} 
                    fill={isInWishlist(product.id) ? "#e91e63" : "none"} 
                    color={isInWishlist(product.id) ? "#e91e63" : "#9e9e9e"}
                    strokeWidth={isInWishlist(product.id) ? 0 : 2}
                  />
                </button>
              </div>
            </div>

            {product.brand && (
              <div className="pd-brand">
                <span className="brand-label">Brand:</span>
                <Link to={`/products?brand=${product.brand}`} className="brand-link">{product.brand}</Link>
              </div>
            )}

            <div className="pd-price-section">
              <div className="pd-current-price-row">
                <div className="pd-current-price">Rs. {product.price?.toLocaleString()}</div>
                {discountPercentage > 0 && (
                  <span className="pd-discount-pill">-{discountPercentage}%</span>
                )}
              </div>
              {product.cut_price && product.cut_price > product.price && (
                <div className="pd-old-price-row">
                  <span className="pd-old-price">Rs. {product.cut_price?.toLocaleString()}</span>
                </div>
              )}
            </div>

            {product.description && (
              <div className="pd-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
            )}

            <div className="pd-stock-info">
              {product.stock > 0 ? (
                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">✗ Out of Stock</span>
              )}
            </div>

            <div className="pd-quantity">
              <span className="quantity-label">Quantity</span>
              <div className="quantity-selector">
                <button 
                  className={`qty-btn ${quantity === 1 ? 'disabled' : ''}`} 
                  onClick={() => handleQuantityChange('dec')}
                  disabled={quantity === 1}
                >
                  <Minus size={16} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button 
                  className="qty-btn" 
                  onClick={() => handleQuantityChange('inc')}
                  disabled={product.stock && quantity >= product.stock}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="pd-buttons">
              <button 
                className="btn-buy-now" 
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
              <button 
                className={`btn-add-cart ${isInCart ? 'added' : ''}`}
                onClick={isInCart ? () => navigate('/cart') : handleAddToCart}
                disabled={product.stock === 0}
              >
                {isInCart ? 'Go to Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>

          {/* Right Column - Delivery & Services */}
          <div className="pd-sidebar">
            <div className="pd-delivery-section">
              <div className="sidebar-header">
                <span className="sidebar-title">Delivery Options</span>
                <Info size={16} color="#9e9e9e" />
              </div>
              
              <AddressSelector 
                currentAddress={deliveryAddress?.fullAddress || 'Sindh, Karachi - Gulistan-e-Johar, Block 18'}
                onAddressChange={handleAddressChange}
              />

              <div className="delivery-option">
                <div className="delivery-icon-wrapper">
                   <Truck size={20} className="sidebar-icon" />
                </div>
                <div className="delivery-details">
                  <div className="delivery-type-row">
                    <span className="delivery-type">Standard Delivery</span>
                    <span className="delivery-price">Rs. 165</span>
                  </div>
                  <span className="delivery-time">Guaranteed by 3-5 days</span>
                </div>
              </div>

              <div className="delivery-option no-border">
                 <div className="delivery-icon-wrapper">
                   <span className="cod-icon">💵</span>
                 </div>
                 <div className="delivery-details">
                    <span className="delivery-type">Cash on Delivery Available</span>
                 </div>
              </div>
            </div>

            <div className="pd-service-section">
              <div className="sidebar-header">
                <span className="sidebar-title">Return & Warranty</span>
                <Info size={16} color="#9e9e9e" />
              </div>

              <div className="service-list">
                <div className="service-item">
                  <ShieldCheck size={20} className="sidebar-icon" />
                  <span className="service-text">100% Authentic Products</span>
                </div>
                <div className="service-item">
                  <Undo2 size={20} className="sidebar-icon" />
                  <span className="service-text">14 days easy return</span>
                </div>
                <div className="service-item">
                  <ShieldCheck size={20} className="sidebar-icon" />
                  <span className="service-text">Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Reviews Section ── */}
        <div className="pd-reviews-section">
          <h2 className="pd-reviews-title">
            Ratings & Reviews of {product.name}
          </h2>

          {/* Review Stats Bar */}
          <div className="pd-review-stats">
            <div className="pd-review-stats-left">
              <div className="pd-review-avg">{reviewStats.average}<span>/5</span></div>
              <div className="pd-review-avg-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    fill={star <= Math.round(reviewStats.average) ? '#FFC107' : '#ddd'}
                    color={star <= Math.round(reviewStats.average) ? '#FFC107' : '#ddd'}
                  />
                ))}
              </div>
              <span className="pd-review-total-count">{reviewStats.total} Ratings</span>
            </div>

            <div className="pd-review-stats-right">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviewStats.distribution[star] || 0;
                const percent = reviewStats.total > 0 ? (count / reviewStats.total) * 100 : 0;
                return (
                  <div key={star} className="pd-review-bar-row">
                    <div className="pd-review-bar-stars">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} fill={s <= star ? '#FFC107' : '#ddd'} color={s <= star ? '#FFC107' : '#ddd'} />
                      ))}
                    </div>
                    <div className="pd-review-bar-track">
                      <div
                        className={`pd-review-bar-fill star-${star}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="pd-review-bar-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews List Header */}
          {reviews.length > 0 && (
            <div className="pd-reviews-list-header">
              <h3>Product Reviews</h3>
              <div className="pd-reviews-controls">
                <div className="pd-review-sort">
                  <span>Sort:</span>
                  <select value={reviewSort} onChange={(e) => setReviewSort(e.target.value)}>
                    <option value="recent">Most Recent</option>
                    <option value="highest">Highest Rating</option>
                    <option value="lowest">Lowest Rating</option>
                  </select>
                </div>
                <div className="pd-review-filter">
                  <span>Filter:</span>
                  <select value={reviewFilter} onChange={(e) => setReviewFilter(e.target.value)}>
                    <option value="all">All Stars</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="pd-reviews-list">
            {reviews.length === 0 ? (
              <div className="pd-no-reviews">
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              [...reviews]
                .filter((r) => reviewFilter === 'all' || r.rating === parseInt(reviewFilter))
                .sort((a, b) => {
                  if (reviewSort === 'highest') return b.rating - a.rating;
                  if (reviewSort === 'lowest') return a.rating - b.rating;
                  return new Date(b.created_at) - new Date(a.created_at);
                })
                .map((review) => (
                  <div key={review.id} className="pd-review-card">
                    <div className="pd-review-card-header">
                      <div className="pd-review-stars-row">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={14} fill={s <= review.rating ? '#FFC107' : '#ddd'} color={s <= review.rating ? '#FFC107' : '#ddd'} />
                        ))}
                      </div>
                      <span className="pd-review-date">
                        {new Date(review.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="pd-review-author">
                      <span className="pd-review-name">{review.customer_name}</span>
                      <span className="pd-review-verified">✅ Verified Purchase</span>
                    </div>

                    <p className="pd-review-text">{review.review_text}</p>

                    {review.images && review.images.length > 0 && (
                      <div className="pd-review-images">
                        {review.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="pd-review-img-thumb"
                            onClick={() => setReviewImageModal(img)}
                          >
                            <img src={img} alt={`Review photo ${idx + 1}`} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Review Image Lightbox Modal */}
        {reviewImageModal && (
          <div className="pd-review-modal-overlay" onClick={() => setReviewImageModal(null)}>
            <div className="pd-review-modal" onClick={(e) => e.stopPropagation()}>
              <button className="pd-review-modal-close" onClick={() => setReviewImageModal(null)}>✕</button>
              <img src={reviewImageModal} alt="Review" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDetail;
