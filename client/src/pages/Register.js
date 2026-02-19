import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      alert("Registration successful");
      navigate("/login");

    } catch (error) {
      alert(error.response?.data || "Registration failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="login-card p-4 mx-auto" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Register</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="form-control mb-3"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-control mb-3"
            value={form.email}
            onChange={handleChange}
            required
          />

<div className="mb-3 position-relative">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    className="form-control pe-5"
    value={form.password}
    onChange={handleChange}
    required
  />

  <button
    type="button"
    className="show-btn"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>



          <button className="btn btn-primary w-100">
            Register
          </button>
        </form>
        <div className="text-center mt-3">
  <span className="text-light">
    Already a user?{" "}
    <span
      className="text-primary"
      style={{ cursor: "pointer", fontWeight: "500" }}
      onClick={() => navigate("/login")}
    >
      Back to Login
    </span>
  </span>
</div>

      </div>
    </div>
  );
}

export default Register;
