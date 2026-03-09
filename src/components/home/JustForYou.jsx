import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../hooks/useCart';
import { useNotification } from '../../hooks/useNotification';
import { productService } from '../../services/productService';
import './JustForYou.css';

const JustForYou = () => {
  const { addToCart } = useCart();
  const { showSuccess } = useNotification();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      try {
        const data = await productService.getJustForYouProducts();
        if (!cancelled) setProducts(data);
      } catch (error) {
        console.error('Error fetching just for you products:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    const timeout = setTimeout(() => {
      if (!cancelled) { cancelled = true; setLoading(false); }
    }, 8000);
    fetchProducts();
    return () => { cancelled = true; clearTimeout(timeout); };
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

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <section className="jfy-section">
      {/* Header */}
      <motion.div
        className="jfy-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="jfy-title-block">
          <h2>Just For You</h2>
          <span className="jfy-subtitle">Handpicked For You</span>
        </div>
        <Link to="/just-for-you" className="jfy-shop-all-btn">SHOP ALL PRODUCTS</Link>
      </motion.div>

      {/* Products Grid */}
      <div className="jfy-products">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: '-50px' }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
          >
            <Link to={`/product/${product.slug}`} className="jfy-card">
              {product.discount_percentage > 0 && (
                <div className="jfy-badge">
                  <span className="jfy-save-text">SAVE</span>
                  <span className="jfy-discount-pct">-{Math.round(product.discount_percentage)}%</span>
                </div>
              )}
              <div className="jfy-img-wrap">
                <img src={product.image || '/placeholder-product.jpg'} alt={product.name} className="jfy-img" />
              </div>
              <div className="jfy-info">
                <h3 className="jfy-name">{product.name}</h3>
                <div className="jfy-pricing">
                  <span className="jfy-price">Rs.{product.price}</span>
                  {product.cut_price && (
                    <span className="jfy-cut-price">Rs.{product.cut_price}</span>
                  )}
                  {product.discount_percentage > 0 && (
                    <span className="jfy-disc-label">-{Math.round(product.discount_percentage)}%</span>
                  )}
                </div>
                <button
                  className="jfy-cart-btn"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  <ShoppingCart size={14} />
                  Add to Cart
                </button>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default JustForYou;
