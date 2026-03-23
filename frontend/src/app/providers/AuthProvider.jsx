import { useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";

function readStoredUser() {
  const rawUser = localStorage.getItem("auth_user");
  return rawUser ? JSON.parse(rawUser) : null;
}

function readStoredToken() {
  return localStorage.getItem("auth_token") || "";
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(readStoredToken);
  const [loading] = useState(false);

  const login = (userObj, authToken = "") => {
    setUser(userObj);
    setToken(authToken);

    localStorage.setItem("auth_user", JSON.stringify(userObj));
    localStorage.setItem("auth_token", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken("");

    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}