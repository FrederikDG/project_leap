import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { CompanyContext } from "../context/CompanyContext.jsx";
import "../styles/Dashboard.css";
import TimelineChart from "../components/TimeLineChart.jsx";
import DataContainer from "../components/DataContainer.jsx";
import StateFlag from "../components/StateFlag.jsx";
export default function Dashboard() {
  const { campaignSlug } = useParams();
  const { companies, activeCompanyId, campaignsByCompany } = useContext(CompanyContext);
  const activeCompany = companies.find((c) => c.id === activeCompanyId) || {};
  const companyColor = activeCompany.color;
  const companyLogo = activeCompany.profilePicUrl;
  const campaigns = campaignsByCompany[activeCompanyId] || [];
  const campaign = campaigns.find((c) => c.title.trim().toLowerCase().replace(/\s+/g, "-") === campaignSlug) || {};
  return (
    <main>
      <div className="content__container campaign__overview">
        <div className="campaign__overview__header">
          <img src={companyLogo} alt={`${activeCompany.name || "Company"} logo"`} className="company__logo" />
          <div className="campaign__info__container">
            <h2 className="campaign__title">{campaign.title || campaignSlug.replace(/-/g, " ")}</h2>
            <p className="campaign__data">
              This campaign has{" "}
              <span className="flight__count__container">
                <strong className="flight__count">3 flights</strong>
              </span>{" "}
              with a total spend of <br />
              <strong> $ 1,750,987</strong>.{" "}
              <strong className="flight__acti</div>vity" style={{ color: companyColor }}>
                Flight 1 is active
              </strong>{" "}
              and{" "}
              <strong className="campaign__percentage" style={{ color: companyColor }}>
                30%{" "}
              </strong>
              has been spent.
            </p>
            <hr />
            <div className="project__goal__container">
              <span className="project__goal__title">project goal</span>
              <p className="project__goal__text">
                Convince policymakers and DC opinion elites that more licensed spectrum is a good thing for America.
              </p>
            </div>
          </div>
        </div>
        <TimelineChart
          className="timeline__chart"
          flights={[
            { start: "2025-03-23", end: "2025-05-31", spend: 634006 },
            { start: "2025-06-01", end: "2025-09-30", spend: 883662 },
            { start: "2025-10-01", end: "2025-12-29", spend: 233319 },
          ]}
          color={companyColor}
        />
      </div>
      <div className="campaign__flight">
        <h3>Flight 1</h3>
        <div className="content__container flight__overview__container">
          <div className="flight__info__container">
            <div className="header__container">
              <img src="../OVERVIEW_ICON.svg" alt="OVERVIEW_ICON" />
              <h4>Flight Overview</h4>
            </div>
            <p className="flight__info__description">
              The campaign has been running for 12 days and there are 24 days remaining in the flight. Nice. ✨
            </p>
          </div>
          <div className="data__progress__container">
<StateFlag type="campaign" state="active" color={companyColor} />
          </div>
          <div className="data__container__container">
            <DataContainer title="working media" data="$634,006" info="cheese balls" />
            <DataContainer title="total spent so far" data="$190,201" info="cheese balls" />
            <DataContainer title="percentage spent" data="30%" info="cheese balls" />
            <DataContainer title="launch date" data="03/02/2025" />
            <DataContainer title="end date" data="5/23/2023" />
            <DataContainer title="flight duration" data="65 days" info="cheese balls" />
          </div>
        </div>
        <div className="content__container flight__channel__container">
          <div className="flight__info__container">
            <div className="header__container">
              <img src="../CHANNEL_ICON.svg" alt="OVERVIEW_ICON" />
              <h4>Channel Breakout</h4>
            </div>
            <p className="flight__info__description">The best performing channel is YouTube TV with a CPM of $3.65 and 163,574 total impressions.</p>
          </div>
        </div>
        <div className="content__container flight__search__container">
          <div className="flight__info__container">
            <div className="header__container">
              <img src="../SEARCH_ICON.svg" alt="OVERVIEW_ICON" />
              <h4>Search Overview</h4>
            </div>
          </div>
        </div>
        <div className="content__container flight__media__container">
          <div className="flight__info__container">
            <div className="header__container">
              <img src="../MEDIA_ICON.svg" alt="OVERVIEW_ICON" />
              <h4>Media Plan</h4>
            </div>
            <p className="flight__info__description">
              Licensed Spectrum is an awareness-focused campaign with a heavily digital strategy and targeted DC OOH placements.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
