import { useState, useEffect } from 'react';
import { X, MapPin, Plus, Check, ChevronLeft, Edit2 } from 'lucide-react';
import AddressSelector from './AddressSelector';
import './AddressDrawer.css';

const AddressDrawer = ({ 
  isOpen, 
  onClose, 
  currentAddress, 
  onAddressChange, 
  savedAddresses = [], 
  onAddAddress,
  initialView = 'list', // 'list' | 'add' | 'edit'
  addressToEdit = null
}) => {
  // If no saved addresses, initialView might need to handle empty state gracefully
  
  const [selectedAddressId, setSelectedAddressId] = useState(currentAddress?.id || null);
  const [showAddNew, setShowAddNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    tag: 'HOME',
    fullAddress: '',
    addressDetails: ''
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Use addresses passed in prop
  const displayAddresses = savedAddresses;

  // Initialize view based on props when opening
  useEffect(() => {
    if (isOpen) {
      if (initialView === 'add') {
        resetForm();
        setShowAddNew(true);
      } else if (initialView === 'edit' && addressToEdit) {
        handleEditAddress(addressToEdit);
      } else {
        setShowAddNew(false);
        setEditingAddress(null);
      }
      
      if (currentAddress) {
        setSelectedAddressId(currentAddress.id);
      }
    }
  }, [isOpen, initialView, addressToEdit, currentAddress]);

  const resetForm = () => {
    setEditingAddress(null);
    setNewAddress({
      name: '',
      phone: '',
      tag: 'HOME',
      fullAddress: '',
      addressDetails: ''
    });
    setSelectedLocation(null);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddressId(address.id);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setNewAddress({
      name: address.name,
      phone: address.phone,
      tag: address.tag,
      fullAddress: address.region,
      addressDetails: address.address
    });
    setSelectedLocation({ fullAddress: address.region });
    setShowAddNew(true);
  };

  const handleSave = () => {
    const selectedAddr = displayAddresses.find(addr => addr.id === selectedAddressId);
    if (selectedAddr && onAddressChange) {
      onAddressChange({
        ...selectedAddr,
        fullAddress: `${selectedAddr.address}, ${selectedAddr.region}`
      });
    }
    onClose();
  };

  const handleLocationSelect = (locationData) => {
    setSelectedLocation(locationData);
    setNewAddress(prev => ({
      ...prev,
      fullAddress: locationData.fullAddress
    }));
  };

  const handleAddNewAddress = () => {
    if (newAddress.name && newAddress.phone && selectedLocation) {
      const newAddr = {
        id: editingAddress?.id, // If undefined, Context will assign ID
        name: newAddress.name,
        phone: newAddress.phone,
        tag: newAddress.tag,
        address: newAddress.addressDetails,
        region: selectedLocation.fullAddress,
        isDefaultShipping: editingAddress ? editingAddress.isDefaultShipping : (savedAddresses.length === 0),
        isDefaultBilling: editingAddress ? editingAddress.isDefaultBilling : (savedAddresses.length === 0)
      };
      
      // Notify parent to add/update address in the list
      // Pass isUpdate flag
      if (onAddAddress) {
        onAddAddress(newAddr, !!editingAddress);
      }
      
      // If we are selecting immediately
      if (onAddressChange && initialView !== 'add' && initialView !== 'edit') {
         // Construct full address for usage
         onAddressChange({
            ...newAddr,
            fullAddress: `${newAddr.address}, ${newAddr.region}`
         });
      }
      
      setShowAddNew(false);
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className={`address-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <button className="drawer-back-btn mobile-only" onClick={onClose}>
            <ChevronLeft size={24} />
          </button>
          <h2 className="drawer-title">
            {showAddNew ? (editingAddress ? 'Edit Address' : 'Add New Address') : 'Shipping Address'}
          </h2>
          <button className="drawer-close-btn desktop-only" onClick={onClose}>
            <X size={24} />
          </button>
          {!showAddNew && (
            <button 
              className="add-address-link desktop-only"
              onClick={() => {
                resetForm();
                setShowAddNew(true);
              }}
            >
              Add new address
            </button>
          )}
        </div>

        <div className="drawer-content">
          {showAddNew ? (
            <div className="add-address-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="e.g. 03001234567"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label>Address Label</label>
                <div className="tag-options">
                  {['HOME', 'OFFICE', 'OTHER'].map(tag => (
                    <button
                      key={tag}
                      className={`tag-btn ${newAddress.tag === tag ? 'active' : ''}`}
                      onClick={() => setNewAddress(prev => ({ ...prev, tag }))}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Select Location *</label>
                <div className="location-selector-wrapper">
                  <AddressSelector
                    currentAddress={selectedLocation?.fullAddress || 'Select your location'}
                    onAddressChange={handleLocationSelect}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address Details *</label>
                <textarea
                  placeholder="House no, Building, Street, Area"
                  value={newAddress.addressDetails}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, addressDetails: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="form-actions">
                <button 
                  className="btn-cancel"
                  onClick={() => {
                    if (initialView === 'add' || initialView === 'edit') {
                      onClose();
                    } else {
                      setShowAddNew(false);
                      resetForm();
                    }
                  }}
                >
                  CANCEL
                </button>
                <button 
                  className="btn-save"
                  onClick={handleAddNewAddress}
                  disabled={!newAddress.name || !newAddress.phone || !selectedLocation}
                >
                  SAVE
                </button>
              </div>
            </div>
          ) : (
            <>
              <button 
                className="add-address-btn mobile-only"
                onClick={() => {
                  resetForm();
                  setShowAddNew(true);
                }}
              >
                <Plus size={20} />
                <span>Add address</span>
              </button>

              {displayAddresses.length > 0 ? (
                <div className="address-list">
                  {displayAddresses.map((address) => (
                    <div 
                      key={address.id}
                      className={`address-item ${selectedAddressId === address.id ? 'selected' : ''}`}
                    >
                      {/* Only show selection radio if in selection mode (onAddressChange provided) */}
                      {onAddressChange && (
                        <div className="address-radio" onClick={() => handleAddressSelect(address)}>
                          {selectedAddressId === address.id ? (
                            <div className="radio-checked">
                              <Check size={16} />
                            </div>
                          ) : (
                            <div className="radio-unchecked" />
                          )}
                        </div>
                      )}
                      
                      <div className="address-details" onClick={() => onAddressChange && handleAddressSelect(address)}>
                        <div className="address-name-row">
                          <span className="address-name">{address.name}</span>
                          <span className="address-phone">{address.phone}</span>
                        </div>
                        <div className="address-line">
                          <span className="address-tag">{address.tag}</span>
                          <span className="address-text">
                            {address.address}
                          </span>
                        </div>
                        <div className="address-region">
                          <MapPin size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                          <span>{address.region}</span>
                        </div>
                        {(address.isDefaultShipping || address.isDefaultBilling) && (
                          <div className="address-badges">
                            {address.isDefaultShipping && (
                              <span className="badge shipping">Default Shipping Address</span>
                            )}
                            {address.isDefaultBilling && (
                              <span className="badge billing">Default Billing Address</span>
                            )}
                          </div>
                        )}
                      </div>
                      <button 
                        className="address-edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAddress(address);
                        }}
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <MapPin size={48} className="empty-icon" />
                  <p>Save your shipping address here.</p>
                </div>
              )}

              {/* Show Footer only if selecting */}
              {onAddressChange && (
                <div className="drawer-footer">
                  <button className="btn-cancel" onClick={onClose}>
                    CANCEL
                  </button>
                  <button 
                    className="btn-save"
                    onClick={handleSave}
                    disabled={!selectedAddressId}
                  >
                    SAVE
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AddressDrawer;
