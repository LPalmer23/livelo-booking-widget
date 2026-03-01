import "dotenv/config";
import express from "express";
import cors from "cors";
import Stripe from "stripe";

const app = express();
app.use(cors());
app.use(express.json());

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe =
  stripeKey && !stripeKey.includes("YOUR_")
    ? new Stripe(stripeKey, { apiVersion: "2023-10-16" })
    : null;

if (!stripe) {
  console.warn("⚠️  STRIPE_SECRET_KEY not set or placeholder. Add your key to mock-backend/.env for payments.");
}

app.get("/health", (_req, res) => res.json({ ok: true }));

// This matches your frontend api.ts: POST /api/stripe-payment-intent
app.post("/api/stripe-payment-intent", async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: "Stripe not configured. Add STRIPE_SECRET_KEY to .env" });
  }
  try {
    const { amount, currency } = req.body;

    if (amount == null || Number.isNaN(Number(amount))) {
      return res.status(400).json({ error: "Missing/invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100), // dollars -> cents
      currency: String(currency || "aud").toLowerCase(),
      automatic_payment_methods: { enabled: true },
    });

    res.json(paymentIntent);
  } catch (e) {
    res.status(400).json({ error: e?.message || "Stripe error" });
  }
});

// This matches your OrderSummary flow if it POSTs /api/order
app.post("/api/order", (req, res) => {
  const { order, orderItems } = req.body || {};
  console.log("✅ ORDER RECEIVED", {
    total: order?.total,
    currency: order?.currency,
    items: Array.isArray(orderItems) ? orderItems.length : 0,
  });

  res.json({ ok: true, order_id: `order_${Date.now()}` });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Mock backend running on http://localhost:${process.env.PORT || 3000}`);
});
