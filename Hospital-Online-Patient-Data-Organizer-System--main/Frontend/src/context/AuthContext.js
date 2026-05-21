import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { authService } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setAuthLoading(true);
    try {
      const response = await authService.login(email, password);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
      toast.success("Login successful");
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return {
        success: false,
        message,
      };
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (role, data) => {
    setAuthLoading(true);
    try {
      const response = await authService.register(role, data);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
      toast.success("Registration successful");
      return { success: true, user };
    } catch (error) {
      let errorMessage = "Registration failed";

      if (error.response?.data) {
        errorMessage = error.response.data.message || errorMessage;

        // If there are validation errors, format them nicely
        if (
          error.response.data.errors &&
          Array.isArray(error.response.data.errors)
        ) {
          const validationErrors = error.response.data.errors
            .map((err) => err.msg || `${err.param}: ${err.msg}`)
            .join(", ");
          if (validationErrors) {
            errorMessage = `Validation errors: ${validationErrors}`;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setAuthLoading(false);
    }
  };

  const resetPassword = async (email, newPassword) => {
    setAuthLoading(true);
    try {
      const response = await authService.resetPassword(email, newPassword);
      toast.success(response.data.message);
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || "Password reset failed";
      toast.error(message);
      return {
        success: false,
        message,
      };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.info("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authLoading,
        login,
        register,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
