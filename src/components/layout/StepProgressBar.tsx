// src/components/layout/StepProgressBar.tsx
import React, { useMemo, useState } from "react";
import type { BookingType } from "../../context/BookingContext";
import { useBooking } from "../../context/BookingContext";

type StepId = 1 | 2 | 3 | 4 | 5 | 6;

interface Step {
  id: StepId;
  label: string;
}

const STEPS: Step[] = [
  { id: 1, label: "Profile" },
  { id: 2, label: "Booking" },
  { id: 3, label: "Accessories" },
  { id: 4, label: "Delivery" },
  { id: 5, label: "Payment" },
  { id: 6, label: "Confirmation" },
];

interface StepProgressBarProps {
  currentStep: StepId;
  bookingType?: BookingType; // kept for compatibility, even if unused for now
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  bookingType, // eslint-disable-line @typescript-eslint/no-unused-vars
}) => {
  const { booking } = useBooking();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartCount = useMemo(
    () =>
      booking.cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [booking.cartItems]
  );

  return (
    <div className="relative flex items-center justify-between gap-8">
      {/* Steps + baseline */}
      <div className="relative flex-1 max-w-[1000px] mx-auto">
        {/* Grey base line – slightly inset so it doesn't hit the edges */}
        <div
          className="absolute left-10 right-10 top-[40%] h-[2px] bg-[#D9D9D9] -translate-y-1/2"
          aria-hidden
        />

        <div className="relative z-10 flex items-center justify-between">
          {STEPS.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            const circleClasses = [
              "flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold",
              "shadow-[0_4px_4px_rgba(0,0,0,0.10)]", // soft shadow for all steps
              "transition-colors",
              isActive
                // active step: light green fill + dark green text
                ? "bg-[#B5E3CB] border-[#45B57C] text-[#23764B]"
                : isCompleted
                // completed steps: solid green
                ? "bg-[#45B57C] border-[#45B57C] text-white"
                // upcoming steps: neutral grey
                : "bg-[#E0E0E0] border-[#D0D0D0] text-[#555]",
            ].join(" ");

            return (
              <div
                key={step.id}
                className="flex flex-col items-center gap-1 min-w-[60px]"
              >
                <div className={circleClasses}>{step.id}</div>
                <span className="text-[11px] text-neutral-700">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart bubble on the right */}
      <button
        type="button"
        onClick={() => setIsCartOpen((prev) => !prev)}
        className="relative -mt-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#D9D9D9] shadow-[0_4px_4px_rgba(0,0,0,0.10)]"
      >
        {/* Placeholder cart icon – swap for an SVG later */}
        <span className="text-lg">🛒</span>

        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E13838] text-[11px] font-semibold text-white">
            {cartCount}
          </span>
        )}
      </button>

      {isCartOpen && (
        <div className="absolute right-0 top-12 z-20 w-80 rounded-lg border border-[#EAEAEA] bg-white shadow-[0_6px_16px_rgba(0,0,0,0.18)]">
          <div className="border-b border-[#EAEAEA] px-4 py-3 text-sm font-semibold text-neutral-800">
            Added Bikes
          </div>
          <div className="max-h-64 overflow-y-auto px-4 py-3">
            {booking.cartItems.length === 0 ? (
              <div className="text-sm text-neutral-500">
                No bikes added yet.
              </div>
            ) : (
              booking.cartItems.map((item) => (
                <div key={`${item.name}-${item.size}`} className="py-2">
                  <div className="flex items-center justify-between text-sm text-neutral-700">
                    <div>
                      <div className="font-medium text-neutral-900">
                        {item.name}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {item.size}
                      </div>
                    </div>
                    <div className="text-neutral-700">x{item.quantity}</div>
                  </div>
                  {item.accessories.length > 0 && (
                    <div className="mt-2 space-y-1 pl-2">
                      {item.accessories.map((acc) => (
                        <div
                          key={`${item.name}-${item.size}-${acc.id}`}
                          className="flex items-center justify-between text-xs text-neutral-600"
                        >
                          <div>
                            {acc.name}
                            {acc.option ? ` (${acc.option})` : ""}
                          </div>
                          <div>x{acc.quantity}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StepProgressBar;
