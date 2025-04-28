import React, { useState, useContext } from "react";
import CampaignBanner from "../components/CampaignBanner";
import Modal from "../components/Modal";
import { CompanyContext } from "../context/CompanyContext";
import "../styles/Overview.css";

const Overview = () => {
  const { companies, activeCompanyId, campaignsByCompany, addCampaign } = useContext(CompanyContext);

  const activeCompany = companies.find((c) => c.id === activeCompanyId) || {};
  const companyColor = activeCompany.color;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLink, setNewLink] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTitle("");
    setNewLink("");
  };

  if (companies.length === 0) {
    return (
      <main className="overview">
        <div className="content__container">
          <p>Please create a company to view and add campaigns.</p>
        </div>
      </main>
    );
  }

  const campaigns = activeCompanyId ? campaignsByCompany[activeCompanyId] || [] : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addCampaign(activeCompanyId, { title: newTitle.trim(), link: newLink.trim() });
    setNewTitle("");
    setNewLink("");
    setIsModalOpen(false);
  };

  return (
    <main className="overview">
      <div className="content__container">
        {campaigns.map((camp) => {
          const slug = camp.title.trim().toLowerCase().replace(/\s+/g, "-");
          return <CampaignBanner key={camp.id} title={camp.title} link={`/dashboard/${slug}`} color={companyColor} />;
        })}
        <button className="add__button" onClick={openModal}>
          + Add Campaign
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>Add New Campaign</h2>
        <form className="add-campaign-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
          </label>

          <label>
            Link
            <input type="text" value={newLink} onChange={(e) => setNewLink(e.target.value)} required />
          </label>

          <div className="form-actions">
            <button type="submit">Add</button>
          </div>
        </form>
      </Modal>
    </main>
  );
};

export default Overview;
