/**
 * Google Maps Geocoding and distance utilities.
 * Requires VITE_GOOGLE_MAPS_API_KEY in .env
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

/** Reference location: 800 Boylston St, Boston, MA 02199 */
const REFERENCE_LAT = 42.3491;
const REFERENCE_LNG = -71.0825;

export interface GeocodeResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}

export type GeocodeResponse =
  | { ok: true; data: GeocodeResult }
  | { ok: false; error: string };

/**
 * Geocode an address using Google Maps Geocoding API.
 * Returns coordinates and formatted address, or an error message.
 */
export async function geocodeAddress(
  address: string
): Promise<GeocodeResponse> {
  if (!GOOGLE_MAPS_API_KEY) {
    return {
      ok: false,
      error:
        "Google Maps API key not configured. Add VITE_GOOGLE_MAPS_API_KEY to your .env file.",
    };
  }

  const encoded = encodeURIComponent(address.trim());
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === "OK" && data.results?.[0]) {
      const loc = data.results[0].geometry.location;
      return {
        ok: true,
        data: {
          lat: loc.lat,
          lng: loc.lng,
          formattedAddress: data.results[0].formatted_address,
        },
      };
    }

    // Surface the actual Google API error
    if (data.status === "ZERO_RESULTS") {
      return { ok: false, error: "Address not found. Please try a different address." };
    }
    if (data.status === "REQUEST_DENIED") {
      return {
        ok: false,
        error:
          "Geocoding API access denied. Enable the Geocoding API in Google Cloud Console and check your API key.",
      };
    }
    if (data.status === "OVER_QUERY_LIMIT") {
      return { ok: false, error: "API quota exceeded. Please try again later." };
    }
    if (data.status === "INVALID_REQUEST") {
      return { ok: false, error: "Invalid address. Please check and try again." };
    }

    return {
      ok: false,
      error: data.error_message || data.status || "Unable to verify address.",
    };
  } catch (err) {
    console.error("Geocoding error:", err);
    return {
      ok: false,
      error:
        "Could not reach Google Maps. Please check your connection and try again.",
    };
  }
}

/**
 * Calculate distance between two points using Haversine formula.
 * Returns distance in kilometers.
 */
function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get distance in km from the given coordinates to 800 Boylston St, Boston, MA 02199.
 */
export function distanceToLiveloKm(lat: number, lng: number): number {
  return haversineDistanceKm(lat, lng, REFERENCE_LAT, REFERENCE_LNG);
}

export interface PlaceSuggestion {
  placeId: string;
  description: string;
}

/**
 * Fetch address suggestions as the user types (Google Places Autocomplete).
 * Requires Places API to be enabled in Google Cloud Console.
 */
export async function fetchPlaceSuggestions(
  input: string
): Promise<PlaceSuggestion[]> {
  if (!GOOGLE_MAPS_API_KEY) return [];
  const trimmed = input.trim();
  if (trimmed.length < 3) return [];

  const encoded = encodeURIComponent(trimmed);
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encoded}&types=address&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") return [];

    const predictions = data.predictions ?? [];
    return predictions.map((p: { place_id: string; description: string }) => ({
      placeId: p.place_id,
      description: p.description,
    }));
  } catch (err) {
    console.error("Places autocomplete error:", err);
    return [];
  }
}

export type PlaceDetailsResponse =
  | { ok: true; data: GeocodeResult }
  | { ok: false; error: string };

/**
 * Get coordinates and formatted address for a place by its place_id.
 */
export async function getPlaceDetails(
  placeId: string
): Promise<PlaceDetailsResponse> {
  if (!GOOGLE_MAPS_API_KEY) {
    return {
      ok: false,
      error:
        "Google Maps API key not configured. Add VITE_GOOGLE_MAPS_API_KEY to your .env file.",
    };
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=geometry,formatted_address&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === "OK" && data.result?.geometry?.location) {
      const loc = data.result.geometry.location;
      return {
        ok: true,
        data: {
          lat: loc.lat,
          lng: loc.lng,
          formattedAddress: data.result.formatted_address ?? "",
        },
      };
    }

    if (data.status === "REQUEST_DENIED") {
      return {
        ok: false,
        error:
          "Places API access denied. Enable the Places API in Google Cloud Console.",
      };
    }

    return {
      ok: false,
      error: data.error_message || data.status || "Could not get address details.",
    };
  } catch (err) {
    console.error("Place details error:", err);
    return {
      ok: false,
      error: "Could not reach Google Maps. Please check your connection.",
    };
  }
}
