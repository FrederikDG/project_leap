import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import "../styles/Navigation.css";
import CompanyMenu from "./CompanyMenu.jsx";
import Button from "./Button.jsx";
const Navigation = ({ onEditClick }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      logout();

      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="nav">
      <div className="nav__container">
        <Button type="text" onClick={handleLogout} text="Log out" image="./BUTTON_ARROW.svg"/>
        <img className="logo" src="./LEAP.svg" alt="LEAP" />
        <CompanyMenu />
      </div>
    </nav>
  );
};

export default Navigation;
