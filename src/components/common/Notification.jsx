import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import './Notification.css';

const Notification = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose && onClose();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  };

  return (
    <div className={`notification ${type} ${isVisible ? 'show' : 'hide'}`}>
      <div className="notification-icon">
        {type === 'success' ? (
          <CheckCircle size={24} />
        ) : (
          <XCircle size={24} />
        )}
      </div>
      <span className="notification-message">{message}</span>
      <button className="notification-close" onClick={handleClose}>
        <X size={18} />
      </button>
    </div>
  );
};

export default Notification;
