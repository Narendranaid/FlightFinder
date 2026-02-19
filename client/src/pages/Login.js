import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Popup from "../components/popup";
import { useLocation } from "react-router-dom";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [popup, setPopup] = useState({
  message: location.state?.message || "",
  type: "success"});

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "admin") {
        setPopup({message: "login Sucessful. welcome Admin",type: "sucess"});
        navigate("/admin",{state:{message: "login Sucessful. welcome Admin"}});
      } else {
        //setPopup({message: "login Sucessful. welcome",type: "sucess"});
        navigate("/",{state:{message: "login Sucessful. welcome"}});
      }

    } catch (error) {
  setPopup({
    message: error.response?.data || "Login failed",
    type: "error"
  });
}

  };

return (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="card p-4 shadow" style={{ width: "400px" }}>
      <h2 className="text-center mb-4">Login</h2>

      <input
        className="form-control mb-3"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn btn-primary w-100" onClick={handleLogin}>
        Login
      </button>
      <Popup message={popup.message} type={popup.type} onClose={() => setPopup({ message: "", type: "" })}/>
    <div className="text-center mt-3">
  <span className="text-light">
    New user?{" "}
    <span
      className="text-primary"
      style={{ cursor: "pointer" }}
      onClick={() => navigate("/register")}
    >
      Register here
    </span>
  </span>
    </div>
</div>

  </div>
);
}
export default Login;
