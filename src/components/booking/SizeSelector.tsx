import React from "react";

interface SizeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const sizes = ["All sizes", "52cm", "54cm", "56cm", "58cm"];

const SizeSelector: React.FC<SizeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-600">Size Selections</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3FB86A]"
      >
        {sizes.map((size) => (
          <option key={size} value={size === "All sizes" ? "" : size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SizeSelector;
