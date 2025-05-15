import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CompanyContext } from "../context/CompanyContext.jsx";
import "../styles/Dashboard.css";
import TimelineChart from "../components/TimeLineChart.jsx";
import ChannelGraph from "../components/ChannelGraph.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import DataContainer from "../components/DataContainer.jsx";
import StateFlag from "../components/StateFlag.jsx";
import ChannelContainer from "../components/ChannelContainer.jsx";
import KeywordContainer from "../components/KeywordContainer.jsx";
import PieChart from "../components/PieChart.jsx";
import Button from "../components/Button.jsx";

export default function Dashboard() {
  const { campaignSlug } = useParams();
  const { companies, activeCompanyId, campaignsByCompany } = useContext(CompanyContext);
  const [campaignData, setCampaignData] = useState(null);

  const activeCompany = companies.find((c) => c.id === activeCompanyId) || {};
  const companyColor = activeCompany.color;
  const companyLogo = activeCompany.profilePicUrl;
  const campaigns = campaignsByCompany[activeCompanyId] || [];
  const campaign = campaigns.find((c) => c.title.trim().toLowerCase().replace(/\s+/g, "-") === campaignSlug) || {};
  const [expandedFlights, setExpandedFlights] = useState([]);
  const formatDate = (data) => {
    if (typeof data === "string" && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
      const [year, month, day] = data.split("-");
      return `${month}/${day}/${year}`;
    }
    return data;
  };
  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await fetch("/campaign.json");
        const data = await response.json();
        setCampaignData(data);

        if (data && data.flights) {
          const currentDate = new Date();
          const activeIndexes = data.flights
            .map((flight, idx) => {
              const startDate = new Date(flight.startDate);
              const endDate = new Date(flight.endDate);
              return currentDate >= startDate && currentDate <= endDate ? idx : null;
            })
            .filter((idx) => idx !== null);
          setExpandedFlights(activeIndexes);
        }
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      }
    };
    fetchCampaignData();
  }, []);

  const toggleFlight = (index) => {
    setExpandedFlights((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  if (!campaignData) {
    return <div>Loading...</div>;
  }
  const { name, budget, flights, goal, mediaPlan } = campaignData;
  return (
    <main>
      <div className="content__container campaign__overview">
        <div className="campaign__overview__header">
          <img src={companyLogo} alt={`${activeCompany.name || "Company"} logo"`} className="company__logo" />
          <div className="campaign__info__container">
            <h2 className="campaign__title">{campaign.title || name || campaignSlug.replace(/-/g, " ")}</h2>
            <p className="campaign__data">
              This campaign has{" "}
              <span className="box__text__container">
                <strong className="box__text">
                  {flights.length.toLocaleString()} {flights.length === 1 ? "flight" : "flights"}
                </strong>
              </span>{" "}
              with a total spend of
              <strong> $ {budget.toLocaleString()}</strong>. <strong style={{ color: companyColor }}>Flight 1 is active</strong> and{" "}
              <strong style={{ color: companyColor }}>30% </strong>
              has been spent.
            </p>
            <hr />
            <div className="project__goal__container">
              <span className="addition__text">project goal</span>
              <p className="project__goal__text">{goal}</p>
            </div>
          </div>
        </div>
        <TimelineChart
          className="timeline__chart"
          flights={flights.map((flight) => ({
            ...flight,
            start: flight.startDate.replace(/\//g, "-"),
            end: flight.endDate.replace(/\//g, "-"),
            spend: flight.spent.toLocaleString(),
          }))}
          color={companyColor}
        />
      </div>
      {flights.map((flight, index) => {
        let bestChannel = null;
        if (Array.isArray(flight.channels) && flight.channels.length > 0) {
          bestChannel = flight.channels.reduce((best, channel) => {
            if (!Array.isArray(channel.metrics) || channel.metrics.length === 0) return best;
            const lastMetric = channel.metrics[channel.metrics.length - 1];
            if (!best) return { channel, metric: lastMetric };
            // Lower CPM is better; if CPM is equal, higher impressions wins
            if (lastMetric.CPM < best.metric.CPM) return { channel, metric: lastMetric };
            if (lastMetric.CPM === best.metric.CPM && lastMetric.impressions > best.metric.impressions) return { channel, metric: lastMetric };
            return best;
          }, null);
        }
        const currentDate = new Date();
        const startDate = new Date(flight.startDate);
        const endDate = new Date(flight.endDate);
        const isActive = currentDate >= startDate && currentDate <= endDate;
        const isFinished = currentDate > endDate;
        let flightColor;
        let flightState;
        if (isActive) {
          flightColor = companyColor;
          flightState = "active";
        } else if (isFinished) {
          flightColor = "var(--color-grey-500)";
          flightState = "finished";
        } else {
          flightColor = "var(--color-grey-500)";
          flightState = "inactive";
        }
        const percentageSpent = ((flight.spent / flight.budget) * 100).toFixed(2);
        const flightDuration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        return (
          <div key={index} className="campaign__flight" style={{ borderColor: flightColor }}>
            <div className="flight__accordion__container">
              <h3 className="flight__title">
                Flight {index + 1}: <span style={{ color: flightColor }}>{flightState}</span>
              </h3>
              <Button image="/BUTTON_DROPDOWN_BIG.svg" onClick={() => toggleFlight(index)} transition={true} rotation={isActive ? 0 : 180} />
            </div>
            {expandedFlights.includes(index) ? (
              <>
                <div className="content__container flight__overview__container" style={{ borderColor: flightColor }}>
                  <div className="flight__info__container">
                    <div className="header__container">
                      <img src="/OVERVIEW_ICON.svg" alt="OVERVIEW_ICON" />
                      <h4>Flight Overview</h4>
                    </div>

                    {isActive ? (
                      <p className="flight__info__description">
                        The campaign has been running for{" "}
                        <strong style={{ color: flightColor }}>{Math.ceil((currentDate - startDate) / (1000 * 60 * 60 * 24))} days</strong> and there
                        are <strong style={{ color: flightColor }}>{Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24))} days</strong>{" "}
                        remaining in the flight. Nice! 👌
                      </p>
                    ) : isFinished ? (
                      <p className="flight__info__description">
                        This flight ran for ${flightDuration} days and concluded successfully. What a run! 🔥
                      </p>
                    ) : (
                      <p className="flight__info__description">
                        This flight is scheduled to start in{" "}
                        <strong style={{ color: flightColor }}>{Math.ceil((startDate - currentDate) / (1000 * 60 * 60 * 24))} days</strong> and will
                        run for
                        <strong style={{ color: flightColor }}> {flightDuration}</strong> days. Are you ready? 🚀
                      </p>
                    )}
                  </div>
                  <div className="progress__container">
                    <StateFlag type="state" state={flightState} name="flight" color={companyColor} />
                    <div className="progressbar__container">
                      <ProgressBar startDate={startDate} endDate={endDate} color={flightColor} />
                      <div className="progressbar__dates__container">
                        <p>{formatDate(flight.startDate)}</p>
                        <p>{formatDate(flight.endDate)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="data__container__container">
                    <DataContainer
                      title="working media"
                      data={`$${flight.budget.toLocaleString()}`}
                      info="Budget allocated across all channels."
                    />
                    <DataContainer
                      title="total spent so far"
                      data={`$${flight.spent.toLocaleString()}`}
                      info="Cumulative dollars spent on this flight to date."
                    />
                    <DataContainer
                      title="percentage spent"
                      data={`${Number(percentageSpent).toFixed(0)}%`}
                      info="Portion of the flight’s budget that’s been used."
                    />
                    <DataContainer title="launch date" data={flight.startDate} />
                    <DataContainer title="end date" data={flight.endDate} />
                    <DataContainer
                      title="flight duration"
                      data={`${flightDuration} days`}
                      info="Total number of days from launch through end date."
                    />
                  </div>
                </div>
                <div className="content__container flight__channel__container" style={{ borderColor: flightColor }}>
                  <div className="flight__info__container">
                    <div className="header__container">
                      <img src="/CHANNEL_ICON.svg" alt="OVERVIEW_ICON" />
                      <h4>Channel Breakout</h4>
                    </div>
                    {isActive ? (
                      <p className="flight__info__description">
                        The best performing channel is <span className="box__text__container">{bestChannel ? bestChannel.channel.name : "N/A"}</span>{" "}
                        with a CPM of <strong style={{ color: flightColor }}>{bestChannel ? `$${bestChannel.metric.CPM}` : "N/A"}</strong> and{" "}
                        <strong style={{ color: flightColor }}>{bestChannel ? bestChannel.metric.impressions.toLocaleString() : "N/A"}</strong> total
                        impressions.
                      </p>
                    ) : isFinished ? (
                      <p className="flight__info__description">
                        The best performing channel was <span className="box__text__container">{bestChannel ? bestChannel.channel.name : "N/A"}</span>{" "}
                        with a CPM of <strong style={{ color: flightColor }}>{bestChannel ? `$${bestChannel.metric.CPM}` : "N/A"}</strong> and{" "}
                        <strong style={{ color: flightColor }}>{bestChannel ? bestChannel.metric.impressions.toLocaleString() : "N/A"}</strong> total
                        impressions.
                      </p>
                    ) : (
                      <p className="flight__info__description">
                        We don't have any data for this flight yet, but we’re excited to see how it performs once it starts!
                      </p>
                    )}
                  </div>
                  <ChannelGraph className="channel__graph" channels={flight.channels} color={flightColor} />{" "}
                  <div className="channels__container">
                    <div className="channel__info__container">
                      <p className="channel__info__name">Name</p>
                      <p className="channel__info__impressions">Impressions</p>
                      <p className="channel__info__cpm">CPM</p>
                      <p className="channel__info__yoy">YoY</p>
                      <p className="channel__info__benchmark">Benchmark</p>
                    </div>
                    {flight.channels?.map((channel) => {
                      let metrics = {};
                      let previousImpressions = "";
                      if (Array.isArray(channel.metrics) && channel.metrics.length > 0) {
                        metrics = channel.metrics[channel.metrics.length - 1];
                        if (channel.metrics.length > 1) {
                          previousImpressions = channel.metrics[channel.metrics.length - 2].impressions;
                        }
                      }
                      return (
                        <ChannelContainer
                          key={channel.name}
                          logo={channel.logoLink}
                          name={channel.name}
                          budget={channel.budget}
                          spent={channel.spent}
                          startDate={channel.startDate}
                          endDate={channel.endDate}
                          previousImpressions={previousImpressions}
                          currentImpressions={`${metrics.impressions}`}
                          CPM={`$${metrics.CPM}`}
                          YoY={`${metrics.YOY}%`}
                          Benchmark={metrics.benchmark}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="content__container flight__search__container">
                  <div className="flight__info__container">
                    <div className="header__container">
                      <img src="/SEARCH_ICON.svg" alt="OVERVIEW_ICON" />
                      <h4>Search Overview</h4>
                    </div>{" "}
                  </div>
                  <div className="search__container">
                    <div className="keywords__container">
                      <p className="addition__text keywords__title">top 5 keywords</p>
                      <div className="keywords__list">
                        <div className="keywords__info__container">
                          <p className="keywords__info__name">Keyword</p>
                          <p className="keywords__info__impressions">Impressions</p>
                          <p className="keywords__info__click">Clicks</p>
                          <p className="keywords__info__cpc">CPC</p>
                        </div>
                        {flight.keywords?.map((keyword) => {
                          return (
                            <KeywordContainer
                              key={keyword.name}
                              keyword={keyword.name}
                              impressions={keyword.impressions}
                              click={keyword.clicks}
                              cpc={keyword.CPC}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <div className="search__data__container">
                      <DataContainer
                        title="search impression share"
                        data={
                          typeof flight.searchImpressionShare === "number"
                            ? `${(flight.searchImpressionShare * 100).toFixed(0)}%`
                            : flight.searchImpressionShare
                        }
                      />
                      <DataContainer title="CTR" data={typeof flight.CTR === "number" ? `${(flight.CTR * 100).toFixed(2)}%` : "5.65%"} />
                      <DataContainer title="CPC" data={`$${flight.CPC}`} />
                      <DataContainer title="total clicks" data={flight.clicks.toLocaleString()} />
                    </div>
                  </div>
                </div>
                <div className="content__container flight__media__container">
                  <div className="flight__info__container">
                    <div className="header__container">
                      <img src="/MEDIA_ICON.svg" alt="OVERVIEW_ICON" />
                      <h4>Media Plan</h4>
                    </div>
                    <p className="flight__info__description">{mediaPlan ? `${mediaPlan}.` : "No media plan has been provided for this campaign."}</p>
                  </div>
                  <PieChart
                    className="pie__chart"
                    channels={flight.channels}
                    color={companyColor}
                    chartId={`pie-chart-${index}`}
                    flightState={flightState}
                  />
                </div>
              </>
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <hr style={{ borderColor: "var(--color-grey-900)", margin: "0rem 1rem" }} />
              </div>
            )}
          </div>
        );
      })}
    </main>
  );
}
