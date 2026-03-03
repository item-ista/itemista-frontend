import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ChevronLeft, MapPin, CreditCard, Package, Truck, Calendar, Star, Pencil } from 'lucide-react';
import { useOrder } from '../../hooks/useOrder';
import { AuthContext } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById } = useOrder();
  const { user } = useContext(AuthContext) || {};
  const [order, setOrder] = useState(null);
  const [reviewedKeys, setReviewedKeys] = useState([]);

  useEffect(() => {
    const foundOrder = getOrderById(id);
    if (foundOrder) {
      setOrder(foundOrder);
    }
  }, [id, getOrderById]);

  // Load which products the user already reviewed
  useEffect(() => {
    if (!user?.id) return;
    reviewService.getUserReviewedProducts(user.id).then(setReviewedKeys);
  }, [user?.id]);

  const isDelivered = ['delivered', 'Delivered'].includes(order?.status);

  if (!order) {
    return (
      <div className="order-detail-page error">
        <h2>Order not found</h2>
        <Link to="/orders" className="back-link">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <div className="od-header">
        <Link to="/orders" className="back-btn">
          <ChevronLeft size={24} />
        </Link>
        <h1>Order Details</h1>
      </div>

      <div className="od-content">
        <div className="od-header-card">
          <div className="od-id-section">
            <span className="od-label">Order ID</span>
            <span className="od-value">#{order.id}</span>
          </div>
          <div className="od-date-section">
             <Calendar size={16} />
             <span>{new Date(order.created_at || order.date).toLocaleString()}</span>
          </div>
        </div>

        <div className="od-status-card">
           <div className={`od-status-badge ${(order.status || 'pending').toLowerCase()}`}>
              {order.status || 'Pending'}
           </div>
           <p className="od-status-desc">
             {(order.status === 'Processing' || order.status === 'processing') && 'Your order is currently being processed. We will notify you once it ships.'}
             {(order.status === 'Delivered' || order.status === 'delivered') && 'Your order has been delivered. Thank you for shopping with us!'}
             {(order.status === 'Cancelled' || order.status === 'cancelled') && 'Your order was cancelled.'}
             {order.status === 'pending' && 'Your order has been received and is pending confirmation.'}
             {order.status === 'shipped' && 'Your order is on the way!'}
           </p>
        </div>

        <div className="od-section">
           <h3><Package size={20} className="section-icon" /> Items ({order.items.length})</h3>
           <div className="od-items-list">
             {order.items.map((item, index) => (
               <div key={index} className="od-item">
                 <div className="od-item-img">
                   <img src={item.image || '/placeholder-product.jpg'} alt={item.name} />
                 </div>
                 <div className="od-item-info">
                   <h4 className="od-item-name">{item.name}</h4>
                   <div className="od-item-meta">
                     <span className="od-qty">x{item.quantity || 1}</span>
                     <span className="od-price">Rs. {item.price?.toLocaleString()}</span>
                   </div>
                   {isDelivered && (
                     (() => {
                       const productId = item.id || item.product_id;
                       const key = `${order.id}_${productId}`;
                       const alreadyReviewed = reviewedKeys.includes(key);
                       return alreadyReviewed ? (
                         <span className="od-reviewed-badge">
                           <Star size={14} fill="#FFC107" color="#FFC107" /> Reviewed
                         </span>
                       ) : (
                         <button
                           className="od-write-review-btn"
                           onClick={(e) => {
                             e.stopPropagation();
                             navigate(`/orders/${order.id}/review?product=${productId}`);
                           }}
                         >
                           <Pencil size={14} /> Write Review
                         </button>
                       );
                     })()
                   )}
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div className="od-section">
          <h3><MapPin size={20} className="section-icon" /> Shipping Address</h3>
          <div className="od-address-info">
            {(() => {
              let addr = order.shipping_address || order.shippingAddress;
              if (typeof addr === 'string') { try { addr = JSON.parse(addr); } catch { addr = { address: addr }; } }
              return (
                <>
                  <p className="address-name">{addr?.fullName || addr?.name || order.customer_name || 'N/A'}</p>
                  <p>{addr?.address || addr?.fullAddress || ''}</p>
                  <p>{addr?.city ? `${addr.city}, ` : ''}{addr?.phone || order.customer_phone || ''}</p>
                </>
              );
            })()}
          </div>
        </div>

        <div className="od-section">
           <h3><CreditCard size={20} className="section-icon" /> Payment Info</h3>
           <div className="od-payment-info">
             <div className="payment-row">
               <span>Payment Method</span>
               <span>{order.payment_method || order.paymentMethod || 'N/A'}</span>
             </div>
             <div className="payment-row">
               <span>Status</span>
               <span className="payment-status">{order.payment_status || order.paymentStatus || 'Pending'}</span>
             </div>
           </div>
        </div>

        <div className="od-summary">
          <div className="summary-row">
             <span>Subtotal</span>
             <span>Rs. {order.subtotal?.toLocaleString()}</span>
          </div>
          <div className="summary-row">
             <span>Shipping Fee</span>
             <span>Rs. {(order.shipping_fee ?? order.shippingFee ?? 0).toLocaleString()}</span>
          </div>
          <div className="summary-row total">
             <span>Total Amount</span>
             <span>Rs. {(order.total ?? order.totalAmount ?? 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
