// BookingType is already fine
export type BookingType = "rent" | "tour" | null;

export interface BookingState {
  // Email / profile
  email: string;
  isEmailVerified: boolean;

  // What flow they chose
  bookingType: BookingType;

  // Booking details (used on BikeBooking page)
  startDate: string | null;
  endDate: string | null;
  size: string | null;
  category: string | null;
  selectedBikeId: string | null;
}
