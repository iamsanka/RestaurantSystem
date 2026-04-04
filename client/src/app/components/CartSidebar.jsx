"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import CheckoutModal from "./CheckoutModal";

export default function CartSidebar() {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
    isOpen,
    setIsOpen,
  } = useCart();

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const openCheckout = () => {
    setCheckoutOpen(true);
    setIsOpen(false);
  };

  return (
    <>
      {/* CART SIDEBAR */}
      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Your Order</h2>
          <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 && <p>Your cart is empty</p>}

          {cart.map((item) => (
            <div key={item.uniqueKey} className="cart-item">
              <div>
                <h4>{item.name}</h4>
                <p>€{item.price.toFixed(2)}</p>

                {item.removedIngredients?.length > 0 && (
                  <p className="removed">
                    Removed: {item.removedIngredients.join(", ")}
                  </p>
                )}
              </div>

              <div className="qty-controls">
                <button onClick={() => decreaseQty(item.uniqueKey)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => increaseQty(item.uniqueKey)}>+</button>
              </div>

              <button
                className="remove-btn"
                onClick={() => removeItem(item.uniqueKey)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <h3>Total: €{total.toFixed(2)}</h3>

          {/* CLEAR CART BUTTON */}
          {cart.length > 0 && (
            <button
              className="clear-cart-btn"
              onClick={clearCart}
              style={{
                width: "100%",
                padding: "10px",
                background: "#ff4d4d",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
                marginBottom: "10px",
              }}
            >
              Clear Cart
            </button>
          )}

          <button
            className="checkout-btn"
            disabled={cart.length === 0}
            onClick={openCheckout}
          >
            Checkout
          </button>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  );
}
