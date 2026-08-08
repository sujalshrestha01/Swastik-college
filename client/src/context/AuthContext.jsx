import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getToken, setToken, fetchMe, login as apiLogin } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { admin } = await fetchMe();
      setAdmin(admin);
    } catch {
      setToken(null);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  async function login(email, password) {
    const { token, admin } = await apiLogin(email, password);
    setToken(token);
    setAdmin(admin);
    return admin;
  }

  function logout() {
    setToken(null);
    setAdmin(null);
  }

  // Merges a partial update into the current admin (e.g. after toggling
  // "Available" or "Notifications") without a full re-fetch.
  function updateAdmin(partial) {
    setAdmin((prev) => (prev ? { ...prev, ...partial } : prev));
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
        updateAdmin,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
