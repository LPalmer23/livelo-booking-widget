// src/pages/Delivery.tsx
import React from "react";
import PageWrapper from "../components/layout/PageWrapper";
import StepProgressBar from "../components/layout/StepProgressBar";
import { useBooking } from "../context/BookingContext";

const Delivery: React.FC = () => {
  const { booking } = useBooking();

  return (
    <PageWrapper>
      <StepProgressBar currentStep={4} bookingType={booking.bookingType} />

      <div className="mx-auto mt-4 max-w-2xl">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Delivery & Pickup
        </h1>
        <p className="mt-2 text-neutral-700">
          This is a placeholder for your delivery step. Here we&apos;ll show
          pickup vs delivery options and pricing based on the customer&apos;s
          accommodation address.
        </p>
      </div>
    </PageWrapper>
  );
};

export default Delivery;
