import { useLocation } from "react-router-dom";

const steps = [
  { path: "/", label: "Profile" },
  { path: "/bike-booking", label: "Booking" },
  { path: "/tour-booking", label: "Booking" },
  { path: "/accessories", label: "Accessories" },
  { path: "/order-summary", label: "Payment" },
  { path: "/confirmation", label: "Confirmation" },
];

export default function StepProgressBar() {
  const location = useLocation();

  // If on /tour-booking, treat it as same step index as /bike-booking
  const normalizedPath =
    location.pathname === "/tour-booking" ? "/bike-booking" : location.pathname;

  const currentStepIndex = steps.findIndex((s) => s.path === normalizedPath);

  // Deduplicate “Booking” in display (so only shows once)
  const displayedSteps = steps.filter(
    (step, index, arr) =>
      arr.findIndex((s) => s.label === step.label) === index
  );

  return (
    <div className="flex justify-center items-center space-x-4">
      {displayedSteps.map((step, index) => {
        const isActive = index <= currentStepIndex;

        return (
          <div key={step.label} className="flex items-center space-x-2">
            {/* Step Circle */}
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold text-sm transition-all duration-300 ${
                isActive
                  ? "bg-rose-600 text-white shadow-md scale-105"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>

            {/* Step Label */}
            <span
              className={`transition-colors duration-300 ${
                isActive ? "text-rose-600 font-medium" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>

            {/* Connector line */}
            {index < displayedSteps.length - 1 && (
              <div
                className={`w-8 h-[2px] transition-all duration-300 ${
                  index < currentStepIndex ? "bg-rose-600" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
