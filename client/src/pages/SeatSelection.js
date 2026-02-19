import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Popup from "../components/popup";

function SeatSelection() {
  const { flightId } = useParams();
  const navigate = useNavigate();

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [popup, setPopup] = useState({ message: "", type: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBookedSeats();
  }, []);

  const fetchBookedSeats = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/bookings/seats/${flightId}`
      );
      setBookedSeats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirm = async () => {
    if (!selectedSeat) {
      setPopup({ message: "Please select a seat", type: "error" });
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/bookings/book",
        {
          flightId,
          seatNumber: selectedSeat
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate("/my-bookings", {
        state: { message: "Flight booked successfully!" }
      });

    } catch (error) {
      setPopup({
        message: error.response?.data || "Booking failed",
        type: "error"
      });
    }
  };

  // Generate seat grid (A–J, 6 seats each side with aisle)
  const rows = 10;
  const seatsPerSide = 3;

  const renderSeats = () => {
    const seatRows = [];

    for (let r = 0; r < rows; r++) {
      const rowLetter = String.fromCharCode(65 + r);
      const rowSeats = [];

      for (let s = 1; s <= seatsPerSide * 2; s++) {
        const seatNumber = `${rowLetter}${s}`;
        const isBooked = bookedSeats.includes(seatNumber);

        rowSeats.push(
          <button
            key={seatNumber}
            disabled={isBooked}
            onClick={() => setSelectedSeat(seatNumber)}
            className={`seat-btn ${
              isBooked
                ? "booked"
                : selectedSeat === seatNumber
                ? "selected"
                : "available"
            }`}
          >
            {seatNumber}
          </button>
        );

        if (s === seatsPerSide) {
          rowSeats.push(<div key={`gap-${r}`} className="aisle"></div>);
        }
      }

      seatRows.push(
        <div key={r} className="seat-row">
          {rowSeats}
        </div>
      );
    }

    return seatRows;
  };

  return (
    <div className="container mt-5 text-center">
      <h2>Select Your Seat</h2>

    <div className="plane-wrapper mt-4">
    <div className="plane-body"></div>

    <div className="seat-overlay">
        {renderSeats()}
    </div>

      <Popup
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ message: "", type: "" })}
      />
    </div>
    <div className="mt-4">
  <button
    className="btn btn-primary me-3"
    onClick={handleConfirm}
  >
    Confirm Booking
  </button>

  <button
    className="btn btn-secondary"
    onClick={() => navigate("/")}
  >
    Cancel
  </button>
</div>

</div>

  );
}

export default SeatSelection;
