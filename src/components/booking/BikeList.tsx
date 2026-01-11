// src/components/booking/BikeList.tsx
import React, { useRef, useState, useCallback, useEffect } from "react";
import BikeCard, { type Bike } from "./BikeCard";

interface BikeListProps {
  bikes: Bike[];
  selectedBikeId: string | null;
  onSelectBike: (id: string) => void;
}

const BikeList: React.FC<BikeListProps> = ({
  bikes,
  selectedBikeId,
  onSelectBike,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
const [thumbWidth, setThumbWidth] = useState(100);   // % of track
const [thumbOffset, setThumbOffset] = useState(0);   // % translateX

const updateThumb = useCallback(() => {
  const el = scrollRef.current;
  if (!el) return;

  const scrollWidth = el.scrollWidth;
  const clientWidth = el.clientWidth;
  const maxScroll = scrollWidth - clientWidth;

  // If no scrolling needed, thumb fills track (or you could hide it)
  if (maxScroll <= 0) {
    setThumbWidth(100);
    setThumbOffset(0);
    return;
  }

  // Thumb size = visible portion of content
  const rawThumbWidth = (clientWidth / scrollWidth) * 100;
  const clampedThumbWidth = Math.max(rawThumbWidth, 10); // don't get too tiny

  const maxOffset = 100 - clampedThumbWidth;
  const offset =
      (el.scrollLeft / maxScroll) * maxOffset;



  setThumbWidth(clampedThumbWidth);
  setThumbOffset(offset);
}, []);

useEffect(() => {
  updateThumb(); // initial size/position
}, [updateThumb]);

const handleScroll = () => {
  updateThumb();
};

  useEffect(() => {
    // initialize on first render
    handleScroll();
  }, [handleScroll]);

  if (!bikes || bikes.length === 0) return null;

  return (
    <>
      {/* Scrollable row of cards */}
      <div
  ref={scrollRef}
  onScroll={handleScroll}
  className="bike-scroll w-full max-w-5xl overflow-x-auto pb-2"
>
    <div className="flex gap-6 min-w-max">
      {bikes.map((bike) => (
        <BikeCard
          key={bike.id}
          bike={bike}
          isSelected={bike.id === selectedBikeId}
          onSelect={onSelectBike}
        />
      ))}
    </div>
  </div>


      {/* Custom green scrollbar just under the cards */}
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
