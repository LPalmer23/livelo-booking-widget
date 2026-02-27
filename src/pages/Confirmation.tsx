import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import StepProgressBar from "../components/layout/StepProgressBar";

export default function Confirmation() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <StepProgressBar currentStep={6} />
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
        <p>Your order has been confirmed.</p>

        <button
          type="button"
          onClick={() => navigate("/order-summary")}
          className="mt-8 px-6 py-2 rounded-md border border-gray-400 text-sm text-gray-700 hover:bg-gray-50"
        >
          ← Back
        </button>
      </div>
    </PageWrapper>
  );
}