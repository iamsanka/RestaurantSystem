"use client";

import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import StripeProvider from "./StripeProvider";
import CardPaymentForm from "./CardPaymentForm";

export default function CheckoutModal({ isOpen, onClose }) {
  const { cart, clearCart } = useCart();
  const [clientSecret, setClientSecret] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    payment_method: "card",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!isOpen || form.payment_method !== "card") return;
    if (!cart || cart.length === 0) return;

    const amount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const amountInCents = Math.round(amount * 100);

    fetch(`${API_URL}/api/payments/create-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountInCents }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((err) => console.error("PaymentIntent error:", err));
  }, [isOpen, form.payment_method, cart]);

  const createOrder = async (payment_status) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const total_amount = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    if (!cart || cart.length === 0) {
      alert("Your cart is empty. Please add items again.");
      setIsProcessing(false);
      return;
    }

    const orderRes = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,

        items: cart.map((i) => ({
          id: i.id,
          name: i.name,
          qty: i.qty,
          price: i.price,
          removedIngredients: i.removedIngredients || [],
        })),

        total_amount,
        payment_method: form.payment_method,
        payment_status,
        order_source: "web",
      }),
    });

    const orderData = await orderRes.json();

    clearCart();
    onClose();

    window.location.href = `/order-submitted?orderId=${orderData.orderId}`;
  };

  if (!isOpen) return null;

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <h2 className="checkout-title">Confirm Your Order</h2>

        <input
          type="text"
          placeholder="Full Name"
          required
          className="checkout-input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          required
          className="checkout-input"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="text"
          placeholder="Phone Number"
          required
          className="checkout-input"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <label className="checkout-label">Payment Method</label>
        <select
          className="checkout-select"
          value={form.payment_method}
          onChange={(e) =>
            setForm({ ...form, payment_method: e.target.value })
          }
        >
          <option value="card">Pay by Card</option>
          <option value="cash">Pay at Counter</option>
        </select>

        {/* ⭐ WRAPPED STRIPE FORM WITH THEME COLORS */}
        {form.payment_method === "card" && clientSecret && (
          <div className="stripe-wrapper">
            <StripeProvider clientSecret={clientSecret}>
              <CardPaymentForm
                form={form}
                cart={cart}
                onSuccess={(status) => createOrder(status)}
              />
            </StripeProvider>
          </div>
        )}

        {form.payment_method === "cash" && (
          <button
            className="confirm-btn"
            disabled={isProcessing}
            onClick={() => createOrder("unpaid")}
          >
            {isProcessing ? "Processing..." : "Confirm Order"}
          </button>
        )}

        <button className="close-modal" onClick={onClose}>
          ×
        </button>
      </div>

      <style jsx>{`
        .checkout-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .checkout-modal {
          background: var(--forest-dark);
          padding: 30px;
          width: 420px;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
          position: relative;
          color: white;
        }

        .checkout-title {
          margin-bottom: 20px;
          font-size: 1.6rem;
          font-weight: bold;
          color: var(--forest-mint);
        }

        .checkout-input,
        .checkout-select {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border-radius: 10px;
          border: 1px solid #444;
          background: #1a1f1a;
          color: white;
          font-size: 1rem;
        }

        .checkout-input::placeholder {
          color: #bbb;
        }

        .checkout-label {
          margin-bottom: 6px;
          display: block;
          font-weight: bold;
          color: var(--forest-mint);
        }

        /* ⭐ NEW STRIPE WRAPPER */
        .stripe-wrapper {
          background: #0f1a0f;
          padding: 18px;
          border-radius: 12px;
          border: 1px solid #2a3a2a;
          margin-top: 10px;
        }

        .confirm-btn {
          width: 100%;
          padding: 14px;
          background: var(--forest-mint);
          color: var(--forest-dark);
          border: none;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          margin-top: 10px;
        }

        .confirm-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .close-modal {
          position: absolute;
          top: 12px;
          right: 12px;
          background: transparent;
          border: none;
          font-size: 28px;
          color: #ccc;
          cursor: pointer;
        }

        .close-modal:hover {
          color: white;
        }
      `}</style>
    </div>
  );
}
