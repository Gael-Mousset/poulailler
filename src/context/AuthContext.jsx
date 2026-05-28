import { createContext, useContext, useState } from "react";
import { authApi } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [email, setEmail] = useState(() => localStorage.getItem("userEmail"));

  async function login(emailVal, password) {
    const res = await authApi.login(emailVal, password);
    localStorage.setItem("token", res.token);
    localStorage.setItem("userEmail", res.email);
    setToken(res.token);
    setEmail(res.email);
  }

  async function register(emailVal, password) {
    const res = await authApi.register(emailVal, password);
    localStorage.setItem("token", res.token);
    localStorage.setItem("userEmail", res.email);
    setToken(res.token);
    setEmail(res.email);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("eggData");
    setToken(null);
    setEmail(null);
  }

  return (
    <AuthContext.Provider value={{ token, email, login, register, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
