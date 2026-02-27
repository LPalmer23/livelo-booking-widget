import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_LIVELO_API_BASE_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // Needed for auth-cookie flows on same domain or app-proxy.
  withCredentials: true,
});

export type AvailableVariant = {
  variant_id?: number;
  product_variant_id?: number;
  variant_value?: string;
  in_stock?: boolean;
  base_price?: number;
  [key: string]: unknown;
};

export type OrderPayload = {
  total: number;
  sub_total: number;
  tax: number;
  shipping: number;
  discount: number;
  currency: string;
  city_slug?: string;
  payment_intent: string;
  payment_method: string;
  phone_number?: string;
  is_delivery: boolean;
  delivery_address?: Record<string, unknown>;
  event_id?: number | null;
};

export type OrderItemPayload = {
  product_id: number;
  product_variant_id: number;
  currency: string;
  sub_total: number;
  start_date: string;
  end_date: string;
  product_options?: Record<string, unknown>;
  rider_profile?: Record<string, unknown>;
  product_link?: string;
  image?: string;
  product_title?: string;
};

export async function getAvailableVariants(params: {
  productId: number;
  locationId: number;
  startDate: string;
  endDate: string;
}) {
  const { productId, locationId, startDate, endDate } = params;
  const response = await apiClient.get<AvailableVariant[]>(
    `/api/variants/${productId}`,
    {
      params: {
        location_id: locationId,
        start_date: startDate,
        end_date: endDate,
      },
    }
  );
  return response.data;
}

export async function createStripePaymentIntent(params: {
  amount: number;
  currency: string;
}) {
  const response = await apiClient.post("/api/stripe-payment-intent", params);
  return response.data;
}

export async function createOrder(params: {
  order: OrderPayload;
  orderItems: OrderItemPayload[];
}) {
  const response = await apiClient.post("/api/order", params);
  return response.data;
}

export default apiClient;
