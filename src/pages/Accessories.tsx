import React, { useMemo, useState, useRef, useEffect } from "react";
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

const mockAccessoryInventory: string[] = [
  "helmet-1",
  "helmet-1",
  "helmet-1",
  "helmet-2",
  "helmet-2",
  "helmet-3",
  "pedals-1",
  "pedals-1",
  "pedals-2",
  "pedals-3",
  "saddle-bag",
  "saddle-bag",
  "tour-1",
];

const Accessories: React.FC = () => {
  const navigate = useNavigate();
  const { booking, addAccessoryToCart } = useBooking();

  // guard routes
  //if (!booking.isEmailVerified) {
  //  navigate("/");
  //} else if (!booking.selectedBikeId) {
  //  navigate("/bike-booking");
  //}

  const [openAccessory, setOpenAccessory] = useState<Accessory | null>(null);
  const [selectedCartItem, setSelectedCartItem] = useState<{
    name: string;
    size: string;
    quantity: number;
    pricePerDay: number;
  } | null>(null);
  const [activeBikeId, setActiveBikeId] = useState<string | null>(null);

  const accessoryAvailability = useMemo(
    () =>
      ACCESSORIES.reduce<Record<string, number>>((acc, accessory) => {
        const count = mockAccessoryInventory.filter(
          (id) => id === accessory.id
        ).length;
        acc[accessory.id] = count || 1;
        return acc;
      }, {}),
    []
  );

  const getAccessoryQuantitiesForBike = (bikeId: string) => {
    const activeBikeAccessories = booking.cartItems.find(
      (item) => item.id === bikeId
    )?.accessories;

    return (activeBikeAccessories ?? []).reduce<Record<string, number>>(
      (acc, item) => {
        acc[item.id] = (acc[item.id] ?? 0) + item.quantity;
        return acc;
      },
      {}
    );
  };

  const getAccessoryOptionForBike = (bikeId: string, accessoryId: string) => {
    const activeBikeAccessories = booking.cartItems.find(
      (item) => item.id === bikeId
    )?.accessories;
    return (
      activeBikeAccessories?.find((acc) => acc.id === accessoryId)?.option ??
      null
    );
  };

  const getSelectedAccessoriesForBike = (bikeId: string) => {
    return (
      booking.cartItems.find((item) => item.id === bikeId)?.accessories ?? []
    );
  };

  const getAccessoryCategory = (accessoryId: string) => {
    if (accessoryId.startsWith("helmet")) return "helmet";
    if (accessoryId.startsWith("pedals")) return "pedals";
    if (accessoryId.startsWith("tour")) return "tour";
    return "other";
  };

  const handleSaveOption = (accessoryId: string, option: string) => {
    if (activeBikeId) {
      const accessory = ACCESSORIES.find((acc) => acc.id === accessoryId);
      if (accessory) {
        const accessoryQuantities =
          getAccessoryQuantitiesForBike(activeBikeId);
        const currentQty = accessoryQuantities[accessoryId] ?? 0;
        const maxQty = accessoryAvailability[accessoryId] ?? 1;
        if (currentQty >= maxQty) {
          setOpenAccessory(null);
          return;
        }
        addAccessoryToCart({
          bikeId: activeBikeId,
          accessory: {
            id: accessory.id,
            name: accessory.name,
            option,
            pricePerDay: accessory.pricePerDay,
          },
        });
      }
    }
    setOpenAccessory(null);
  };

  const handleBack = () => navigate("/bike-booking");
  const handleNext = () => {
    navigate("/delivery");
  };

  const AccessoryScroller: React.FC<{
    bikeKey: string;
  }> = ({ bikeKey }) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [thumbWidth, setThumbWidth] = useState(100);
    const [thumbOffset, setThumbOffset] = useState(0);
    const accessoryQuantities = getAccessoryQuantitiesForBike(bikeKey);
    const selectedAccessories = getSelectedAccessoriesForBike(bikeKey);
    const selectedHelmetId = selectedAccessories.find((acc) =>
      acc.id.startsWith("helmet")
    )?.id;
    const selectedPedalId = selectedAccessories.find((acc) =>
      acc.id.startsWith("pedals")
    )?.id;

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

    return (
      <div className="w-full max-w-5xl mb-8">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto bike-scroll pb-4"
          onScroll={updateThumb}
        >
          {ACCESSORIES.map((acc) => (
            <AccessoryCard
              key={`${bikeKey}-${acc.id}`}
              accessory={acc}
              selectedOption={getAccessoryOptionForBike(bikeKey, acc.id)}
              selectedQuantity={accessoryQuantities[acc.id] ?? 0}
              availableCount={accessoryAvailability[acc.id] ?? 1}
              isDisabled={
                (accessoryQuantities[acc.id] ?? 0) >=
                  (accessoryAvailability[acc.id] ?? 1) ||
                (getAccessoryCategory(acc.id) === "helmet" &&
                  selectedHelmetId &&
                  selectedHelmetId !== acc.id) ||
                (getAccessoryCategory(acc.id) === "pedals" &&
                  selectedPedalId &&
                  selectedPedalId !== acc.id)
              }
              isDimmed={
                (getAccessoryCategory(acc.id) === "helmet" &&
                  selectedHelmetId &&
                  selectedHelmetId !== acc.id) ||
                (getAccessoryCategory(acc.id) === "pedals" &&
                  selectedPedalId &&
                  selectedPedalId !== acc.id)
              }
              onOpenModal={() => {
                setActiveBikeId(bikeKey);
                setOpenAccessory(acc);
              }}
            />
          ))}
        </div>

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
    );
  };

  return (
    <PageWrapper>
      <StepProgressBar currentStep={3} />

      <div className="mt-14 flex flex-col items-center">
        <h1 className="text-[32px] font-semibold text-black mb-6">
          Choose Your Accessories
        </h1>

        {booking.cartItems.length === 0 && (
          <div className="w-full max-w-5xl mb-8 rounded-md border border-[#EAEAEA] bg-[#FAFAFA] px-4 py-3 text-sm text-[#555]">
            Add bikes in booking to see rider details and accessories.
          </div>
        )}

        {booking.cartItems.map((item, index) => {
          const bikeKey = item.id;
          return (
            <div key={item.id} className="w-full max-w-5xl">
              {/* Rider / bike info grey box */}
              <div className="w-full max-w-[960px] mb-8 rounded-xl bg-[#F5F5F5] px-6 py-5">
                <div className="text-sm font-semibold text-gray-800 mb-4">
                  {index + 1}. Rider details for {item.name} {item.size}
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

              {/* Accessories & tours */}
              <div className="w-full max-w-5xl mb-4 flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-[#34A853]" />
                <span className="text-sm font-medium text-[#333]">
                  Accessories & Tours
                </span>
              </div>

              <AccessoryScroller bikeKey={bikeKey} />
            </div>
          );
        })}


        {/* Bottom buttons */}
        <div className="w-full max-w-5xl mt-10">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleBack}
              className="min-w-[112px] px-6 py-2 rounded-md border border-gray-400 text-sm text-gray-700 hover:bg-gray-50"
            >
              ← Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="min-w-[112px] px-6 py-2 rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800"
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
          selectedOption={
            activeBikeId
              ? getAccessoryOptionForBike(activeBikeId, openAccessory.id)
              : null
          }
          onClose={() => setOpenAccessory(null)}
          onSave={(opt) => handleSaveOption(openAccessory.id, opt)}
        />
      )}

      {selectedCartItem && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-neutral-500">Selected bike</div>
                <div className="text-base font-semibold text-neutral-900">
                  {selectedCartItem.name}
                </div>
                <div className="text-sm text-neutral-600">
                  Size: {selectedCartItem.size}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCartItem(null)}
                className="text-sm text-neutral-500 hover:text-neutral-800"
              >
                Close
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-neutral-700">
              <span>Quantity</span>
              <span>x{selectedCartItem.quantity}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-neutral-700">
              <span>Rate</span>
              <span>AUD {selectedCartItem.pricePerDay.toFixed(2)} / day</span>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default Accessories;
