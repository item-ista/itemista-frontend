import { createContext, useCallback } from 'react';
import { toast } from 'react-toastify';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const baseOptions = useCallback((duration) => ({
    autoClose: duration,
    position: 'top-right',
  }), []);

  const cartToastOptions = useCallback((duration) => ({
    ...baseOptions(duration),
    className: 'custom-toast cart-added-toast',
    progressClassName: 'custom-toast-progress cart-added-progress',
  }), [baseOptions]);

  const alreadyAddedToastOptions = useCallback((duration) => ({
    ...baseOptions(duration),
    className: 'custom-toast cart-already-toast',
    progressClassName: 'custom-toast-progress cart-already-progress',
  }), [baseOptions]);

  const orderSuccessToastOptions = useCallback((duration) => ({
    ...baseOptions(duration),
    className: 'custom-toast order-success-toast',
    progressClassName: 'custom-toast-progress order-success-progress',
  }), [baseOptions]);

  const showNotification = useCallback((message, type = 'success', duration = 3000) => {
    const options = baseOptions(duration);
    if (type === 'success') return toast.success(message, options);
    if (type === 'error') return toast.error(message, options);
    return toast(message, options);
  }, [baseOptions]);

  const showSuccess = useCallback((message, duration = 3000) => {
    return toast.success(message, baseOptions(duration));
  }, [baseOptions]);

  const showError = useCallback((message, duration = 4000) => {
    return toast.error(message, baseOptions(duration));
  }, [baseOptions]);

  const showInfo = useCallback((message, duration = 3000) => {
    return toast.info(message, baseOptions(duration));
  }, [baseOptions]);

  const showCartAdded = useCallback((message = 'Product added to cart', duration = 2500) => {
    return toast.success(message, cartToastOptions(duration));
  }, [cartToastOptions]);

  const showCartRemoved = useCallback((message = 'Product removed from cart', duration = 2500) => {
    return toast.error(message, alreadyAddedToastOptions(duration));
  }, [alreadyAddedToastOptions]);

  const showCartAlreadyAdded = useCallback((message = 'Already added to cart', duration = 2500) => {
    return toast.info(message, alreadyAddedToastOptions(duration));
  }, [alreadyAddedToastOptions]);

  const showOrderSuccess = useCallback((message = 'Order placed successfully!', duration = 3000) => {
    return toast.success(message, orderSuccessToastOptions(duration));
  }, [orderSuccessToastOptions]);

  const showWishlistAdded = useCallback((message = 'Added to wishlist', duration = 2500) => {
    return toast.success(message, cartToastOptions(duration));
  }, [cartToastOptions]);

  const showWishlistRemoved = useCallback((message = 'Removed from wishlist', duration = 2500) => {
    return toast.error(message, alreadyAddedToastOptions(duration));
  }, [alreadyAddedToastOptions]);

  const removeNotification = useCallback((id) => {
    toast.dismiss(id);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showInfo,
        showCartAdded,
        showCartRemoved,
        showCartAlreadyAdded,
        showOrderSuccess,
        showWishlistAdded,
        showWishlistRemoved,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
