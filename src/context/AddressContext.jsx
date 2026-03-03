import { createContext, useState, useEffect } from 'react';

// Simple ID generator
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const getStoredAddresses = () => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('addresses');
    if (saved) {
      return JSON.parse(saved);
    }
    // Return default address if none exists
    return [
      {
        id: 'default-1',
        name: 'Zeeshan Haider Soomro',
        phone: '0320 2727926',
        tag: 'HOME',
        address: 'Rabia City, block 18, Gulistan e Johar',
        region: 'Sindh - Karachi - Gulistan-e-Johar - Block 18',
        fullAddress: 'Rabia City, block 18, Gulistan e Johar, Sindh - Karachi - Gulistan-e-Johar - Block 18',
        isDefaultShipping: true,
        isDefaultBilling: true
      }
    ];
  } catch (error) {
    console.error('Failed to parse stored addresses:', error);
    return [];
  }
};

export const AddressContext = createContext(null);

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState(getStoredAddresses);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('addresses', JSON.stringify(addresses));
  }, [addresses]);

  const addAddress = (newAddress) => {
    const addressWithId = {
      ...newAddress,
      id: newAddress.id || generateId(),
      isDefaultShipping: addresses.length === 0, // Make default if it's the first one
      isDefaultBilling: addresses.length === 0
    };
    
    setAddresses((prev) => [...prev, addressWithId]);
    return addressWithId;
  };

  const updateAddress = (updatedAddress) => {
    setAddresses((prev) => 
      prev.map((addr) => addr.id === updatedAddress.id ? updatedAddress : addr)
    );
  };

  const deleteAddress = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const setDefaultAddress = (id, type = 'shipping') => {
    setAddresses((prev) => 
      prev.map((addr) => ({
        ...addr,
        isDefaultShipping: type === 'shipping' ? addr.id === id : addr.isDefaultShipping,
        isDefaultBilling: type === 'billing' ? addr.id === id : addr.isDefaultBilling
      }))
    );
  };

  const getAddressById = (id) => {
    return addresses.find((addr) => addr.id === id);
  };

  const getDefaultAddress = () => {
    return addresses.find(addr => addr.isDefaultShipping) || addresses[0] || null;
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        getAddressById,
        getDefaultAddress
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};
