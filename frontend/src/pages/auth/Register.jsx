import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../store/authSlice";
import "./Register.css";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [customError, setCustomError] = useState("");

  // Redirect after successful registration/login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/userhome", { replace: true }); // replace to prevent back navigation
    }
  }, [isAuthenticated, navigate]);

  // Handle back button on Register page
  useEffect(() => {
    const handlePopState = () => {
      navigate("/", { replace: true }); // go to PublicHome on back
    };

    if (!isAuthenticated) {
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isAuthenticated, navigate]);

  // Show backend error
  useEffect(() => {
    if (error) setCustomError(error.message);
  }, [error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setCustomError(""); // clear error on typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(registerUser(formData));
    // Redirect handled by useEffect
  };

  return (
    <div className="register-container d-flex flex-column align-items-center mt-5">
      <h2 className="mb-4">Register for CodeQuest</h2>
      {customError && <p className="text-danger">{customError}</p>}

      <form onSubmit={handleSubmit} className="d-flex flex-column w-25">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="form-control mb-3"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="form-control mb-3"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="form-control mb-3"
          required
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
