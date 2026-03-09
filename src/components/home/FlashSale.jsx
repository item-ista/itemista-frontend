import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { productService } from '../../services/productService';
import { useCart } from '../../hooks/useCart';
import { useNotification } from '../../hooks/useNotification';
import './FlashSale.css';

const getColumnCount = () => {
  const w = window.innerWidth;
  if (w > 1024) return 6;
  if (w > 768) return 4;
  if (w > 480) return 3;
  return 2;
};

const FlashSale = () => {
  const { addToCart } = useCart();
  const { showSuccess } = useNotification();
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cols, setCols] = useState(getColumnCount);

  useEffect(() => {
    const handleResize = () => setCols(getColumnCount());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch flash sale products from Supabase
  useEffect(() => {
    let cancelled = false;

    const fetchFlashSaleProducts = async () => {
      try {
        const data = await productService.getFlashSaleProducts();
        if (!cancelled) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching flash sale products:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    // Safety fallback: force loading=false after 8s to prevent infinite spinner
    const timeout = setTimeout(() => {
      if (!cancelled) {
        cancelled = true;
        setLoading(false);
      }
    }, 8000);

    fetchFlashSaleProducts();

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      title: product.name,
      price: product.price,
      originalPrice: product.cut_price,
      image: product.image,
    }, 1);
    showSuccess('Successfully added to cart');
  };

  return (
    <section className="flash-sale-section">
      {/* Desktop Header */}
      <motion.div 
        className="flash-sale-header-desktop"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flash-sale-title-desktop">
          <h2>Flash Sale</h2>
          <span className="sale-subtitle">On Sale Now</span>
        </div>
        <Link to="/flash-sale" className="shop-all-btn">SHOP ALL PRODUCTS</Link>
      </motion.div>

      {/* Mobile Header */}
      <motion.div 
        className="flash-sale-header-mobile"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="mobile-header-row">
          <h2 className="flash-sale-title-mobile">Flash Sale</h2>
          <Link to="/flash-sale" className="shop-more-link">Shop More &gt;</Link>
        </div>
        <div className="countdown-timer">
          <div className="timer-label">ENDING IN</div>
          <div className="timer-display">
            <span className="timer-unit">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="timer-separator">:</span>
            <span className="timer-unit">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="timer-separator">:</span>
            <span className="timer-unit">{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </motion.div>

      {/* Products List */}
      <div className="flash-sale-products">
        {loading ? (
          <div className="flash-sale-loading">Loading...</div>
        ) : products.length === 0 ? (
          <div className="flash-sale-empty">No flash sale products available</div>
        ) : (
          products.slice(0, cols * 2).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
            >
              <Link to={`/product/${product.slug}`} className="flash-sale-product-card">
                {product.discount_percentage > 0 && (
                  <div className="discount-badge">
                    <span className="save-text">SAVE</span>
                    <span className="discount-percent">-{Math.round(product.discount_percentage)}%</span>
                  </div>
                )}
                <div className="product-image-container">
                  <img src={product.image || '/placeholder-product.jpg'} alt={product.name} className="product-image" />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-pricing">
                    <span className="product-price">Rs.{product.price}</span>
                    {product.cut_price && (
                      <span className="product-original-price">Rs.{product.cut_price}</span>
                    )}
                    {product.discount_percentage > 0 && (
                      <span className="product-discount">-{Math.round(product.discount_percentage)}%</span>
                    )}
                  </div>
                  {product.stock > 0 && product.stock <= 10 && (
                    <div className="stock-indicator">
                      <span className="stock-text">{product.stock} Stock left</span>
                    </div>
                  )}
                  <button
                    className="fs-add-cart-btn"
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    <ShoppingCart size={14} />
                    Add to Cart
                  </button>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
};

export default FlashSale;
