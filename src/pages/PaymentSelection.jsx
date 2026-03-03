import { useState } from 'react';
import { ChevronLeft, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart'; // Changed from mock
import { useOrder } from '../hooks/useOrder';
import { useAddress } from '../hooks/useAddress';
import { useNotification } from '../hooks/useNotification';
import './PaymentSelection.css';

const PaymentSelection = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, deliveryAddress, clearCart } = useCart(); // Use real cart
  const { addresses } = useAddress();
  const { placeOrder } = useOrder();
  const { showSuccess, showError } = useNotification();
  const [selectedPayment, setSelectedPayment] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Use real cart data
  const subtotal = cartTotal;
  const shipping = 165;
  const total = subtotal + shipping;

  // Determine the best shipping address - same logic as Checkout page
  const shippingAddress = deliveryAddress
    || addresses.find(addr => addr.isDefaultShipping)
    || addresses[0]
    || null;

  const paymentMethods = [
    {
      id: 'easypaisa',
      name: 'Easypaisa',
      icon: '💳',
      disabled: true
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      icon: '💳',
      disabled: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      subtitle: 'Credit/Debit Card',
      icon: '💳',
      disabled: true
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      subtitle: 'Cash on Delivery',
      icon: '💵',
      disabled: false
    }
  ];

  const handlePaymentSelect = (paymentId) => {
    if (paymentId === 'cod') {
      setSelectedPayment(paymentId);
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedPayment) return;
    
    try {
      if (selectedPayment === 'cod') {
        const order = {
          items: cartItems,
          totalAmount: total,
          shippingAddress: shippingAddress,
          paymentMethod: 'Cash on Delivery',
          paymentStatus: 'Pending',
          subtotal,
          shippingFee: shipping
        };

        await placeOrder(order);
        clearCart();
        setShowSuccessModal(true);
        
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate('/orders', { replace: true }); // Redirect to orders page
        }, 3000);
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      showError('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="payment-selection-page">
      {/* Mobile Header */}
      <div className="payment-mobile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1 className="header-title">Select Payment Method</h1>
      </div>

      <div className="payment-container">
        <div className="payment-main">
          <div className="payment-methods">
            <h2 className="payment-title">Select Payment Method</h2>
            
            <div className="payment-grid">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id}
                  className={`payment-method ${method.disabled ? 'disabled' : ''} ${selectedPayment === method.id ? 'selected' : ''}`}
                  onClick={() => handlePaymentSelect(method.id)}
                >
                  <div className="payment-icon">
                    {method.id === 'easypaisa' && <img src="/api/placeholder/40/40" alt="Easypaisa" />}
                    {method.id === 'jazzcash' && <img src="/api/placeholder/40/40" alt="JazzCash" />}
                    {method.id === 'card' && <div className="card-icon">💳</div>}
                    {method.id === 'hbl' && <div className="hbl-icon">HBL</div>}
                    {method.id === 'wallet' && <div className="wallet-icon">💝</div>}
                    {method.id === 'installment' && <div className="installment-icon">💰</div>}
                    {method.id === 'cod' && <div className="cod-icon">💵</div>}
                  </div>
                  <div className="payment-info">
                    <div className="payment-name">{method.name}</div>
                    {method.subtitle && (
                      <div className="payment-subtitle">{method.subtitle}</div>
                    )}
                  </div>
                  {selectedPayment === method.id && (
                    <CheckCircle className="selected-icon" size={20} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="order-summary-sidebar">
          <div className="summary-card">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items and shipping fee included)</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-total">
                <span>Total Amount</span>
                <span className="total-price">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button 
            className={`confirm-order-btn ${!selectedPayment ? 'disabled' : ''}`}
            disabled={!selectedPayment}
            onClick={handleConfirmOrder}
          >
            Confirm Order
          </button>
        </div>
      </div>

      {/* Mobile Confirm Button */}
      <div className="mobile-confirm-section">
        <button 
          className={`confirm-order-mobile ${!selectedPayment ? 'disabled' : ''}`}
          disabled={!selectedPayment}
          onClick={handleConfirmOrder}
        >
          Confirm Order - Rs. {total.toLocaleString()}
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="modal-header">
              <button 
                className="modal-close"
                onClick={() => setShowSuccessModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-content">
              <div className="success-icon">
                <CheckCircle size={64} color="#10B981" />
              </div>
              <h2 className="modal-title">Thank You!</h2>
              <p className="modal-message">
                Your order has been placed successfully. You will receive a confirmation shortly.
              </p>
              <div className="order-details">
                <p>Payment Method: Cash on Delivery</p>
                <p>Total Amount: Rs. {total.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSelection;