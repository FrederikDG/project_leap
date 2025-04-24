import React, { createContext, useState, useEffect } from "react";
import api, { setToken } from "../utils/api.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, _setAccessToken] = useState(null);
  const setAccessToken = (token) => {
    setToken(token);
    _setAccessToken(token);
  };

  // on mount try refresh
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.post("/auth/refresh_token");
        if (data.accessToken) {
          setAccessToken(data.accessToken);
        }
      } catch (err) {
        // no valid refresh token, user stays logged out
      }
    })();
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });
    setAccessToken(data.accessToken);
  };

  const logout = () => {
    setAccessToken(null);
    // clear cookie on server if needed
  };

  return <AuthContext.Provider value={{ accessToken, login, logout }}>{children}</AuthContext.Provider>;
}
