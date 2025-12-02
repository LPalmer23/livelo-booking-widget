// src/components/layout/PageWrapper.tsx
import React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center px-4 py-10">
      <div
        className="
          w-full max-w-[1100px]
          min-w-[550px]
          bg-white
          rounded-[10px]
          border border-[#EAEAEA]
          shadow-[0_4px_12px_rgba(0,0,0,0.15)]
          px-10 py-8
        "
      >
        {children}
      </div>
    </div>
  );
}
