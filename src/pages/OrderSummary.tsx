import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import PageWrapper from "../components/layout/PageWrapper";
import StepProgressBar from "../components/layout/StepProgressBar";
import StripeCheckout from "../components/payment/StripeCheckout";
import { useBooking } from "../context/BookingContext";
import type { PaymentIntent } from "@stripe/stripe-js";
import { createOrder, type OrderItemPayload, type OrderPayload } from "../utils/api";

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise =
  stripePublishableKey && !stripePublishableKey.includes("YOUR_")
    ? loadStripe(stripePublishableKey)
    : null;

function roundAUD(value: number): number {
  return Math.round(value * 100) / 100;
}

type MoneyLineProps = {
  label: string;
  value: number;
  currency: string;
  strong?: boolean;
};

function MoneyLine({ label, value, currency, strong }: MoneyLineProps) {
  return (
    <div className={`flex justify-between text-sm ${strong ? "font-semibold text-neutral-900" : "text-neutral-700"}`}>
      <span>{label}</span>
      <span>
        {currency} {value.toFixed(2)}
      </span>
    </div>
  );
}

export default function OrderSummary() {
  const navigate = useNavigate();
  const { booking } = useBooking();

  const [couponCode, setCouponCode] = useState("");

  const currency = booking.selectedBikeCurrency ?? "AUD";

  // Bikes live in booking.cartItems (from your BikeBooking page).
  // Each cart item may also have `.accessories` added in Accessories page.
  const bikes = booking.cartItems ?? [];

  const rentalDays = useMemo(() => {
    if (booking.startDate && booking.endDate) {
      const diff = dayjs(booking.endDate).diff(dayjs(booking.startDate), "day");
      return Math.max(diff, 1);
    }
    // When we have cart items but no dates (e.g. mock flow), use 1 day so totals display
    return bikes.length > 0 ? 1 : 0;
  }, [booking.endDate, booking.startDate, bikes.length]);

  const bikeSubtotal = useMemo(() => {
    if (!rentalDays) return 0;
    const sum = bikes.reduce((acc, item: any) => {
      const qty = Number(item.quantity ?? 1);
      const pricePerDay = Number(item.pricePerDay ?? 0);
      return acc + qty * pricePerDay * rentalDays;
    }, 0);
    return roundAUD(sum);
  }, [bikes, rentalDays]);

  const accessoriesSubtotal = useMemo(() => {
    if (!rentalDays) return 0;
    const sum = bikes.reduce((acc, item: any) => {
      const accessories = item.accessories ?? [];
      const accessoriesTotalForBike = accessories.reduce((accSum: number, a: any) => {
        const qty = Number(a.quantity ?? 1);
        const pricePerDay = Number(a.pricePerDay ?? 0);
        return accSum + qty * pricePerDay * rentalDays;
      }, 0);
      return acc + accessoriesTotalForBike;
    }, 0);
    return roundAUD(sum);
  }, [bikes, rentalDays]);

  // Keep tax/discount as 0 for now (layout only)
  const discount = 0;
  const tax = 0;
  const shipping = 10;

  const subtotal = roundAUD(bikeSubtotal + accessoriesSubtotal);
  const totalWithShipping = roundAUD(Math.max(subtotal - discount + tax + shipping, 0));

  const dateLine =
    booking.startDate && booking.endDate
      ? `${booking.startDate} → ${booking.endDate} (${rentalDays} day${rentalDays === 1 ? "" : "s"})`
      : "Select dates";

  const bikeThumb =
    booking.selectedBikeImage && typeof booking.selectedBikeImage === "string"
      ? booking.selectedBikeImage
      : "/images/bike-placeholder.jpg";

  const handlePaymentSuccess = async (paymentIntent: PaymentIntent) => {
    const receiveMethod = (booking as { receiveMethod?: string }).receiveMethod;
    const accommodationAddress = (booking as { accommodationAddress?: string }).accommodationAddress;
    const isDelivery = receiveMethod === "deliver";

    const orderItems: OrderItemPayload[] = bikes.map((item: { id: string; name: string; size: string; pricePerDay: number; quantity: number }) => {
      const qty = Number(item.quantity ?? 1);
      const pricePerDay = Number(item.pricePerDay ?? 0);
      const itemSubtotal = rentalDays ? roundAUD(qty * pricePerDay * rentalDays) : 0;
      return {
        product_id: booking.productId ?? 1,
        product_variant_id: 1,
        currency,
        sub_total: itemSubtotal,
        start_date: booking.startDate ?? "",
        end_date: booking.endDate ?? "",
        product_title: item.name,
      };
    });

    const order: OrderPayload = {
      total: totalWithShipping,
      sub_total: subtotal,
      tax,
      shipping,
      discount,
      currency,
      payment_intent: paymentIntent.id,
      payment_method: paymentIntent.payment_method != null ? String(paymentIntent.payment_method) : "card",
      is_delivery: isDelivery,
      delivery_address: accommodationAddress ? { formatted: accommodationAddress } : undefined,
    };

    await createOrder({ order, orderItems });
    navigate("/confirmation");
  };

  const hasStripe = !!stripePromise;

  return (
    <PageWrapper>
      <StepProgressBar currentStep={5} />

      <div className="mt-10 flex flex-col gap-6">
        <h1 className="text-3xl font-semibold text-neutral-900">Order Summary</h1>

        {/* ORDER SUMMARY CARD */}
        <div className="rounded-md border border-[#EAEAEA] bg-white px-6 py-5">
          <div className="mb-4 text-sm font-semibold text-neutral-900">Order Summary</div>

          {/* Dates */}
          <div className="mb-5 flex items-start justify-between gap-4 text-sm text-neutral-700">
            <span className="min-w-[90px]">Dates</span>
            <span className="text-right">{dateLine}</span>
          </div>

          {/* Bikes */}
          <div className="mb-4 text-sm font-semibold text-neutral-900">Bikes</div>

          <div className="flex flex-col gap-4">
            {bikes.length === 0 ? (
              <div className="text-sm text-neutral-500">No bikes selected yet.</div>
            ) : (
              bikes.map((item: any, idx: number) => {
                const qty = Number(item.quantity ?? 1);
                const pricePerDay = Number(item.pricePerDay ?? 0);
                const lineTotal = rentalDays ? roundAUD(qty * pricePerDay * rentalDays) : 0;

                const accessories = item.accessories ?? [];
                const hasAccessories = accessories.length > 0;

                return (
                  <div key={`${item.id ?? item.name ?? "bike"}-${idx}`} className="rounded-md border border-[#EFEFEF] p-4">
                    <div className="flex gap-4">
                      {/* small image */}
                      <div className="h-14 w-14 overflow-hidden rounded-md border border-[#EAEAEA] bg-white">
                        <img
                          src={bikeThumb}
                          alt={item.name ?? "Bike"}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/images/bike-placeholder.jpg";
                          }}
                        />
                      </div>

                      {/* text */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-neutral-900">
                              {idx + 1}. {item.name ?? "Selected Bike"}
                            </div>
                            <div className="text-xs text-neutral-500">
                              Size: {item.size ?? "-"} • Qty: {qty} • {currency} {pricePerDay.toFixed(2)}/day
                            </div>
                          </div>

                          <div className="text-sm font-semibold text-neutral-900">
                            {currency} {lineTotal.toFixed(2)}
                          </div>
                        </div>

                        {/* Accessories under the bike */}
                        <div className="mt-3">
                          <div className="text-xs font-semibold text-neutral-700">Accessories</div>
                          {!hasAccessories ? (
                            <div className="mt-1 text-xs text-neutral-500">None selected</div>
                          ) : (
                            <div className="mt-2 flex flex-col gap-2">
                              {accessories.map((a: any, aIdx: number) => {
                                const aQty = Number(a.quantity ?? 1);
                                const aPrice = Number(a.pricePerDay ?? 0);
                                const aLine = rentalDays ? roundAUD(aQty * aPrice * rentalDays) : 0;

                                return (
                                  <div
                                    key={`${a.id ?? a.name ?? "acc"}-${aIdx}`}
                                    className="flex items-center justify-between gap-3 rounded-md bg-neutral-50 px-3 py-2"
                                  >
                                    <div className="text-xs text-neutral-700">
                                      {a.name ?? "Accessory"}
                                      {a.option ? <span className="text-neutral-500"> ({a.option})</span> : null}
                                      <span className="text-neutral-500"> · x{aQty} · {currency} {aPrice.toFixed(2)}/day</span>
                                    </div>
                                    <div className="text-xs font-semibold text-neutral-900">
                                      {currency} {aLine.toFixed(2)}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Totals */}
          <div className="mt-6 border-t border-[#EFEFEF] pt-4">
            <MoneyLine label="Bike Subtotal" value={bikeSubtotal} currency={currency} />
            <MoneyLine label="Accessories Subtotal" value={accessoriesSubtotal} currency={currency} />
            <MoneyLine label="Tax" value={tax} currency={currency} />
            <MoneyLine label="Discount" value={discount} currency={currency} />
            <div className="mt-2">
              <MoneyLine label="Shipping" value={shipping} currency={currency} />
            </div>
            <div className="mt-2">
              <MoneyLine label="Total" value={totalWithShipping} currency={currency} strong />
            </div>
          </div>
        </div>

        {/* COUPON */}
        <div className="rounded-md border border-[#EAEAEA] bg-white px-6 py-5">
          <div className="mb-2 text-sm font-semibold text-neutral-900">Discount/Coupon Code</div>
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter code"
            className="w-full rounded-md border border-[#EAEAEA] px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
          <div className="mt-2 text-xs text-neutral-500">
            (Not applied yet — visual layout only)
          </div>
        </div>

        {/* PAYMENT */}
        <div className="text-center text-base font-semibold text-neutral-900">
          Payment Amount: {currency} {totalWithShipping.toFixed(2)}
        </div>

        <div className="rounded-md border border-[#EAEAEA] bg-white px-6 py-6">
          <div className="mb-3 text-sm font-semibold text-neutral-900">Payment</div>

          {hasStripe ? (
            <Elements stripe={stripePromise!}>
              <StripeCheckout
                amount={totalWithShipping}
                currency={currency}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </Elements>
          ) : (
            <div className="grid gap-3">
              <p className="text-sm text-neutral-500">
                Add VITE_STRIPE_PUBLISHABLE_KEY to .env to enable Stripe payments.
              </p>
            <button
              type="button"
              className="w-full rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
              onClick={() => navigate("/confirmation")}
            >
              Continue to Confirmation (Demo)
            </button>
          </div>
          )}
        </div>

        {/* NAV */}
        <div className="mt-2 flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/delivery")}
            className="rounded-md border border-gray-400 px-6 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => navigate("/confirmation")}
            className="rounded-md bg-black px-8 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Next →
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}