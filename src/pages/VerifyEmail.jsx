import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useUser } from "../context/UserContext";
import {
  Mail,
  CheckCircle,
  AlertCircle,
  X,
  ArrowRight,
  RefreshCw,
  MailOpen,
} from "lucide-react";

// ── Animated Blob Background ─────────────────────────────────────────────────
const BlobBackground = () => (
  <div className="ve-bg-blobs" aria-hidden="true">
    <div className="ve-blob ve-blob-1" />
    <div className="ve-blob ve-blob-2" />
    <div className="ve-blob ve-blob-3" />
  </div>
);

// ── Toast Notification ────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <div className={`ve-toast ve-toast--${type}`} role="alert">
    <span className="ve-toast__icon">
      {type === "error" ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
    </span>
    <span className="ve-toast__msg">{message}</span>
    <button className="ve-toast__close" onClick={onClose} aria-label="Close">
      <X size={14} />
    </button>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
export default function VerifyEmail() {
  const { language } = useLanguage();
  const { verifyEmail, resendVerification, user } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const emailParam = searchParams.get("email") || user?.email || "";

  const th = language === "th";

  // States: 'verifying' | 'success' | 'error' | 'already' | 'resend'
  const [pageState, setPageState] = useState(token ? "verifying" : "resend");
  const [toast, setToast] = useState(null);
  const [resendEmail, setResendEmail] = useState(emailParam);
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  const startCountdown = (seconds = 60) => {
    setCountdown(seconds);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (countdownRef.current) clearInterval(countdownRef.current); }, []);

  // ── Auto-verify when token is in URL ──
  useEffect(() => {
    if (!token) return;
    (async () => {
      const res = await verifyEmail(token);
      if (res.success) {
        setPageState(res.alreadyVerified ? "already" : "success");
        // Redirect to login after 4 seconds if not logged in, or home if logged in
        setTimeout(() => {
          navigate(user ? "/" : "/login", { replace: true });
        }, 4500);
      } else {
        setPageState("error");
      }
    })();
  }, [token]);

  // ── Resend handler ──
  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail) {
      showToast(th ? "กรุณากรอกอีเมล" : "Please enter your email");
      return;
    }
    setIsSending(true);
    const res = await resendVerification(resendEmail);
    setIsSending(false);
    if (res.success) {
      showToast(
        th
          ? `ส่งอีเมลยืนยันไปที่ ${resendEmail} แล้ว กรุณาตรวจสอบ inbox`
          : `Verification email sent to ${resendEmail}. Please check your inbox.`,
        "success"
      );
      startCountdown(60);
    } else {
      showToast(res.message || (th ? "เกิดข้อผิดพลาด กรุณาลองใหม่" : "Something went wrong. Please try again."));
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .ve-page {
          min-height: calc(100vh - 120px);
          display: flex; align-items: center; justify-content: center;
          padding: 2rem 1rem; position: relative;
          font-family: 'Inter', sans-serif; overflow: hidden;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #f8fafc 100%);
        }
        .ve-bg-blobs { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .ve-blob {
          position: absolute; border-radius: 50%;
          filter: blur(70px); opacity: 0.35;
          animation: veBlobMove 12s ease-in-out infinite alternate;
        }
        .ve-blob-1 { width: 400px; height: 400px; background: radial-gradient(circle, #38bdf8, #818cf8); top: -120px; left: -120px; animation-duration: 14s; }
        .ve-blob-2 { width: 350px; height: 350px; background: radial-gradient(circle, #c084fc, #f472b6); bottom: -100px; right: -80px; animation-duration: 10s; animation-delay: -4s; }
        .ve-blob-3 { width: 250px; height: 250px; background: radial-gradient(circle, #34d399, #38bdf8); bottom: 30%; left: 10%; animation-duration: 18s; animation-delay: -8s; }
        @keyframes veBlobMove {
          0% { transform: translate(0,0) scale(1); }
          50% { transform: translate(30px,-20px) scale(1.08); }
          100% { transform: translate(-20px,30px) scale(0.96); }
        }
        .ve-card {
          width: 100%; max-width: 440px; border-radius: 28px; overflow: hidden;
          box-shadow: 0 30px 60px rgba(2,132,199,0.12), 0 0 0 1px rgba(148,163,184,0.12);
          position: relative; z-index: 1; background: white; padding: 3rem 2.5rem;
        }
        .ve-icon-badge {
          width: 72px; height: 72px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.5rem;
        }
        .ve-icon-badge--blue { background: linear-gradient(135deg, #dbeafe, #e0f2fe); color: #0284c7; }
        .ve-icon-badge--green { background: #f0fdf4; color: #16a34a; }
        .ve-icon-badge--red { background: #fef2f2; color: #dc2626; }
        .ve-icon-badge--loading { background: #f0f9ff; color: #0284c7; animation: vePulse 1.5s ease-in-out infinite; }
        @keyframes vePulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.85; } }
        .ve-state { display: flex; flex-direction: column; align-items: center; text-align: center; }
        .ve-state h1 { font-size: 1.5rem; font-weight: 800; color: #0f172a; letter-spacing: -0.4px; margin: 0 0 0.5rem 0; }
        .ve-state p { font-size: 0.875rem; color: #64748b; margin: 0 0 1.75rem 0; line-height: 1.65; max-width: 320px; }
        .ve-state p strong { color: #0f172a; font-weight: 700; }
        .ve-spinner { width: 32px; height: 32px; border: 3px solid #e0f2fe; border-top-color: #0284c7; border-radius: 50%; animation: veSpin 0.8s linear infinite; }
        @keyframes veSpin { to { transform: rotate(360deg); } }
        .ve-btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.75rem; border: none; border-radius: 12px;
          background: linear-gradient(135deg, #0284c7, #38bdf8);
          color: white; font-size: 0.875rem; font-weight: 700;
          font-family: 'Inter', sans-serif; cursor: pointer; text-decoration: none;
          transition: all 0.2s; box-shadow: 0 4px 15px rgba(2,132,199,0.35);
        }
        .ve-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(2,132,199,0.45); }
        .ve-btn-outline {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.7rem 1.5rem; border: 2px solid #0ea5e9; border-radius: 12px;
          color: #0284c7; background: white; font-size: 0.875rem; font-weight: 700;
          font-family: 'Inter', sans-serif; cursor: pointer; text-decoration: none;
          transition: all 0.2s;
        }
        .ve-btn-outline:hover { background: #0284c7; color: white; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(2,132,199,0.3); }
        /* Countdown redirect bar */
        .ve-redirect-bar {
          width: 100%; height: 3px; background: #e2e8f0;
          border-radius: 2px; overflow: hidden; margin-bottom: 1.5rem;
        }
        .ve-redirect-fill {
          height: 100%; background: linear-gradient(90deg, #22c55e, #16a34a);
          border-radius: 2px; animation: veCountdownBar 4.5s linear forwards;
        }
        @keyframes veCountdownBar { from { width: 100%; } to { width: 0%; } }
        /* Resend form */
        .ve-resend-heading { margin-bottom: 1.75rem; }
        .ve-resend-heading h1 { font-size: 1.5rem; font-weight: 800; color: #0f172a; letter-spacing: -0.4px; margin: 0 0 0.4rem 0; }
        .ve-resend-heading p { font-size: 0.85rem; color: #64748b; margin: 0; line-height: 1.55; }
        .ve-field { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.75rem; }
        .ve-field__label { font-size: 0.8rem; font-weight: 600; color: #374151; }
        .ve-field__wrap { position: relative; display: flex; align-items: center; }
        .ve-field__icon { position: absolute; left: 0.85rem; color: #94a3b8; display: flex; align-items: center; pointer-events: none; }
        .ve-field__input {
          width: 100%; box-sizing: border-box;
          padding: 0.72rem 0.85rem 0.72rem 2.5rem;
          border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.9rem;
          color: #1e293b; font-family: 'Inter', sans-serif; background: #f8fafc;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; outline: none;
        }
        .ve-field__input:focus { border-color: #0ea5e9; background: white; box-shadow: 0 0 0 3px rgba(14,165,233,0.12); }
        .ve-field__input::placeholder { color: #cbd5e1; }
        .ve-submit {
          width: 100%; padding: 0.85rem; border: none; border-radius: 12px;
          background: linear-gradient(135deg, #0284c7, #38bdf8);
          color: white; font-weight: 700; font-size: 0.95rem; font-family: 'Inter', sans-serif;
          cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 15px rgba(2,132,199,0.35);
          display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 0.5rem;
        }
        .ve-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(2,132,199,0.45); }
        .ve-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .ve-submit__spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.4); border-top-color: white; border-radius: 50%; animation: veSpin 0.7s linear infinite; }
        .ve-countdown-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: #f0f9ff; border: 1px solid #bae6fd;
          border-radius: 20px; padding: 0.35rem 0.85rem;
          font-size: 0.78rem; font-weight: 600; color: #0284c7;
          margin-top: 0.75rem;
        }
        .ve-back { text-align: center; margin-top: 1.25rem; font-size: 0.82rem; color: #64748b; }
        .ve-back a { color: #0ea5e9; font-weight: 700; font-family: 'Inter', sans-serif; font-size: 0.82rem; text-decoration: none; }
        .ve-back a:hover { text-decoration: underline; }
        /* Info banner */
        .ve-info-banner {
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          border: 1px solid #bae6fd; border-radius: 10px;
          padding: 0.75rem 1rem; font-size: 0.8rem; color: #0369a1;
          margin-bottom: 1.25rem; display: flex; align-items: flex-start; gap: 0.5rem;
          line-height: 1.5;
        }
        .ve-toast {
          position: fixed; top: 1.5rem; right: 1.5rem; z-index: 9999;
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.75rem 1rem; border-radius: 12px; font-size: 0.85rem;
          font-weight: 500; font-family: 'Inter', sans-serif; max-width: 360px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12); animation: veToastIn 0.3s ease;
        }
        @keyframes veToastIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .ve-toast--error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .ve-toast--success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        .ve-toast__icon { display: flex; align-items: center; flex-shrink: 0; }
        .ve-toast__msg { flex: 1; }
        .ve-toast__close { background: none; border: none; cursor: pointer; color: inherit; opacity: 0.6; padding: 0; display: flex; align-items: center; }
        .ve-toast__close:hover { opacity: 1; }
        @media (max-width: 480px) { .ve-card { border-radius: 20px; padding: 2rem 1.5rem; } }
      `}</style>

      <div className="ve-page">
        <BlobBackground />

        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        <div className="ve-card">

          {/* ── VERIFYING ── */}
          {pageState === "verifying" && (
            <div className="ve-state">
              <div className="ve-icon-badge ve-icon-badge--loading">
                <div className="ve-spinner" />
              </div>
              <h1>{th ? "กำลังยืนยันอีเมล..." : "Verifying email..."}</h1>
              <p>{th ? "กรุณารอสักครู่ ระบบกำลังตรวจสอบข้อมูลของคุณ" : "Please wait while we verify your email address."}</p>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {pageState === "success" && (
            <div className="ve-state">
              <div className="ve-redirect-bar"><div className="ve-redirect-fill" /></div>
              <div className="ve-icon-badge ve-icon-badge--green">
                <CheckCircle size={34} />
              </div>
              <h1>{th ? "ยืนยันอีเมลสำเร็จ! 🎉" : "Email Verified! 🎉"}</h1>
              <p>
                {th
                  ? "อีเมลของคุณได้รับการยืนยันเรียบร้อยแล้ว กำลังพาคุณไปหน้าถัดไป..."
                  : "Your email has been successfully verified. Redirecting you now..."}
              </p>
              <Link to={user ? "/" : "/login"} className="ve-btn-primary" id="btn-ve-continue">
                {th ? "ดำเนินการต่อ" : "Continue"} <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* ── ALREADY VERIFIED ── */}
          {pageState === "already" && (
            <div className="ve-state">
              <div className="ve-redirect-bar"><div className="ve-redirect-fill" /></div>
              <div className="ve-icon-badge ve-icon-badge--green">
                <CheckCircle size={34} />
              </div>
              <h1>{th ? "ยืนยันแล้ว" : "Already verified"}</h1>
              <p>
                {th
                  ? "อีเมลนี้ได้รับการยืนยันไปแล้ว คุณสามารถเข้าสู่ระบบได้ทันที"
                  : "This email has already been verified. You can sign in right away."}
              </p>
              <Link to="/login" className="ve-btn-primary" id="btn-ve-signin">
                {th ? "เข้าสู่ระบบ" : "Sign in"} <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* ── ERROR ── */}
          {pageState === "error" && (
            <div className="ve-state">
              <div className="ve-icon-badge ve-icon-badge--red">
                <AlertCircle size={34} />
              </div>
              <h1>{th ? "ยืนยันไม่สำเร็จ" : "Verification failed"}</h1>
              <p>
                {th
                  ? "ลิงก์ยืนยันอีเมลนี้หมดอายุหรือไม่ถูกต้อง กรุณาขอลิงก์ยืนยันใหม่"
                  : "This verification link is invalid or has expired. Please request a new one."}
              </p>
              <button
                className="ve-btn-primary"
                onClick={() => setPageState("resend")}
                id="btn-ve-resend-from-error"
              >
                <RefreshCw size={15} />
                {th ? "ขอลิงก์ใหม่" : "Request new link"}
              </button>
            </div>
          )}

          {/* ── RESEND FORM ── */}
          {pageState === "resend" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <div className="ve-icon-badge ve-icon-badge--blue" style={{ flexShrink: 0, marginBottom: 0 }}>
                  <MailOpen size={30} />
                </div>
                <div className="ve-resend-heading" style={{ marginBottom: 0 }}>
                  <h1>{th ? "ยืนยันอีเมลของคุณ" : "Verify your email"}</h1>
                  <p style={{ marginBottom: 0 }}>
                    {th
                      ? "กรอกอีเมลที่ลงทะเบียนไว้เพื่อรับลิงก์ยืนยัน"
                      : "Enter your registered email to receive a verification link."}
                  </p>
                </div>
              </div>

              {emailParam && (
                <div className="ve-info-banner">
                  <Mail size={15} style={{ flexShrink: 0, marginTop: 2 }} />
                  {th
                    ? `เราส่งลิงก์ยืนยันไปที่ ${emailParam} แล้ว กรุณาตรวจสอบ inbox และ spam folder`
                    : `We've sent a verification link to ${emailParam}. Check your inbox and spam folder.`}
                </div>
              )}

              <form onSubmit={handleResend} noValidate>
                <div className="ve-field">
                  <label htmlFor="ve-email" className="ve-field__label">
                    {th ? "อีเมล" : "Email address"}
                  </label>
                  <div className="ve-field__wrap">
                    <span className="ve-field__icon"><Mail size={16} /></span>
                    <input
                      id="ve-email"
                      type="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      required
                      placeholder={th ? "อีเมลที่ลงทะเบียนไว้" : "your@email.com"}
                      className="ve-field__input"
                      disabled={isSending}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="ve-submit"
                  disabled={isSending || countdown > 0}
                  id="btn-ve-send"
                >
                  {isSending ? (
                    <div className="ve-submit__spinner" />
                  ) : (
                    <>
                      <RefreshCw size={16} />
                      {countdown > 0
                        ? (th ? `ส่งใหม่ได้ใน ${countdown}s` : `Resend in ${countdown}s`)
                        : (th ? "ส่งลิงก์ยืนยัน" : "Send Verification Link")}
                    </>
                  )}
                </button>

                {countdown > 0 && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div className="ve-countdown-badge">
                      <RefreshCw size={12} />
                      {th ? `ส่งได้อีกครั้งใน ${countdown} วินาที` : `You can resend in ${countdown}s`}
                    </div>
                  </div>
                )}
              </form>

              <div className="ve-back">
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
