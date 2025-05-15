// client/src/components/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api.js";
import "../styles/Register.css"; // Assuming you have a CSS file for styling
import Button from "../components/Button.jsx"; // Import the Button component

export default function Register() {
  const [user, setUser] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", {
        username: user.username,
        password: user.password,
      });
      // on success, send them to login
      navigate("/login");
    } catch (err) {
      // show any error returned by the server
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="register">
      <div className="register__header">
        <Button type="text" text="Already have an account?" onClick={() => navigate("/login")} />
      </div>
      <div className="register__container">
        <form onSubmit={handleSubmit}>
          <div className="textfield__container">
          <input
            className="register__textfield"
            value={user.username}
            onChange={(e) => setUser((u) => ({ ...u, username: e.target.value }))}
            placeholder="Username"
            required
          /><input
            className="register__textfield register__textfield--password"
            type="password"
            value={user.password}
            onChange={(e) => setUser((u) => ({ ...u, password: e.target.value }))}
            placeholder="Password"
            required
          />
          <input
            className="register__textfield"
            value={user.email}
            onChange={(e) => setUser((u) => ({ ...u, email: e.target.value }))}
            placeholder="Email"
            required
          />
          </div>
          <Button animationTrigger="hover" image="./LOGIN_ARROW.svg" onClick={handleSubmit} />
        </form>
      </div>
    </div>
  );
}
