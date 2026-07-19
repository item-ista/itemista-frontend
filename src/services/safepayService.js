import { supabase } from '../lib/supabase';

/**
 * Create a Safepay payment session via Supabase Edge Function
 * This calls the server-side function which holds the secret key securely.
 * Returns { success, token, checkoutUrl, environment }
 */
export const createSafepaySession = async ({ amount, orderId, currency = 'PKR' }) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-safepay-payment', {
      body: { amount, orderId, currency },
    });

    if (error) {
      console.error('Safepay session creation error:', error);
      throw new Error(error.message || 'Failed to create payment session');
    }

    if (!data?.success) {
      console.error('Safepay response:', data);
      throw new Error(data?.error || 'Payment session creation failed');
    }

    return data;
  } catch (err) {
    console.error('Safepay service error:', err);
    throw err;
  }
};
