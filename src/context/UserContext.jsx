import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.PROD
    ? ""
    : import.meta.env.VITE_API_URL || "http://34.87.78.35:8000";

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
    // Check local database first for demo admin/users or fallback
    const mockUsersStr = localStorage.getItem("surazense_mock_users");
    let mockUsers = mockUsersStr ? JSON.parse(mockUsersStr) : [];

    // Pre-populate mock admin if not exists
    const hasAdmin = mockUsers.some((u) => u.email === "admin@surazense.com");
    if (!hasAdmin) {
      mockUsers.push({
        id: "mock-admin-1",
        email: "admin@surazense.com",
        username: "admin",
        first_name: "System",
        last_name: "Administrator",
        phone: "081-234-5678",
        role: "admin",
        created_at: new Date().toISOString(),
      });
      localStorage.setItem("surazense_mock_users", JSON.stringify(mockUsers));
    }

    // Direct check for admin login locally to make it smooth
    if (email === "admin@surazense.com" && password === "admin123") {
      const adminUser = mockUsers.find(
        (u) => u.email === "admin@surazense.com",
      );
      setUser(adminUser);
      localStorage.setItem("surazense_user", JSON.stringify(adminUser));
      return { success: true };
    }

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
      console.warn("API login failed, attempting local mock login:", err);
      // Fallback: Check local storage mock users
      const localUser = mockUsers.find((u) => u.email === email);
      if (
        localUser &&
        (password === "admin123" || password === localUser.password)
      ) {
        setUser(localUser);
        localStorage.setItem("surazense_user", JSON.stringify(localUser));
        return { success: true };
      }
      return {
        success: false,
        message:
          "Connection failed. Please use demo admin credentials (admin@surazense.com / admin123)",
      };
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
    const payload = {
      email,
      password,
      role,
      username: username || null,
      first_name: first_name || null,
      last_name: last_name || null,
      phone: phone || null,
    };

    try {
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
      setUser(userData);
      localStorage.setItem("surazense_user", JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      console.warn("API registration failed, saving user locally:", err);
      // Local storage mock register
      const mockUsersStr = localStorage.getItem("surazense_mock_users");
      const mockUsers = mockUsersStr ? JSON.parse(mockUsersStr) : [];

      if (mockUsers.some((u) => u.email === email)) {
        return { success: false, message: "Email already registered locally." };
      }

      const newUser = {
        id: `mock-user-${Date.now()}`,
        email,
        username,
        first_name,
        last_name,
        phone,
        role,
        created_at: new Date().toISOString(),
      };

      mockUsers.push(newUser);
      localStorage.setItem("surazense_mock_users", JSON.stringify(mockUsers));
      setUser(newUser);
      localStorage.setItem("surazense_user", JSON.stringify(newUser));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("surazense_user");
  };

  const updateProfile = async (userId, profileData) => {
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to update profile");
      }

      const userData = await res.json();
      setUser(userData);
      localStorage.setItem("surazense_user", JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      console.warn("API profile update failed, saving locally:", err);
      // Fallback: update local mock storage
      const mockUsersStr = localStorage.getItem("surazense_mock_users");
      const mockUsers = mockUsersStr ? JSON.parse(mockUsersStr) : [];

      const userIdx = mockUsers.findIndex(
        (u) => u.id === userId || u.email === profileData.email,
      );
      if (userIdx !== -1) {
        const updatedUser = {
          ...mockUsers[userIdx],
          ...profileData,
          updated_at: new Date().toISOString(),
        };
        // If password is changed, update it too
        if (profileData.password) {
          updatedUser.password = profileData.password;
        }
        mockUsers[userIdx] = updatedUser;
        localStorage.setItem("surazense_mock_users", JSON.stringify(mockUsers));
        setUser(updatedUser);
        localStorage.setItem("surazense_user", JSON.stringify(updatedUser));
        return { success: true };
      } else {
        // If user is logged in, but not found in mock users (e.g. they logged in with API and then server went down, or they were a pre-seeded admin)
        // Let's update the current user session in local storage anyway
        const updatedUser = {
          ...user,
          ...profileData,
          updated_at: new Date().toISOString(),
        };
        setUser(updatedUser);
        localStorage.setItem("surazense_user", JSON.stringify(updatedUser));
        return { success: true };
      }
    }
  };

  // Background Session Inactivity Timeout (Main website only, disabled on /admin)
  useEffect(() => {
    if (!user) return;

    // Do not run timeout logic on /admin page
    if (window.location.pathname === "/admin") {
      return;
    }

    const timeoutEnabled =
      localStorage.getItem("surazense_timeout_enabled") !== "false";
    if (!timeoutEnabled) return;

    const durationMin = parseInt(
      localStorage.getItem("surazense_timeout_duration") || "15",
      10,
    );
    const durationMs = durationMin * 60 * 1000;

    let timeoutId = null;

    const resetTimer = () => {
      // Re-check path in case user navigates to /admin without a page reload
      if (window.location.pathname === "/admin") {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        return;
      }

      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
        sessionStorage.setItem("surazense_session_expired", "true");
        sessionStorage.removeItem("admin_authorized");
      }, durationMs);
    };

    // Events to monitor user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    // Initialize timer
    resetTimer();

    // Listen to events
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Periodically re-check path in case SPA routing changed path without event firing
    const pathCheckInterval = setInterval(() => {
      if (window.location.pathname === "/admin") {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      }
    }, 1000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      clearInterval(pathCheckInterval);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user]);

  return (
    <UserContext.Provider
      value={{ user, loading, login, register, logout, updateProfile }}
    >
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
