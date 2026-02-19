import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Popup from "../components/popup";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/bookings/my",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setBookings(res.data);

    } catch (error) {
      console.log(error);
    }
  };

 const location = useLocation();

const [popup, setPopup] = useState({
  message: location.state?.message || "",
  type: location.state?.message ? "success" : ""
});

  const handleCancel = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/bookings/cancel/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPopup({
  message: "Booking cancelled successfully",
  type: "success"
});

      fetchBookings();

    } catch (error) {
      setPopup({
  message: "Booking cancel failed",
  type: "error"
});

    }
  };

 return (
  <div className="container mt-5">
    <h2 className="mb-4">My Bookings</h2>

    {bookings.length === 0 && (
      <p className="text-white">No bookings yet.</p>
    )}

    {bookings.map((booking) => (
      <div key={booking._id} className="card mb-3 p-3">

        {booking.flight ? (
          <>
            <h5>{booking.flight.airline}</h5>
            <p>
              {booking.flight.departureCity} → {booking.flight.destinationCity}
            </p>
          </>
        ) : (
          <h5 className="text-danger">Flight Deleted</h5>
        )}

        <p>Seat: {booking.seatNumber}</p>

        <button
          className="btn btn-danger"
          onClick={() => handleCancel(booking._id)}
        >
          Cancel
        </button>

      </div>
    ))}
    <Popup
  message={popup.message}
  type={popup.type}
  onClose={() => setPopup({ message: "", type: "" })}
/>

  </div>
);

}

export default MyBookings;
