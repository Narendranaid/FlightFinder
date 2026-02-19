import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!token) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <Link className="navbar-brand fw-bold" to="/">
        ✈ FlightBook
      </Link>

      <div className="ms-auto d-flex gap-2">
        <Link className="btn btn-light btn-sm" to="/">
          Home
        </Link>

        <Link className="btn btn-light btn-sm" to="/my-bookings">
          My Bookings
        </Link>

        {role === "admin" && (
          <Link className="btn btn-warning btn-sm" to="/admin">
            Admin
          </Link>
        )}

        <button className="btn btn-danger btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
