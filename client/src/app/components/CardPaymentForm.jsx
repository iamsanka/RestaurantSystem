"use client";

import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";

export default function CardPaymentForm({ form, cart, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isProcessing) return;
    setIsProcessing(true);

    if (!stripe || !elements) {
      alert("Stripe is not ready yet");
      setIsProcessing(false);
      return;
    }

    // Prevent empty cart submission
    if (!cart || cart.length === 0) {
      alert("Your cart is empty. Please add items again.");
      setIsProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
        payment_method_data: {
          billing_details: {
            name: form.name,
            email: form.email,
            phone: form.phone,
          },
        },
      },
      redirect: "if_required",
    });

    if (error) {
      alert(error.message || "Payment failed. Please try again.");
      setIsProcessing(false);
      return;
    }

    const paymentStatus =
      paymentIntent?.status === "succeeded" ? "paid" : "unpaid";

    onSuccess(paymentStatus);
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />

      <button
        type="submit"
        className="confirm-btn"
        style={{ marginTop: 20 }}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Confirm Payment"}
      </button>
    </form>
  );
}
