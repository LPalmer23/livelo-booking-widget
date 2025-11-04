import { createContext, useContext, useState, ReactNode } from "react";

// Define the types
type BookingType = "rent" | "tour" | null;

interface Booking {
  bookingType: BookingType;
  email: string;
  startDate?: string;
  endDate?: string;
  size?: string;
  category?: string;
  total?: number;
}

interface BookingContextType {
  booking: Booking;
  setBooking: (data: Partial<Booking>) => void;
  clearBooking: () => void;
}

// Create the context
const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Provider component
export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [booking, setBookingState] = useState<Booking>({
    bookingType: null,
    email: "",
  });

  const setBooking = (data: Partial<Booking>) =>
    setBookingState((prev) => ({ ...prev, ...data }));

  const clearBooking = () =>
    setBookingState({ bookingType: null, email: "" });

  return (
    <BookingContext.Provider value={{ booking, setBooking, clearBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook for easy access
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
