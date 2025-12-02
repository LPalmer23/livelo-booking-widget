// src/components/booking/BikeList.tsx
import React from "react";
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
  if (!bikes.length) {
    return (
      <p className="text-sm text-[#777]">
        No bikes match the selected filters.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {bikes.map((bike) => (
        <BikeCard
          key={bike.id}
          bike={bike}
          isSelected={bike.id === selectedBikeId}
          onSelect={onSelectBike}
        />
      ))}
    </div>
  );
};

export default BikeList;
export type { Bike };
