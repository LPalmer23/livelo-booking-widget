import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";
import EmailVerification from "./pages/EmailVerification";
import BikeBooking from "./pages/BikeBooking";
import Accessories from "./pages/Accessories";



const App: React.FC = () => {
  return (
    <BookingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<EmailVerification />} />
          <Route path="/bike-booking" element={<BikeBooking />} />
          <Route path="/accessories" element={<Accessories />} />  
        </Routes>
      </Router>
    </BookingProvider>
  );
};

export default App;
