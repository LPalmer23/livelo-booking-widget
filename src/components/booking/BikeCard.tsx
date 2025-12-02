// src/components/booking/BikeCard.tsx
import React from "react";

export interface Bike {
  id: string;
  name: string;
  pricePerDay: number;
  size: string;
  available: number;

  // optional fields:
  imageUrl?: string;
  tags?: string[];
  category?: string;
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
      className={`flex flex-col text-left rounded-[10px] border bg-white shadow-[0_4px_4px_rgba(0,0,0,0.10)] overflow-hidden transition
        ${isSelected ? "border-[#E13838]" : "border-[#EAEAEA]"}`}
    >
      {/* image */}
      <div className="h-40 w-full overflow-hidden bg-[#F3F3F3]">
        <img
          src={bike.imageUrl}
          alt={bike.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* content */}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#333]">{bike.name}</h3>
          <span className="text-sm font-semibold text-[#333]">
            ${bike.pricePerDay}/day
          </span>
        </div>

        {/* tags */}
        {/* Tags */}
        <div className="mt-2 flex flex-wrap gap-1">
          {(bike.tags ?? []).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#F5F5F5] px-2 py-1 text-[10px] font-medium text-[#555]"
            >
              {tag}
            </span>
          ))}
        </div>


        <div className="mt-2 flex items-center justify-between text-xs text-[#555]">
          <span>Size: {bike.size}</span>
          <span>Available: {bike.available}</span>
        </div>

        <div className="mt-3 flex justify-end">
          <span
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              isSelected
                ? "bg-[#E13838] text-white"
                : "bg-[#747474] text-white"
            }`}
          >
            {isSelected ? "Selected" : "Select"}
          </span>
        </div>
      </div>
    </button>
  );
};

export default BikeCard;
