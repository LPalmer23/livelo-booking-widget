import { useState, type FormEvent } from "react";
import {
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { PaymentIntent } from "@stripe/stripe-js";

import { getStripePaymentIntent } from "../../hooks/useStripePayment";

type StripeCheckoutProps = {
  amount: number;
  currency: string;
  onPaymentSuccess: (paymentIntent: PaymentIntent) => void;
};

function StripeCheckout({
  amount,
  currency,
  onPaymentSuccess,
}: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!stripe || !elements) {
      setErrorMessage("Stripe is not ready yet.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage("Card details are missing.");
      return;
    }

    setIsSubmitting(true);
    try {
      const paymentIntent = await getStripePaymentIntent({ amount, currency });
      const clientSecret = paymentIntent?.client_secret;
      if (!clientSecret) {
        throw new Error("Payment intent missing client secret.");
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        throw new Error(result.error.message || "Payment failed.");
      }

      if (result.paymentIntent) {
        onPaymentSuccess(result.paymentIntent);
      } else {
        throw new Error("Payment did not complete.");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Payment failed.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="rounded-md border border-[#EAEAEA] px-4 py-3">
        <CardElement options={{ hidePostalCode: true }} />
      </div>

      {errorMessage && (
        <div className="rounded-md border border-[#F3C2C2] bg-[#FFF5F5] px-4 py-2 text-sm text-[#B3261E]">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isSubmitting || amount <= 0}
        className={`w-full rounded-md px-6 py-3 text-sm font-semibold text-white ${
          !stripe || isSubmitting || amount <= 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-black hover:bg-gray-800"
        }`}
      >
        {isSubmitting ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default StripeCheckout;
