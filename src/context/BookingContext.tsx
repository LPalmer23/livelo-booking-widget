// src/context/BookingContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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
  selectedBikeName: string | null;
  selectedBikeImage: string | null;
  selectedBikePricePerDay: number | null;
  selectedBikeCurrency: string | null;
  productId: number | null;
  locationId: number | null;
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

interface BookingContextValue {
  booking: BookingState;
  setBooking: (updates: Partial<BookingState>) => void;
  addToCart: (item: {
    id: string;
    name: string;
    size: string;
    pricePerDay: number;
  }) => void;
  removeFromCart: (params: { name: string; size: string }) => void;
  addAccessoryToCart: (params: {
    bikeId: string;
    accessory: {
      id: string;
      name: string;
      option: string | null;
      pricePerDay: number;
    };
  }) => void;
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
    selectedBikeName: null,
    selectedBikeImage: null,
    selectedBikePricePerDay: null,
    selectedBikeCurrency: "AUD",
    productId: null,
    locationId: null,
    cartItems: [],
  });

  const setBooking = useCallback((updates: Partial<BookingState>) => {
    setBookingState((prev) => ({ ...prev, ...updates }));
  }, []);

  const addToCart = useCallback((item: {
    id: string;
    name: string;
    size: string;
    pricePerDay: number;
  }) => {
    setBookingState((prev) => {
      return {
        ...prev,
        cartItems: [
          ...prev.cartItems,
          { ...item, quantity: 1, accessories: [] },
        ],
      };
    });
  }, []);

  const removeFromCart = useCallback((params: { name: string; size: string }) => {
    setBookingState((prev) => {
      const index = prev.cartItems.findIndex(
        (cartItem) =>
          cartItem.name === params.name && cartItem.size === params.size
      );
      if (index === -1) return prev;
      const nextItems = [...prev.cartItems];
      nextItems.splice(index, 1);
      return {
        ...prev,
        cartItems: nextItems,
      };
    });
  }, []);

  const addAccessoryToCart = useCallback((params: {
    bikeId: string;
    accessory: {
      id: string;
      name: string;
      option: string | null;
      pricePerDay: number;
    };
  }) => {
    setBookingState((prev) => {
      return {
        ...prev,
        cartItems: prev.cartItems.map((cartItem) => {
          if (cartItem.id !== params.bikeId) {
            return cartItem;
          }

          const existingAccessory = cartItem.accessories.find(
            (acc) => acc.id === params.accessory.id
          );

          if (existingAccessory) {
            return {
              ...cartItem,
              accessories: cartItem.accessories.map((acc) =>
                acc.id === params.accessory.id
                  ? {
                      ...acc,
                      quantity: acc.quantity + 1,
                      option: params.accessory.option,
                    }
                  : acc
              ),
            };
          }

          return {
            ...cartItem,
            accessories: [
              ...cartItem.accessories,
              {
                ...params.accessory,
                quantity: 1,
              },
            ],
          };
        }),
      };
    });
  }, []);

  const contextValue = useMemo(
    () => ({ booking, setBooking, addToCart, removeFromCart, addAccessoryToCart }),
    [booking, setBooking, addToCart, removeFromCart, addAccessoryToCart]
  );

  return (
    <BookingContext.Provider value={contextValue}>
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
