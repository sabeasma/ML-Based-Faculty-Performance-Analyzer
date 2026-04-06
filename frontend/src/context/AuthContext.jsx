import { createContext, useContext, useMemo, useState } from 'react';
import { loginRequest } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('userData');
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (email, password) => {
    const data = await loginRequest(email, password);
    setToken(data.token);
    setRole(data.role);
    setUser(data.userData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('userData', JSON.stringify(data.userData));
    return data;
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userData');
  };

  const value = useMemo(() => ({ token, role, user, login, logout }), [token, role, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
