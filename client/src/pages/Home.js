import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Popup from "../components/popup";
import { useNavigate } from "react-router-dom";


function Home() {
  const [flights, setFlights] = useState([]);

  // 🔍 Filter States
  const [search, setSearch] = useState("");
  const [departureFilter, setDepartureFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");

  useEffect(() => {
    fetchFlights();
  }, []);

  const navigate = useNavigate();
  const fetchFlights = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/flights"
      );
      setFlights(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const location = useLocation();
  const [popup, setPopup] = useState({
    message: location.state?.message || "",
    type: "success"
  });

  const handleBooking = async (flightId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/bookings/book",
        {
          flightId,
          seatNumber: "A1"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPopup({
        message: "Flight booked successfully!",
        type: "success"
      });

      fetchFlights();

    } catch (error) {
      setPopup({
        message: error.response?.data || "Booking failed",
        type: "error"
      });
    }
  };

  // 🔎 Filter Logic
  const filteredFlights = flights
    .filter((flight) =>
      flight.airline.toLowerCase().includes(search.toLowerCase())
    )
    .filter((flight) =>
      flight.departureCity.toLowerCase().includes(departureFilter.toLowerCase())
    )
    .filter((flight) =>
      flight.destinationCity.toLowerCase().includes(destinationFilter.toLowerCase())
    );

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Search Flights</h2>

      {/* 🔍 Filter Section */}
      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by airline..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by departure city"
            value={departureFilter}
            onChange={(e) => setDepartureFilter(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by destination city"
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
          />
        </div>
      </div>
<h2 className="mb-4">Available Flights</h2>
{/* 🛫 Flights List */}
{filteredFlights.length === 0 ? (
  <div className="text-center mt-5">
    <h4 style={{ color: "white" }}>✈ No flights found</h4>
    <p style={{ color: "lightgray" }}>
      Try adjusting your search or filters.
    </p>
  </div>
) : (
  filteredFlights.map((flight) => (
    <div key={flight._id} className="card mb-3 p-3">
      <h5>{flight.airline}</h5>
      <p>
        {flight.departureCity} → {flight.destinationCity}
      </p>
      <p>Price: ${flight.price}</p>
      <p>Seats Left: {flight.availableSeats}</p>

      <button
        className="btn btn-primary"
        onClick={() => navigate(`/select-seat/${flight._id}`)}>
        Book
      </button>
    </div>
  ))
)}


      {/* 📌 Popup */}
      <Popup
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ message: "", type: "" })}
      />
    </div>
  );
}

export default Home;
