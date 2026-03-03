import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ChevronLeft, MapPin, Store, ChevronRight, Ticket, Info, CreditCard } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAddress } from '../hooks/useAddress';
import AddressDrawer from '../components/common/AddressDrawer';
import './Checkout.css';

const DELIVERY_FEE = 165;

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, deliveryAddress, setDeliveryAddress } = useCart();
  const { addresses, addAddress, updateAddress } = useAddress();
  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);
  
  // Use addresses from context or fallback to empty array
  // If deliveryAddress is set in CartContext (from previous selection), use it.
  // Otherwise, fallback to default or first address.
  const shippingAddress = deliveryAddress || addresses.find(addr => addr.isDefaultShipping) || addresses[0];

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const orderTotal = cartTotal + DELIVERY_FEE;

  // Redirect to cart if no items
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleAddOrUpdateAddress = (address, isUpdate) => {
    if (isUpdate) {
      updateAddress(address);
    } else {
      addAddress(address);
    }
  };

  return (
    <div className="checkout-page">
      {/* Mobile Header */}
      <div className="checkout-mobile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1 className="header-title">Checkout</h1>
      </div>

      <div className="checkout-container">
        <div className="checkout-main">
          {/* Shipping Section */}
          <div className="checkout-section">
            <div className="section-header">
              <div className="header-left">
                <MapPin size={20} className="section-icon mobile-only" color="#1a9cb7" />
                 <h2 className="section-title">Shipping & Billing</h2>
              </div>
              <button 
                className="edit-btn"
                onClick={() => setIsAddressDrawerOpen(true)}
              >
                EDIT
              </button>
            </div>
            <div className="address-details">
              {shippingAddress ? (
                <>
                  <div className="address-name-row">
                     <span className="user-name">{shippingAddress.name}</span>
                     <span className="user-phone">{shippingAddress.phone}</span>
                  </div>
                  <div className="address-content">
                    <span className="address-tag">{shippingAddress.tag}</span>
                    <p className="address-text">
                      {shippingAddress.fullAddress || `${shippingAddress.address}, ${shippingAddress.region}`}
                    </p>
                    <ChevronRight size={18} className="mobile-only arrow-right" />
                  </div>
                </>
              ) : (
                <div className="address-empty-state">
                  <p>No shipping address selected</p>
                </div>
              )}
            </div>
          </div>

          {/* Package Details */}
          <div className="package-section">
            <div className="package-header">
               <div className="package-title-row">
                 <h2 className="section-title">Package 1 of 1</h2>
                 <span className="shipped-by">Shipped by <span className="store-name">ItemIsta</span></span>
               </div>
            </div>

            <div className="package-store mobile-only">
               <Store size={18} />
               <span>ItemIsta</span>
            </div>

            <div className="delivery-card">
               <div className="delivery-choice">
                  <div className="choice-header">
                    <div className="choice-radio active">
                       <div className="radio-dot"></div>
                    </div>
                    <div className="choice-info">
                       <span className="delivery-price">Rs. {DELIVERY_FEE}</span>
                       <span className="delivery-label">Standard Delivery</span>
                    </div>
                  </div>
                  <div className="delivery-estimate">
                     Guaranteed by 3-5 days
                  </div>
                  <button className="pickup-link mobile-only">Click for self pick-up &gt;</button>
               </div>
            </div>

            {cartItems.map((item) => {
              const discount = item.originalPrice 
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) 
                : 0;
              return (
                <div className="checkout-item" key={item.id}>
                   <div className="item-image">
                      <img src={item.image} alt={item.name} />
                   </div>
                   <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <div className="item-price-qty">
                         <div className="price-box">
                            <span className="current-price">Rs. {item.price?.toLocaleString()}</span>
                            {item.originalPrice && <span className="old-price">Rs. {item.originalPrice?.toLocaleString()}</span>}
                            {discount > 0 && <span className="discount-tag">-{discount}%</span>}
                         </div>
                         <span className="item-qty">Qty: {item.quantity}</span>
                      </div>
                   </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Only Voucher Section */}
          <div className="checkout-section mobile-only invoice-section">
             <div className="section-header">
                <div className="header-left">
                  <Ticket size={20} color="#ec4899" />
                   <h2 className="section-title">Voucher & Code</h2>
                </div>
                <div className="voucher-input-placeholder">
                   Enter your voucher code &gt;
                </div>
             </div>
          </div>

          <div className="checkout-section mobile-only invoice-section">
             <div className="section-header">
                <div className="header-left">
                  <div className="invoice-icon">📄</div>
                   <h2 className="section-title">Invoice and Contact Info</h2>
                </div>
                <ChevronRight size={18} color="#ccc" />
             </div>
          </div>
        </div>

        {/* Sidebar (Web) / Summary (Combined) */}
        <div className="checkout-sidebar">
          {/* Promotion Card (Web) */}
          <div className="sidebar-card promo-card desktop-only">
             {/* <h3 className="sidebar-subtitle">Promotion</h3> */}
             <div className="promo-input-row">
                <input type="text" placeholder="Enter ItemIsta Store Code" />
                <button className="apply-btn">APPLY</button>
             </div>
          </div>

          {/* Contact (Web) */}
          <div className="sidebar-card desktop-only">
             <div className="sidebar-card-header">
                <h3 className="sidebar-subtitle">Invoice and Contact Info</h3>
                <button className="edit-link">Edit</button>
             </div>
          </div>

          {/* Summary Card */}
          <div className="sidebar-card summary-card">
             <h3 className="sidebar-subtitle desktop-only">Order Summary</h3>
             
             <div className="summary-row desktop-only">
                <span>Items Total ({totalQuantity} items)</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
             </div>
             <div className="summary-row desktop-only">
                <span>Delivery Fee</span>
                <span>Rs. {DELIVERY_FEE}</span>
             </div>

             {/* Mobile Summary Rows */}
             <div className="summary-row mobile-only">
                <span className="summary-label">Merchandise Subtotal ({totalQuantity} items)</span>
                <span className="summary-value">Rs. {cartTotal.toLocaleString()}</span>
             </div>
             <div className="summary-row mobile-only">
                <span className="summary-label">Shipping Fee Subtotal</span>
                <span className="summary-value">Rs. {DELIVERY_FEE}</span>
             </div>

             <div className="total-row">
                <span className="total-label">Total:</span>
                <div className="total-value-container">
                   <span className="total-price">Rs. {orderTotal.toLocaleString()}</span>
                   <span className="vat-text">VAT included, where applicable</span>
                </div>
             </div>

             <button 
               className="proceed-btn desktop-only"
               onClick={() => navigate('/payment')}
             >
               Proceed to Pay
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="checkout-mobile-footer mobile-only">
         <div className="footer-total">
            <span className="total-label">Total:</span>
            <span className="total-price">Rs. {orderTotal.toLocaleString()}</span>
         </div>
         <button 
           className="proceed-btn-mobile"
           onClick={() => navigate('/payment')}
         >
           Proceed to Pay
         </button>
      </div>

      {/* Address Drawer */}
      <AddressDrawer
        isOpen={isAddressDrawerOpen}
        onClose={() => setIsAddressDrawerOpen(false)}
        currentAddress={shippingAddress}
        savedAddresses={addresses}
        onAddressChange={(newAddress) => {
          setDeliveryAddress(newAddress);
          setIsAddressDrawerOpen(false);
        }}
        onAddAddress={handleAddOrUpdateAddress}
      />
    </div>
  );
};

export default Checkout;
