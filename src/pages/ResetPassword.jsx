import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useUser } from "../context/UserContext";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  X,
  ArrowRight,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

// ── Animated Blob Background ─────────────────────────────────────────────────
const BlobBackground = () => (
  <div className="rp-bg-blobs" aria-hidden="true">
    <div className="rp-blob rp-blob-1" />
    <div className="rp-blob rp-blob-2" />
    <div className="rp-blob rp-blob-3" />
  </div>
);

// ── Toast Notification ────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <div className={`rp-toast rp-toast--${type}`} role="alert">
    <span className="rp-toast__icon">
      {type === "error" ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
    </span>
    <span className="rp-toast__msg">{message}</span>
    <button className="rp-toast__close" onClick={onClose} aria-label="Close">
      <X size={14} />
    </button>
  </div>
);

// ── Input Field ───────────────────────────────────────────────────────────────
const InputField = ({ icon: Icon, label, id, type = "text", value, onChange, required, placeholder, rightAddon, disabled }) => (
  <div className="rp-field">
    <label htmlFor={id} className="rp-field__label">{label}</label>
    <div className="rp-field__wrap">
      <span className="rp-field__icon"><Icon size={16} /></span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        className="rp-field__input"
        autoComplete={type === "password" ? "new-password" : "off"}
      />
      {rightAddon && <span className="rp-field__addon">{rightAddon}</span>}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
export default function ResetPassword() {
  const { language } = useLanguage();
  const { resetPassword, verifyResetToken } = useUser();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const th = language === "th";

  // States: 'verifying' | 'form' | 'success' | 'invalid'
  const [pageState, setPageState] = useState("verifying");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // ── Password strength ──
  const strength = (() => {
    if (!newPassword) return 0;
    let s = 0;
    if (newPassword.length >= 8) s++;
    if (/[A-Z]/.test(newPassword)) s++;
    if (/[0-9]/.test(newPassword)) s++;
    if (/[^A-Za-z0-9]/.test(newPassword)) s++;
    return s;
  })();

  const strengthLabel = th
    ? ["", "อ่อนมาก", "อ่อน", "ปานกลาง", "แข็งแกร่ง"][strength]
    : ["", "Very weak", "Weak", "Fair", "Strong"][strength];

  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"][strength];

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // ── Verify token on mount ──
  useEffect(() => {
    if (!token) {
      setPageState("invalid");
      return;
    }
    (async () => {
      const res = await verifyResetToken(token);
      setPageState(res.valid ? "form" : "invalid");
    })();
  }, [token]);

  // ── Submit handler ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast(th ? "รหัสผ่านไม่ตรงกัน" : "Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      showToast(th ? "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" : "Password must be at least 8 characters");
      return;
    }
    setIsSubmitting(true);
    const res = await resetPassword(token, newPassword);
    setIsSubmitting(false);
    if (res.success) {
      setPageState("success");
    } else {
      showToast(res.message || (th ? "เกิดข้อผิดพลาด กรุณาลองใหม่" : "Something went wrong. Please try again."));
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .rp-page {
          min-height: calc(100vh - 120px);
          display: flex; align-items: center; justify-content: center;
          padding: 2rem 1rem; position: relative;
          font-family: 'Inter', sans-serif; overflow: hidden;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #f8fafc 100%);
        }
        .rp-bg-blobs { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .rp-blob {
          position: absolute; border-radius: 50%;
          filter: blur(70px); opacity: 0.35;
          animation: rpBlobMove 12s ease-in-out infinite alternate;
        }
        .rp-blob-1 { width: 400px; height: 400px; background: radial-gradient(circle, #38bdf8, #818cf8); top: -120px; left: -120px; animation-duration: 14s; }
        .rp-blob-2 { width: 350px; height: 350px; background: radial-gradient(circle, #c084fc, #f472b6); bottom: -100px; right: -80px; animation-duration: 10s; animation-delay: -4s; }
        .rp-blob-3 { width: 250px; height: 250px; background: radial-gradient(circle, #34d399, #38bdf8); bottom: 30%; left: 10%; animation-duration: 18s; animation-delay: -8s; }
        @keyframes rpBlobMove {
          0% { transform: translate(0,0) scale(1); }
          50% { transform: translate(30px,-20px) scale(1.08); }
          100% { transform: translate(-20px,30px) scale(0.96); }
        }
        .rp-card {
          width: 100%; max-width: 440px; border-radius: 28px; overflow: hidden;
          box-shadow: 0 30px 60px rgba(2,132,199,0.12), 0 0 0 1px rgba(148,163,184,0.12);
          position: relative; z-index: 1; background: white; padding: 3rem 2.5rem;
        }
        .rp-icon-badge {
          width: 64px; height: 64px; border-radius: 18px;
          background: linear-gradient(135deg, #dbeafe, #e0f2fe);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.25rem; color: #0284c7;
        }
        .rp-heading { margin-bottom: 1.75rem; }
        .rp-heading h1 { font-size: 1.6rem; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; margin: 0 0 0.35rem 0; }
        .rp-heading p { font-size: 0.85rem; color: #64748b; margin: 0; line-height: 1.5; }
        .rp-fields { display: flex; flex-direction: column; gap: 0.9rem; margin-bottom: 0.5rem; }
        .rp-field { display: flex; flex-direction: column; gap: 0.35rem; }
        .rp-field__label { font-size: 0.8rem; font-weight: 600; color: #374151; }
        .rp-field__wrap { position: relative; display: flex; align-items: center; }
        .rp-field__icon { position: absolute; left: 0.85rem; color: #94a3b8; display: flex; align-items: center; pointer-events: none; }
        .rp-field__input {
          width: 100%; box-sizing: border-box;
          padding: 0.72rem 0.85rem 0.72rem 2.5rem;
          border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.9rem;
          color: #1e293b; font-family: 'Inter', sans-serif; background: #f8fafc;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; outline: none;
        }
        .rp-field__input:focus { border-color: #0ea5e9; background: white; box-shadow: 0 0 0 3px rgba(14,165,233,0.12); }
        .rp-field__input:disabled { opacity: 0.6; cursor: not-allowed; }
        .rp-field__input::placeholder { color: #cbd5e1; }
        .rp-field__addon { position: absolute; right: 0.85rem; display: flex; align-items: center; cursor: pointer; color: #94a3b8; }
        .rp-field__addon:hover { color: #475569; }
        .rp-field__addon button { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; color: inherit; }
        .rp-strength { margin-top: 0.35rem; }
        .rp-strength__bar { height: 4px; border-radius: 2px; background: #e2e8f0; overflow: hidden; }
        .rp-strength__fill { height: 100%; border-radius: 2px; transition: width 0.3s ease, background 0.3s ease; }
        .rp-strength__label { font-size: 0.72rem; font-weight: 600; margin-top: 0.25rem; }
        .rp-submit {
          width: 100%; padding: 0.85rem; border: none; border-radius: 12px;
          background: linear-gradient(135deg, #0284c7, #38bdf8);
          color: white; font-weight: 700; font-size: 0.95rem; font-family: 'Inter', sans-serif;
          cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 15px rgba(2,132,199,0.35);
          display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 0.75rem;
        }
        .rp-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(2,132,199,0.45); }
        .rp-submit:active:not(:disabled) { transform: translateY(0); }
        .rp-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .rp-submit__spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: rpSpin 0.7s linear infinite; }
        @keyframes rpSpin { to { transform: rotate(360deg); } }
        .rp-back { text-align: center; margin-top: 1.25rem; font-size: 0.82rem; color: #64748b; }
        .rp-back a { color: #0ea5e9; font-weight: 700; font-family: 'Inter', sans-serif; font-size: 0.82rem; text-decoration: none; }
        .rp-back a:hover { text-decoration: underline; }
        .rp-state { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 1rem 0; }
        .rp-state__icon { width: 72px; height: 72px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; }
        .rp-state__icon--success { background: #f0fdf4; color: #16a34a; }
        .rp-state__icon--error { background: #fef2f2; color: #dc2626; }
        .rp-state__icon--loading { background: #f0f9ff; color: #0284c7; animation: rpPulse 1.5s ease-in-out infinite; }
        @keyframes rpPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.85; } }
        .rp-state h2 { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0 0 0.5rem 0; letter-spacing: -0.3px; }
        .rp-state p { font-size: 0.875rem; color: #64748b; margin: 0 0 1.5rem 0; line-height: 1.6; max-width: 300px; }
        .rp-state__spinner { width: 32px; height: 32px; border: 3px solid #e0f2fe; border-top-color: #0284c7; border-radius: 50%; animation: rpSpin 0.8s linear infinite; }
        .rp-toast {
          position: fixed; top: 1.5rem; right: 1.5rem; z-index: 9999;
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.75rem 1rem; border-radius: 12px; font-size: 0.85rem;
          font-weight: 500; font-family: 'Inter', sans-serif; max-width: 340px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12); animation: rpToastIn 0.3s ease;
        }
        @keyframes rpToastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .rp-toast--error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .rp-toast--success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        .rp-toast__icon { display: flex; align-items: center; flex-shrink: 0; }
        .rp-toast__msg { flex: 1; }
        .rp-toast__close { background: none; border: none; cursor: pointer; color: inherit; opacity: 0.6; padding: 0; display: flex; align-items: center; }
        .rp-toast__close:hover { opacity: 1; }
        .rp-btn-primary {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.75rem 1.75rem; border: none; border-radius: 12px;
          background: linear-gradient(135deg, #0284c7, #38bdf8);
          color: white; font-size: 0.875rem; font-weight: 700;
          font-family: 'Inter', sans-serif; cursor: pointer; text-decoration: none;
          transition: all 0.2s; box-shadow: 0 4px 15px rgba(2,132,199,0.35);
        }
        .rp-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(2,132,199,0.45); }
        .rp-btn-outline {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.7rem 1.5rem; border: 2px solid #0ea5e9; border-radius: 12px;
          color: #0284c7; background: white; font-size: 0.875rem; font-weight: 700;
          font-family: 'Inter', sans-serif; cursor: pointer; text-decoration: none;
          transition: all 0.2s;
        }
        .rp-btn-outline:hover { background: #0284c7; color: white; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(2,132,199,0.3); }
        @media (max-width: 480px) { .rp-card { border-radius: 20px; padding: 2rem 1.5rem; } }
      `}</style>

      <div className="rp-page">
        <BlobBackground />

        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        <div className="rp-card">

          {/* ── VERIFYING TOKEN ── */}
          {pageState === "verifying" && (
            <div className="rp-state">
              <div className="rp-state__icon rp-state__icon--loading">
                <div className="rp-state__spinner" />
              </div>
              <h2>{th ? "กำลังตรวจสอบ..." : "Verifying link..."}</h2>
              <p>{th ? "กรุณารอสักครู่" : "Please wait a moment"}</p>
            </div>
          )}

          {/* ── INVALID TOKEN ── */}
          {pageState === "invalid" && (
            <div className="rp-state">
              <div className="rp-state__icon rp-state__icon--error">
                <AlertCircle size={32} />
              </div>
              <h2>{th ? "ลิงก์ไม่ถูกต้อง" : "Invalid link"}</h2>
              <p>
                {th
                  ? "ลิงก์รีเซ็ตรหัสผ่านนี้หมดอายุหรือไม่ถูกต้อง กรุณาขอลิงก์ใหม่อีกครั้ง"
                  : "This password reset link has expired or is invalid. Please request a new one."}
              </p>
              <Link to="/login" className="rp-btn-outline" id="btn-rp-request-new">
                {th ? "ขอลิงก์ใหม่" : "Request a new link"}
              </Link>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {pageState === "success" && (
            <div className="rp-state">
              <div className="rp-state__icon rp-state__icon--success">
                <CheckCircle size={32} />
              </div>
              <h2>{th ? "ตั้งรหัสผ่านใหม่สำเร็จ!" : "Password reset!"}</h2>
              <p>
                {th
                  ? "รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว คุณสามารถเข้าสู่ระบบได้ทันที"
                  : "Your password has been successfully updated. You can now sign in with your new password."}
              </p>
              <Link to="/login" className="rp-btn-primary" id="btn-rp-goto-login">
                {th ? "เข้าสู่ระบบ" : "Sign in"} <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* ── FORM ── */}
          {pageState === "form" && (
            <>
              <div className="rp-icon-badge">
                <KeyRound size={28} />
              </div>
              <div className="rp-heading">
                <h1>{th ? "ตั้งรหัสผ่านใหม่" : "Set new password"}</h1>
                <p>
                  {th
                    ? "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร"
                    : "Your new password must be at least 8 characters long."}
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="rp-fields">
                  <div>
                    <InputField
                      id="rp-new-password"
                      icon={Lock}
                      label={th ? "รหัสผ่านใหม่" : "New Password"}
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      disabled={isSubmitting}
                      rightAddon={
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      }
                    />
                    {/* Password strength meter */}
                    {newPassword && (
                      <div className="rp-strength">
                        <div className="rp-strength__bar">
                          <div
                            className="rp-strength__fill"
                            style={{ width: `${(strength / 4) * 100}%`, background: strengthColor }}
                          />
                        </div>
                        <p className="rp-strength__label" style={{ color: strengthColor }}>
                          {strengthLabel}
                        </p>
                      </div>
                    )}
                  </div>

                  <InputField
                    id="rp-confirm-password"
                    icon={ShieldCheck}
                    label={th ? "ยืนยันรหัสผ่านใหม่" : "Confirm New Password"}
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    rightAddon={
                      <button
                        type="button"
                        onClick={() => setShowConfirm((p) => !p)}
                        aria-label="Toggle confirm password"
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="rp-submit"
                  disabled={isSubmitting || !newPassword || !confirmPassword}
                  id="btn-reset-submit"
                >
                  {isSubmitting ? (
                    <div className="rp-submit__spinner" />
                  ) : (
                    <>
                      {th ? "บันทึกรหัสผ่านใหม่" : "Save New Password"}
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>

              <div className="rp-back">
                <Link to="/login">
                  ← {th ? "กลับไปหน้าเข้าสู่ระบบ" : "Back to Sign In"}
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
