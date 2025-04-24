import React from "react";
import "../styles/OverviewBanner.css";
import { Link } from "react-router-dom";
const OverviewBanner = ({ title, link }) => {
  return (
    <Link to={link} className="overview__banner">
    
        <h2>{title}</h2>
     
    </Link>
  );
};

export default OverviewBanner;
