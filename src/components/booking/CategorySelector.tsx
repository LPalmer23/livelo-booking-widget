import React from "react";

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
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-600">Categories</label>
      <select
        className="w-full h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelector;
