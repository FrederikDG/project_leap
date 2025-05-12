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
  budget,
  spent,
  startDate,
  endDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
        const percentageSpent = ((spent / budget) * 100).toFixed(0);
        const start = new Date(startDate);
        const end = new Date(endDate);
        const flightDuration = !isNaN(start) && !isNaN(end)
          ? Math.ceil((end - start) / (1000 * 60 * 60 * 24))
          : "N/A";

  const handleToggle = () => setIsOpen(open => !open);

  // Helper function to format numbers with commas
  const formatNumber = (num) => {
    if (num === undefined || num === null) return num;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

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
          <p>{formatNumber(currentImpressions)}</p>
        </div>
        <p className="channel__cpm">{CPM}</p>
        <p className="channel__yoy">{YoY}</p>
        <p className="channel__benchmark">{Benchmark ? Benchmark : '-'}</p>
        <button className="channel__button" onClick={handleToggle}>
          {isOpen ? "Close" : "Expand"}
        </button>
      </div>

      <div className="channel__data__container">
        <DataContainer title="working media" data={`$${formatNumber(budget)}`} />
        <DataContainer title="total spent so far" data={`$${formatNumber(spent)}`}/>
        <DataContainer title="percentage spent" data={`${percentageSpent}%`} />
        <DataContainer title="launch date" data={startDate}/>
        <DataContainer title="end date" data={endDate} />
        <DataContainer title="flight duration" data={`${flightDuration} days`} />
      </div>
    </div>
  );
};

export default ChannelContainer;
