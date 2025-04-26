import React, { useState } from "react";
import CampaignBanner from "../components/CampaignBanner";
import Modal from "../components/Modal";
import "../styles/Overview.css";

const Overview = () => {
  const [campaigns, setCampaigns] = useState([
    { title: "Licensed Spectrum", link: "/licensed-spectrum" },
    { title: "Reputation Campaign", link: "/reputation-campaign" },
    { title: "Distracted Driving", link: "/distracted-driving" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newLink, setNewLink] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewTitle("");
    setNewLink("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLink.trim()) return;
    setCampaigns((prev) => [...prev, { title: newTitle.trim(), link: newLink.trim() }]);
    closeModal();
  };

  return (
    <main className="overview">
      <div className="overview__container">
        {campaigns.map((camp, idx) => (
          <CampaignBanner key={idx} title={camp.title} link={camp.link} />
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
