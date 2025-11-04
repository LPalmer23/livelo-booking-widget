

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";

// Pages (your real flow)
import EmailVerification from "./pages/EmailVerification";
import BikeBooking from "./pages/BikeBooking";
import Accessories from "./pages/Accessories";
import OrderSummary from "./pages/OrderSummary";
import Confirmation from "./pages/Confirmation";
import TourBooking from "./pages/TourBooking";

export default function App() {
  return (
    <BookingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<EmailVerification />} />   {/* Step 1 */}
          <Route path="/bike-booking" element={<BikeBooking />} /> {/* Step 2 (Rent flow) */}
          <Route path="/tour-booking" element={<TourBooking />} /> {/* Step 2 (Tour flow) */}
          <Route path="/accessories" element={<Accessories />} />   {/* Step 3 */}
          <Route path="/order-summary" element={<OrderSummary />} /> {/* Step 4 */}
          <Route path="/confirmation" element={<Confirmation />} /> {/* Step 5 */}
        </Routes>
      </Router>
    </BookingProvider>
  );
}
