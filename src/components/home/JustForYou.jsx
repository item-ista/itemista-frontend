import { Link } from 'react-router';
import { Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../hooks/useCart';
import { useNotification } from '../../hooks/useNotification';
import './JustForYou.css';

const JustForYou = () => {
  const { addToCart } = useCart();
  const { showSuccess } = useNotification();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const productToAdd = {
      id: product.id,
      name: product.name,
      title: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
    };
    addToCart(productToAdd, 1);
    showSuccess('Successfully added to cart');
  };

  // Mock data for 12 products
  const products = [
    {
      id: 1,
      name: "Premium Large Bath Towel - Ultra Soft & Absorbent",
      price: 1484,
      originalPrice: 1500,
      discount: 1,
      rating: 4.5,
      reviews: 1,
      image: "/placeholder-product.jpg"
    },
    {
      id: 2,
      name: "T9 Vintage Hair Trimmer For Men | T9 Professional Cordless",
      price: 799,
      originalPrice: 1599,
      discount: 50,
      rating: 4.8,
      reviews: 3837,
      image: "/placeholder-product.jpg"
    },
    {
      id: 3,
      name: "Pro White TWS Airpods Sound & High Quality",
      price: 725,
      originalPrice: 3000,
      discount: 76,
      rating: 4.2,
      reviews: 2582,
      image: "/placeholder-product.jpg"
    },
    {
      id: 4,
      name: "NEW ARRIVAL PURE FLEECE ( THE NORTH FACE )",
      price: 1799,
      originalPrice: 3400,
      discount: 47,
      rating: 4.0,
      reviews: 5,
      image: "/placeholder-product.jpg"
    },
    {
      id: 5,
      name: "Ring Toss Game For Kids With 18 inch Stand",
      price: 287,
      originalPrice: 500,
      discount: 43,
      rating: 4.7,
      reviews: 811,
      image: "/placeholder-product.jpg"
    },
    {
      id: 6,
      name: "NAVY BLUE BTS PRINTED WINTER WARM FLEECE",
      price: 899,
      originalPrice: 3500,
      discount: 74,
      rating: 4.6,
      reviews: 209,
      image: "/placeholder-product.jpg"
    },
    {
      id: 7,
      name: "A FAMILY STORE PROVIDES PACK OF 3",
      price: 99,
      originalPrice: 299,
      discount: 67,
      rating: 4.1,
      reviews: 154,
      image: "/placeholder-product.jpg"
    },
    {
      id: 8,
      name: "TRENDY PRINTED SUMMER TRACKSUIT FOR",
      price: 949,
      originalPrice: 3399,
      discount: 72,
      rating: 3.5,
      reviews: 6,
      image: "/placeholder-product.jpg"
    },
    {
      id: 9,
      name: "PACK OF 3 AMAZING NECKLACE DEAL FOR",
      price: 79,
      originalPrice: 299,
      discount: 74,
      rating: 4.3,
      reviews: 181,
      image: "/placeholder-product.jpg"
    },
    {
      id: 10,
      name: "White & black markhor printed For Men & Boys",
      price: 899,
      originalPrice: 1599,
      discount: 44,
      rating: 4.7,
      reviews: 1859,
      image: "/placeholder-product.jpg"
    },
    {
      id: 11,
      name: "Pack of 05 Soft Cotton Underwear Panties for",
      price: 277,
      originalPrice: 799,
      discount: 65,
      rating: 4.8,
      reviews: 3332,
      image: "/placeholder-product.jpg"
    },
    {
      id: 12,
      name: "Slippers for men House slipper for man Slippers",
      price: 329,
      originalPrice: 2050,
      discount: 84,
      rating: 4.2,
      reviews: 708,
      image: "/placeholder-product.jpg"
    }
  ];

  const renderStars = (rating) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={10} 
            className={`star-icon ${star <= rating ? 'filled' : ''}`} 
            fill={star <= rating ? "#FFC107" : "none"}
            color={star <= rating ? "#FFC107" : "#CBCBCB"}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="just-for-you-section">
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
      >
        Just For You
      </motion.h2>
      <motion.div 
        className="jfy-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.95 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 10 
                } 
              }
            }}
          >
            <Link to={`/products/${product.id}`} className="jfy-card">
            <div className="jfy-image-container">
              <img src={product.image} alt={product.name} className="jfy-image" />
              {product.discount > 0 && (
                <div className="jfy-discount-badge">-{product.discount}%</div>
              )}
            </div>
            <div className="jfy-info">
              <h3 className="jfy-name">{product.name}</h3>
              <div className="jfy-price-container">
                <span className="jfy-price">Rs.{product.price}</span>
                {product.discount > 0 && (
                  <span className="jfy-discount-text">-{product.discount}%</span>
                )}
              </div>
              <div className="jfy-rating-container">
                 {renderStars(product.rating)}
                 <span className="jfy-reviews">({product.reviews})</span>
              </div>
              <button 
                className="jfy-add-cart-btn"
                onClick={(e) => handleAddToCart(e, product)}
              >
                <ShoppingCart size={14} />
                Add to Cart
              </button>
            </div>
          </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default JustForYou;
