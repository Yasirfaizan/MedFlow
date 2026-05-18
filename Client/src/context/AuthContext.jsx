import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    let cancelled = false;

    if (token) {
      setLoading(true);
      api
        .get("/auth/me")
        .then((res) => {
          if (!cancelled) setUser(res.data.data);
        })
        .catch(() => {
          if (!cancelled) logout();
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = (tokenVal, userData) => {
    // Tie this browser session to a single authenticated role.
    const existingRole = localStorage.getItem("authenticatedRole");
    const nextRole = userData?.role || "";

    if (existingRole && existingRole !== nextRole) {
      // Same browser cannot switch roles without explicit logout.
      localStorage.clear();
      setToken(null);
      setUser(null);
      return;
    }

    localStorage.setItem("token", tokenVal);
    localStorage.setItem("authenticatedRole", nextRole);
    setToken(tokenVal);
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
