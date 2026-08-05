import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useUser } from "../context/UserContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";

// ── Animated Blob Background ─────────────────────────────────────────────────
const BlobBackground = () => (
  <div className="login-bg-blobs" aria-hidden="true">
    <div className="blob blob-1" />
    <div className="blob blob-2" />
    <div className="blob blob-3" />
  </div>
);

// ── Toast Notification ────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <div className={`login-toast login-toast--${type}`} role="alert">
    <span className="login-toast__icon">
      {type === "error" ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
    </span>
    <span className="login-toast__msg">{message}</span>
    <button className="login-toast__close" onClick={onClose} aria-label="Close">
      <X size={14} />
    </button>
  </div>
);

// ── Input Field ───────────────────────────────────────────────────────────────
const InputField = ({
  icon: Icon,
  label,
  id,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
  rightAddon,
}) => (
  <div className="login-field">
    <label htmlFor={id} className="login-field__label">
      {label}
    </label>
    <div className="login-field__wrap">
      <span className="login-field__icon">
        <Icon size={16} />
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="login-field__input"
        autoComplete={
          type === "password"
            ? "current-password"
            : type === "email"
              ? "email"
              : "off"
        }
      />
      {rightAddon && <span className="login-field__addon">{rightAddon}</span>}
    </div>
  </div>
);

// ── Social Login Button ──────────────────────────────────────────────────────
const SocialButton = ({
  provider,
  label,
  logo,
  color,
  hoverColor,
  textColor = "white",
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="social-btn"
    style={{
      background: color,
      color: textColor,
      "--hover-bg": hoverColor,
    }}
    id={`btn-social-${provider}`}
    aria-label={`Sign in with ${label}`}
  >
    <span
      className="social-btn__logo"
      dangerouslySetInnerHTML={{ __html: logo }}
    />
    <span className="social-btn__label">{label}</span>
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
export default function Login() {
  const { t, language } = useLanguage();
  const { login, register, forgotPassword, user } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  // Read tab from URL param (?tab=forgot | ?tab=signup)
  const initialTab = (() => {
    const p = searchParams.get("tab");
    return p === "forgot" || p === "signup" ? p : "login";
  })();
  const [tab, setTab] = useState(initialTab); // 'login' | 'signup' | 'forgot'
  const [prevTab, setPrevTab] = useState(null);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null); // 'google'|'facebook'|'line'
  const [toast, setToast] = useState(null); // { message, type }
  const [verifyEmailPending, setVerifyEmailPending] = useState(null); // email string when verification is needed
  const [rememberMe, setRememberMe] = useState(true); // persist session across browser restart
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0); // seconds remaining when rate-limited
  const rateLimitRef = React.useRef(null);

  // ── Social Login handler ──
  const handleSocialLogin = (provider) => {
    const apiUrl = import.meta.env.VITE_API_URL || "";
    if (!apiUrl) {
      showToast(
        provider === "google"
          ? "🔧 Google Login: กรุณาตั้งค่า VITE_API_URL และ Google OAuth Client ID ใน .env"
          : provider === "facebook"
            ? "🔧 Facebook Login: กรุณาตั้งค่า VITE_API_URL และ Facebook App ID ใน .env"
            : "🔧 LINE Login: กรุณาตั้งค่า VITE_API_URL และ LINE Channel ID ใน .env",
        "error",
      );
      return;
    }
    setSocialLoading(provider);
    // Encode redirect destination into state so OAuthCallback can redirect correctly
    const statePayload = btoa(
      JSON.stringify({ redirect: redirectPath, provider }),
    );
    const callbackUrl = `${window.location.origin}/auth/callback?provider=${provider}`;
    // Redirect to backend OAuth initiation endpoint
    window.location.href = `${apiUrl}/api/auth/${provider}?redirect_uri=${encodeURIComponent(callbackUrl)}&state=${encodeURIComponent(statePayload)}`;
  };

  // If already logged in, redirect immediately
  useEffect(() => {
    if (user) navigate(redirectPath, { replace: true });
  }, [user]);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const switchTab = (newTab) => {
    setPrevTab(tab);
    setTab(newTab);
    setToast(null);
    setPassword("");
    setConfirmPassword("");
  };

  // ── Submit Handler ──────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToast(null);

    if (tab === "forgot") {
      const res = await forgotPassword(email);
      setIsSubmitting(false);
      if (res.success) {
        showToast(
          language === "th"
            ? `ส่งลิงก์รีเซ็ตรหัสผ่านไปที่ ${email} แล้ว`
            : `Reset link sent to ${email}`,
          "success",
        );
        setTimeout(() => switchTab("login"), 2500);
      } else {
        showToast(res.message || "เกิดข้อผิดพลาด");
      }
      return;
    }

    if (tab === "login") {
      const res = await login(email, password, rememberMe);
      setIsSubmitting(false);
      if (res.success) {
        sessionStorage.removeItem("surazense_session_expired");
        navigate(redirectPath, { replace: true });
      } else if (res.rateLimited) {
        // Start visual countdown
        const secs = res.retryAfter || 30;
        setRateLimitCountdown(secs);
        if (rateLimitRef.current) clearInterval(rateLimitRef.current);
        rateLimitRef.current = setInterval(() => {
          setRateLimitCountdown((c) => {
            if (c <= 1) {
              clearInterval(rateLimitRef.current);
              return 0;
            }
            return c - 1;
          });
        }, 1000);
        showToast(res.message);
      } else {
        showToast(res.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      }
    } else {
      // signup
      if (password !== confirmPassword) {
        setIsSubmitting(false);
        showToast(
          language === "th" ? "รหัสผ่านไม่ตรงกัน" : "Passwords do not match",
        );
        return;
      }
      if (password.length < 8) {
        setIsSubmitting(false);
        showToast(
          language === "th"
            ? "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"
            : "Password must be at least 8 characters",
        );
        return;
      }
      const res = await register({
        email,
        password,
        username,
        first_name: firstName,
        last_name: lastName,
        phone,
      });
      setIsSubmitting(false);
      if (res.success) {
        sessionStorage.removeItem("surazense_session_expired");
        if (res.requiresEmailVerification) {
          // Backend requires email verification before login
          setVerifyEmailPending(email);
          switchTab("login");
        } else {
          navigate(redirectPath, { replace: true });
        }
      } else {
        showToast(res.message || "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่");
      }
    }
  };

  const th = language === "th";

  return (
    <>
      {/* ── Inline Styles ─────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .login-page {
          min-height: calc(100vh - 120px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          position: relative;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #f8fafc 100%);
        }

        /* ── Blobs ── */
        .login-bg-blobs { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.35;
          animation: blobMove 12s ease-in-out infinite alternate;
        }
        .blob-1 { width: 400px; height: 400px; background: radial-gradient(circle, #38bdf8, #818cf8); top: -120px; left: -120px; animation-duration: 14s; }
        .blob-2 { width: 350px; height: 350px; background: radial-gradient(circle, #c084fc, #f472b6); bottom: -100px; right: -80px; animation-duration: 10s; animation-delay: -4s; }
        .blob-3 { width: 250px; height: 250px; background: radial-gradient(circle, #34d399, #38bdf8); bottom: 30%; left: 10%; animation-duration: 18s; animation-delay: -8s; }
        @keyframes blobMove {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(30px, -20px) scale(1.08); }
          100% { transform: translate(-20px, 30px) scale(0.96); }
        }

        /* ── Card ── */
        .login-card {
          width: 100%;
          max-width: 460px;
          border-radius: 28px;
          overflow: hidden;
          box-shadow:
            0 30px 60px rgba(2, 132, 199, 0.12),
            0 0 0 1px rgba(148, 163, 184, 0.12);
          position: relative;
          z-index: 1;
          background: white;
        }

        /* ── Right Panel ── */
        .login-panel-right {
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow-y: auto;
        }

        /* ── Tabs ── */
        .login-tabs {
          display: flex;
          background: #f1f5f9;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 2rem;
          gap: 4px;
        }
        .login-tab {
          flex: 1;
          padding: 0.6rem;
          border: none;
          border-radius: 9px;
          background: transparent;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
          color: #94a3b8;
          transition: all 0.2s ease;
          font-family: 'Inter', sans-serif;
        }
        .login-tab--active {
          background: white;
          color: #0284c7;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04);
        }
        .login-tab:hover:not(.login-tab--active) { color: #475569; background: rgba(255,255,255,0.5); }

        /* ── Heading ── */
        .login-heading { margin-bottom: 0.4rem; }
        .login-heading h1 {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
          margin: 0 0 0.3rem 0;
        }
        .login-heading p {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0 0 1.5rem 0;
        }

        /* ── Fields ── */
        .login-fields { display: flex; flex-direction: column; gap: 0.9rem; }
        .login-field { display: flex; flex-direction: column; gap: 0.35rem; }
        .login-field__label { font-size: 0.8rem; font-weight: 600; color: #374151; }
        .login-field__wrap { position: relative; display: flex; align-items: center; }
        .login-field__icon {
          position: absolute; left: 0.85rem;
          color: #94a3b8;
          display: flex; align-items: center;
          pointer-events: none;
        }
        .login-field__input {
          width: 100%;
          box-sizing: border-box;
          padding: 0.72rem 0.85rem 0.72rem 2.5rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.9rem;
          color: #1e293b;
          font-family: 'Inter', sans-serif;
          background: #f8fafc;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
        }
        .login-field__input:focus {
          border-color: #0ea5e9;
          background: white;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.12);
        }
        .login-field__input::placeholder { color: #cbd5e1; }
        .login-field__addon {
          position: absolute; right: 0.85rem;
          display: flex; align-items: center;
          cursor: pointer; color: #94a3b8;
        }
        .login-field__addon:hover { color: #475569; }
        .login-field__addon button {
          background: none; border: none; cursor: pointer; padding: 0;
          display: flex; align-items: center; color: inherit;
        }

        /* Grid for 2-col fields */
        .login-fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

        /* ── Forgot link ── */
        .login-forgot {
          text-align: right;
          margin-top: -0.3rem;
        }
        .login-forgot button {
          background: none; border: none; cursor: pointer;
          font-size: 0.78rem; color: #0ea5e9; font-weight: 600;
          font-family: 'Inter', sans-serif; padding: 0;
        }
        .login-forgot button:hover { color: #0284c7; text-decoration: underline; }

        /* ── Submit Button ── */
        .login-submit {
          width: 100%;
          padding: 0.85rem;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #0284c7, #38bdf8);
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(2, 132, 199, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .login-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(2, 132, 199, 0.45);
        }
        .login-submit:active:not(:disabled) { transform: translateY(0); }
        .login-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .login-submit__spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Switch ── */
        .login-switch {
          text-align: center;
          margin-top: 1.2rem;
          font-size: 0.82rem;
          color: #64748b;
        }
        .login-switch button {
          background: none; border: none; cursor: pointer;
          color: #0ea5e9; font-weight: 700;
          font-family: 'Inter', sans-serif; padding: 0;
          font-size: 0.82rem;
        }
        .login-switch button:hover { text-decoration: underline; }

        /* ── Toast ── */
        .login-toast {
          position: fixed;
          top: 1.5rem; right: 1.5rem;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          max-width: 340px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          animation: toastIn 0.3s ease;
        }
        @keyframes toastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .login-toast--error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .login-toast--success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        .login-toast__icon { display: flex; align-items: center; flex-shrink: 0; }
        .login-toast__msg { flex: 1; }
        .login-toast__close {
          background: none; border: none; cursor: pointer;
          color: inherit; opacity: 0.6; padding: 0;
          display: flex; align-items: center;
        }
        .login-toast__close:hover { opacity: 1; }

        /* ── Divider ── */
        .login-divider {
          display: flex; align-items: center; gap: 0.75rem;
          margin: 1rem 0;
        }
        .login-divider__line { flex: 1; height: 1px; background: #e2e8f0; }
        .login-divider__text { font-size: 0.75rem; color: #94a3b8; white-space: nowrap; }

        /* ── Session expired banner ── */
        .login-expired-banner {
          background: linear-gradient(135deg, #fff7ed, #fef3c7);
          border: 1px solid #fcd34d;
          border-radius: 10px;
          padding: 0.7rem 1rem;
          font-size: 0.8rem;
          color: #92400e;
          font-weight: 500;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* ── Social Buttons ── */
        .social-login-section { margin-top: 1.25rem; }
        .social-divider {
          display: flex; align-items: center; gap: 0.75rem;
          margin: 0 0 1rem 0;
        }
        .social-divider__line { flex: 1; height: 1px; background: #e2e8f0; }
        .social-divider__text { font-size: 0.72rem; color: #94a3b8; white-space: nowrap; font-weight: 500; letter-spacing: 0.03em; }

        .social-btn-group { display: flex; flex-direction: column; gap: 0.6rem; }
        .social-btn {
          width: 100%;
          display: flex; align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 1rem;
          border: none; border-radius: 10px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          transition: all 0.18s ease;
          position: relative;
          overflow: hidden;
        }
        .social-btn:hover { filter: brightness(0.93); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .social-btn:active { transform: translateY(0); filter: brightness(0.88); }
        .social-btn--loading { opacity: 0.75; pointer-events: none; }
        /* Google button needs a visible border since it's white */
        #btn-social-google { border: 1.5px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        #btn-social-google:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .social-btn__logo {
          width: 22px; height: 22px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .social-btn__logo svg { width: 20px; height: 20px; }
        .social-btn__label { flex: 1; text-align: center; }
        .social-btn__spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          position: absolute; right: 1rem;
        }

        /* ── Responsive ── */
        @media (max-width: 480px) {
          .login-card { border-radius: 20px; }
          .login-panel-right { padding: 2rem 1.5rem; }
        }
      `}</style>

      {/* ── Page ── */}
      <div className="login-page">
        <BlobBackground />

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <div className="login-card">
          {/* ── Form Panel ── */}
          <div className="login-panel-right">
            {/* Session expired notice */}
            {sessionStorage.getItem("surazense_session_expired") && (
              <div className="login-expired-banner" role="alert">
                ⏰&nbsp;
                {th
                  ? "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่"
                  : "Session expired. Please log in again."}
              </div>
            )}

            {/* Email verification pending notice */}
            {verifyEmailPending && (
              <div
                className="login-expired-banner"
                role="alert"
                style={{
                  background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                  border: "1px solid #86efac",
                  color: "#15803d",
                }}
              >
                <span>✉️</span>&nbsp;
                <span>
                  {th ? (
                    <>
                      {`สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมล `}
                      <strong>{verifyEmailPending}</strong>
                      {` เพื่อยืนยันบัญชี`}&nbsp;
                      <Link
                        to={`/verify-email?email=${encodeURIComponent(verifyEmailPending)}`}
                        style={{ color: "#15803d", fontWeight: 700 }}
                      >
                        ยืนยันอีเมล →
                      </Link>
                    </>
                  ) : (
                    <>
                      {`Account created! Please check `}
                      <strong>{verifyEmailPending}</strong>
                      {` to verify your account.`}&nbsp;
                      <Link
                        to={`/verify-email?email=${encodeURIComponent(verifyEmailPending)}`}
                        style={{ color: "#15803d", fontWeight: 700 }}
                      >
                        Verify email →
                      </Link>
                    </>
                  )}
                </span>
              </div>
            )}

            {/* Tabs */}
            {tab !== "forgot" && (
              <div className="login-tabs" role="tablist">
                <button
                  role="tab"
                  aria-selected={tab === "login"}
                  className={`login-tab ${tab === "login" ? "login-tab--active" : ""}`}
                  onClick={() => switchTab("login")}
                  id="tab-login"
                >
                  {th ? "เข้าสู่ระบบ" : "Sign In"}
                </button>
                <button
                  role="tab"
                  aria-selected={tab === "signup"}
                  className={`login-tab ${tab === "signup" ? "login-tab--active" : ""}`}
                  onClick={() => switchTab("signup")}
                  id="tab-signup"
                >
                  {th ? "สมัครสมาชิก" : "Sign Up"}
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* ── LOGIN ── */}
              {tab === "login" && (
                <>
                  <div className="login-heading">
                    <h1>{th ? "ยินดีต้อนรับกลับ" : "Welcome back"}</h1>
                    <p>
                      {th
                        ? "กรุณากรอกอีเมลและรหัสผ่านของคุณ"
                        : "Enter your email and password to continue"}
                    </p>
                  </div>
                  <div className="login-fields">
                    <InputField
                      id="login-email"
                      icon={Mail}
                      label={th ? "อีเมล" : "Email"}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder={th ? "กรอกอีเมลของคุณ" : "your@email.com"}
                    />
                    <InputField
                      id="login-password"
                      icon={Lock}
                      label={th ? "รหัสผ่าน" : "Password"}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder={th ? "รหัสผ่านของคุณ" : "Your password"}
                      rightAddon={
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      }
                    />
                    <div className="login-forgot">
                      <button type="button" onClick={() => switchTab("forgot")}>
                        {th ? "ลืมรหัสผ่าน?" : "Forgot password?"}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      marginTop: "-0.1rem",
                    }}
                  >
                    <input
                      id="login-remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{
                        width: 16,
                        height: 16,
                        accentColor: "#0284c7",
                        cursor: "pointer",
                        borderRadius: 4,
                        flexShrink: 0,
                      }}
                    />
                    <label
                      htmlFor="login-remember-me"
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "#475569",
                        cursor: "pointer",
                        userSelect: "none",
                      }}
                    >
                      {th
                        ? "จดจำฉันไว้ในอุปกรณ์นี้"
                        : "Remember me on this device"}
                    </label>
                    {!rememberMe && (
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "#94a3b8",
                          marginLeft: "auto",
                        }}
                      >
                        {th
                          ? "(สิ้นสุดเมื่อปิด Browser)"
                          : "(ends on browser close)"}
                      </span>
                    )}
                  </div>

                  {/* Rate limit warning banner */}
                  {rateLimitCountdown > 0 && (
                    <div
                      style={{
                        background: "#fff7ed",
                        border: "1px solid #fed7aa",
                        borderRadius: 10,
                        padding: "0.6rem 0.9rem",
                        fontSize: "0.8rem",
                        color: "#c2410c",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      ⏳&nbsp;
                      {th
                        ? `ต้องรอ ${rateLimitCountdown} วินาทีก่อนลองใหม่`
                        : `Too many attempts — wait ${rateLimitCountdown}s`}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="login-submit"
                    disabled={isSubmitting || rateLimitCountdown > 0}
                    id="btn-login-submit"
                  >
                    {isSubmitting ? (
                      <div className="login-submit__spinner" />
                    ) : (
                      <>
                        {th ? "เข้าสู่ระบบ" : "Sign In"}
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>

                  {/* ── Social Login ── */}
                  <div className="social-login-section">
                    <div className="social-divider">
                      <div className="social-divider__line" />
                      <span className="social-divider__text">
                        {th ? "หรือเข้าสู่ระบบด้วย" : "OR CONTINUE WITH"}
                      </span>
                      <div className="social-divider__line" />
                    </div>
                    <div className="social-btn-group">
                      {/* Google */}
                      <SocialButton
                        provider="google"
                        label={
                          th ? "เข้าสู่ระบบด้วย Google" : "Continue with Google"
                        }
                        color="#ffffff"
                        hoverColor="#f1f5f9"
                        textColor="#1e293b"
                        onClick={() => handleSocialLogin("google")}
                        logo={`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>`}
                      />
                      {socialLoading === "google" && (
                        <div
                          className="social-btn__spinner"
                          style={{ position: "static", marginLeft: "auto" }}
                        />
                      )}

                      {/* Facebook */}
                      <SocialButton
                        provider="facebook"
                        label={
                          th
                            ? "เข้าสู่ระบบด้วย Facebook"
                            : "Continue with Facebook"
                        }
                        color="#1877F2"
                        hoverColor="#166fe5"
                        onClick={() => handleSocialLogin("facebook")}
                        logo={`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`}
                      />

                      {/* LINE */}
                      <SocialButton
                        provider="line"
                        label={
                          th ? "เข้าสู่ระบบด้วย LINE" : "Continue with LINE"
                        }
                        color="#06C755"
                        hoverColor="#05b34c"
                        onClick={() => handleSocialLogin("line")}
                        logo={`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="white"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.627.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>`}
                      />
                    </div>
                  </div>
                  <div className="login-switch">
                    {th ? "ยังไม่มีบัญชี?" : "Don't have an account?"}&nbsp;
                    <button type="button" onClick={() => switchTab("signup")}>
                      {th ? "สมัครสมาชิกฟรี" : "Sign up for free"}
                    </button>
                  </div>
                </>
              )}

              {/* ── SIGN UP ── */}
              {tab === "signup" && (
                <>
                  <div className="login-heading">
                    <h1>{th ? "สร้างบัญชีใหม่" : "Create account"}</h1>
                    <p>
                      {th
                        ? "กรอกข้อมูลด้านล่างเพื่อสมัครสมาชิก"
                        : "Fill in your details to get started"}
                    </p>
                  </div>
                  <div className="login-fields">
                    <InputField
                      id="signup-username"
                      icon={User}
                      label={th ? "ชื่อผู้ใช้งาน" : "Username"}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder={th ? "ชื่อผู้ใช้งาน" : "username"}
                    />
                    <div className="login-fields-grid">
                      <div className="login-field">
                        <label
                          htmlFor="signup-first"
                          className="login-field__label"
                        >
                          {th ? "ชื่อจริง" : "First Name"}
                        </label>
                        <div className="login-field__wrap">
                          <input
                            id="signup-first"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder={th ? "ชื่อจริง" : "First"}
                            className="login-field__input"
                            style={{ paddingLeft: "0.85rem" }}
                          />
                        </div>
                      </div>
                      <div className="login-field">
                        <label
                          htmlFor="signup-last"
                          className="login-field__label"
                        >
                          {th ? "นามสกุล" : "Last Name"}
                        </label>
                        <div className="login-field__wrap">
                          <input
                            id="signup-last"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder={th ? "นามสกุล" : "Last"}
                            className="login-field__input"
                            style={{ paddingLeft: "0.85rem" }}
                          />
                        </div>
                      </div>
                    </div>
                    <InputField
                      id="signup-phone"
                      icon={Phone}
                      label={th ? "เบอร์โทรศัพท์" : "Phone"}
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={th ? "เบอร์โทรศัพท์" : "Phone number"}
                    />
                    <InputField
                      id="signup-email"
                      icon={Mail}
                      label={th ? "อีเมล" : "Email"}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder={th ? "อีเมลของคุณ" : "your@email.com"}
                    />
                    <InputField
                      id="signup-password"
                      icon={Lock}
                      label={
                        th
                          ? "รหัสผ่าน (อย่างน้อย 8 ตัว)"
                          : "Password (min 8 chars)"
                      }
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      rightAddon={
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          aria-label="Toggle password"
                        >
                          {showPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      }
                    />
                    <InputField
                      id="signup-confirm"
                      icon={Lock}
                      label={th ? "ยืนยันรหัสผ่าน" : "Confirm Password"}
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      rightAddon={
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((p) => !p)}
                          aria-label="Toggle confirm password"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    className="login-submit"
                    disabled={isSubmitting}
                    id="btn-signup-submit"
                    style={{ marginTop: "1rem" }}
                  >
                    {isSubmitting ? (
                      <div className="login-submit__spinner" />
                    ) : (
                      <>
                        {th ? "สมัครสมาชิก" : "Create Account"}
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                  <div className="login-switch">
                    {th ? "มีบัญชีอยู่แล้ว?" : "Already have an account?"}&nbsp;
                    <button type="button" onClick={() => switchTab("login")}>
                      {th ? "เข้าสู่ระบบ" : "Sign in"}
                    </button>
                  </div>
                </>
              )}

              {/* ── FORGOT PASSWORD ── */}
              {tab === "forgot" && (
                <>
                  <div className="login-heading">
                    <h1>{th ? "ลืมรหัสผ่าน?" : "Forgot password?"}</h1>
                    <p>
                      {th
                        ? "กรอกอีเมลของคุณ เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้"
                        : "Enter your email and we'll send you a reset link"}
                    </p>
                  </div>
                  <div className="login-fields">
                    <InputField
                      id="forgot-email"
                      icon={Mail}
                      label={th ? "อีเมล" : "Email address"}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder={
                        th ? "อีเมลที่ลงทะเบียนไว้" : "registered@email.com"
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    className="login-submit"
                    disabled={isSubmitting}
                    id="btn-forgot-submit"
                    style={{ marginTop: "1rem" }}
                  >
                    {isSubmitting ? (
                      <div className="login-submit__spinner" />
                    ) : (
                      <>
                        {th ? "ส่งลิงก์รีเซ็ต" : "Send Reset Link"}
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                  <div className="login-switch">
                    <button type="button" onClick={() => switchTab("login")}>
                      ← {th ? "กลับไปหน้าเข้าสู่ระบบ" : "Back to Sign In"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
