import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import dayjs from "dayjs";

import PageWrapper from "../components/layout/PageWrapper";
import StepProgressBar from "../components/layout/StepProgressBar";
import StripeCheckout from "../components/payment/StripeCheckout";
import { useBooking } from "../context/BookingContext";
import { createOrder } from "../utils/api";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

export default function OrderSummary() {
  const navigate = useNavigate();
  const { booking } = useBooking();
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const rentalDays = useMemo(() => {
    if (!booking.startDate || !booking.endDate) return null;
    const diff = dayjs(booking.endDate).diff(dayjs(booking.startDate), "day");
    return Math.max(diff, 1);
  }, [booking.endDate, booking.startDate]);

  const pricePerDay = booking.selectedBikePricePerDay ?? 0;
  const currency = booking.selectedBikeCurrency ?? "AUD";
  const subtotal = rentalDays ? pricePerDay * rentalDays : 0;
  const total = subtotal;

  const canCheckout =
    Boolean(booking.selectedBikeId) &&
    Boolean(booking.productId) &&
    Boolean(booking.startDate) &&
    Boolean(booking.endDate) &&
    subtotal > 0;

  const handlePaymentSuccess = async (paymentIntent: any) => {
    setOrderError(null);
    try {
      await createOrder({
        order: {
          total,
          sub_total: subtotal,
          tax: 0,
          shipping: 0,
          discount: 0,
          currency,
          city_slug: undefined,
          payment_intent: paymentIntent.id,
          payment_method: String(paymentIntent.payment_method ?? "card"),
          phone_number: undefined,
          is_delivery: false,
          delivery_address: undefined,
          event_id: null,
        },
        orderItems: [
          {
            product_id: Number(booking.productId),
            product_variant_id: Number(booking.selectedBikeId),
            currency,
            sub_total: subtotal,
            start_date: booking.startDate as string,
            end_date: booking.endDate as string,
            product_options: {},
            rider_profile: {},
            product_link: undefined,
            image: booking.selectedBikeImage ?? undefined,
            product_title: booking.selectedBikeName ?? undefined,
          },
        ],
      });
      setOrderSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Order creation failed. Check authentication.";
      setOrderError(message);
    }
  };

  return (
    <PageWrapper>
      <StepProgressBar currentStep={5} />

      <div className="mt-10 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Order Summary
        </h1>

        <div className="rounded-md border border-[#EAEAEA] bg-white px-6 py-4">
          <div className="flex justify-between text-sm text-neutral-700">
            <span>Bike</span>
            <span>{booking.selectedBikeName ?? "Selected Bike"}</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-700">
            <span>Dates</span>
            <span>
              {booking.startDate && booking.endDate
                ? `${booking.startDate} → ${booking.endDate}`
                : "Select dates"}
            </span>
          </div>
          <div className="flex justify-between text-sm text-neutral-700">
            <span>Rate</span>
            <span>
              {currency} {pricePerDay.toFixed(2)} / day
            </span>
          </div>
          <div className="flex justify-between text-sm text-neutral-700">
            <span>Days</span>
            <span>{rentalDays ?? "-"}</span>
          </div>
          <div className="mt-3 flex justify-between text-base font-semibold text-neutral-900">
            <span>Total</span>
            <span>
              {currency} {total.toFixed(2)}
            </span>
          </div>
        </div>

        {!stripePromise && (
          <div className="rounded-md border border-[#F3C2C2] bg-[#FFF5F5] px-4 py-3 text-sm text-[#B3261E]">
            Missing Stripe publishable key. Add
            {" "}
            <code>VITE_STRIPE_PUBLISHABLE_KEY</code> to your
            {" "}
            <code>.env</code>.
          </div>
        )}

        {orderError && (
          <div className="rounded-md border border-[#F3C2C2] bg-[#FFF5F5] px-4 py-3 text-sm text-[#B3261E]">
            {orderError}
          </div>
        )}

        {orderSuccess && (
          <div className="rounded-md border border-[#B5E3CB] bg-[#E8F7EF] px-4 py-3 text-sm text-[#1B5E3A]">
            Payment completed and order created.
          </div>
        )}

        {stripePromise && (
          <Elements stripe={stripePromise}>
            <StripeCheckout
              amount={total}
              currency={currency.toLowerCase()}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </Elements>
        )}

        {!canCheckout && (
          <div className="text-sm text-neutral-500">
            Select dates and a bike before checking out.
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/delivery")}
            className="min-w-[112px] px-6 py-2 rounded-md border border-gray-400 text-sm text-gray-700 hover:bg-gray-50"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => navigate("/confirmation")}
            className="min-w-[112px] px-6 py-2 rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800"
          >
            Next →
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}