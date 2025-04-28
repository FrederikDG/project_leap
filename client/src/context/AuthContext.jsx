import React, { createContext, useState, useEffect } from "react";
import api, { setToken } from "../utils/api.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, _setAccessToken] = useState(null);

  // centralize token logic: sets axios header + state + localStorage
  const storeToken = (token) => {
    if (token) {
      setToken(token);
      localStorage.setItem("accessToken", token);
      _setAccessToken(token);
    } else {
      setToken(null);
      localStorage.removeItem("accessToken");
      _setAccessToken(null);
    }
  };

  // on mount: rehydrate + silent refresh
  useEffect(() => {
    (async () => {
      // 1) if we saved a token last time, prime axios
      const saved = localStorage.getItem("accessToken");
      if (saved) {
        setToken(saved);
        _setAccessToken(saved);
      }
      // 2) then always try refresh_token for a fresh JWT
      try {
        const { data } = await api.post("/auth/refresh_token");
        if (data.accessToken) {
          storeToken(data.accessToken);
        }
      } catch {
        // no valid refresh cookie, user remains logged out
      }
    })();
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });
    storeToken(data.accessToken);
  };

  const logout = async () => {
    await api.post("/auth/logout"); // clear cookie
    storeToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
