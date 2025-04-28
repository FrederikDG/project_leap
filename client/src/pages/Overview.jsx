import React, { useState, useContext } from "react";
import CampaignBanner from "../components/CampaignBanner";
import Modal from "../components/Modal";
import { CompanyContext } from "../context/CompanyContext";
import "../styles/Overview.css";

const Overview = () => {
  const { companies, activeCompanyId, campaignsByCompany, addCampaign } = useContext(CompanyContext);

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
        <div className="overview__container">
          <p>Please create a company to view and add campaigns.</p>
        </div>
      </main>
    );
  }

  
  const campaigns = activeCompanyId ? campaignsByCompany[activeCompanyId] || [] : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLink.trim() || !activeCompanyId) return;
    addCampaign(activeCompanyId, { id: Date.now().toString(), title: newTitle.trim(), link: newLink.trim() });
    closeModal();
  };

  return (
    <main className="overview">
      <div className="overview__container">
        {campaigns.map((camp) => (
          <CampaignBanner key={camp.id} title={camp.title} link={camp.link} />
        ))}

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
