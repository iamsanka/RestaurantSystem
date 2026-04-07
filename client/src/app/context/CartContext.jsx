"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  getCartCookie,
  setCartCookie,
  clearCartCookie,
} from "../utils/cookieCart";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Clear cart ONLY on full page refresh
  useEffect(() => {
    if (!sessionStorage.getItem("cartLoaded")) {
      clearCartCookie();
      setCart([]);
      sessionStorage.setItem("cartLoaded", "true");
    }
  }, []);

  // Load cart from cookies after refresh logic
  useEffect(() => {
    const saved = getCartCookie();
    if (saved && Array.isArray(saved)) {
      setCart(saved);
    }
  }, []);

  // Save cart to cookies whenever it changes
  useEffect(() => {
    setCartCookie(cart);
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.uniqueKey === item.uniqueKey);

      if (existing) {
        return prev.map((i) =>
          i.uniqueKey === item.uniqueKey ? { ...i, qty: i.qty + 1 } : i
        );
      }

      return [...prev, { ...item, qty: 1 }];
    });

    setIsOpen(true);
  };

  const increaseQty = (uniqueKey) => {
    setCart((prev) =>
      prev.map((i) =>
        i.uniqueKey === uniqueKey ? { ...i, qty: i.qty + 1 } : i
      )
    );
  };

  const decreaseQty = (uniqueKey) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.uniqueKey === uniqueKey ? { ...i, qty: i.qty - 1 } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (uniqueKey) => {
    setCart((prev) => prev.filter((i) => i.uniqueKey !== uniqueKey));
  };

  const clearCart = () => {
    setCart([]);
    clearCartCookie();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
