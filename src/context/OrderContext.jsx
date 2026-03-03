import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContext } from './AuthContext';

export const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext) || {};

  // User ke orders Supabase se load karo
  const loadOrders = async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

  // Supabase mein order save karo
  const placeOrder = async (orderDetails) => {
    try {
      const orderPayload = {
        user_id: user?.id || null,
        customer_name: orderDetails.shippingAddress?.name || orderDetails.customerName || '',
        customer_email: orderDetails.shippingAddress?.email || user?.email || '',
        customer_phone: orderDetails.shippingAddress?.phone || orderDetails.customerPhone || '',
        shipping_address: typeof orderDetails.shippingAddress === 'object'
          ? JSON.stringify(orderDetails.shippingAddress)
          : (orderDetails.shippingAddress || ''),
        items: orderDetails.items || [],
        subtotal: orderDetails.subtotal || 0,
        shipping_fee: orderDetails.shippingFee || 0,
        discount: orderDetails.discount || 0,
        total: orderDetails.totalAmount || orderDetails.total || 0,
        status: 'pending',
        payment_method: orderDetails.paymentMethod || 'Cash on Delivery',
        payment_status: 'pending',
        notes: orderDetails.notes || '',
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()
        .single();

      if (error) throw error;

      setOrders((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Failed to place order:', err);
      throw err;
    }
  };

  const getOrderById = (orderId) => {
    return orders.find((order) => order.id === orderId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        placeOrder,
        getOrderById,
        loadOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
