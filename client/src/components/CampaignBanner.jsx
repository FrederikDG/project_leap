import React from "react";
import "../styles/CampaignBanner.css";
import { Link } from "react-router-dom";
import StateFlag from "./StateFlag";
const CampaignBanner = ({ title, link, color }) => {
  return (
    <Link to={link} className="overview__banner">
      <img className="banner__arrow" src="./GO_ARROW.svg" alt="GO" />
      <div className="flag__container">
        <StateFlag type="state" name="campaign" state="active" color={color}/>
        <StateFlag type="count" name="flight" count="3" />
      </div>
      <h2 className="banner__title">{title}</h2>
    </Link>
  );
};

export default CampaignBanner;
