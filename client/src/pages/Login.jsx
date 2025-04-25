import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom"; // Import Link for navigation
import LoginButton from "../components/LoginButton.jsx"; // Import the LoginButton component
import "../styles/Login.css"; // Assuming you have a CSS file for styling
export default function Login() {
  const [user, setUser] = useState({ username: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(user.username, user.password);
      navigate("/overview");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login__container">
      <form onSubmit={handleSubmit}>
        <div className="login__textfield__container">
        <input className="login__textfield" value={user.username} onChange={(e) => setUser((u) => ({ ...u, username: e.target.value }))} placeholder="Username" required />
        <input  className="login__textfield login__textfield--password"
          type="password"
          value={user.password}
          onChange={(e) => setUser((u) => ({ ...u, password: e.target.value }))}
          placeholder="Password"
          required
        />  <LoginButton animationTrigger="hover" image="./LOGIN_ARROW.svg"></LoginButton></div>
    
      </form>
      <p>
        Don’t have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
