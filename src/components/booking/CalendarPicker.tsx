import React from "react";
import dayjs from "dayjs";

function formatDisplayDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = dayjs(dateStr);
  return d.isValid() ? d.format("ddd, MMM D, YYYY") : "";
}

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

  const startDisplay = formatDisplayDate(startDate) || "Pick start date";
  const endDisplay = formatDisplayDate(endDate) || "Pick end date";

  const boxBase =
    "group flex h-[69px] w-full items-center justify-between rounded-[10px] border-[2px] border-[#EAEAEA] bg-white px-4 shadow-[0_4px_1px_rgba(0,0,0,0.25)] transition-colors hover:border-[#D0D0D0] hover:bg-[#FAFAFA] focus-within:border-[#57B560] focus-within:ring-2 focus-within:ring-[#57B560]/20";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Start date */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wide text-[#555]">
          Start
        </label>
        <div className="relative">
          <div className={boxBase}>
            <span
              className={`text-sm ${
                startDate ? "font-medium text-[#222]" : "text-[#777]"
              }`}
            >
              {startDisplay}
            </span>
            <span className="pointer-events-none flex h-8 w-8 items-center justify-center rounded-md bg-[#F5F5F5] text-[#555] group-hover:bg-[#EBEBEB]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
          </div>
          <input
            type="date"
            value={startDate ?? ""}
            onChange={handleStartChange}
            onClick={(e) => e.currentTarget.showPicker?.()}
            className="absolute inset-0 z-10 cursor-pointer opacity-0"
            aria-label="Start date"
          />
        </div>
      </div>

      {/* End date */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-wide text-[#555]">
          End
        </label>
        <div className="relative">
          <div className={boxBase}>
            <span
              className={`text-sm ${
                endDate ? "font-medium text-[#222]" : "text-[#777]"
              }`}
            >
              {endDisplay}
            </span>
            <span className="pointer-events-none flex h-8 w-8 items-center justify-center rounded-md bg-[#F5F5F5] text-[#555] group-hover:bg-[#EBEBEB]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
          </div>
          <input
            type="date"
            value={endDate ?? ""}
            onChange={handleEndChange}
            onClick={(e) => e.currentTarget.showPicker?.()}
            className="absolute inset-0 z-10 cursor-pointer opacity-0"
            aria-label="End date"
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarPicker;
