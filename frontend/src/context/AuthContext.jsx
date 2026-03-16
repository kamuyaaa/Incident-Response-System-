import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, getToken } from '../api/client';
import { AUTH } from '../api/endpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { user: u } = await api.get(AUTH.me);
      setUser(u);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (email, password) => {
    const { user: u, token } = await api.post(AUTH.login, { email, password });
    localStorage.setItem('token', token);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (data) => {
    const { user: u } = await api.post(AUTH.register, data);
    const { token } = await api.post(AUTH.login, { email: data.email, password: data.password });
    localStorage.setItem('token', token);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isRole: (role) => user?.role === role,
    hasAnyRole: (...roles) => roles.includes(user?.role),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
