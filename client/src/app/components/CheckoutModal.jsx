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

  // Create PaymentIntent when modal opens
  useEffect(() => {
    if (!isOpen || form.payment_method !== "card") return;
    if (!cart || cart.length === 0) return; // prevent empty cart issues

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

    // Prevent sending empty cart to backend
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
        <h2>Confirm Your Order</h2>

        <input
          type="text"
          placeholder="Full Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="text"
          placeholder="Phone Number"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <label>Payment Method</label>
        <select
          value={form.payment_method}
          onChange={(e) =>
            setForm({ ...form, payment_method: e.target.value })
          }
        >
          <option value="card">Pay by Card</option>
          <option value="cash">Pay at Counter</option>
        </select>

        {form.payment_method === "card" && clientSecret && (
          <StripeProvider clientSecret={clientSecret}>
            <CardPaymentForm
              form={form}
              cart={cart}
              onSuccess={(status) => createOrder(status)}
            />
          </StripeProvider>
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
    </div>
  );
}
