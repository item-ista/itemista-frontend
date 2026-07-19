import { AlertTriangle, X } from 'lucide-react';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Are you sure?', 
  message = 'Do you really want to perform this action?',
  confirmText = 'Yes, Delete',
  cancelText = 'Cancel',
  type = 'danger' // 'danger' | 'info' | 'warning'
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="confirm-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="confirm-modal-content">
          <div className={`confirm-modal-icon ${type}`}>
            <AlertTriangle size={32} />
          </div>
          
          <h3 className="confirm-modal-title">{title}</h3>
          <p className="confirm-modal-text">{message}</p>
        </div>

        <div className="confirm-modal-actions">
          <button className="confirm-modal-btn cancel" onClick={onClose}>
            {cancelText}
          </button>
          <button 
            className={`confirm-modal-btn confirm ${type}`} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
