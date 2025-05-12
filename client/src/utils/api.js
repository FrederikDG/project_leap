import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

export function setToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry && !original.url.includes("/auth/refresh_token")) {
      original._retry = true;

      const { data } = await api.post("/auth/refresh_token");
      if (data.accessToken) {
        setToken(data.accessToken);
        original.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return api(original);
      }
    }
    return Promise.reject(err);
  }
);

// — at the bottom of src/utils/api.js —
export const fetchCompanies = () => api.get("/api/companies");
export const createCompany = (formData) =>
  api.post("/api/companies", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const fetchCampaigns = (companyId) => api.get(`/api/companies/${companyId}/campaigns`);
export const createCampaign = (companyId, data) => api.post(`/api/companies/${companyId}/campaigns`, data);

export default api;
