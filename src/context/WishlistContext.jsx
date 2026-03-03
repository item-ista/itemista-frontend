import { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// ── localStorage helpers ───────────────────────────────────────────────────────
const getStoredWishlist = () => {
  try {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};

// ── Load wishlist from DB with product details ────────────────────────────────
const loadWishlistFromDB = async (uid) => {
  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        product_id, created_at,
        products ( id, name, slug, price, cut_price, image, description, brand )
      `)
      .eq('user_id', uid)
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data
      .filter((row) => row.products)
      .map((row) => ({
        id: row.products.id,
        name: row.products.name,
        slug: row.products.slug,
        price: row.products.price,
        cut_price: row.products.cut_price,
        image: row.products.image,
        description: row.products.description,
        brand: row.products.brand,
      }));
  } catch {
    return [];
  }
};

// ── Merge guest + DB wishlists (no duplicates) ───────────────────────────────
const mergeWishlists = (guestItems, dbItems) => {
  const merged = [...dbItems];
  for (const g of guestItems) {
    if (!dbItems.find((d) => String(d.id) === String(g.id))) {
      merged.push(g);
    }
  }
  return merged;
};

// ── Supabase sync helpers (fire-and-forget) ──────────────────────────────────
const addToDB = async (userId, productId) => {
  if (!userId) return;
  try {
    await supabase.from('wishlist_items').upsert(
      { user_id: userId, product_id: productId },
      { onConflict: 'user_id,product_id', ignoreDuplicates: true }
    );
  } catch { /* ignore */ }
};

const removeFromDB = async (userId, productId) => {
  if (!userId) return;
  try {
    await supabase.from('wishlist_items').delete()
      .eq('user_id', userId).eq('product_id', productId);
  } catch { /* ignore */ }
};

const syncAllToDB = async (userId, items) => {
  if (!userId || items.length === 0) return;
  try {
    const rows = items.map((item) => ({
      user_id: userId,
      product_id: item.id,
    }));
    await supabase.from('wishlist_items').upsert(rows, {
      onConflict: 'user_id,product_id',
      ignoreDuplicates: true,
    });
  } catch { /* ignore */ }
};

const clearWishlistInDB = async (userId) => {
  if (!userId) return;
  try {
    await supabase.from('wishlist_items').delete().eq('user_id', userId);
  } catch { /* ignore */ }
};

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(getStoredWishlist);
  const [userId, setUserId] = useState(null);

  // ── Persist to localStorage on every change ────────────────────────────────
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // ── Handle login: load from DB, merge with guest wishlist ─────────────────
  const handleSignIn = async (uid) => {
    setUserId(uid);
    const guestItems = getStoredWishlist();
    const dbItems = await loadWishlistFromDB(uid);
    const merged = mergeWishlists(guestItems, dbItems);
    setWishlistItems(merged);
    if (merged.length > 0) syncAllToDB(uid, merged);
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
          setWishlistItems([]);
          localStorage.removeItem('wishlist');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Wishlist operations ────────────────────────────────────────────────────
  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      if (prev.find((item) => String(item.id) === String(product.id))) return prev;
      return [...prev, product];
    });
    addToDB(userId, product.id);
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => String(item.id) !== String(productId)));
    removeFromDB(userId, productId);
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => String(item.id) === String(productId));
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      return false;
    } else {
      addToWishlist(product);
      return true;
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    clearWishlistInDB(userId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
