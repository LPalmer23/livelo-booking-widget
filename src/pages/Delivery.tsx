// src/pages/Delivery.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import StepProgressBar from "../components/layout/StepProgressBar";
import { useBooking } from "../context/BookingContext";
import {
  fetchPlaceSuggestions,
  getPlaceDetails,
  geocodeAddress,
  distanceToLiveloKm,
} from "../utils/geocode";

type ReceiveMethod = "pickup" | "deliver";
type ReturnMethod = "dropoff" | "collect";

const TIME_OPTIONS = [
  "Select Time",
  "8:00–10:00",
  "10:00–12:00",
  "12:00–2:00",
  "2:00–4:00",
  "4:00–6:00",
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Money({ amount }: { amount: number }) {
  // adjust currency formatting later if you store booking.currency
  const sign = amount >= 0 ? "+" : "-";
  return (
    <span className="text-sm font-semibold text-emerald-600">
      {sign}${Math.abs(amount).toFixed(2)}
    </span>
  );
}

function OptionCard(props: {
  selected: boolean;
  disabled?: boolean;
  title: string;
  subtitle?: string;
  priceDelta?: number;
  errorText?: string;
  onClick: () => void;
  rightSlot?: React.ReactNode;
}) {
  const {
    selected,
    disabled,
    title,
    subtitle,
    priceDelta,
    errorText,
    onClick,
    rightSlot,
  } = props;

  return (
    <button
      type="button"
      onClick={() => !disabled && onClick()}
      className={cx(
        "w-full text-left rounded-xl border bg-white px-5 py-4 shadow-sm transition",
        selected ? "border-[#57B560]" : "border-neutral-200 hover:border-neutral-300",
        disabled && "opacity-60 cursor-not-allowed hover:border-neutral-200"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-neutral-900">{title}</div>
          {subtitle && (
            <div className="mt-1 text-sm text-neutral-500">{subtitle}</div>
          )}
          {errorText && (
            <div className="mt-2 text-sm font-medium text-red-600">
              {errorText}
            </div>
          )}
        </div>

        {typeof priceDelta === "number" && <Money amount={priceDelta} />}
      </div>

      {rightSlot && (
        <div className="mt-3 flex items-center justify-start">
          {rightSlot}
        </div>
      )}
    </button>
  );
}

export default function Delivery() {
  const navigate = useNavigate();
  const { booking, setBooking } = useBooking();

  // Local UI state (so this page works even before you fully wire API logic)
  const [addressDraft, setAddressDraft] = useState<string>(
    (booking as any).accommodationAddress ?? ""
  );
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [geocodeLoading, setGeocodeLoading] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<{ placeId: string; description: string }[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const suppressSuggestionsRef = useRef(false);

  const receiveMethod = (booking as any).receiveMethod as ReceiveMethod | null;
  const returnMethod = (booking as any).returnMethod as ReturnMethod | null;
  const receiveTime = ((booking as any).receiveTime as string | null) ?? null;
  const returnTime = ((booking as any).returnTime as string | null) ?? null;

  // Debounced autocomplete as user types
  useEffect(() => {
    if (suppressSuggestionsRef.current) {
      suppressSuggestionsRef.current = false;
      return;
    }
    const q = addressDraft.trim();
    if (q.length < 3) {
      setSuggestions([]);
      setSuggestionsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const results = await fetchPlaceSuggestions(q);
        setSuggestions(results);
        setSuggestionsOpen(results.length > 0);
        setHighlightedIndex(-1);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [addressDraft]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectSuggestion = useCallback(
    async (suggestion: { placeId: string; description: string }) => {
      suppressSuggestionsRef.current = true;
      setSuggestionsOpen(false);
      setSuggestions([]);
      setGeocodeError(null);
      setGeocodeLoading(true);

      try {
        const result = await getPlaceDetails(suggestion.placeId);
        if (result.ok) {
          const km = distanceToLiveloKm(result.data.lat, result.data.lng);
          setDistanceKm(km);
          setAddressDraft(result.data.formattedAddress);
          setBooking({ accommodationAddress: result.data.formattedAddress } as any);
        } else {
          setGeocodeError(result.error);
        }
      } catch {
        setGeocodeError("Unable to verify address.");
      } finally {
        setGeocodeLoading(false);
      }
    },
    [setBooking]
  );

  // Distance from accommodation to 800 Boylston St, Boston, MA 02199 (demo: 5 km if no address)
  const pickupDistanceKm = distanceKm ?? 5;
  const dropoffDistanceKm = distanceKm ?? 5;
  const dropoffUnavailable = useMemo(() => {
    return addressDraft.trim().length > 0 && addressDraft.toLowerCase().includes("po box");
  }, [addressDraft]);

  const handleSearch = async () => {
    const addr = addressDraft.trim();
    if (!addr) return;

    setGeocodeLoading(true);
    setGeocodeError(null);
    setDistanceKm(null);

    try {
      const result = await geocodeAddress(addr);
      if (result.ok) {
        const km = distanceToLiveloKm(result.data.lat, result.data.lng);
        setDistanceKm(km);
        setAddressDraft(result.data.formattedAddress);
        setBooking({
          accommodationAddress: result.data.formattedAddress,
        } as any);
      } else {
        setGeocodeError(result.error);
        setBooking({ accommodationAddress: addr } as any);
      }
    } catch {
      setGeocodeError("Unable to verify address. Please try again.");
      setBooking({ accommodationAddress: addr } as any);
    } finally {
      setGeocodeLoading(false);
    }
  };

  // Demo: unlock next step to reach payment (bypass validation)
  const canContinue = true;

  return (
    <PageWrapper>
      <StepProgressBar currentStep={4} bookingType={(booking as any).bookingType} />

      <div className="mx-auto mt-8 w-full max-w-4xl">
        <h1 className="text-center text-4xl font-semibold tracking-tight text-neutral-900">
          Enter Your Accommodation Address
        </h1>

        {/* Address Search with autocomplete */}
        <div ref={containerRef} className="mx-auto mt-6 w-full max-w-xl relative">
          <div className="flex overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
            <input
              value={addressDraft}
              onChange={(e) => {
                setAddressDraft(e.target.value);
                setGeocodeError(null);
              }}
              onFocus={() => suggestions.length > 0 && setSuggestionsOpen(true)}
              onKeyDown={(e) => {
                if (!suggestionsOpen || suggestions.length === 0) {
                  if (e.key === "Enter") handleSearch();
                  return;
                }
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setHighlightedIndex((i) =>
                    i < suggestions.length - 1 ? i + 1 : 0
                  );
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setHighlightedIndex((i) =>
                    i > 0 ? i - 1 : suggestions.length - 1
                  );
                } else if (e.key === "Enter" && highlightedIndex >= 0) {
                  e.preventDefault();
                  selectSuggestion(suggestions[highlightedIndex]);
                } else if (e.key === "Escape") {
                  setSuggestionsOpen(false);
                  setHighlightedIndex(-1);
                }
              }}
              placeholder="Start typing your address..."
              className="w-full px-4 py-3 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={geocodeLoading || !addressDraft.trim()}
              className="shrink-0 bg-neutral-400 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {geocodeLoading ? "Searching…" : "Search"}
            </button>
          </div>

          {/* Suggestions dropdown */}
          {suggestionsOpen && (
            <ul className="absolute z-10 mt-1 w-full rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
              {suggestionsLoading ? (
                <li className="px-4 py-3 text-sm text-neutral-500">
                  Finding addresses...
                </li>
              ) : (
                suggestions.map((s, i) => (
                  <li key={s.placeId}>
                    <button
                      type="button"
                      onClick={() => selectSuggestion(s)}
                      onMouseEnter={() => setHighlightedIndex(i)}
                      className={cx(
                        "w-full px-4 py-2.5 text-left text-sm",
                        i === highlightedIndex
                          ? "bg-neutral-100 text-neutral-900"
                          : "text-neutral-700 hover:bg-neutral-50"
                      )}
                    >
                      {s.description}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}

          {geocodeError && (
            <p className="mt-2 text-sm text-red-600">{geocodeError}</p>
          )}
          {distanceKm !== null && (
            <p className="mt-2 text-sm text-neutral-600">
              {distanceKm.toFixed(1)} km from Livelo (800 Boylston St, Boston)
            </p>
          )}
        </div>

        {/* Sections */}
        <div className="mt-10 space-y-10">
          {/* Receive */}
          <section>
            <h2 className="text-xl font-semibold text-neutral-900">
              Receive Your Bikes
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
              <OptionCard
                selected={receiveMethod === "pickup"}
                title="Pickup From Livelo"
                subtitle={`${pickupDistanceKm.toFixed(1)} km from accommodation`}
                onClick={() =>
                  setBooking({ receiveMethod: "pickup", receiveTime: null } as any)
                }
              />

              <OptionCard
                selected={receiveMethod === "deliver"}
                title="Livelo Delivers"
                priceDelta={10}
                onClick={() =>
                  setBooking({ receiveMethod: "deliver" } as any)
                }
                rightSlot={
                  receiveMethod === "deliver" ? (
                    <select
                      value={receiveTime ?? "Select Time"}
                      onChange={(e) =>
                        setBooking({ receiveTime: e.target.value } as any)
                      }
                      className="w-full max-w-[220px] rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 outline-none"
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full max-w-[220px] rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-400">
                      Select Time
                    </div>
                  )
                }
              />
            </div>
          </section>

          {/* Return */}
          <section>
            <h2 className="text-xl font-semibold text-neutral-900">
              Return Your Bikes
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
              <OptionCard
                selected={returnMethod === "dropoff"}
                disabled={dropoffUnavailable}
                title="Drop-off to Livelo"
                subtitle={`${dropoffDistanceKm.toFixed(1)} km from residence`}
                errorText={dropoffUnavailable ? "Unavailable at this location" : undefined}
                onClick={() =>
                  setBooking({ returnMethod: "dropoff", returnTime: null } as any)
                }
              />

              <OptionCard
                selected={returnMethod === "collect"}
                title="Livelo Collects"
                priceDelta={10}
                onClick={() =>
                  setBooking({ returnMethod: "collect" } as any)
                }
                rightSlot={
                  returnMethod === "collect" ? (
                    <select
                      value={returnTime ?? "Select Time"}
                      onChange={(e) =>
                        setBooking({ returnTime: e.target.value } as any)
                      }
                      className="w-full max-w-[220px] rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 outline-none"
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full max-w-[220px] rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-400">
                      Select Time
                    </div>
                  )
                }
              />
            </div>
          </section>
        </div>

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/accessories")}
            className="min-w-[112px] px-6 py-2 rounded-md border border-gray-400 text-sm text-gray-700 hover:bg-gray-50"
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={() => navigate("/order-summary")}
            disabled={!canContinue}
            className={cx(
              "min-w-[112px] px-6 py-2 rounded-md text-sm font-medium",
              canContinue
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            )}
          >
            Next →
          </button>
        </div>

        {!canContinue && (
          <div className="mt-3 text-center text-sm text-neutral-500">
            Enter an address and select receive/return options to continue.
          </div>
        )}
      </div>
    </PageWrapper>
  );
}