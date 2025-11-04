// src/pages/EmailVerification.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";

export default function EmailVerification() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      // Mock email verification — redirect to booking page
      navigate("/bike-booking");
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <PageWrapper>
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Let’s Get Started</h1>
        <p className="text-gray-600 mb-6">
          Enter your email to begin your booking.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-72 focus:ring-2 focus:ring-rose-500 outline-none"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-all duration-200"
          >
            Send Code
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
