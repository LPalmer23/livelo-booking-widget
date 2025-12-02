import { useNavigate } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";

const BookingChoice: React.FC = () => {
  const navigate = useNavigate();
  const { setBooking } = useBooking();

  const handleSelect = (choice: "rent" | "tour") => {
    setBooking({ bookingType: choice });
    navigate(choice === "rent" ? "/bike-booking" : "/tour-booking");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 mt-10">
      <h2 className="text-2xl font-semibold">What are you booking today?</h2>

      <div className="flex gap-6 mt-4">
        <button
          onClick={() => handleSelect("rent")}
          className="px-10 py-4 rounded-xl bg-gray-600 text-white text-lg font-medium hover:bg-gray-700 transition"
        >
          Rent Bikes
        </button>

        <button
          onClick={() => handleSelect("tour")}
          className="px-10 py-4 rounded-xl bg-gray-600 text-white text-lg font-medium hover:bg-gray-700 transition"
        >
          Book a Tour
        </button>
      </div>
    </div>
  );
};

export default BookingChoice;
