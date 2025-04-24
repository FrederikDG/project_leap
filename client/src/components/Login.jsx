import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom"; // Import Link for navigation
import "../styles/Login.css"; // Assuming you have a CSS file for styling
export default function Login() {
  const [user, setUser] = useState({ username: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(user.username, user.password);
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login__container">
      <form onSubmit={handleSubmit}>
        <input value={user.username} onChange={(e) => setUser((u) => ({ ...u, username: e.target.value }))} placeholder="Username" required />
        <input
          type="password"
          value={user.password}
          onChange={(e) => setUser((u) => ({ ...u, password: e.target.value }))}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don’t have an account? <Link to="/register">Register here</Link>
      </p>
      <div className="login__image">
        <img className="logo leap login__logo" src="./leap.svg" alt="Login Illustration" />
      </div>
    </div>
  );
}
