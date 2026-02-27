// src/pages/Delivery.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import StepProgressBar from "../components/layout/StepProgressBar";
import { useBooking } from "../context/BookingContext";

const Delivery: React.FC = () => {
  const navigate = useNavigate();
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
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/accessories")}
            className="px-6 py-2 rounded-md border border-gray-400 text-sm text-gray-700 hover:bg-gray-50"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={() => navigate("/order-summary")}
            className="px-8 py-2 rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800"
          >
            Next →
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Delivery;
