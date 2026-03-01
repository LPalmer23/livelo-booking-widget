import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import StepProgressBar from "../components/layout/StepProgressBar";

export default function TourBooking() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <StepProgressBar currentStep={2} />
      <div className="flex flex-col items-center justify-center text-center mt-10">
        <h1 className="text-3xl font-semibold">Tour Booking Page</h1>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-8 px-6 py-2 rounded-md border border-gray-400 text-sm text-gray-700 hover:bg-gray-50"
        >
          ← Back
        </button>
      </div>
    </PageWrapper>
  );
}
  