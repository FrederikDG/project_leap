import React, { useState } from "react";
import "../styles/ChannelContainer.css";
import DataContainer from "./DataContainer";

const ChannelContainer = ({
  logo,
  name,
  previousImpressions,
  currentImpressions,
  CPM,
  YoY,
  Benchmark,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(open => !open);

  return (
    <div className={`channel__container${isOpen ? " open" : ""}`}>
      <div className="channel__stats__container">
        <div className="channel__title__container">
          {logo && (
            <img
              className="channel__logo"
              src={logo}
              alt={`${name} logo`}
            />
          )}
          <h4>{name}</h4>
        </div>
        <div className="channel__impressions">
          <img
            src={
              Number(previousImpressions) > Number(currentImpressions)
                ? "/IMPRESSIONS_TRIANGLE_BAD.svg"
                : "/IMPRESSIONS_TRIANGLE_GOOD.svg"
            }
            alt="Impressions Triangle"
          />
          <p>{currentImpressions}</p>
        </div>
        <p className="channel__cpm">{CPM}</p>
        <p className="channel__yoy">{YoY}</p>
        <p className="channel__benchmark">{Benchmark}</p>
        <button className="channel__button" onClick={handleToggle}>
          {isOpen ? "Close" : "Expand"}
        </button>
      </div>

      <div className="channel__data__container">
        <DataContainer title="working media" data="$634,006" />
        <DataContainer title="total spent so far" data="$190,201" />
        <DataContainer title="percentage spent" data="30%" />
        <DataContainer title="launch date" data="03/02/2025" />
        <DataContainer title="end date" data="05/23/2023" />
        <DataContainer title="flight duration" data="65 days" />
      </div>
    </div>
  );
};

export default ChannelContainer;
