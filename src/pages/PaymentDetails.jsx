import { useMemo, useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle, CreditCard, Shield, Loader2, Lock, AlertTriangle, Info } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useOrder } from '../hooks/useOrder';
import { useAddress } from '../hooks/useAddress';
import { useNotification } from '../hooks/useNotification';
import SafepayCheckoutButton from '../components/checkout/SafepayButton';
import './PaymentDetails.css';

const DELIVERY_FEE = 165;

// Safepay config from env
const SAFEPAY_ENV = import.meta.env.VITE_SAFEPAY_ENVIRONMENT || 'sandbox';
// IMPORTANT: Use the PUBLIC key (starts with pk_) for the frontend, NOT the secret key.
const SAFEPAY_PUBLIC_KEY = import.meta.env.VITE_SAFEPAY_API_KEY || ''; 

const PaymentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkoutItems, checkoutTotal, buyNowItem, clearBuyNowProduct, clearCart } = useCart();
  const { placeOrder } = useOrder();
  const { addresses } = useAddress();
  const { showSuccess, showOrderSuccess, showError, showInfo } = useNotification();

  const persistedSelection = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('checkout-selection');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const selection = location.state || persistedSelection;
  const paymentMethod = selection?.paymentMethod || 'cod';

  const shippingAddress = useMemo(() => {
    const selectedAddressId = selection?.selectedAddressId;
    if (!selectedAddressId) return addresses.find((addr) => addr.isDefaultShipping) || addresses[0] || null;
    return addresses.find((addr) => addr.id === selectedAddressId) || addresses.find((addr) => addr.isDefaultShipping) || addresses[0] || null;
  }, [addresses, selection?.selectedAddressId]);

  const customerDetails = {
    fullName: selection?.customerDetails?.fullName || shippingAddress?.name || '',
    email: selection?.customerDetails?.email || shippingAddress?.email || '',
    phone: selection?.customerDetails?.phone || shippingAddress?.phone || '',
  };

  const [placingOrder, setPlacingOrder] = useState(false);
  const [safepayCompleted, setSafepayCompleted] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const subtotal = checkoutTotal;
  const total = subtotal + DELIVERY_FEE;

  // Check address on mount
  useEffect(() => {
    if (selection && (!shippingAddress || addresses.length === 0)) {
      setShowAddressModal(true);
    }
    
    // Simulating button load time for better UX
    const timer = setTimeout(() => setIsButtonLoading(false), 800);
    return () => clearTimeout(timer);
  }, [shippingAddress, addresses.length, selection]);

  if (!selection || checkoutItems.length === 0) {
    return (
      <div className="payment-details-page">
        <div className="payment-details-empty">
          <Info size={48} className="info-icon" />
          <h2>Checkout Session Not Found</h2>
          <p>Please complete payment method selection first.</p>
          <button onClick={() => navigate('/payment')} className="go-back-btn">Go Back</button>
        </div>
      </div>
    );
  }

  // ── Safepay Embedded Payment - onPayment callback ──
  const handleSafepaySuccess = async (data) => {
    if (!shippingAddress || addresses.length === 0) {
      setShowAddressModal(true);
      return;
    }

    try {
      setSafepayCompleted(true);
      showInfo('Payment received! Creating your order...');

      const paymentDetails = {
        payer_name: customerDetails.fullName,
        payer_email: customerDetails.email,
        payer_phone: customerDetails.phone,
        payment_gateway: 'safepay',
        tracker_token: data?.tracker || data?.token || '',
        reference_code: data?.reference_code || data?.ref || '',
        signature: data?.signature || data?.sig || '',
        paid_at: new Date().toISOString(),
      };

      const orderData = await placeOrder({
        items: checkoutItems,
        totalAmount: total,
        shippingAddress,
        selectedAddressId: shippingAddress?.id || selection?.selectedAddressId || null,
        customerName: customerDetails.fullName,
        customerPhone: customerDetails.phone,
        paymentMethod: 'Debit Card (Safepay)',
        paymentStatus: 'paid',
        paymentDetails,
        subtotal,
        shippingFee: DELIVERY_FEE,
      });

      // Clear cart
      if (buyNowItem) {
        clearBuyNowProduct();
      } else {
        clearCart();
      }
      sessionStorage.removeItem('checkout-selection');

      showSuccess('Payment successful! Order has been placed.');
      navigate('/payment-success', {
        state: {
          fromSafepay: true,
          orderId: orderData?.id,
          referenceCode: data?.reference_code || data?.ref || '',
        },
        replace: true,
      });
    } catch (error) {
      console.error('Order creation after Safepay payment failed:', error);
      showError('Payment was received but order creation failed. Please contact support.');
    }
  };

  // ── Cash on Delivery Flow ──
  const handleCODPayment = async () => {
    if (!shippingAddress || addresses.length === 0) {
      setShowAddressModal(true);
      return;
    }

    if (!customerDetails.fullName || !customerDetails.email || !customerDetails.phone) {
      showError('Customer details missing. Please go back and complete details.');
      return;
    }

    try {
      setPlacingOrder(true);

      const paymentDetails = {
        payer_name: customerDetails.fullName,
        payer_email: customerDetails.email,
        payer_phone: customerDetails.phone,
      };

      await placeOrder({
        items: checkoutItems,
        totalAmount: total,
        shippingAddress,
        selectedAddressId: shippingAddress?.id || selection?.selectedAddressId || null,
        customerName: customerDetails.fullName,
        customerPhone: customerDetails.phone,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'pending',
        paymentDetails,
        subtotal,
        shippingFee: DELIVERY_FEE,
      });

      if (buyNowItem) {
        clearBuyNowProduct();
      } else {
        clearCart();
      }

      sessionStorage.removeItem('checkout-selection');
      showOrderSuccess('Order placed successfully!');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Order placement failed:', error);
      showError('Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleAddressModalRedirect = () => {
    setShowAddressModal(false);
    sessionStorage.setItem('checkout-return', 'true');
    navigate('/addresses');
  };

  const isProcessing = placingOrder || safepayCompleted;

  return (
    <div className="payment-details-page">
      <div className="payment-details-mobile-header">
        <button className="back-btn" onClick={() => navigate('/payment')} disabled={isProcessing}>
          <ChevronLeft size={24} />
        </button>
        <h1 className="header-title">Payment Details</h1>
      </div>

      <div className="payment-details-container">
        <div className="payment-details-main">
          <h2 className="payment-details-title">
            {paymentMethod === 'card' ? 'Secure Card Payment' : 'Review & Order'}
          </h2>

          <div className="customer-summary-box">
            <div className="summary-section">
              <h4>Shipping To</h4>
              <p><strong>{customerDetails.fullName}</strong></p>
              <p>{shippingAddress?.fullAddress || `${shippingAddress?.address || ''} ${shippingAddress?.region || ''}`.trim()}</p>
            </div>
            <div className="summary-section">
              <h4>Contact Info</h4>
              <p>{customerDetails.email}</p>
              <p>{customerDetails.phone}</p>
            </div>
          </div>

          {paymentMethod === 'card' ? (
            <div className="safepay-checkout-block">
              <div className="safepay-info-card">
                <div className="safepay-header">
                  <div className="safepay-icon-wrapper">
                    <CreditCard size={28} />
                  </div>
                  <div>
                    <h3>Pay with Debit / Credit Card</h3>
                    <p className="safepay-subtitle">Powered by Safepay — Pakistan's secure gateway</p>
                  </div>
                </div>

                <div className="safepay-features-grid">
                  <div className="feature-item">
                    <Shield size={14} />
                    <span>PCI-DSS Compliant</span>
                  </div>
                  <div className="feature-item">
                    <Shield size={14} />
                    <span>3D Secure</span>
                  </div>
                  <div className="feature-item">
                    <Shield size={14} />
                    <span>Secure Encrypted</span>
                  </div>
                </div>

                <div className="safepay-amount-row">
                  <span className="label">Payable Amount:</span>
                  <span className="value">Rs. {total.toLocaleString()}</span>
                </div>

                <div className="safepay-notice-box">
                  <Lock size={14} />
                  <span>Your payment is processed securely by Safepay. We do not store your card details.</span>
                </div>

                {/* Safepay Embedded Checkout Button */}
                <div className="safepay-button-wrapper">
                  {isButtonLoading && (
                    <div className="safepay-skeleton">
                      <Loader2 className="spin" size={24} />
                      <span>Loading secure payment...</span>
                    </div>
                  )}
                  <div className={`safepay-actual-button ${isButtonLoading ? 'hidden' : ''}`}>
                    <SafepayCheckoutButton
                      env={SAFEPAY_ENV}
                      client={{
                        sandbox: SAFEPAY_PUBLIC_KEY,
                        production: SAFEPAY_PUBLIC_KEY,
                      }}
                      style={{
                        mode: 'light',
                        size: 'large',
                        variant: 'primary',
                      }}
                      orderId={`order-${Date.now()}`}
                      source="website"
                      payment={{
                        currency: 'PKR',
                        amount: total,
                      }}
                      onPayment={(data) => {
                        console.log('Safepay success:', data);
                        handleSafepaySuccess(data);
                      }}
                      onCancel={() => {
                        console.log('Safepay cancel');
                        showError('Payment was cancelled.');
                      }}
                    />
                  </div>
                </div>

                {safepayCompleted && (
                  <div className="safepay-status-message success">
                    <CheckCircle size={18} />
                    <span>Payment completed successfully!</span>
                  </div>
                )}

                <div className="safepay-test-card">
                  <p>🧪 <strong>Test Mode:</strong> Use <code>5200 0000 0000 1096</code>, Expiry <code>03/28</code>, CVC <code>111</code></p>
                </div>
              </div>
            </div>
          ) : (
            <div className="cod-info-card">
              <div className="cod-header">
                <CheckCircle size={24} className="check-icon" />
                <div>
                  <h3>Cash on Delivery</h3>
                  <p>Pay when your order is delivered to your doorstep.</p>
                </div>
              </div>
              <div className="cod-amount">
                <span>Total Amount to Pay:</span>
                <strong>Rs. {total.toLocaleString()}</strong>
              </div>
            </div>
          )}
        </div>

        <aside className="payment-details-sidebar">
          <div className="sidebar-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-item">
              <span>Items ({checkoutItems.length})</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span>Delivery Fee</span>
              <span>Rs. {DELIVERY_FEE.toLocaleString()}</span>
            </div>
            <div className="summary-total-line">
              <span>Total Payable</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          {paymentMethod === 'cod' ? (
            <button 
              className={`place-order-btn ${isProcessing ? 'processing' : ''}`}
              onClick={handleCODPayment} 
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="spin" />
                  Placing Order...
                </>
              ) : (
                'Place Order'
              )}
            </button>
          ) : (
            <div className="card-secure-footer">
              <Lock size={16} />
              <span>Secured by Safepay</span>
            </div>
          )}
        </aside>
      </div>

      {/* Mobile Sticky Footer - Only for COD */}
      {paymentMethod === 'cod' && (
        <div className="payment-details-mobile-footer">
          <div className="footer-amount">
            <span className="label">Total:</span>
            <span className="value">Rs. {total.toLocaleString()}</span>
          </div>
          <button
            className={`footer-submit-btn ${isProcessing ? 'processing' : ''}`}
            onClick={handleCODPayment}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 size={18} className="spin" /> : 'Confirm Order'}
          </button>
        </div>
      )}

      {/* Address Warning Modal */}
      {showAddressModal && (
        <div className="modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AlertTriangle size={54} className="warning-icon" />
            <h3>Address Missing!</h3>
            <p>You need to provide a delivery address before you can complete your order.</p>
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleAddressModalRedirect}>
                Go to Address Page
              </button>
              <button className="btn-secondary" onClick={() => setShowAddressModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;
