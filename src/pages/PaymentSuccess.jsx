import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Package, ArrowRight, Home, Loader2 } from 'lucide-react';
import { useNotification } from '../hooks/useNotification';
import { supabase } from '../lib/supabase';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { showOrderSuccess, showError } = useNotification();
  const [status, setStatus] = useState('loading'); // loading, success, failed, cancelled
  const [orderInfo, setOrderInfo] = useState(null);

  // Check for embedded payment state
  const embeddedResult = location.state;

  // Check for Safepay callback params (legacy redirect)
  const tracker = searchParams.get('tracker');
  const ref = searchParams.get('ref');
  const sig = searchParams.get('sig');
  const cancelled = searchParams.get('cancelled');

  useEffect(() => {
    const handlePaymentResult = async () => {
      // 1. Check for embedded flow result
      if (embeddedResult?.fromSafepay) {
        setStatus('success');
        setOrderInfo({
          orderId: embeddedResult.orderId,
          referenceCode: embeddedResult.referenceCode,
        });
        return;
      }

      // 2. Fallback to legacy redirect flow
      const pendingOrderStr = sessionStorage.getItem('safepay-pending-order');
      const pendingOrder = pendingOrderStr ? JSON.parse(pendingOrderStr) : null;

      if (cancelled === 'true') {
        setStatus('cancelled');
        
        // If we have a pending order, mark it as cancelled
        if (pendingOrder?.orderId) {
          try {
            await supabase
              .from('orders')
              .update({ 
                payment_status: 'cancelled',
                status: 'cancelled',
                payment_details: {
                  payment_gateway: 'safepay',
                  cancelled_at: new Date().toISOString(),
                  tracker_token: tracker,
                }
              })
              .eq('id', pendingOrder.orderId);
          } catch (e) {
            console.error('Failed to update cancelled order:', e);
          }
        }
        
        sessionStorage.removeItem('safepay-pending-order');
        showError('Payment was cancelled.');
        return;
      }

      if (tracker && ref && sig) {
        // Payment completed - update order
        try {
          if (pendingOrder?.orderId) {
            const { error: updateError } = await supabase
              .from('orders')
              .update({
                payment_status: 'paid',
                status: 'confirmed',
                payment_details: {
                  payment_gateway: 'safepay',
                  tracker_token: tracker,
                  reference_code: ref,
                  signature: sig,
                  paid_at: new Date().toISOString(),
                }
              })
              .eq('id', pendingOrder.orderId);

            if (updateError) {
              console.error('Failed to update order:', updateError);
            }

            setOrderInfo({
              orderId: pendingOrder.orderId,
              total: pendingOrder.total,
              items: pendingOrder.checkoutItems,
              referenceCode: ref,
            });
          }

          setStatus('success');
          showOrderSuccess('Payment successful! Your order has been confirmed.');
          sessionStorage.removeItem('safepay-pending-order');
        } catch (err) {
          console.error('Payment confirmation error:', err);
          setStatus('failed');
          showError('Payment verification failed. Please contact support.');
        }
      } else if (pendingOrder) {
        // Came directly without Safepay params — perhaps manual navigation
        setOrderInfo({
          orderId: pendingOrder.orderId,
          total: pendingOrder.total,
        });
        setStatus('success');
      } else {
        // No Safepay params and no pending order
        setStatus('success');
      }
    };

    handlePaymentResult();
  }, [tracker, ref, sig, cancelled]);

  if (status === 'loading') {
    return (
      <div className="payment-result-page">
        <div className="result-container">
          <div className="result-icon loading-icon">
            <Loader2 size={48} className="spin" />
          </div>
          <h1>Verifying payment...</h1>
          <p>Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (status === 'cancelled') {
    return (
      <div className="payment-result-page">
        <div className="result-container">
          <div className="result-icon cancelled-icon">
            <XCircle size={56} />
          </div>
          <h1 className="cancelled-title">Payment Cancelled</h1>
          <p className="result-subtitle">Your payment was cancelled. No charges were made.</p>
          
          <div className="result-actions">
            <button className="primary-action-btn" onClick={() => navigate('/cart')}>
              <Package size={18} />
              Return to Cart
            </button>
            <button className="secondary-action-btn" onClick={() => navigate('/')}>
              <Home size={18} />
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="payment-result-page">
        <div className="result-container">
          <div className="result-icon failed-icon">
            <XCircle size={56} />
          </div>
          <h1 className="failed-title">Payment Failed</h1>
          <p className="result-subtitle">
            Something went wrong with your payment. Please try again or contact support.
          </p>
          
          <div className="result-actions">
            <button className="primary-action-btn" onClick={() => navigate('/payment')}>
              Try Again
            </button>
            <button className="secondary-action-btn" onClick={() => navigate('/contact')}>
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success
  return (
    <div className="payment-result-page">
      <div className="result-container success-container">
        <div className="success-animation">
          <div className="result-icon success-icon">
            <CheckCircle size={56} />
          </div>
          <div className="confetti-burst"></div>
        </div>
        
        <h1 className="success-title">Payment Successful! 🎉</h1>
        <p className="result-subtitle">
          Thank you for your order. Your payment has been processed successfully.
        </p>

        {orderInfo && (
          <div className="order-details-box">
            {orderInfo.orderId && (
              <div className="detail-row">
                <span className="detail-label">Order ID</span>
                <span className="detail-value">#{orderInfo.orderId.slice(0, 8).toUpperCase()}</span>
              </div>
            )}
            {orderInfo.referenceCode && (
              <div className="detail-row">
                <span className="detail-label">Payment Ref</span>
                <span className="detail-value">{orderInfo.referenceCode}</span>
              </div>
            )}
            {orderInfo.total && (
              <div className="detail-row">
                <span className="detail-label">Amount Paid</span>
                <span className="detail-value amount">Rs. {orderInfo.total.toLocaleString()}</span>
              </div>
            )}
            {orderInfo.items && orderInfo.items.length > 0 && (
              <div className="detail-row items-row">
                <span className="detail-label">Items</span>
                <span className="detail-value">{orderInfo.items.length} item{orderInfo.items.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        )}

        <div className="result-actions">
          <button className="primary-action-btn" onClick={() => navigate('/orders')}>
            <Package size={18} />
            View My Orders
            <ArrowRight size={16} />
          </button>
          <button className="secondary-action-btn" onClick={() => navigate('/')}>
            <Home size={18} />
            Continue Shopping
          </button>
        </div>

        <p className="email-note">
          📧 A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
