// src/context/BookingContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

export type BookingType = "rent" | "tour" | null;

export interface BookingState {
  email: string;
  isEmailVerified: boolean;
  bookingType: BookingType;

  // NEW fields used on BikeBooking page
  startDate: string | null;
  endDate: string | null;
  size: string | null;          // e.g. "54cm", "Medium"
  category: string | null;      // e.g. "Road", "Mountain"
  selectedBikeId: string | null;
}

interface BookingContextValue {
  booking: BookingState;
  setBooking: (updates: Partial<BookingState>) => void;
}

const BookingContext = createContext<BookingContextValue | undefined>(
  undefined
);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [booking, setBookingState] = useState<BookingState>({
    email: "",
    isEmailVerified: false,
    bookingType: null,

    // NEW fields default values
    startDate: null,
    endDate: null,
    size: null,
    category: null,
    selectedBikeId: null,
  });

  const setBooking = (updates: Partial<BookingState>) => {
    setBookingState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <BookingContext.Provider value={{ booking, setBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextValue => {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return ctx;
};
