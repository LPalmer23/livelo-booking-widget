import React from "react";

interface SizeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const sizes = ["All sizes", "52cm", "54cm", "56cm", "58cm"];

const SizeSelector: React.FC<SizeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex justify-center">
      <div className="relative flex h-[69px] w-[460px] items-center rounded-[10px] border-[2px] border-[#EAEAEA] bg-white px-4 shadow-[0_4px_1px_rgba(0,0,0,0.25)]">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-[#222222] focus:outline-none appearance-none pr-6"
        >
          {sizes.map((size) => (
            <option key={size} value={size === 'All sizes' ? '' : size}>
              {size}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-4 text-lg leading-none text-[#555555]">
          ⌄
        </span>
      </div>
    </div>
  );  
};

export default SizeSelector;
