// src/components/booking/BikeList.tsx
import React, { useRef, useState, useCallback, useEffect } from "react";
import BikeCard, { type Bike } from "./BikeCard";

interface BikeListProps {
  bikes: Bike[];
  selectedBikeId: string | null;
  onSelectBike: (id: string) => void;
  onRemoveBike: (id: string) => void;
  selectedQuantities: Record<string, number>;
}

const BikeList: React.FC<BikeListProps> = ({
  bikes,
  selectedBikeId,
  onSelectBike,
  onRemoveBike,
  selectedQuantities,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [thumbWidth, setThumbWidth] = useState(100); // % of track
  const [thumbOffset, setThumbOffset] = useState(0); // % translateX

  const updateThumb = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollWidth = el.scrollWidth;
    const clientWidth = el.clientWidth;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 0) {
      setThumbWidth(100);
      setThumbOffset(0);
      return;
    }

    const rawThumbWidth = (clientWidth / scrollWidth) * 100;
    const clampedThumbWidth = Math.max(rawThumbWidth, 10);

    const maxOffset = 100 - clampedThumbWidth;
    const offset = (el.scrollLeft / maxScroll) * maxOffset;

    setThumbWidth(clampedThumbWidth);
    setThumbOffset(offset);
  }, []);

  // Initial + whenever bikes change (content width changes)
  useEffect(() => {
    updateThumb();
  }, [updateThumb, bikes.length]);

  const handleScroll = () => {
    updateThumb();
  };

  if (!bikes || bikes.length === 0) return null;

  return (
    <>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="bike-scroll w-full max-w-5xl overflow-x-auto pb-2"
      >
        <div className="flex gap-6 min-w-max">
          {bikes.map((bike) => {
            const key = `${bike.name}__${bike.size}`;
            const selectedQuantity = selectedQuantities[key] ?? 0;
            return (
              <BikeCard
                key={bike.id}
                bike={bike}
                isSelected={bike.id === selectedBikeId}
                selectedQuantity={selectedQuantity}
                onSelect={onSelectBike}
                onRemove={onRemoveBike}
              />
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-5xl mt-1">
        <div className="relative h-1 w-full bg-[#D9D9D9] rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-[#57B560] rounded-full"
            style={{
              width: `${thumbWidth}%`,
              left: `${thumbOffset}%`,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default BikeList;
export type { Bike };
