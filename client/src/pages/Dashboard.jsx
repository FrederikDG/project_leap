import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { CompanyContext } from "../context/CompanyContext.jsx";
import "../styles/Dashboard.css";
import TimelineChart from "../components/TimeLineChart.jsx";
export default function Dashboard() {
  const { campaignSlug } = useParams();
  const { companies, activeCompanyId, campaignsByCompany } = useContext(CompanyContext);
  const activeCompany = companies.find((c) => c.id === activeCompanyId) || {};
  const companyColor = activeCompany.color;
  const companyLogo = activeCompany.profilePicUrl;
  const campaigns = campaignsByCompany[activeCompanyId] || [];
  const campaign =
    campaigns.find(
      (c) => c.title.trim().toLowerCase().replace(/\s+/g, "-") === campaignSlug
    ) || {};
  return (
    <div className="content__container campaign__overview">
      <div className="campaign__overview__header">
        <img src={companyLogo} alt={`${activeCompany.name || "Company"} logo"`} className="company__logo"/>
        <div className="campaign__info__container">
          <h2 className="campaign__title">{campaign.title || campaignSlug.replace(/-/g, " ")}</h2>
          <p className="campaign__data">
            This campaign has{" "}
            <span className="flight__count__container">
              <strong className="flight__count">3 flights</strong>
            </span>{" "}
            with a total spend of <br />
            <strong> $ 1,750,987</strong>.{" "}
            
            <strong className="flight__activity" style={{ color: companyColor }}>
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
<TimelineChart flights={[
        { name: "Flight 1", start: "2025-03-23", end: "2025-05-31", spend: 634006, status: "active" },
        { name: "Flight 2", start: "2025-06-01", end: "2025-09-30", spend: 634006, status: "inactive" },
        { name: "Flight 3", start: "2025-10-01", end: "2025-12-29", spend: 634006, status: "inactive" },
      ]} color={companyColor} />
    </div>
  );
}
