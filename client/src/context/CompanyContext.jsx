import React, { createContext, useState, useEffect, useContext } from "react";
import api, { fetchCompanies as _fetchCompanies, fetchCampaigns, createCampaign } from "../utils/api.js";
import { AuthContext } from "./AuthContext.jsx";

export const CompanyContext = createContext();

export function CompanyProvider({ children }) {
  const { accessToken } = useContext(AuthContext);
  const [companies, setCompanies] = useState([]);
  const [order, setOrder] = useState([]);
  const [activeCompanyId, setActiveCompanyId] = useState(null);
  const [campaignsByCompany, setCampaignsByCompany] = useState({});

  // Load companies once authenticated
  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      try {
        const response = await _fetchCompanies();
        const data = response.data;
        // Build full URLs for profile pictures
        const withUrls = data.map(c => ({
          ...c,
          profilePicUrl: c.profilePic ? `/uploads/${c.profilePic}` : null
        }));

        setCompanies(withUrls);
        const ids = withUrls.map(c => c.id);
        setOrder(ids);
        if (ids.length) setActiveCompanyId(ids[0]);

        const map = {};
        withUrls.forEach(c => { map[c.id] = c.campaigns || []; });
        setCampaignsByCompany(map);
      } catch (err) {
        console.error("Failed to load companies", err);
      }
    })();
  }, [accessToken]);

  // Create a new company with optional image
  const addCompany = async (formData) => {
    try {
      const response = await api.post('/api/companies', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const c = response.data;
      const newCompany = {
        ...c,
        profilePicUrl: c.profilePic ? `/uploads/${c.profilePic}` : null
      };

      setCompanies(prev => [newCompany, ...prev]);
      setOrder(prev => [newCompany.id, ...prev]);
      setActiveCompanyId(newCompany.id);
      setCampaignsByCompany(prev => ({ ...prev, [newCompany.id]: [] }));
    } catch (err) {
      console.error("Failed to create company", err);
    }
  };

  // Select a company
  const selectCompany = (id) => {
    setActiveCompanyId(id);
    setOrder(prev => [id, ...prev.filter(x => x !== id)]);
  };

  // Add a new campaign
  const addCampaign = async (companyId, campaignInput) => {
    try {
      const response = await createCampaign(companyId, campaignInput);
      const camp = response.data;
      setCampaignsByCompany(prev => ({
        ...prev,
        [companyId]: [...(prev[companyId] || []), camp]
      }));
    } catch (err) {
      console.error("Failed to create campaign", err);
    }
  };

  return (
    <CompanyContext.Provider
      value={{
        companies,
        order,
        activeCompanyId,
        campaignsByCompany,
        addCompany,
        selectCompany,
        addCampaign
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}
