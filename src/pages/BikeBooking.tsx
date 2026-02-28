import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import StepProgressBar from "../components/layout/StepProgressBar";
import { useBooking } from "../context/BookingContext";

import CalendarPicker from "../components/booking/CalendarPicker";
import SizeSelector from "../components/booking/SizeSelector";
import CategorySelector from "../components/booking/CategorySelector";
import BikeList, { type Bike } from "../components/booking/BikeList";
import { getAvailableVariants, type AvailableVariant } from "../utils/api";

type MockInventoryItem = {
  id: string;
  name: string;
  size: string;
  category: string;
  pricePerDay: number;
};

const mockInventory: MockInventoryItem[] = [
  { id: "toa-54-1", name: "Chapter2 TOA – Ultegra Di2", size: "54cm", category: "Road", pricePerDay: 148 },
  { id: "toa-54-2", name: "Chapter2 TOA – Ultegra Di2", size: "54cm", category: "Road", pricePerDay: 148 },
  { id: "toa-54-3", name: "Chapter2 TOA – Ultegra Di2", size: "54cm", category: "Road", pricePerDay: 148 },
  { id: "toa-56-1", name: "Chapter2 TOA – Ultegra Di2", size: "56cm", category: "Road", pricePerDay: 148 },
  { id: "toa-56-2", name: "Chapter2 TOA – Ultegra Di2", size: "56cm", category: "Road", pricePerDay: 148 },
  { id: "toa-58-1", name: "Chapter2 TOA – Ultegra Di2", size: "58cm", category: "Road", pricePerDay: 148 },
  { id: "syn-54-1", name: "Cannondale Synapse", size: "54cm", category: "Endurance", pricePerDay: 130 },
  { id: "syn-54-2", name: "Cannondale Synapse", size: "54cm", category: "Endurance", pricePerDay: 130 },
  { id: "syn-54-3", name: "Cannondale Synapse", size: "54cm", category: "Endurance", pricePerDay: 130 },
  { id: "syn-56-1", name: "Cannondale Synapse", size: "56cm", category: "Endurance", pricePerDay: 130 },
  { id: "syn-56-2", name: "Cannondale Synapse", size: "56cm", category: "Endurance", pricePerDay: 130 },
];

/** Bikes unavailable when selected dates overlap these ranges (for mock date filtering) */
const mockUnavailableRanges: Record<string, Array<{ start: string; end: string }>> = {
  "Chapter2 TOA – Ultegra Di2__58cm": [{ start: "2025-03-01", end: "2025-03-15" }],
  "Cannondale Synapse__56cm": [{ start: "2025-02-10", end: "2025-02-20" }],
  "Chapter2 TOA – Ultegra Di2__56cm": [{ start: "2025-04-01", end: "2025-04-10" }],
};

const categoryOptions = ["All categories", "Road", "Endurance", "Gravel", "TT", "E-Bike"];

const BikeBooking: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { booking, setBooking, addToCart, removeFromCart } = useBooking();
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const productId = useMemo(() => {
    const value = searchParams.get("productId");
    return value ? Number(value) : null;
  }, [searchParams]);

  const locationId = useMemo(() => {
    const value = searchParams.get("locationId");
    return value ? Number(value) : null;
  }, [searchParams]);

  const productTitle =
    searchParams.get("productTitle") ?? "Livelo Bike Rental";
  const productImage = searchParams.get("productImage") ?? undefined;
  const bypassSelection = searchParams.get("bypass") === "1";
  const useMockInventory =
    searchParams.get("inventory") === "mock" || (!productId && !locationId);

  const selectedQuantities = useMemo(() => {
    return booking.cartItems.reduce<Record<string, number>>((acc, item) => {
      const key = `${item.name}__${item.size}`;
      acc[key] = (acc[key] ?? 0) + item.quantity;
      return acc;
    }, {});
  }, [booking.cartItems]);

  // Allow viewing booking even without email verification for now.

  useEffect(() => {
    setBooking({
      productId,
      locationId,
      selectedBikeName: productTitle,
      selectedBikeImage: productImage ?? null,
    });
  }, [locationId, productId, productImage, productTitle, setBooking]);

  // Build "all bikes" - from mock (always) or from API (when dates set)
  const allBikes = useMemo(() => {
    if (useMockInventory) {
      const grouped = new Map<string, Bike>();
      for (const item of mockInventory) {
        const key = `${item.name}__${item.size}`;
        const existing = grouped.get(key);
        if (existing) {
          existing.available += 1;
        } else {
          grouped.set(key, {
            id: item.id,
            name: item.name,
            size: item.size,
            category: item.category,
            pricePerDay: item.pricePerDay,
            available: 1,
          });
        }
      }
      return Array.from(grouped.values());
    }
    return bikes;
  }, [useMockInventory, bikes]);

  // Fetch from API when we have productId, locationId, and dates
  useEffect(() => {
    const canFetch =
      productId &&
      locationId &&
      booking.startDate &&
      booking.endDate;

    if (useMockInventory) {
      setLoadError(null);
      setIsLoading(false);
      return;
    }

    if (!canFetch) {
      setBikes([]);
      setLoadError(null);
      return;
    }

    let isMounted = true;
    const fetchVariants = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const data = await getAvailableVariants({
          productId,
          locationId,
          startDate: booking.startDate as string,
          endDate: booking.endDate as string,
        });

        if (!isMounted) return;

        const mapped: Bike[] = (data || []).map(
          (variant: AvailableVariant, index: number) => {
            const variantId =
              variant.product_variant_id ??
              variant.variant_id ??
              index;
            const size = String(variant.variant_value ?? "One size");
            const pricePerDay = Number(variant.base_price ?? 0);
            const inStock =
              typeof variant.in_stock === "boolean"
                ? variant.in_stock
                : Boolean(variant.in_stock ?? true);
            const category = (variant as Record<string, unknown>).category as string | undefined;

            return {
              id: String(variantId),
              name: productTitle,
              imageUrl: productImage,
              size,
              pricePerDay,
              available: inStock ? 1 : 0,
              category,
            };
          }
        );

        setBikes(mapped);

        const stillSelected = mapped.some(
          (bike) => bike.id === booking.selectedBikeId
        );
        if (!stillSelected && booking.selectedBikeId) {
          setBooking({ selectedBikeId: null });
        }
      } catch (err) {
        if (!isMounted) return;
        setLoadError("Unable to load availability. Try again.");
        setBikes([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchVariants();

    return () => {
      isMounted = false;
    };
  }, [
    booking.endDate,
    booking.selectedBikeId,
    booking.startDate,
    locationId,
    productId,
    productImage,
    productTitle,
    setBooking,
    useMockInventory,
  ]);

  // Filter bikes by date (mock only), size, and category
  const filteredBikes = useMemo(() => {
    let result = allBikes;

    // Date filter (mock): remove bikes unavailable for selected date range
    if (useMockInventory && booking.startDate && booking.endDate) {
      const start = booking.startDate;
      const end = booking.endDate;
      result = result.filter((bike) => {
        const key = `${bike.name}__${bike.size}`;
        const ranges = mockUnavailableRanges[key];
        if (!ranges) return true;
        const overlaps = ranges.some(
          (r) => !(end < r.start || start > r.end)
        );
        return !overlaps;
      });
    }

    // Size filter
    const sizeFilter = booking.size?.trim();
    if (sizeFilter && sizeFilter !== "All sizes") {
      result = result.filter((bike) => bike.size === sizeFilter);
    }

    // Category filter
    const categoryFilter = booking.category?.trim();
    if (categoryFilter && categoryFilter !== "All categories") {
      result = result.filter((bike) => bike.category === categoryFilter);
    }

    return result;
  }, [
    allBikes,
    useMockInventory,
    booking.startDate,
    booking.endDate,
    booking.size,
    booking.category,
  ]);

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
    const selected = allBikes.find((bike) => bike.id === bikeId);
    if (selected) {
      const key = `${selected.name}__${selected.size}`;
      const currentQty = selectedQuantities[key] ?? 0;
      if (currentQty >= selected.available) {
        return;
      }
    }
    if (selected) {
      const cartItemId = `${selected.id}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 6)}`;
      addToCart({
        id: cartItemId,
        name: selected.name,
        size: selected.size,
        pricePerDay: selected.pricePerDay,
      });
    }
    setBooking({
      selectedBikeId: bikeId,
      selectedBikePricePerDay: selected?.pricePerDay ?? null,
      selectedBikeName: selected?.name ?? productTitle,
      selectedBikeImage: selected?.imageUrl ?? productImage ?? null,
      selectedBikeCurrency: "AUD",
    });
  };

  const handleRemoveBike = (bikeId: string) => {
    const selected = allBikes.find((bike) => bike.id === bikeId);
    if (!selected) return;
    removeFromCart({ name: selected.name, size: selected.size });
  };

  const handleNext = () => {
    navigate("/accessories");
    window.setTimeout(() => {
      if (window.location.pathname !== "/accessories") {
        window.location.assign("/accessories");
      }
    }, 0);
  };

  const handleBack = () => {
    setBooking({ email: "", isEmailVerified: false });
    navigate("/");
    window.setTimeout(() => {
      if (window.location.pathname !== "/") {
        window.location.assign("/");
      }
    }, 0);
  };

  return (
    <PageWrapper>
      <StepProgressBar currentStep={2} />

      <div className="mt-14 flex flex-col items-center">
        <h1 className="text-[32px] font-semibold text-black mb-6">
          Select Your Bike
        </h1>

        {/* Filters row */}
        {/* Filters: 2 × 2 layout */}
        <div className="w-full max-w-[960px] mb-8 space-y-4">
          {/* Row 1: start / end */}
          <CalendarPicker
            startDate={booking.startDate ?? ""}
            endDate={booking.endDate ?? ""}
            onChange={handleDatesChange}
          />

          {/* Row 2: size / category */}
          <div className="grid grid-cols-2 gap-4">
            <SizeSelector
              value={!booking.size || booking.size === "All sizes" ? "" : booking.size}
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

        {isLoading && (
          <div className="w-full max-w-5xl rounded-md border border-[#EAEAEA] bg-[#FAFAFA] px-4 py-3 text-sm text-[#555]">
            Loading availability...
          </div>
        )}

        {loadError && (
          <div className="w-full max-w-5xl rounded-md border border-[#F3C2C2] bg-[#FFF5F5] px-4 py-3 text-sm text-[#B3261E]">
            {loadError}
          </div>
        )}

        {!isLoading &&
          !loadError &&
          filteredBikes.length === 0 &&
          productId &&
          locationId &&
          !useMockInventory &&
          !booking.startDate && (
          <div className="w-full max-w-5xl rounded-md border border-[#EAEAEA] bg-[#FAFAFA] px-4 py-3 text-sm text-[#555]">
            Select your dates to see availability.
          </div>
        )}

        {!isLoading &&
          !loadError &&
          filteredBikes.length === 0 &&
          (useMockInventory ? allBikes.length > 0 : bikes.length > 0) && (
          <div className="w-full max-w-5xl rounded-md border border-[#EAEAEA] bg-[#FAFAFA] px-4 py-3 text-sm text-[#555]">
            No bikes match your filters. Try adjusting dates, size, or category.
          </div>
        )}

        {!isLoading && !loadError && filteredBikes.length > 0 && (
          <BikeList
            bikes={filteredBikes}
            selectedBikeId={booking.selectedBikeId}
            onSelectBike={handleSelectBike}
            onRemoveBike={handleRemoveBike}
            selectedQuantities={selectedQuantities}
          />
        )}

        {/* Bottom progress line + buttons */}
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
        {bypassSelection && (
          <div className="mt-3 text-xs text-neutral-500">
            Bypass enabled: add a bike later in checkout.
          </div>
        )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default BikeBooking;
