import React from "react";
import OverviewBanner from "../components/OverviewBanner";
import "../styles/Overview.css";
const Overview = () => {
  return (
    <main className="overview">
      <div className="overview__container">
        <OverviewBanner title="Licensed Spectrum" link="link" />
        <OverviewBanner title="Licensed Spectrum" link="link" />
        <OverviewBanner title="Licensed Spectrum" link="link" />

      </div>
    </main>
  );
};

export default Overview;
