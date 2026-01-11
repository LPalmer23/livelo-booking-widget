// src/components/accessories/TourDetailsModal.tsx
import React from "react";
import type { Accessory } from "./AccessoryCard";

export type TourDateRange = {
  startDate: string;
  endDate: string;
};

interface Props {
  accessory: Accessory;
  initialRange: TourDateRange | null;
  onClose: () => void;
  onSave: (range: TourDateRange) => void;
}

const TourDetailsModal: React.FC<Props> = ({
  accessory,
  initialRange,
  onClose,
  onSave,
}) => {
  const [startDate, setStartDate] = React.useState(
    initialRange?.startDate ?? ""
  );
  const [endDate, setEndDate] = React.useState(initialRange?.endDate ?? "");

  const canSave = startDate !== "" && endDate !== "" && startDate <= endDate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">{accessory.name}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          <img
            src={accessory.imageSrc}
            alt={accessory.name}
            className="h-full w-full object-cover rounded-lg"
          />
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {accessory.description}
        </p>

        <div className="space-y-3">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-1">
              Tour start date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-700 mb-1">
              Tour end date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            />
          </div>

          <p className="text-[11px] text-gray-500">
            Later we can validate this against available tour dates from the
            backend.
          </p>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs rounded-md border border-gray-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => {
              if (canSave) {
                onSave({ startDate, endDate });
              }
            }}
            className="px-4 py-2 text-xs rounded-md bg-[#57B560] text-white disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourDetailsModal;
