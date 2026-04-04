import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create PaymentIntent for Payment Element
router.post("/create-intent", async (req, res) => {
  try {
    const { amount, currency = "eur" } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error("STRIPE ERROR:", err);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

export default router;
