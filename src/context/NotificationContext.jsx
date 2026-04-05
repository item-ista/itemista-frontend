import { createContext, useCallback } from 'react';
import { toast } from 'react-toastify';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const showNotification = useCallback((message, type = 'success', duration = 3000) => {
    const options = { autoClose: duration };
    if (type === 'success') return toast.success(message, options);
    if (type === 'error') return toast.error(message, options);
    return toast(message, options);
  }, []);

  const showSuccess = useCallback((message, duration = 3000) => {
    return toast.success(message, { autoClose: duration });
  }, []);

  const showError = useCallback((message, duration = 4000) => {
    return toast.error(message, { autoClose: duration });
  }, []);

  const removeNotification = useCallback((id) => {
    toast.dismiss(id);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, showSuccess, showError, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
