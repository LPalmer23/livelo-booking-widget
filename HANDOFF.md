# Livelo Booking Widget — Intern Summary

## Project Overview

The Livelo Booking Widget is a React app that lets customers book bike rentals. It will be embedded in Shopify store pages via iframe. The widget talks to **livelo2.0** (API backend) and orders show up in **adminlivelo2.0**.

**Flow:** Email → Bike Selection → Accessories → Delivery → Order Summary (Payment) → Confirmation

---

## What’s Done

| Area | Status | Notes |
|------|--------|-------|
| Email verification | Done | Step 1 |
| Bike selection | Done | Mock inventory when no API; live API when `productId` + `locationId` in URL |
| Accessories | Done | Mock accessories; per-bike selection |
| Delivery | Done | Address input, Google autocomplete (needs API key), fake 5 km + $10 delivery/collect |
| Order summary | Done | Stripe checkout wired; order creation calls livelo2.0 |
| Confirmation | Done | Basic success page |
| Step progress bar | Done | Shows current step |
| Green selection styling | Done | Bike cards, accessory cards, delivery options use `#57B560` |
| Back/Next buttons | Done | Same size, square style |
| Delivery validation | Bypassed | `canContinue = true` for demo |

---

## What You Must Do

### 1. Get API Access

Ask your manager for:

- **Google Maps API key** — Geocoding + Places (for address autocomplete)
- **livelo2.0 API URL** — Base URL for variants, Stripe, orders
- **Stripe publishable key** — Test or live
- **Guest order flow** — livelo2.0 `/api/order` needs auth today; widget runs in iframe on Shopify, so you need either a guest order endpoint or Auth0 login before checkout

Add to `.env`:

```
VITE_LIVELO_API_BASE_URL=https://...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_GOOGLE_MAPS_API_KEY=...
```

### 2. Fix Order Creation (Critical)

**File:** `src/pages/OrderSummary.tsx`

Current issues:

- `city_slug: undefined` — livelo2.0 requires a valid `city_slug` (FK to `location`). You need `city_slug` from `locationId`.
- Only one order item is sent — `cartItems` can have multiple bikes; only the first is sent.
- No accessories — `cartItems[].accessories` are never sent.
- No delivery data — `accommodationAddress`, `receiveMethod`, `returnMethod`, `receiveTime`, `returnTime` are collected in Delivery but not sent.
- `is_delivery` and `delivery_address` always false/undefined.
- `shipping` is always 0 — delivery/collect fee ($10) is not included.

**Tasks:**

1. Add `GET /api/location/[id]` in livelo2.0 (or use an existing endpoint) that returns `city_slug`.
2. Add `getLocation(locationId)` in `src/utils/api.ts` and call it when you have `locationId`.
3. Store `city_slug` in booking state and pass it into the order payload.
4. Map all `cartItems` to `orderItems` (including accessories in `product_options` or as separate items).
5. Add delivery fields to `BookingState` in `src/context/BookingContext.tsx`: `accommodationAddress`, `receiveMethod`, `returnMethod`, `receiveTime`, `returnTime`.
6. Compute `shipping` from delivery/collect choices (e.g. +$10 when deliver or collect).
7. Set `is_delivery: true` and `delivery_address: { formatted_address: ... }` when appropriate.
8. Compute `total` from cart + accessories + shipping.

### 3. Demo Mode (Optional but Useful)

When APIs are unavailable, add a demo mode so the full flow can run without real APIs:

- **URL param:** `?demo=1` or `?inventory=mock` (mock bikes already partially supported).
- **Behavior:** Use mock data, skip real Stripe and `createOrder`, show a fake success with a mock order ID.
- **Address:** Use plain text input; no Google Maps when API key is missing.

### 4. Shopify Embed

- **Host:** Deploy the widget (e.g. Vercel, Netlify) to a URL like `https://widget.livelo.bike`.
- **Embed snippet:** Documented in README; add iframe to Shopify theme or app block.
- **Product mapping:** Shopify products need `productId` and `locationId` (e.g. via metafields) in the iframe URL.

### 5. CORS and Auth (livelo2.0 Backend)

For the widget to work in Shopify:

- livelo2.0 must allow CORS for the widget domain.
- Order creation must work without Auth0 (guest flow) or users must log in before checkout.

---

## Project Structure

```
src/
├── App.tsx
├── AppRoutes.tsx
├── context/
│   └── BookingContext.tsx    # Global booking state
├── pages/
│   ├── EmailVerification.tsx
│   ├── BikeBooking.tsx
│   ├── Accessories.tsx
│   ├── Delivery.tsx
│   ├── OrderSummary.tsx
│   ├── Confirmation.tsx
│   └── TourBooking.tsx
├── components/
│   ├── booking/             # BikeCard, BikeList, CalendarPicker, etc.
│   ├── accessories/         # AccessoryCard, HelmetAccessoryCard
│   ├── layout/              # PageWrapper, StepProgressBar
│   └── payment/             # StripeCheckout
└── utils/
    ├── api.ts               # livelo2.0 API client
    └── geocode.ts           # Google Maps geocoding + Places autocomplete
```

---

## Related Repos

- **livelo2.0** — Next.js API (variants, orders, Stripe). Widget calls this.
- **adminlivelo2.0** — Admin panel. Orders created by the widget appear here.

---

## How to Run Locally

```bash
npm install
npm run dev
```

Create `.env` from `.env.example`. Add `productId` and `locationId` to the URL for live API, e.g.:

```
http://localhost:5173/?productId=14&locationId=5
```

Use `?inventory=mock` for mock bikes when no API is available.

---

## Key Files to Edit

| File | Purpose |
|------|---------|
| `src/utils/api.ts` | Add `getLocation`, extend `createOrder` payload |
| `src/context/BookingContext.tsx` | Add delivery fields to state |
| `src/pages/OrderSummary.tsx` | Fix order payload, cart items, total, delivery |
| `src/pages/Delivery.tsx` | Persist delivery choices to booking context |
| `src/utils/geocode.ts` | Graceful fallback when Google API key missing |

---

## Quick Wins

1. Add demo mode: bypass APIs when `?demo=1` or `VITE_LIVELO_API_BASE_URL` is empty.
2. Add `city_slug` lookup: fetch location by ID when `locationId` is present.
3. Re-enable delivery validation: remove `canContinue = true` and restore the real logic once delivery data is stored in context.

---

## Questions for Your Manager

1. Do we have livelo2.0 API access? Staging URL?
2. Do we have Stripe test keys?
3. Do we have a Google Maps API key?
4. Is there a guest order flow, or do users need to log in via Auth0?
5. Where will the widget be hosted (domain, platform)?
6. Is there a Shopify store for testing?
