---
name: Booking Flow Checklist
overview: A simple checklist to get the full booking flow working, from setup to testing.
todos: []
isProject: false
---

# Booking Flow Checklist

A step-by-step list to get the full booking flow working.

---

## 0. Get API Keys and Access (Before You Start)

**Ask Peter for:**

- **Google Maps API key** — For address autocomplete on the Delivery page. Needs Geocoding + Places APIs enabled.
- **livelo2.0 API URL** — The real backend URL (e.g. `https://api.livelo.bike` or staging URL).
- **Stripe keys** — Test publishable and secret keys if you don't have them yet.

---

## 1. Add Your Stripe Keys

**Backend** — Edit `mock-backend/.env`:

- Replace `sk_test_YOUR_NEW_KEY_HERE` with your real Stripe **secret** key (starts with `sk_test_`)
- Keep `PORT=3000`

**Frontend** — Edit `.env` at the project root:

- Replace `pk_test_YOUR_PUBLISHABLE_KEY` with your real Stripe **publishable** key (starts with `pk_test_`)
- Keep `VITE_LIVELO_API_BASE_URL=http://localhost:3000`

**Note:** Secret key stays in the backend only. Publishable key is safe in the frontend.

---

## 2. Start the Backend

Open a terminal and run:

```
cd livelo-booking-widget-1/mock-backend
npm install
npm run dev
```

You should see: `Mock backend running on http://localhost:3000`

**Check it works:** Open [http://localhost:3000/health](http://localhost:3000/health) in your browser. You should see `{"ok":true}`.

---

## 3. Start the Frontend

Open a **new** terminal (keep the backend running) and run:

```
cd livelo-booking-widget-1
npm run dev
```

You should see: `Local: http://localhost:5173/`

---

## 4. Test the Full Flow

Open [http://localhost:5173](http://localhost:5173) in your browser and go through each step:


| Step                 | What to do                                                                                                |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| **1. Email**         | Enter any email and click Validate. Then click "Rent Bikes".                                              |
| **2. Dates**         | Pick a start and end date.                                                                                |
| **3. Bike**          | Click "Add" on one or more bikes. Click "Next".                                                           |
| **4. Accessories**   | (Optional) Select accessories for each bike. Click "Next".                                                |
| **5. Delivery**      | Enter any address. Choose receive/return options. Click "Next".                                           |
| **6. Order Summary** | Check the totals. Enter card: `4242 4242 4242 4242`, any future expiry, any 3-digit CVC. Click "Pay Now". |
| **7. Confirmation**  | You should see "Thank you!" and the backend terminal should log `ORDER RECEIVED`.                         |


---

## 5. If Something Fails


| Problem             | Fix                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------ |
| White screen        | Check the browser console (F12) for errors.                                                |
| Payment fails       | Make sure both backend and frontend are running. Check that your Stripe keys are correct.  |
| Totals show 0.00    | Pick dates on the bike page and add at least one bike.                                     |
| Backend won't start | Make sure port 3000 is free. Check that `STRIPE_SECRET_KEY` in `mock-backend/.env` is set. |
| No Stripe form      | Add `VITE_STRIPE_PUBLISHABLE_KEY` to `.env` at the project root.                           |


---

## Quick Reference

**Two terminals, both running:**

- Terminal A: `cd mock-backend && npm run dev` (backend on port 3000)
- Terminal B: `cd livelo-booking-widget-1 && npm run dev` (frontend on port 5173)

**Test card:** `4242 4242 4242 4242`

---

## 6. Switch from Mock Backend to Real livelo2.0 backend

**When you have the livelo2.0 URL from Peter:**

1. **Stop the mock backend** — You can close that terminal or leave it; the frontend will call the real API instead.
2. **Edit `.env**` at the project root:
  - Change `VITE_LIVELO_API_BASE_URL` from `http://localhost:3000` to the livelo2.0 URL (e.g. `https://api.livelo.bike`).
3. **Restart the frontend** — Stop `npm run dev` and run it again so it picks up the new `.env` value.
4. **Add Google API key** (optional):
  - Add `VITE_GOOGLE_MAPS_API_KEY=...` to `.env` (get from Peter).
  - Restart the frontend.
  - Address autocomplete on the Delivery page will work.

**Note:** livelo2.0 must allow CORS for your frontend URL. Orders created through the widget will show up in **adminlivelo2.0**. The mock backend is only for local testing.

---

Please reach out if you're confused about something. I will try my best to get back to you within the day or next. Lydia Palmer. Email: [lapalmer@bu.edu](mailto:lapalmer@bu.edu). Phone: +1 609-937-2318