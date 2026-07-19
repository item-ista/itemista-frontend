import { useState } from 'react';
import { Plus, MapPin, Phone, Trash2, Edit2, Home, Briefcase, Hash } from 'lucide-react';
import { useAddress } from '../../hooks/useAddress';
import AddressDrawer from '../../components/common/AddressDrawer';
import ConfirmModal from '../../components/common/ConfirmModal';
import './Addresses.css';

const Addresses = () => {
  const { addresses, updateAddress, addAddress, deleteAddress, setDefaultAddress } = useAddress();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('list'); // 'add' or 'edit'
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const handleAddClick = () => {
    setSelectedAddress(null);
    setDrawerMode('add');
    setIsDrawerOpen(true);
  };

  const handleEditClick = (address) => {
    setSelectedAddress(address);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (id) => {
    setAddressToDelete(id);
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      deleteAddress(addressToDelete);
      setAddressToDelete(null);
    }
  };

  const handleSetDefault = (id, type) => {
    setDefaultAddress(id, type);
  };

  const getTagIcon = (tag) => {
    switch (tag) {
      case 'HOME': return <Home size={16} />;
      case 'OFFICE': return <Briefcase size={16} />;
      default: return <MapPin size={16} />;
    }
  };

  return (
    <div className="addresses-page">
      <div className="addresses-header">
        <h1>My Addresses</h1>
        <button className="add-address-btn-desktop" onClick={handleAddClick}>
          <Plus size={20} />
          <span>Add New Address</span>
        </button>
      </div>

      <div className="addresses-list">
        {addresses.length === 0 ? (
          <div className="empty-addresses">
            <div className="empty-icon-wrapper">
              <MapPin size={48} />
            </div>
            <h3>No Addresses Found</h3>
            <p>Add a shipping address to speed up your checkout process.</p>
            <button className="add-address-btn-primary" onClick={handleAddClick}>
              Add New Address
            </button>
          </div>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="address-card">
              <div className="address-card-header">
                <div className="address-tag-badge">
                  {getTagIcon(address.tag)}
                  <span>{address.tag}</span>
                </div>
                <div className="address-actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEditClick(address)}
                    title="Edit Address"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteClick(address.id)}
                    title="Delete Address"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="address-card-content">
                <h3 className="user-name">{address.name}</h3>
                <div className="info-row">
                  <Phone size={14} className="info-icon" />
                  <span>{address.phone}</span>
                </div>
                <div className="info-row address-text-row">
                  <MapPin size={14} className="info-icon" />
                  <p>
                    {address.address && `${address.address}${address.region ? ', ' : ''}`}
                    {address.region}
                  </p>
                </div>
              </div>

              <div className="address-card-footer">
                <div className="default-toggles">
                  <label className="toggle-label">
                    <input 
                      type="radio" 
                      name="defaultShipping" 
                      checked={address.isDefaultShipping}
                      onChange={() => handleSetDefault(address.id, 'shipping')}
                    />
                    <span className="toggle-text">Default Shipping</span>
                  </label>
                  <label className="toggle-label">
                    <input 
                      type="radio" 
                      name="defaultBilling" 
                      checked={address.isDefaultBilling}
                      onChange={() => handleSetDefault(address.id, 'billing')}
                    />
                    <span className="toggle-text">Default Billing</span>
                  </label>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <button className="fab-add-address mobile-only" onClick={handleAddClick}>
        <Plus size={24} />
      </button>

      <AddressDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        initialView={drawerMode}
        addressToEdit={selectedAddress}
        onAddAddress={(addr, isUpdate) => {
          if (isUpdate) {
            updateAddress(addr);
          } else {
            addAddress(addr);
          }
          // The drawer handles closing itself in some modes, but here we control it too
          // But actually AddressDrawer calls onClose after successful operation if we allow it
          // Or we can rely on isOpen prop only
          setIsDrawerOpen(false);
        }}
        savedAddresses={addresses}
      />
      <ConfirmModal 
        isOpen={!!addressToDelete}
        onClose={() => setAddressToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Addresses;