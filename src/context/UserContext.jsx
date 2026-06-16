import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("surazense_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Incorrect email or password");
      }

      const userData = await res.json();
      setUser(userData);
      localStorage.setItem("surazense_user", JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      console.error("Login failed:", err);
      return { success: false, message: err.message };
    }
  };

  const register = async ({
    email,
    password,
    username,
    first_name,
    last_name,
    phone,
    role = "customer",
  }) => {
    try {
      const payload = {
        email,
        password,
        role,
        username: username || null,
        first_name: first_name || null,
        last_name: last_name || null,
        phone: phone || null,
      };

      const res = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Registration failed");
      }

      const userData = await res.json();
      // Auto login
      setUser(userData);
      localStorage.setItem("surazense_user", JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      console.error("Registration failed:", err);
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("surazense_user");
  };

  return (
    <UserContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
