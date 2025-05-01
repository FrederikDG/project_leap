import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { CompanyContext } from "../context/CompanyContext.jsx";
import "../styles/Dashboard.css";
import TimelineChart from "../components/TimeLineChart.jsx";
import ChannelGraph from "../components/ChannelGraph.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
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
              <span className="box__text__container">
                <strong className="box__text">3 flights</strong>
              </span>{" "}
              with a total spend of <br />
              <strong> $ 1,750,987</strong>. <strong style={{ color: companyColor }}>Flight 1 is active</strong> and{" "}
              <strong style={{ color: companyColor }}>30% </strong>
              has been spent.
            </p>
            <hr />
            <div className="project__goal__container">
              <span className="addition__text">project goal</span>
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
            { start: "2025-10-01", end: "2025-12-31", spend: 233319 },
          ]}
          color={companyColor}
        />
      </div>
      <div className="campaign__flight">
        <h3>Flight 1</h3>
        <div className="content__container flight__overview__container">
          <div className="flight__info__container">
            <div className="header__container">
              <img src="/OVERVIEW_ICON.svg" alt="OVERVIEW_ICON" />
              <h4>Flight Overview</h4>
            </div>
            <p className="flight__info__description">
              The campaign has been running for <strong style={{ color: companyColor }}>12 days</strong> and there are{" "}
              <strong style={{ color: companyColor }}>24 days</strong> remaining in the flight. Nice. ✨
            </p>
          </div>
          <div className="progress__container">
            <StateFlag type="campaign" state="active" color={companyColor} />
            <div className="progressbar__container">
              <ProgressBar progress={30} color={companyColor} />
              <div className="progressbar__dates__container">
                <p>03/02/2025</p>
                <p>05/23/2023</p>
              </div>
            </div>
          </div>
          <div className="data__container__container">
            <DataContainer title="working media" data="$634,006" info="Budget allocated to purchase ad inventory across all channels." />
            <DataContainer title="total spent so far" data="$190,201" info="Cumulative dollars spent on this flight to date." />
            <DataContainer title="percentage spent" data="30%" info="Portion of the flight’s total budget that’s been used." />
            <DataContainer title="launch date" data="03/02/2025" />
            <DataContainer title="end date" data="05/23/2023" />
            <DataContainer title="flight duration" data="65 days" info="Total number of days from launch through end date." />
          </div>
        </div>
        <div className="content__container flight__channel__container">
          <div className="flight__info__container">
            <div className="header__container">
              <img src="/CHANNEL_ICON.svg" alt="OVERVIEW_ICON" />
              <h4>Channel Breakout</h4>
            </div>
            <p className="flight__info__description">
              The best performing channel is{" "}
              <span className="box__text__container">
                <strong className="box__text">YouTube TV</strong>
              </span>{" "}
              with a CPM of <strong style={{ color: companyColor }}>$3.65</strong> and <strong style={{ color: companyColor }}>163,574</strong> total
              impressions.
            </p>
          </div>
          <ChannelGraph
            className="channel__graph"
            data={{
              weeks: [
                { week: "2025-03-23", metrics: { impressions: 61425, cpm: 1.6, yearOverYear: 5.8 } },
                { week: "2025-03-30", metrics: { impressions: 121397, cpm: 1.2, yearOverYear: 6.1 } },
                { week: "2025-04-06", metrics: { impressions: 90157, cpm: 1.58, yearOverYear: 5.26 } },
                { week: "2025-04-13", metrics: { impressions: 82254, cpm: 1.49, yearOverYear: 6.3 } },
                { week: "2025-04-20", metrics: { impressions: 124524, cpm: 1.62, yearOverYear: 5.7 } },
                { week: "2025-04-27", metrics: { impressions: 151745, cpm: 1.55, yearOverYear: 6.2 } },
                { week: "2025-05-04", metrics: { impressions: 110273, cpm: 1.57, yearOverYear: 5.9 } },
                { week: "2025-05-11", metrics: { impressions: 121855, cpm: 1.53, yearOverYear: 6.1 } },
              ],
            }}
            color={companyColor}
          />
        </div>
        <div className="content__container flight__search__container">
          <div className="flight__info__container">
            <div className="header__container">
              <img src="/SEARCH_ICON.svg" alt="OVERVIEW_ICON" />
              <h4>Search Overview</h4>
            </div>
          </div>
        </div>
        <div className="content__container flight__media__container">
          <div className="flight__info__container">
            <div className="header__container">
              <img src="/MEDIA_ICON.svg" alt="OVERVIEW_ICON" />
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
