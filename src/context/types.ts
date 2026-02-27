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
  cartItems: Array<{
    id: string;
    name: string;
    size: string;
    pricePerDay: number;
    quantity: number;
    accessories: Array<{
      id: string;
      name: string;
      option: string | null;
      pricePerDay: number;
      quantity: number;
    }>;
  }>;
}
