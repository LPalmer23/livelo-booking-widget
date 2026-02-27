import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import EmailVerification from "./pages/EmailVerification";
import BikeBooking from "./pages/BikeBooking";
import Accessories from "./pages/Accessories";
import Delivery from "./pages/Delivery";
import OrderSummary from "./pages/OrderSummary";
import Confirmation from "./pages/Confirmation";
import TourBooking from "./pages/TourBooking";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<EmailVerification />} />
      <Route path="/bike-booking" element={<BikeBooking />} />
      <Route path="/accessories" element={<Accessories />} />
      <Route path="/delivery" element={<Delivery />} />
      <Route path="/order-summary" element={<OrderSummary />} />
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path="/tour-booking" element={<TourBooking />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
