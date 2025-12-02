import React from "react";

export interface CalendarPickerProps {
  startDate?: string | null;
  endDate?: string | null;
  onChange: (startDate: string, endDate: string) => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value, endDate ?? "");
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(startDate ?? "", e.target.value);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600">Pick Start Date</label>
        <input
          type="date"
          value={startDate ?? ""}
          onChange={handleStartChange}
          className="w-full h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600">Pick End Date</label>
        <input
          type="date"
          value={endDate ?? ""}
          onChange={handleEndChange}
          className="w-full h-11 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>
    </div>
  );
};

export default CalendarPicker;
