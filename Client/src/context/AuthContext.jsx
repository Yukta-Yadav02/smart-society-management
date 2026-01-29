import React, { createContext, useContext, useState } from "react";
import { apiConnector } from "../services/apiConnector";
import { AUTH_API } from "../services/apis";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOGIN ================= */
  const login = async (email, password) => {
    console.log("➡️ LOGIN CALLED:", email);

    try {
      setLoading(true);

      const response = await apiConnector(
        "POST",
        AUTH_API.LOGIN,
        { email, password }
      );

      console.log("✅ LOGIN RESPONSE:", response);

      if (response.success) {
        localStorage.setItem("token", response.token);
        setUser(response.user);

        console.log("🔐 Token stored, user set");
        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (error) {
      console.error("❌ LOGIN FAILED:", error);
      return {
        success: false,
        message: error.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /* ================= SIGNUP (RESIDENT) ================= */
  const signup = async ({ name, email, password }) => {
    console.log("➡️ SIGNUP CALLED:", email);

    try {
      setLoading(true);

      const response = await apiConnector(
        "POST",
        AUTH_API.REGISTER_RESIDENT,
        { name, email, password }
      );

      console.log("✅ SIGNUP RESPONSE:", response);

      return {
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      console.error("❌ SIGNUP FAILED:", error);
      return {
        success: false,
        message: error.message || "Signup failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    console.log("🚪 LOGOUT");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);