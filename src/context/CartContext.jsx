import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // Can be used for drawer toggle if needed

  const addToCart = (beat, license) => {
    // Check if item already exists to prevent duplicates (optional logic)
    const exists = cartItems.find(item => item.beat.id === beat.id && item.license.id === license.id);
    if (exists) {
      alert("This license is already in your cart!");
      return;
    }

    const newItem = {
      id: `${beat.id}-${license.id}-${Date.now()}`, // Unique ID for cart item
      beat,
      license,
      addedAt: new Date()
    };
    
    setCartItems(prev => [...prev, newItem]);
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.license.price, 0);
  }, [cartItems]);

  const cartCount = cartItems.length;

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
