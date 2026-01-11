// HelmetAccessoryCard.tsx
import React from "react";
import type { Accessory } from "./AccessoryCard";

type AccessoryOption = string;

interface Props {
  accessory: Accessory;
  selectedOption: AccessoryOption | null;
  onClose: () => void;
  onSave: (option: AccessoryOption) => void;
}

const HelmetAccessoryCard: React.FC<Props> = ({
  accessory,
  selectedOption,
  onClose,
  onSave,
}) => {
  const [tempSelection, setTempSelection] = React.useState<AccessoryOption | null>(
    selectedOption ?? accessory.options[0] ?? null
  );

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

        <p className="text-sm text-gray-600 mb-4">{accessory.description}</p>

        <fieldset>
          <legend className="text-xs font-medium text-gray-700 mb-2">
            Choose an option
          </legend>
          <div className="space-y-2">
            {accessory.options.map((opt) => (
              <label
                key={opt}
                className="flex items-center justify-between border rounded-lg px-3 py-2 cursor-pointer hover:border-gray-400"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`accessory-${accessory.id}`}
                    checked={tempSelection === opt}
                    onChange={() => setTempSelection(opt)}
                  />
                  <span className="text-sm text-gray-800">{opt}</span>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

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
            disabled={!tempSelection}
            onClick={() => {
              if (tempSelection) onSave(tempSelection);
              onClose();
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

export default HelmetAccessoryCard;
