import React, { useContext } from "react";
import { useNavigate, useMatch } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import "../styles/Navigation.css";
import CompanyMenu from "./CompanyMenu.jsx";
import Button from "./Button.jsx";

const Navigation = ({ onEditClick }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // useMatch returns a match object if the current URL fits the pattern
  const isDashboard = useMatch("/dashboard/:campaignSlug");

  const handleLogout = async () => {
    try {
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleBack = () => {
    // go back to previous page
    navigate(-1);
  };

  const handleSettings = () => {
    // either call the passed-in handler or navigate somewhere
    if (onEditClick) {
      onEditClick();
    } else {
      navigate("/settings");
    }
  };

  return (
    <nav className="nav">
      <div className="nav__container">
        {isDashboard ? (
          // on dashboard: show Back
          <Button type="text" onClick={handleBack} text="Back" image="./BUTTON_ARROW.svg" />
        ) : (
          // everywhere else: show Log out
          <Button type="text" onClick={handleLogout} text="Log out" image="./BUTTON_ARROW.svg" />
        )}

        <img className="logo" src="./LEAP.svg" alt="LEAP" />

        {isDashboard ? (
          // on dashboard: show Settings
          <Button type="text" onClick={handleSettings} text="Settings" />
        ) : (
          // everywhere else: show company menu
          <CompanyMenu />
        )}
      </div>
    </nav>
  );
};

export default Navigation;
