import React, { createContext, useState, useEffect } from "react";


export const CompanyContext = createContext();


export function CompanyProvider({ children }) {
  
  const [companies, setCompanies] = useState([]);
  const [order, setOrder] = useState([]);
  const [activeCompanyId, setActiveCompanyId] = useState(null);

  
  const [campaignsByCompany, setCampaignsByCompany] = useState({});

  
  useEffect(() => {
    if (order.length === 0 && companies.length > 0) {
      setOrder(companies.map(c => c.id));
      setActiveCompanyId(companies[0].id);
    }
  }, [companies]);

  /**
   * Add a new company and make it the active one
   * @param {{id: string, name: string, color: string, profilePic: File}} company
   */
  const addCompany = (company) => {
    setCompanies(prev => [company, ...prev]);
    setOrder(prev => [company.id, ...prev.filter(id => id !== company.id)]);
    setActiveCompanyId(company.id);
  };

  /**
   * Select an existing company by id
   * @param {string} id
   */
  const selectCompany = (id) => {
    
    setOrder(prev => [id, ...prev.filter(x => x !== id)]);
    setActiveCompanyId(id);
  };

  /**
   * Add a campaign for a specific company
   * @param {string} companyId
   * @param {{id: string, title: string, link?: string}} campaign
   */
  const addCampaign = (companyId, campaign) => {
    setCampaignsByCompany(prev => ({
      ...prev,
      [companyId]: [...(prev[companyId] || []), campaign]
    }));
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
