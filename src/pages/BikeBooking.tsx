import React from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import StepProgressBar from "../components/layout/StepProgressBar";
import { useBooking } from "../context/BookingContext";

import CalendarPicker from "../components/booking/CalendarPicker";
import SizeSelector from "../components/booking/SizeSelector";
import CategorySelector from "../components/booking/CategorySelector";
import BikeList, { type Bike } from "../components/booking/BikeList";

const mockBikes: Bike[] = [
  {
    id: "bike-1",
    name: "Chapter2 TOA – Ultegra Di2",
    size: "54cm",
    category: "Road",
    pricePerDay: 148,
    available: 3,
  },
  {
    id: "bike-2",
    name: "Chapter2 TOA – Ultegra Di2",
    size: "56cm",
    category: "Road",
    pricePerDay: 148,
    available: 2,
  },
  {
    id: "bike-3",
    name: "Chapter2 TOA – Ultegra Di2",
    size: "58cm",
    category: "Road",
    pricePerDay: 148,
    available: 1,
  },
];

const sizeOptions = ["All sizes", "50cm", "52cm", "54cm", "56cm", "58cm"];
const categoryOptions = ["All categories", "Road", "Gravel", "TT", "E-Bike"];

const BikeBooking: React.FC = () => {
  const navigate = useNavigate();
  const { booking, setBooking } = useBooking();

  // If they somehow hit this route without picking a flow,
  // just send them back to the email step.
  if (!booking.isEmailVerified) {
    navigate("/");
  }

  const handleDatesChange = (startDate: string, endDate: string) => {
    setBooking({ startDate, endDate });
  };

  const handleSizeChange = (value: string) => {
    setBooking({ size: value });
  };

  const handleCategoryChange = (value: string) => {
    setBooking({ category: value });
  };

  const handleSelectBike = (bikeId: string) => {
    setBooking({ selectedBikeId: bikeId });
  };

  const handleNext = () => {
    if (!booking.selectedBikeId) return;
    navigate("/accessories");
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <PageWrapper>
      <StepProgressBar currentStep={2} />

      <div className="mt-14 flex flex-col items-center">
        <h1 className="text-[32px] font-semibold text-black mb-6">
          Select Your Bike
        </h1>

        {/* Filters row */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-4xl mb-8">
          <CalendarPicker
            startDate={booking.startDate ?? ""}
            endDate={booking.endDate ?? ""}
            onChange={handleDatesChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <SizeSelector
              value={booking.size ?? "All sizes"}
              options={sizeOptions}
              onChange={handleSizeChange}
            />
            <CategorySelector
              value={booking.category ?? "All categories"}
              options={categoryOptions}
              onChange={handleCategoryChange}
            />
          </div>
        </div>

        {/* Available rentals label */}
        <div className="w-full max-w-5xl mb-4 flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-[#34A853]" />
          <span className="text-sm font-medium text-[#333]">
            Available Rentals
          </span>
        </div>

        {/* Bike cards */}
        <BikeList
          bikes={mockBikes}
          selectedBikeId={booking.selectedBikeId ?? undefined}
          onSelect={handleSelectBike}
        />

        {/* Bottom progress line + buttons */}
        <div className="w-full max-w-5xl mt-10">
          <div className="h-1 w-full bg-[#D9D9D9] mb-6 relative">
            <div className="absolute left-0 top-0 h-1 bg-[#57B560] w-1/2" />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-2 rounded-md border border-gray-400 text-sm text-gray-700 hover:bg-gray-50"
            >
              ← Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!booking.selectedBikeId}
              className={`px-8 py-2 rounded-md text-sm font-medium text-white
                ${
                  booking.selectedBikeId
                    ? "bg-black hover:bg-gray-800"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default BikeBooking;
