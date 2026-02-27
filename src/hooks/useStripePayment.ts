import { createStripePaymentIntent } from "../utils/api";

export async function getStripePaymentIntent(params: {
  amount: number;
  currency: string;
}) {
  return createStripePaymentIntent(params);
}
