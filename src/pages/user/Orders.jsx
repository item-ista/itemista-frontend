import { Link, useNavigate } from 'react-router-dom';
import { Package, ShoppingBag } from 'lucide-react';
import { useOrder } from '../../hooks/useOrder';
import './Orders.css';

const Orders = () => {
  const { orders } = useOrder();
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className="orders-page empty">
        <div className="empty-orders-content">
          <div className="empty-icon-wrapper">
            <Package size={64} strokeWidth={1} />
          </div>
          <h2>No orders yet</h2>
          <p>You haven't placed any orders yet. Start shopping now!</p>
          <Link to="/" className="btn-start-shopping">
            <ShoppingBag size={18} />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
      </div>
      
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card" onClick={() => navigate(`/orders/${order.id}`)}>
            <div className="order-header">
               <div className="order-id-date">
                 <span className="order-id">Order #{order.id?.slice(0, 8)}</span>
                 <span className="order-date">{new Date(order.created_at || order.date).toLocaleDateString()}</span>
               </div>
               <span className={`order-status ${(order.status || 'pending').toLowerCase()}`}>
                 {order.status || 'Pending'}
               </span>
            </div>

            <div className="order-items-preview">
               {order.items.slice(0, 3).map((item, index) => (
                 <div key={index} className="order-item-img-container">
                    <img src={item.image || '/placeholder-product.jpg'} alt={item.name} className="order-item-img" />
                    {order.items.length > 3 && index === 2 && (
                       <div className="more-items-overlay">+{order.items.length - 2}</div>
                    )}
                 </div>
               ))}
            </div>

            <div className="order-footer">
               <div className="order-total">
                  <span>Total Amount:</span>
                  <span className="amount">Rs. {(order.total ?? order.totalAmount ?? 0).toLocaleString()}</span>
               </div>
               <button className="btn-view-details">
                  View Details
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
