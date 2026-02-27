// src/pages/EmailVerification.tsx
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import PageWrapper from "../components/layout/PageWrapper";
import StepProgressBar from "../components/layout/StepProgressBar";
import { useBooking } from "../context/BookingContext";

// Tiny inline SVG for the green circle + check
const CheckCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="50"
    height="50"
    viewBox="0 0 50 50"
    aria-hidden="true"
  >
    <ellipse
      cx="25"
      cy="25"
      rx="25"
      ry="25"
      fill="rgba(69, 185, 124, 0.80)"
      filter="drop-shadow(0px 4px 4px rgba(0,0,0,0.25))"
    />
    <path
      d="M17 25.5 L22 30.5 L32 20.5"
      stroke="#ffffff"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


export default function EmailVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { booking, setBooking } = useBooking();

  const [localEmail, setLocalEmail] = useState(booking.email ?? "");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEmailVerified = booking.isEmailVerified;
  const bypassSelection = searchParams.get("bypass") === "1";

  useEffect(() => {
    if (!bypassSelection || booking.isEmailVerified) return;
    setBooking({
      email: booking.email || "test@example.com",
      isEmailVerified: true,
      bookingType: "rent",
    });
    navigate(`/bike-booking?${searchParams.toString()}`);
  }, [
    booking.email,
    booking.isEmailVerified,
    bypassSelection,
    navigate,
    searchParams,
    setBooking,
  ]);

  const handleValidate = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = localEmail.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    // Fake verification for now – later you can swap this for a real API call.
    setIsVerifying(true);
    setTimeout(() => {
      setBooking({
        email: trimmed,
        isEmailVerified: true,
      });
      setIsVerifying(false);
    }, 600);
  };

  const handleChooseBooking = (type: "rent" | "tour") => {
    if (!isEmailVerified) return; // safety guard
    setBooking({ bookingType: type });
    const queryString = searchParams.toString();
    const suffix = queryString ? `?${queryString}` : "";

    if (type === "rent") {
      navigate(`/bike-booking${suffix}`);
    } else {
      navigate(`/tour-booking${suffix}`);
    }
  };

  const bookingButtonsDisabled = !isEmailVerified || isVerifying;

  return (
    <PageWrapper>
      <StepProgressBar currentStep={1} />

      <div className="flex flex-col items-center mt-10">
        {/* Main heading */}
        <h1 className="text-4xl font-semibold text-center text-black mb-2">
          Let&apos;s get started
        </h1>

        {/* Email section */}
        {!isEmailVerified ? (
          <>
            <p className="text-lg text-gray-700 mb-8">
              Enter your email address
            </p>

            <form
  onSubmit={handleValidate}
  className="w-full flex justify-center mb-10"
>
  <div className="flex w-full max-w-xl">
    <input
      type="email"
      value={localEmail}
      onChange={(e) => setLocalEmail(e.target.value)}
      placeholder="Enter your email address"
      className="
        flex-1
        rounded-l-[10px]
        border border-[#D3D7DF]
        bg-white
        px-4 py-3
        text-gray-800
        placeholder:text-[#A0A4B0]
        focus:outline-none
        focus:ring-2
        focus:ring-[#4B87F8]
        focus:border-transparent
      "
    />

    <button
      type="submit"
      disabled={isVerifying}
      className={`
        h-[52px]
        px-8
        rounded-r-[10px]
        border border-l-0 border-[#D3D7DF] 
        text-sm font-semibold text-white
        transition-colors
        ${
          isVerifying
            ? "bg-gray-300 cursor-wait"
            : "bg-[#B5e3cb] hover:bg-[#45b57c] cursor-pointer"
        }
      `}
    >
      {isVerifying ? "Verifying..." : "Validate"}
    </button>
  </div>
</form>


            {error && (
              <p className="text-sm text-red-500 mb-6 text-center">{error}</p>
            )}
          </>
        ) : (
          <>
            {/* Verified state */}
            <div className="flex flex-col items-center gap-4 mb-10 mt-4">
              <div className="flex items-center gap-3">
                <CheckCircle />
                <span className="text-lg font-medium text-gray-900">
                  Email confirmed
                </span>
              </div>
              <p className="text-base text-gray-700">
                You may continue with your booking.
              </p>
            </div>
          </>
        )}

        {/* Second heading */}
        <h2 className="text-3xl font-semibold text-center text-black mb-6">
          What are you booking today?
        </h2>

        {/* Booking buttons */}
        <div className="flex flex-col sm:flex-row gap-6">
          <button
            type="button"
            onClick={() => handleChooseBooking("rent")}
            disabled={bookingButtonsDisabled}
            className={`w-[311px] h-20 rounded-[10px] text-lg font-medium ${
              bookingButtonsDisabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#747474] text-white hover:bg-[#5f5f5f] cursor-pointer"
            }`}
          >
            Rent Bikes
          </button>

          <button
            type="button"
            onClick={() => handleChooseBooking("tour")}
            disabled={bookingButtonsDisabled}
            className={`w-[311px] h-20 rounded-[10px] text-lg font-medium ${
              bookingButtonsDisabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#747474] text-white hover:bg-[#5f5f5f] cursor-pointer"
            }`}
          >
            Book a Tour
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
