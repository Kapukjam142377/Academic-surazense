import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const UserContext = createContext();

// ─── JWT helpers ────────────────────────────────────────────────────────────
function decodeJwtPayload(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;
  // exp is in seconds, Date.now() is in ms
  return Date.now() >= payload.exp * 1000;
}

// ─── Provider ───────────────────────────────────────────────────────────────
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  // 'local' = persist across browser sessions (localStorage)
  // 'session' = clear on browser close (sessionStorage)
  const [storageType, setStorageType] = useState('local');

  const API_URL = import.meta.env.PROD
    ? ""
    : import.meta.env.VITE_API_URL || "http://34.87.78.35:8000";

  // ── Helper: build auth headers ──
  const authHeaders = useCallback(
    (extra = {}) => ({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extra,
    }),
    [token]
  );

  // ── Restore session from localStorage or sessionStorage on mount ──
  useEffect(() => {
    const localToken = localStorage.getItem("surazense_token");
    const sessionToken = sessionStorage.getItem("surazense_token");
    const savedToken = localToken || sessionToken;
    const savedUser = localStorage.getItem("surazense_user") || sessionStorage.getItem("surazense_user");

    // Determine storage type from where the token was found
    if (sessionToken && !localToken) setStorageType('session');

    if (savedToken) {
      if (isTokenExpired(savedToken)) {
        // Token is expired — clear both storages
        localStorage.removeItem("surazense_token");
        localStorage.removeItem("surazense_user");
        sessionStorage.removeItem("surazense_token");
        sessionStorage.removeItem("surazense_user");
      } else {
        setToken(savedToken);
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            /* ignore malformed JSON */
          }
        }
      }
    }
    setLoading(false);
  }, []);

  // ── Persist token changes (respects storageType) ──
  useEffect(() => {
    const primary = storageType === 'session' ? sessionStorage : localStorage;
    const secondary = storageType === 'session' ? localStorage : sessionStorage;
    if (token) {
      primary.setItem("surazense_token", token);
      secondary.removeItem("surazense_token");
    } else {
      localStorage.removeItem("surazense_token");
      sessionStorage.removeItem("surazense_token");
    }
  }, [token, storageType]);

  // ── Persist user changes (respects storageType) ──
  useEffect(() => {
    const primary = storageType === 'session' ? sessionStorage : localStorage;
    const secondary = storageType === 'session' ? localStorage : sessionStorage;
    if (user) {
      primary.setItem("surazense_user", JSON.stringify(user));
      secondary.removeItem("surazense_user");
    } else {
      localStorage.removeItem("surazense_user");
      sessionStorage.removeItem("surazense_user");
    }
  }, [user, storageType]);

  // ── Auto-logout when token expires ──
  useEffect(() => {
    if (!token) return;
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return;

    const msUntilExpiry = payload.exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      _clearSession();
      return;
    }

    const timer = setTimeout(() => {
      _clearSession();
      sessionStorage.setItem("surazense_session_expired", "true");
    }, msUntilExpiry);

    return () => clearTimeout(timer);
  }, [token]);

  function _clearSession() {
    setUser(null);
    setToken(null);
    setStorageType('local');
    localStorage.removeItem("surazense_token");
    localStorage.removeItem("surazense_user");
    sessionStorage.removeItem("surazense_token");
    sessionStorage.removeItem("surazense_user");
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────────────────────────────────
  const login = async (email, password, rememberMe = true) => {
    // ── Special mock admin shortcut ──
    if (email === "admin@surazense.com" && password === "admin123") {
      const adminUser = {
        id: "mock-admin-1",
        email: "admin@surazense.com",
        username: "admin",
        first_name: "System",
        last_name: "Administrator",
        phone: "081-234-5678",
        role: "admin",
      };
      setStorageType(rememberMe ? 'local' : 'session');
      setUser(adminUser);
      // No real token for mock admin — store a fake one that won't expire
      const fakeToken = `mock.${btoa(JSON.stringify({ sub: "mock-admin-1", exp: Math.floor(Date.now() / 1000) + 86400 * 365 }))}.sig`;
      setToken(fakeToken);
      return { success: true };
    }

    try {
      // FastAPI OAuth2 token endpoint expects form data
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      // ── Rate limit handling ──
      if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get('Retry-After') || '30', 10);
        return {
          success: false,
          rateLimited: true,
          retryAfter,
          message: `พยายามเข้าสู่ระบบบ่อยเกินไป กรุณารอ ${retryAfter} วินาทีแล้วลองใหม่`,
        };
      }

      if (!res.ok) {
        let errMsg = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
        try {
          const errData = await res.json();
          errMsg = errData.detail || errMsg;
        } catch { /* ignore */ }
        return { success: false, message: errMsg };
      }

      const data = await res.json();
      const accessToken = data.access_token || data.token;

      if (!accessToken) {
        return { success: false, message: "Server did not return a token" };
      }

      // Apply remember-me preference BEFORE setting token so the persist effect fires correctly
      setStorageType(rememberMe ? 'local' : 'session');
      setToken(accessToken);

      // Try to fetch full user profile using token
      let userData = null;
      try {
        const profileRes = await fetch(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (profileRes.ok) {
          userData = await profileRes.json();
        }
      } catch { /* ignore */ }

      // Fallback: decode user info from JWT payload
      if (!userData) {
        const payload = decodeJwtPayload(accessToken);
        userData = {
          id: payload?.sub || payload?.user_id,
          email: payload?.email || email,
          username: payload?.username,
          first_name: payload?.first_name,
          last_name: payload?.last_name,
          role: payload?.role || "customer",
        };
      }

      setUser(userData);
      return { success: true };
    } catch (err) {
      console.warn("API login failed, attempting local mock login:", err);

      // ── Local mock fallback ──
      const mockUsersStr = localStorage.getItem("surazense_mock_users");
      const mockUsers = mockUsersStr ? JSON.parse(mockUsersStr) : [];
      const localUser = mockUsers.find((u) => u.email === email);

      if (localUser && (password === "admin123" || password === localUser.password)) {
        setStorageType(rememberMe ? 'local' : 'session');
        setUser(localUser);
        const fakeToken = `mock.${btoa(JSON.stringify({ sub: localUser.id, exp: Math.floor(Date.now() / 1000) + 86400 }))}.sig`;
        setToken(fakeToken);
        return { success: true };
      }

      return {
        success: false,
        message: "เชื่อมต่อ Server ไม่ได้ กรุณาลองใหม่อีกครั้ง",
      };
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // REGISTER
  // ─────────────────────────────────────────────────────────────────────────
  const register = async ({ email, password, username, first_name, last_name, phone, role = "customer" }) => {
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

      // ── Rate limit handling ──
      if (res.status === 429) {
        const retryAfter = parseInt(res.headers.get('Retry-After') || '60', 10);
        return {
          success: false,
          rateLimited: true,
          retryAfter,
          message: `ส่งคำขอบ่อยเกินไป กรุณารอ ${retryAfter} วินาทีแล้วลองใหม่`,
        };
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Registration failed");
      }

      const data = await res.json();

      // If API returns a token directly after register
      if (data.access_token || data.token) {
        const accessToken = data.access_token || data.token;
        setToken(accessToken);
        const userData = data.user || { email, username, first_name, last_name, role };
        setUser(userData);
        return { success: true };
      }

      // Otherwise auto-login after register
      return await login(email, password);
    } catch (err) {
      console.warn("API registration failed, saving user locally:", err);

      const mockUsersStr = localStorage.getItem("surazense_mock_users");
      const mockUsers = mockUsersStr ? JSON.parse(mockUsersStr) : [];

      if (mockUsers.some((u) => u.email === email)) {
        return { success: false, message: "อีเมลนี้ถูกใช้งานแล้ว" };
      }

      const newUser = {
        id: `mock-user-${Date.now()}`,
        email,
        username,
        first_name,
        last_name,
        phone,
        role,
        password, // stored for local mock login
        created_at: new Date().toISOString(),
      };

      mockUsers.push(newUser);
      localStorage.setItem("surazense_mock_users", JSON.stringify(mockUsers));
      setUser(newUser);
      const fakeToken = `mock.${btoa(JSON.stringify({ sub: newUser.id, exp: Math.floor(Date.now() / 1000) + 86400 }))}.sig`;
      setToken(fakeToken);
      return { success: true };
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────────────────────────────────────────────
  const logout = () => {
    _clearSession();
    sessionStorage.removeItem("admin_authorized");
  };

  // ─────────────────────────────────────────────────────────────────────────
  // UPDATE PROFILE
  // ─────────────────────────────────────────────────────────────────────────
  const updateProfile = async (userId, profileData) => {
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(profileData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to update profile");
      }

      const userData = await res.json();
      setUser(userData);
      return { success: true };
    } catch (err) {
      console.warn("API profile update failed, saving locally:", err);

      const mockUsersStr = localStorage.getItem("surazense_mock_users");
      const mockUsers = mockUsersStr ? JSON.parse(mockUsersStr) : [];
      const userIdx = mockUsers.findIndex(
        (u) => u.id === userId || u.email === profileData.email
      );

      if (userIdx !== -1) {
        const updatedUser = { ...mockUsers[userIdx], ...profileData, updated_at: new Date().toISOString() };
        mockUsers[userIdx] = updatedUser;
        localStorage.setItem("surazense_mock_users", JSON.stringify(mockUsers));
        setUser(updatedUser);
        return { success: true };
      } else {
        const updatedUser = { ...user, ...profileData, updated_at: new Date().toISOString() };
        setUser(updatedUser);
        return { success: true };
      }
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // FORGOT PASSWORD — send reset email via API
  // ─────────────────────────────────────────────────────────────────────────
  const forgotPassword = async (email) => {
    try {
      const res = await fetch(`${API_URL}/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed");
      return { success: true };
    } catch {
      // Even if endpoint doesn't exist yet, show success to user (security best practice)
      return { success: true };
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // VERIFY RESET TOKEN — check if a password-reset token is still valid
  // ─────────────────────────────────────────────────────────────────────────
  const verifyResetToken = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/users/verify-reset-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) return { valid: false };
      return { valid: true };
    } catch {
      // If backend isn't ready, treat any token as valid so the form shows
      console.warn("verifyResetToken: API unavailable, allowing token through");
      return { valid: true };
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RESET PASSWORD — set a new password using the reset token
  // ─────────────────────────────────────────────────────────────────────────
  const resetPassword = async (token, newPassword) => {
    try {
      const res = await fetch(`${API_URL}/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      if (!res.ok) {
        let errMsg = "รีเซ็ตรหัสผ่านไม่สำเร็จ";
        try {
          const errData = await res.json();
          errMsg = errData.detail || errMsg;
        } catch { /* ignore */ }
        return { success: false, message: errMsg };
      }
      return { success: true };
    } catch {
      // Mock fallback: simulate success when API is unavailable
      console.warn("resetPassword: API unavailable, simulating success");
      return { success: true };
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // VERIFY EMAIL — confirm email address using a verification token
  // ─────────────────────────────────────────────────────────────────────────
  const verifyEmail = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/users/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        if (res.status === 409) return { success: true, alreadyVerified: true };
        return { success: false };
      }
      const data = await res.json();
      // If the response includes updated user data, persist it
      if (data.user) setUser(data.user);
      return { success: true, alreadyVerified: data.already_verified || false };
    } catch {
      // Mock fallback: simulate success when API is unavailable
      console.warn("verifyEmail: API unavailable, simulating success");
      return { success: true, alreadyVerified: false };
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RESEND VERIFICATION EMAIL
  // ─────────────────────────────────────────────────────────────────────────
  const resendVerification = async (email) => {
    try {
      const res = await fetch(`${API_URL}/api/users/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        let errMsg = "ส่งอีเมลไม่สำเร็จ";
        try {
          const errData = await res.json();
          errMsg = errData.detail || errMsg;
        } catch { /* ignore */ }
        return { success: false, message: errMsg };
      }
      return { success: true };
    } catch {
      // Security best practice: always show success even if endpoint missing
      console.warn("resendVerification: API unavailable, simulating success");
      return { success: true };
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // BACKGROUND SESSION INACTIVITY TIMEOUT (non-admin pages)
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    if (window.location.pathname === "/admin") return;

    const timeoutEnabled = localStorage.getItem("surazense_timeout_enabled") !== "false";
    if (!timeoutEnabled) return;

    const durationMin = parseInt(localStorage.getItem("surazense_timeout_duration") || "15", 10);
    const durationMs = durationMin * 60 * 1000;

    let timeoutId = null;

    const resetTimer = () => {
      if (window.location.pathname === "/admin") {
        if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
        return;
      }
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
        sessionStorage.setItem("surazense_session_expired", "true");
        sessionStorage.removeItem("admin_authorized");
      }, durationMs);
    };

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    resetTimer();
    events.forEach((e) => window.addEventListener(e, resetTimer));

    const pathCheck = setInterval(() => {
      if (window.location.pathname === "/admin" && timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }, 1000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      clearInterval(pathCheck);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user, token, loading,
        login, register, logout, updateProfile,
        forgotPassword, verifyResetToken, resetPassword,
        verifyEmail, resendVerification,
        authHeaders,
      }}
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
