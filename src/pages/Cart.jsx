import { Link, useNavigate } from 'react-router';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart, startCheckoutFromCart } = useCart();
  const { showCartRemoved } = useNotification();

  const handleQuantityChange = (productId, currentQty, type) => {
    if (type === 'inc') {
      updateQuantity(productId, currentQty + 1);
    } else {
      updateQuantity(productId, currentQty - 1);
    }
  };

  const handleProductClick = (productSlug) => {
    if (productSlug) {
      navigate(`/product/${productSlug}`);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    showCartRemoved('Product removed from cart');
  };

  const handleClearCart = () => {
    clearCart();
    showCartRemoved('Cart cleared');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <ShoppingCart size={80} strokeWidth={1} />
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/" className="continue-shopping-btn">
              <ArrowLeft size={18} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <span className="cart-count">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-section">
            <div className="cart-items-header">
              <span className="header-product">Product</span>
              <span className="header-price">Price</span>
              <span className="header-quantity">Quantity</span>
              <span className="header-total">Total</span>
              <span className="header-action"></span>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-product" onClick={() => handleProductClick(item.slug)}>
                    <div className="cart-item-image">
                      <img src={item.image || '/placeholder-product.jpg'} alt={item.name || item.title} />
                    </div>
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.name || item.title}</h3>
                      {item.color && <span className="cart-item-variant">Color: {item.color}</span>}
                      {item.size && <span className="cart-item-variant">Size: {item.size}</span>}
                    </div>
                  </div>

                  <div className="cart-item-price">
                    <span className="price-current">Rs. {item.price?.toLocaleString()}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="price-original">Rs. {item.originalPrice?.toLocaleString()}</span>
                    )}
                  </div>

                  <div className="cart-item-quantity">
                    <div className="quantity-controls">
                      <button 
                        className={`qty-btn ${item.quantity === 1 ? 'disabled' : ''}`}
                        onClick={() => handleQuantityChange(item.id, item.quantity, 'dec')}
                        disabled={item.quantity === 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity, 'inc')}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>

                  <div className="cart-item-action">
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-items-footer">
              <button className="clear-cart-btn" onClick={handleClearCart}>
                <Trash2 size={16} />
                Clear Cart
              </button>
              <Link to="/" className="continue-shopping-link">
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary-section">
            <div className="cart-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal ({cartCount} items)</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span className="shipping-text">Calculated at checkout</span>
              </div>

              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>

              <button 
                className="checkout-btn"
                onClick={() => {
                  startCheckoutFromCart();
                  navigate('/checkout');
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
