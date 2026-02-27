import React from "react";
import { BookingProvider } from "./context/BookingContext";
import AppRoutes from "./AppRoutes";



const App: React.FC = () => {
  return (
    <BookingProvider>
      <AppRoutes />
    </BookingProvider>
  );
};

export default App;
