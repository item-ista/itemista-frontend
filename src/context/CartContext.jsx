import { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// ── localStorage helpers ───────────────────────────────────────────────────────
const getStoredCart = () => {
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};

const getStoredDeliveryAddress = () => {
  try {
    const saved = localStorage.getItem('deliveryAddress');
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
};

// ── Load cart from DB with product details ────────────────────────────────────
const loadCartFromDB = async (uid) => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        product_id, quantity,
        products ( id, name, slug, price, cut_price, image )
      `)
      .eq('user_id', uid);
    if (error || !data) return [];
    return data
      .filter((row) => row.products) // skip rows where product was deleted
      .map((row) => ({
        id: row.products.id,
        name: row.products.name,
        slug: row.products.slug,
        price: row.products.price,
        originalPrice: row.products.cut_price,
        image: row.products.image,
        quantity: row.quantity,
      }));
  } catch {
    return [];
  }
};

// ── Merge guest cart + DB cart (DB wins on conflict) ─────────────────────────
const mergeCarts = (guestItems, dbItems) => {
  const merged = [...dbItems];
  for (const guestItem of guestItems) {
    const existsInDB = dbItems.find((i) => i.id === guestItem.id);
    if (!existsInDB) merged.push(guestItem);
  }
  return merged;
};

// ── Supabase cart sync (fire-and-forget, never blocks UI) ─────────────────────
const syncCartToDB = async (userId, items) => {
  if (!userId || items.length === 0) return;
  try {
    const rows = items.map((item) => ({
      user_id: userId,
      product_id: item.id,
      quantity: item.quantity,
    }));
    await supabase.from('cart_items').upsert(rows, {
      onConflict: 'user_id,product_id',
      ignoreDuplicates: false,
    });
  } catch { /* ignore */ }
};

const removeFromDB = async (userId, productId) => {
  if (!userId) return;
  try {
    await supabase.from('cart_items').delete()
      .eq('user_id', userId).eq('product_id', productId);
  } catch { /* ignore */ }
};

const clearCartInDB = async (userId) => {
  if (!userId) return;
  try {
    await supabase.from('cart_items').delete().eq('user_id', userId);
  } catch { /* ignore */ }
};

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getStoredCart);
  const [userId, setUserId] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState(getStoredDeliveryAddress);

  // ── Persist cart to localStorage on every change ──────────────────────────
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // ── Persist delivery address ───────────────────────────────────────────────
  useEffect(() => {
    if (deliveryAddress) {
      localStorage.setItem('deliveryAddress', JSON.stringify(deliveryAddress));
    } else {
      localStorage.removeItem('deliveryAddress');
    }
  }, [deliveryAddress]);

  // ── Handle login: load from DB, merge with guest cart ─────────────────────
  const handleSignIn = async (uid) => {
    setUserId(uid);
    const guestItems = getStoredCart();
    const dbItems = await loadCartFromDB(uid);
    const merged = mergeCarts(guestItems, dbItems);
    setCartItems(merged);
    // Sync merged cart back to DB (includes any guest items)
    if (merged.length > 0) syncCartToDB(uid, merged);
  };

  // ── Auth state listener ────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) handleSignIn(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          handleSignIn(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUserId(null);
          setCartItems([]);
          localStorage.removeItem('cart');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cart operations ────────────────────────────────────────────────────────
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      const updated = existing
        ? prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i)
        : [...prev, { ...product, quantity }];
      const item = updated.find((i) => i.id === product.id);
      if (item) syncCartToDB(userId, [item]);
      return updated;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== productId));
    removeFromDB(userId, productId);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCartItems((prev) => {
      const updated = prev.map((i) => i.id === productId ? { ...i, quantity } : i);
      const item = updated.find((i) => i.id === productId);
      if (item) syncCartToDB(userId, [item]);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    clearCartInDB(userId);
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        deliveryAddress,
        setDeliveryAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
