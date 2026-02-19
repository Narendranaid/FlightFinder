import { useEffect, useState } from "react";
import axios from "axios";
import Popup from "../components/popup";
import { useLocation } from "react-router-dom";

function AdminDashboard() {
  const [flights, setFlights] = useState([]);
  const [newFlight, setNewFlight] = useState({
    airline: "",
    departureCity: "",
    destinationCity: "",
    price: "",
    availableSeats: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    const res = await axios.get("http://localhost:5000/api/flights");
    setFlights(res.data);
  };

    const location = useLocation();
    const [popup, setPopup] = useState({
    message: location.state?.message || "",
    type: "success"
    });


  const handleAddFlight = async () => {
    await axios.post(
      "http://localhost:5000/api/flights/add",
      newFlight,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNewFlight({
      airline: "",
      departureCity: "",
      destinationCity: "",
      price: "",
      availableSeats: ""
    });

    fetchFlights();
  };

  const handleDeleteFlight = async (id) => {
    const confirmDelete = window.confirm("Delete this flight?");
    if (!confirmDelete) return;

    await axios.delete(
      `http://localhost:5000/api/flights/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchFlights();
  };

  return (
    <div className="container-fluid bg-dark text-white min-vh-100 p-4" style={{background: "linear-gradient(135deg, #1f2937, #111827)"}}>

      <h2 className="mb-4 fw-bold">✈ Admin Dashboard</h2>

      {/* Stats Section */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="admin-card bg-primary text-white shadow p-3">
            <h5>Total Flights</h5>
            <h3>{flights.length}</h3>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card bg-success text-white shadow p-3">
            <h5>System Status</h5>
            <h4>Active</h4>
          </div>
        </div>
      </div>

   {/* Add Flight Form (Centered) */}
<div className="row justify-content-center mb-5">
  <div className="col-md-6 col-lg-5">
    <div className="card bg-secondary bg-opacity-75 border-0 p-4 shadow-lg">
      <h4 className="mb-4 text-center">Add New Flight</h4>

      <input
        className="form-control mb-3"
        placeholder="Airline"
        value={newFlight.airline}
        onChange={(e) =>
          setNewFlight({ ...newFlight, airline: e.target.value })
        }
      />

      <input
        className="form-control mb-3"
        placeholder="Departure City"
        value={newFlight.departureCity}
        onChange={(e) =>
          setNewFlight({ ...newFlight, departureCity: e.target.value })
        }
      />

      <input
        className="form-control mb-3"
        placeholder="Destination City"
        value={newFlight.destinationCity}
        onChange={(e) =>
          setNewFlight({ ...newFlight, destinationCity: e.target.value })
        }
      />

      <input
        type="number"
        className="form-control mb-3"
        placeholder="Price"
        value={newFlight.price}
        onChange={(e) =>
          setNewFlight({ ...newFlight, price: e.target.value })
        }
      />

      <input
        type="number"
        className="form-control mb-4"
        placeholder="Available Seats"
        value={newFlight.availableSeats}
        onChange={(e) =>
          setNewFlight({ ...newFlight, availableSeats: e.target.value })
        }
      />

      <button
        className="btn btn-success w-100"
        onClick={handleAddFlight}
      >
        Add Flight
      </button>
    </div>
  </div>
</div>

      {/* Flights Table */}
      <div className="card bg-dark shadow p-4">
        <h4 className="mb-3">All Flights</h4>

        <div className="table-responsive">
          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th>Airline</th>
                <th>Route</th>
                <th>Price</th>
                <th>Seats</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {flights.map((flight) => (
                <tr key={flight._id}>
                  <td>{flight.airline}</td>
                  <td>
                    {flight.departureCity} → {flight.destinationCity}
                  </td>
                  <td>${flight.price}</td>
                  <td>{flight.availableSeats}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteFlight(flight._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    <Popup message={popup.message} type={popup.type} onClose={() => setPopup({ message: "", type: "" })}/>
    </div>
  );
}

export default AdminDashboard;
