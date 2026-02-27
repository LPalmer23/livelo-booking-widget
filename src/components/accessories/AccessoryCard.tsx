import React from "react";

type AccessoryOption = string;

export type Accessory = {
  id: string;
  name: string;
  pricePerDay: number;
  imageSrc: string;
  description: string;
  options: AccessoryOption[];
};

interface AccessoryCardProps {
  accessory: Accessory;
  selectedOption: AccessoryOption | null;
  selectedQuantity: number;
  availableCount: number;
  isDisabled?: boolean;
  isDimmed?: boolean;
  onOpenModal: () => void;
}

const AccessoryCard: React.FC<AccessoryCardProps> = ({
  accessory,
  selectedOption,
  selectedQuantity,
  availableCount,
  isDisabled = false,
  isDimmed = false,
  onOpenModal,
}) => {
  const { name, pricePerDay, imageSrc } = accessory;

  const isSelected = !!selectedOption;

  return (
    <div
      className={[
        "w-[260px] flex-shrink-0 bg-white rounded-xl shadow-md border flex flex-col overflow-hidden transition-opacity",
        isSelected ? "border-[#57B560]" : "border-gray-200",
        isDimmed ? "opacity-50" : "",
      ].join(" ")}
    >

      {/* image */}
      <div className="h-32 bg-gray-100 flex items-center justify-center">
        <img src={imageSrc} alt={name} className="h-full w-full object-cover" />
      </div>

      {/* content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-semibold text-base text-gray-900">{name}</h3>
          <p className="text-xs text-gray-600 mt-1">
            AUD {pricePerDay.toFixed(2)} / Day
          </p>
          {isSelected && (
            <p className="text-[11px] text-[#57B560] mt-1">
              Selected: {selectedOption}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-md border text-sm font-medium ${
              selectedQuantity >= availableCount
                ? "border-[#E13838] text-[#E13838]"
                : "border-[#D4D4D4] text-[#333]"
            }`}
          >
            {selectedQuantity}
          </span>
          <button
            type="button"
            onClick={onOpenModal}
            disabled={isDisabled}
            className={[
              "px-4 py-1.5 rounded-md text-xs font-semibold border",
              isSelected
                ? "bg-white text-[#F9625D] border-[#F9625D]"
                : "bg-[#F9625D] text-white border-[#F9625D] hover:bg-[#f8504a]",
              isDisabled ? "opacity-50 cursor-not-allowed hover:bg-[#F9625D]" : "",
            ].join(" ")}
          >
            {isSelected ? "Edit" : "Select"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessoryCard;
