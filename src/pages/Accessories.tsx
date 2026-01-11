import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import StepProgressBar from "../components/layout/StepProgressBar";
import { useBooking } from "../context/BookingContext";
import AccessoryCard, {
  type Accessory,
} from "../components/accessories/AccessoryCard";
import HelmetAccessoryCard from "../components/accessories/HelmetAccessoryCard";

const ACCESSORIES: Accessory[] = [
  // helmets
  {
    id: "helmet-1",
    name: "Helmet",
    pricePerDay: 0,
    imageSrc: "/images/helmet-placeholder.jpg",
    description: "High quality road helmet with adjustable fit.",
    options: ["S", "M", "L"],
  },
  {
    id: "helmet-2",
    name: "Helmet",
    pricePerDay: 0,
    imageSrc: "/images/helmet-placeholder.jpg",
    description: "High quality road helmet with adjustable fit.",
    options: ["S", "M", "L"],
  },
  {
    id: "helmet-3",
    name: "Helmet",
    pricePerDay: 0,
    imageSrc: "/images/helmet-placeholder.jpg",
    description: "High quality road helmet with adjustable fit.",
    options: ["S", "M", "L"],
  },

  // pedals
  {
    id: "pedals-1",
    name: "Shimano SPD Road Pedals",
    pricePerDay: 0,
    imageSrc: "/images/pedals-placeholder.jpg",
    description: "SPD-SL road pedals. Bring your own shoes.",
    options: ["One size"],
  },
  {
    id: "pedals-2",
    name: "Shimano SPD Road Pedals",
    pricePerDay: 0,
    imageSrc: "/images/pedals-placeholder.jpg",
    description: "SPD-SL road pedals. Bring your own shoes.",
    options: ["One size"],
  },
  {
    id: "pedals-3",
    name: "Shimano SPD Road Pedals",
    pricePerDay: 0,
    imageSrc: "/images/pedals-placeholder.jpg",
    description: "SPD-SL road pedals. Bring your own shoes.",
    options: ["One size"],
  },

  // existing extras
  {
    id: "saddle-bag",
    name: "Saddle Bag",
    pricePerDay: 0,
    imageSrc: "/images/saddlebag-placeholder.jpg",
    description: "Compact saddle bag for tools and snacks.",
    options: ["Standard"],
  },
  {
    id: "tour-1",
    name: "1 Hour Tour",
    pricePerDay: 0,
    imageSrc: "/images/tour-placeholder.jpg",
    description: "Guided 1-hour ride to explore the local area.",
    options: ["One size"],
  },
];

const Accessories: React.FC = () => {
  const navigate = useNavigate();
  const { booking } = useBooking();

  // guard routes
  //if (!booking.isEmailVerified) {
  //  navigate("/");
  //} else if (!booking.selectedBikeId) {
  //  navigate("/bike-booking");
  //}

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string | null>
  >({});
  const [openAccessory, setOpenAccessory] = useState<Accessory | null>(null);

  // ---- custom green scroll bar state ----
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [thumbWidth, setThumbWidth] = useState(100);
  const [thumbOffset, setThumbOffset] = useState(0);

  const updateThumb = () => {
    const el = scrollRef.current;
    if (!el) return;

    const visible = el.clientWidth;
    const total = el.scrollWidth;
    const left = el.scrollLeft;

    if (total <= visible) {
      setThumbWidth(100);
      setThumbOffset(0);
      return;
    }

    const width = (visible / total) * 100;
    const maxOffset = 100 - width;
    const maxScroll = total - visible;
    const offset = maxScroll > 0 ? (left / maxScroll) * maxOffset : 0;

    setThumbWidth(width);
    setThumbOffset(offset);
  };

  useEffect(() => {
    updateThumb();
    window.addEventListener("resize", updateThumb);
    return () => window.removeEventListener("resize", updateThumb);
  }, []);

  const handleSaveOption = (accessoryId: string, option: string) => {
    setSelectedOptions((prev) => ({ ...prev, [accessoryId]: option }));
    setOpenAccessory(null);
  };

  const handleBack = () => navigate("/bike-booking");
  const handleNext = () => {
    // later: navigate("/delivery");
  };

  return (
    <PageWrapper>
      <StepProgressBar currentStep={3} />

      <div className="mt-14 flex flex-col items-center">
        <h1 className="text-[32px] font-semibold text-black mb-6">
          Choose Your Accessories
        </h1>

        {/* Rider / bike info grey box */}
        <div className="w-full max-w-[960px] mb-8 rounded-xl bg-[#F5F5F5] px-6 py-5">
          <div className="text-sm font-semibold text-gray-800 mb-4">
            1. Rider details for selected bike
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Rider’s First and Last Name (required)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  placeholder="First (required)"
                />
                <input
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  placeholder="Last (required)"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Rider’s Email (optional)
              </label>
              <input
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="Email"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Rider’s Height (required)
              </label>
              <input
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="Height (cm)"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Seat’s Height
              </label>
              <input
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="Length (cm)"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Bar Reach
              </label>
              <input
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="Length (cm)"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Bar Drop
              </label>
              <input
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="Length (cm)"
              />
            </div>
          </div>
        </div>

        {/* Section label */}
        <div className="w-full max-w-5xl mb-4 flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-[#34A853]" />
          <span className="text-sm font-medium text-[#333]">
            Accessories & Tours
          </span>
        </div>

        {/* Sliding accessory cards + green scroll bar */}
        <div className="w-full max-w-5xl">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto bike-scroll pb-4"
            onScroll={updateThumb}
          >
            {ACCESSORIES.map((acc) => (
              <AccessoryCard
                key={acc.id}
                accessory={acc}
                selectedOption={selectedOptions[acc.id] ?? null}
                onOpenModal={() => setOpenAccessory(acc)}
              />
            ))}
          </div>

          {/* custom green thumb (matches booking page) */}
          <div className="w-full mt-1">
            <div className="relative h-1 w-full bg-[#D9D9D9] rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-[#57B560] rounded-full"
                style={{
                  width: `${thumbWidth}%`,
                  transform: `translateX(${thumbOffset}%)`,
                  transition: "transform 60ms linear",
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="w-full max-w-5xl mt-10">
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
              className="px-8 py-2 rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Re-usable popup */}
      {openAccessory && (
        <HelmetAccessoryCard
          accessory={openAccessory}
          selectedOption={selectedOptions[openAccessory.id] ?? null}
          onClose={() => setOpenAccessory(null)}
          onSave={(opt) => handleSaveOption(openAccessory.id, opt)}
        />
      )}
    </PageWrapper>
  );
};

export default Accessories;
