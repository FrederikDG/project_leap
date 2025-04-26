import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import "../styles/Navigation.css";
import CompanyMenu from "./CompanyMenu.jsx";
const Navigation = ({ onEditClick }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      
      await fetch("/logout", {
        method: "POST",
        credentials: "include",            
        headers: { "Content-Type": "application/json" },
      });

      
      logout();

      
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="nav">
      <div className="nav__container">
        <button className="text__button" onClick={handleLogout}>
          <img src="./BUTTON_ARROW.svg" alt="BUTTON_ARROW" />
          Log out
        </button>

        <img className="logo" src="./LEAP.svg" alt="LEAP" />
<CompanyMenu/>
      </div>
    </nav>
  );
};

export default Navigation;
