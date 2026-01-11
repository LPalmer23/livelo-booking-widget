// src/components/booking/BikeCard.tsx
import React from "react";

export interface Bike {
  id: string;
  name: string;
  imageUrl?: string;
  tags?: string[];
  pricePerDay: number;
  size: string;
  available: number;
}

export interface BikeCardProps {
  bike: Bike;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const BikeCard: React.FC<BikeCardProps> = ({ bike, isSelected, onSelect }) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(bike.id)}
      className={`
        flex h-[364px] w-[260px] shrink-0 flex-col
        rounded-[10px] border-[3px] bg-white
        shadow-[0_4px_1px_rgba(0,0,0,0.25)]
        transition
        ${isSelected ? "border-[#E13838]" : "border-[#EAEAEA]"}
      `}
    >
      <div className="flex flex-1 flex-col px-4 pt-4 pb-3">
        {/* Image area – 215 × 138 */}
        <div className="mx-auto mb-4 flex h-[138px] w-[215px] items-center justify-center overflow-hidden">
          {bike.imageUrl ? (
            <img
              src={bike.imageUrl}
              alt={bike.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-[#F2F2F2]" />
          )}
        </div>

        {/* Title */}
        <p className="mb-1 text-center text-sm font-semibold leading-snug text-[#222]">
          {bike.name}
        </p>

        {/* Size */}
        <p className="text-center text-sm font-medium text-[#222]">
          {bike.size}
        </p>

        {/* Price */}
        <p className="mt-1 text-center text-sm font-medium text-[#222]">
          AUD {bike.pricePerDay.toFixed(2)} / day
        </p>

        {/* Bottom row */}
        <div className="mt-auto flex items-end justify-between pt-4">
          {/* Availability text */}
          <span className="text-xs font-medium text-[#E13838]">
            {bike.available} Available
          </span>

          {/* Select button + quantity pill */}
          <div className="flex items-center gap-2">
            <span
              className={`
                inline-flex items-center justify-center rounded-md px-4 py-[6px]
                text-sm font-medium shadow-[0_4px_1px_rgba(0,0,0,0.25)]
                ${isSelected ? "bg-[#E13838] text-white" : "bg-[#F86D6D] text-white hover:bg-[#e45555]"}
              `}
            >
              {isSelected ? "Selected" : "Select"}
            </span>

            {/* For now this just mirrors the available count;
               later you can swap this to "quantity selected" */}
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#D4D4D4] text-sm font-medium text-[#333]">
              {bike.available}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default BikeCard;
