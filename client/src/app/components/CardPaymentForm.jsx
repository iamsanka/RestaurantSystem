"use client";

import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

export default function CardPaymentForm({ form, cart, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      alert("Stripe is not ready yet");
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000",
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
      alert(error.message);
      return;
    }

    const paymentStatus =
      paymentIntent?.status === "succeeded" ? "paid" : "unpaid";

    onSuccess(paymentStatus);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button type="submit" className="confirm-btn" style={{ marginTop: 20 }}>
        Confirm Payment
      </button>
    </form>
  );
}
