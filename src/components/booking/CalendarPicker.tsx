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
      {/* Start date box */}
      <div className="flex justify-center">
        <div className="relative w-[460px] h-[69px]">
          {/* Visible styled box */}
          <div className="flex h-full w-full items-center justify-between rounded-[10px] border-[2px] border-[#EAEAEA] bg-white px-4 shadow-[0_4px_1px_rgba(0,0,0,0.25)]">
            <span
              className={`text-sm ${
                startDate ? "text-[#222222]" : "text-[#777777]"
              }`}
            >
              {startDate || "Pick Start Date"}
            </span>
            <span className="pointer-events-none text-lg leading-none text-[#555555]">
              ⌄
            </span>
          </div>
  
          {/* Invisible input ON TOP that actually controls the date */}
          <input
            type="date"
            value={startDate ?? ""}
            onChange={handleStartChange}
            onClick={(e) => e.currentTarget.showPicker?.()}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          />
        </div>
      </div>
  
      {/* End date box */}
      <div className="flex justify-center">
        <div className="relative w-[460px] h-[69px]">
          {/* Visible styled box */}
          <div className="flex h-full w-full items-center justify-between rounded-[10px] border-[2px] border-[#EAEAEA] bg-white px-4 shadow-[0_4px_1px_rgba(0,0,0,0.25)]">
            <span
              className={`text-sm ${
                endDate ? "text-[#222222]" : "text-[#777777]"
              }`}
            >
              {endDate || "Pick End Date"}
            </span>
            <span className="pointer-events-none text-lg leading-none text-[#555555]">
              ⌄
            </span>
          </div>
  
          {/* Invisible input ON TOP */}
          <input
            type="date"
            value={endDate ?? ""}
            onChange={handleEndChange}
            onClick={(e) => e.currentTarget.showPicker?.()}
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          />
        </div>
      </div>
    </div>
  );  
};

export default CalendarPicker;
