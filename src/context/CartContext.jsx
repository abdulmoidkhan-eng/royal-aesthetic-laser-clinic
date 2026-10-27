import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('royal_clinic_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('royal_clinic_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Add product to cart (blocking out of stock products)
  const addToCart = (product, quantity = 1) => {
    if (!product || product.inStock === false) {
      console.warn('Cannot add out of stock product to cart');
      return false;
    }

    const price = typeof product.price === 'number' ? product.price : (product.pricePKR || 0);

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      } else {
        return [
          ...prev, 
          { 
            ...product, 
            price, 
            quantity 
          }
        ];
      }
    });
    return true;
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  // Change quantity directly
  const changeQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Update quantity with delta (+1 / -1)
  const updateQuantity = (productId, delta) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Computed totals
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => {
    const itemPrice = typeof item.price === 'number' ? item.price : (item.pricePKR || 0);
    return sum + itemPrice * item.quantity;
  }, 0);
  const cartSubtotal = total;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        changeQuantity,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
