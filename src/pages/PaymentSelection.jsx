import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, CheckCircle, CreditCard, Banknote, MapPin, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAddress } from '../hooks/useAddress';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import './PaymentSelection.css';

const DELIVERY_FEE = 165;

const PaymentSelection = () => {
  const navigate = useNavigate();
  const { checkoutItems, checkoutTotal, deliveryAddress, setDeliveryAddress } = useCart();
  const { addresses } = useAddress();
  const { user } = useAuth();
  const { showError } = useNotification();

  const [selectedPayment, setSelectedPayment] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const defaultShippingAddress = deliveryAddress
    || addresses.find((addr) => addr.isDefaultShipping)
    || addresses[0]
    || null;

  const shippingAddress = useMemo(() => {
    if (!selectedAddressId) return defaultShippingAddress;
    return addresses.find((addr) => addr.id === selectedAddressId) || defaultShippingAddress;
  }, [addresses, defaultShippingAddress, selectedAddressId]);

  useEffect(() => {
    if (checkoutItems.length === 0) {
      navigate('/cart');
    }
  }, [checkoutItems.length, navigate]);

  useEffect(() => {
    if (defaultShippingAddress?.id) {
      setSelectedAddressId(defaultShippingAddress.id);
    }
  }, [defaultShippingAddress]);

  useEffect(() => {
    setCustomerDetails((prev) => ({
      fullName: shippingAddress?.name || prev.fullName || '',
      email: shippingAddress?.email || user?.email || prev.email || '',
      phone: shippingAddress?.phone || prev.phone || '',
    }));
  }, [shippingAddress, user?.email]);

  // Only Debit Card (Safepay) and Cash on Delivery
  const paymentMethods = [
    { id: 'card', name: 'Debit Card', subtitle: 'Card payment (Safepay)', icon: 'card', disabled: false },
    { id: 'cod', name: 'Cash on Delivery', subtitle: 'Pay at doorstep', icon: 'cod', disabled: false },
  ];

  const handlePaymentSelect = (paymentId) => {
    setSelectedPayment(paymentId);
  };

  const handleAddressChange = (addressId) => {
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find((address) => address.id === addressId);
    if (selectedAddress) {
      setDeliveryAddress(selectedAddress);
    }
  };

  const handleCustomerFieldChange = (field, value) => {
    setCustomerDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Address validation - show modal and redirect if no address
    if (!shippingAddress || addresses.length === 0) {
      setShowAddressModal(true);
      return;
    }

    if (!selectedPayment) {
      showError('Please select a payment method.');
      return;
    }

    if (!customerDetails.fullName || !customerDetails.email || !customerDetails.phone) {
      showError('Please complete customer details.');
      return;
    }

    const selection = {
      paymentMethod: selectedPayment,
      selectedAddressId: shippingAddress?.id || selectedAddressId,
      customerDetails,
    };

    sessionStorage.setItem('checkout-selection', JSON.stringify(selection));
    navigate('/payment-details', { state: selection });
  };

  const handleAddressModalRedirect = () => {
    setShowAddressModal(false);
    // Store current checkout state so user can return
    sessionStorage.setItem('checkout-return', 'true');
    navigate('/addresses');
  };

  const subtotal = checkoutTotal;
  const shipping = DELIVERY_FEE;
  const total = subtotal + shipping;

  return (
    <div className="payment-selection-page">
      <div className="payment-mobile-header">
        <button className="back-btn" onClick={() => navigate('/checkout')}>
          <ChevronLeft size={24} />
        </button>
        <h1 className="header-title">Delivery & Payment</h1>
      </div>

      <div className="payment-container">
        <div className="payment-main">
          <div className="payment-methods">
            <h2 className="payment-title">Delivery & Payment Method</h2>

            <div className="address-selector">
              <h3>Select Delivery Address</h3>
              {addresses.length > 0 ? (
                <div className="address-list">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`address-option ${shippingAddress?.id === address.id ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="shippingAddress"
                        value={address.id}
                        checked={shippingAddress?.id === address.id}
                        onChange={() => handleAddressChange(address.id)}
                      />
                      <div className="address-option-content">
                        <p className="address-name-row">
                          <strong>{address.name}</strong>
                          <span>{address.phone}</span>
                        </p>
                        <p>{address.fullAddress || `${address.address}, ${address.region || ''}`}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="address-empty-box">
                  <MapPin size={24} className="empty-icon" />
                  <p className="address-empty">No delivery address found.</p>
                  <button className="add-address-link" onClick={() => {
                    sessionStorage.setItem('checkout-return', 'true');
                    navigate('/addresses');
                  }}>
                    + Add Delivery Address
                  </button>
                </div>
              )}
            </div>

            <div className="customer-details-box">
              <h3>Customer Details</h3>
              <p className="details-subtitle">Verify your contact information for order updates.</p>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={customerDetails.fullName}
                    onChange={(e) => handleCustomerFieldChange('fullName', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    value={customerDetails.email}
                    onChange={(e) => handleCustomerFieldChange('email', e.target.value)}
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="03XX XXXXXXX"
                    value={customerDetails.phone}
                    onChange={(e) => handleCustomerFieldChange('phone', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="payment-grid" style={{ marginTop: '12px' }}>
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`payment-method ${method.disabled ? 'disabled' : ''} ${selectedPayment === method.id ? 'selected' : ''}`}
                  onClick={() => handlePaymentSelect(method.id)}
                >
                  <div className="payment-icon">
                    {method.icon === 'card' && <CreditCard size={24} />}
                    {method.icon === 'cod' && <Banknote size={24} />}
                  </div>
                  <div className="payment-info">
                    <div className="payment-name">{method.name}</div>
                    {method.subtitle && <div className="payment-subtitle">{method.subtitle}</div>}
                  </div>
                  {selectedPayment === method.id && <CheckCircle className="selected-icon" size={20} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="order-summary-sidebar">
          <div className="summary-card">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal ({checkoutItems.length} items)</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping Fee</span>
                <span>Rs. {shipping.toLocaleString()}</span>
              </div>
              <div className="summary-total">
                <span>Total Amount</span>
                <span className="total-price">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button className={`confirm-order-btn ${!selectedPayment ? 'disabled' : ''}`} disabled={!selectedPayment} onClick={handleNext}>
            Next
          </button>
        </div>
      </div>

      {/* Mobile sticky footer */}
      <div className="payment-mobile-footer">
        <div className="payment-footer-total">
          <span className="total-label">Total:</span>
          <span className="total-price">Rs. {total.toLocaleString()}</span>
        </div>
        <button
          className={`payment-next-btn ${!selectedPayment ? 'disabled' : ''}`}
          disabled={!selectedPayment}
          onClick={handleNext}
        >
          Next
        </button>
      </div>

      {/* Address Required Modal */}
      {showAddressModal && (
        <div className="address-modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="address-modal" onClick={(e) => e.stopPropagation()}>
            <div className="address-modal-icon">
              <AlertTriangle size={48} />
            </div>
            <h3 className="address-modal-title">Delivery Address Required</h3>
            <p className="address-modal-text">
              Please add a delivery address before placing your order. You'll be redirected to the address page.
            </p>
            <div className="address-modal-actions">
              <button className="address-modal-btn primary" onClick={handleAddressModalRedirect}>
                Add Address
              </button>
              <button className="address-modal-btn secondary" onClick={() => setShowAddressModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSelection;
