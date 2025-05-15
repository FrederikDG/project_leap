import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom"; // Import Link for navigation
import LoginButton from "../components/Button.jsx"; // Import the LoginButton component
import "../styles/Login.css"; // Assuming you have a CSS file for styling
import Button from "../components/Button.jsx";
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
    <div className="login">
      <div className="login__header">
        <Button type="text" text="Register here" onClick={() => navigate("/register")} />
      </div>
      <div className="login__container">
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="textfield__container">
            <input
              className="login__textfield"
              autoComplete="off"
              value={user.username}
              onChange={(e) => setUser((u) => ({ ...u, username: e.target.value }))}
              placeholder="Username"
              required
            />
            <input
              className="login__textfield login__textfield--password"
              autoComplete="off"
              type="password"
              value={user.password}
              onChange={(e) => setUser((u) => ({ ...u, password: e.target.value }))}
              placeholder="Password"
              required
            />
            <Button animationTrigger="hover" image="./LOGIN_ARROW.svg" onClick={handleSubmit} />
          </div>
        </form>
      </div>
    </div>
  );
}
