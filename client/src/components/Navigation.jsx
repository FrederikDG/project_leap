import React from "react";
import "../styles/Navigation.css";
const Navigation = () => {
  return (
    <nav>
        <div className="nav__container">
      <button>log out</button>
      <img className="logo" src="./LEAP.svg" alt="LEAP" />
      <button>edit</button></div>
    </nav>
  );
};

export default Navigation;
