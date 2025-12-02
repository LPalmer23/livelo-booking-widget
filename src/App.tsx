import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";
import EmailVerification from "./pages/EmailVerification";
import BikeBooking from "./pages/BikeBooking";

const App: React.FC = () => {
  return (
    <BookingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<EmailVerification />} />
          <Route path="/bike-booking" element={<BikeBooking />} />
        
        </Routes>
      </Router>
    </BookingProvider>
  );
};

export default App;
