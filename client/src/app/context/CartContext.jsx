"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /**
   * Add item to cart using uniqueKey
   */
  const addToCart = (item) => {
    setCart((prev) => {
      // Check if this exact customization already exists
      const existing = prev.find((i) => i.uniqueKey === item.uniqueKey);

      if (existing) {
        // Increase qty of the matching customized item
        return prev.map((i) =>
          i.uniqueKey === item.uniqueKey ? { ...i, qty: i.qty + 1 } : i
        );
      }

      // Otherwise add as a NEW customized item
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

  const clearCart = () => setCart([]);

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
