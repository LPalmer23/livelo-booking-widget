// src/components/layout/PageWrapper.tsx
import React from "react";
import StepProgressBar from "./StepProgressBar";

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* Header / Progress Section */}
      <header className="border-b border-gray-200 py-6">
        <StepProgressBar />
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 py-8">
        {children}
      </main>
    </div>
  );
}
