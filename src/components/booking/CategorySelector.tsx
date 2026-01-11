
import React, { useState } from "react";

export interface CategorySelectorProps {
  value?: string | null;
  options: string[];
  onChange: (value: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  options,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const selected = value ?? options[0] ?? "All categories";

  const handleSelect = (opt: string) => {
    onChange(opt);
    setOpen(false);
  };

  return (
    <div className="flex justify-center">
      <div className="relative w-[460px]">
        {/* Trigger box (matches the other fields) */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-[69px] w-full items-center justify-between rounded-[10px] border-[2px] border-[#EAEAEA] bg-white px-4 shadow-[0_4px_1px_rgba(0,0,0,0.25)] text-left"
        >
          <span className="text-sm text-[#222222]">{selected}</span>

          {/* MAKE SURE pointer-events-none IS HERE */}
          <span className="pointer-events-none text-lg leading-none text-[#555555]">
            ⌄
          </span>
        </button>


        {/* Dropdown menu */}
        {open && (
          <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-[10px] border border-[#EAEAEA] bg-white shadow-[0_4px_8px_rgba(0,0,0,0.15)] z-10">
            {options.map((opt) => {
              const isActive = opt === selected;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={`flex w-full items-center justify-between px-4 py-2 text-sm text-[#222222] hover:bg-[#F5F5F5] ${
                    isActive ? "bg-[#F0F7FF]" : ""
                  }`}
                >
                  <span>{opt}</span>
                  {isActive && (
                    <span className="text-xs text-[#3B82F6]">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySelector;
