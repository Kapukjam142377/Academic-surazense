import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useUser } from "../context/UserContext";
import { CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

// ── Animated Blob Background ─────────────────────────────────────────────────
const BlobBackground = () => (
  <div className="oc-bg-blobs" aria-hidden="true">
    <div className="oc-blob oc-blob-1" />
    <div className="oc-blob oc-blob-2" />
    <div className="oc-blob oc-blob-3" />
  </div>
);

const PROVIDER_LABELS = {
  google: "Google",
  facebook: "Facebook",
  line: "LINE",
};

const PROVIDER_COLORS = {
  google: "#4285F4",
  facebook: "#1877F2",
  line: "#06C755",
};

// ─────────────────────────────────────────────────────────────────────────────
export default function OAuthCallback() {
  const { language } = useLanguage();
  const { login } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const th = language === "th";

  const provider = searchParams.get("provider") || "google";
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const redirectPath = (() => {
    try { return state ? JSON.parse(atob(state)).redirect || "/" : "/"; }
    catch { return "/"; }
  })();

  // States: 'processing' | 'success' | 'error'
  const [pageState, setPageState] = useState("processing");
  const [errorMsg, setErrorMsg] = useState("");

  const API_URL = import.meta.env.PROD
    ? ""
    : import.meta.env.VITE_API_URL || "http://34.87.78.35:8000";

  useEffect(() => {
    // If the provider returned an error directly
    if (error) {
      setErrorMsg(
        error === "access_denied"
          ? (th ? "คุณยกเลิกการเข้าสู่ระบบด้วย " + PROVIDER_LABELS[provider] : "You cancelled the " + PROVIDER_LABELS[provider] + " sign-in.")
          : (errorDescription || (th ? "เกิดข้อผิดพลาดจาก " + PROVIDER_LABELS[provider] : "An error occurred with " + PROVIDER_LABELS[provider]))
      );
      setPageState("error");
      return;
    }

    if (!code) {
      setErrorMsg(th ? "ไม่พบรหัส authorization กรุณาลองใหม่" : "Missing authorization code. Please try again.");
      setPageState("error");
      return;
    }

    // Exchange code for token via backend
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/${provider}/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, state }),
        });

        if (!res.ok) {
          let errMsg = th ? "การยืนยันตัวตนล้มเหลว" : "Authentication failed";
          try {
            const errData = await res.json();
            errMsg = errData.detail || errMsg;
          } catch { /* ignore */ }
          setErrorMsg(errMsg);
          setPageState("error");
          return;
        }

        const data = await res.json();
        // Backend should return { access_token, user } or { token, user }
        if (data.access_token || data.token) {
          // Use context login path to set token + user properly
          // Or set them directly if the context exposes a setTokenAndUser helper
          setPageState("success");
          setTimeout(() => navigate(redirectPath, { replace: true }), 1800);
        } else {
          setErrorMsg(th ? "ไม่ได้รับ token จาก server" : "No token returned from server.");
          setPageState("error");
        }
      } catch (err) {
        console.warn("OAuth callback: API unavailable", err);
        setErrorMsg(
          th
            ? `ไม่สามารถเชื่อมต่อ server ได้ กรุณาตั้งค่า ${PROVIDER_LABELS[provider]} OAuth ใน backend ก่อน`
            : `Cannot connect to server. Please configure ${PROVIDER_LABELS[provider]} OAuth in the backend first.`
        );
        setPageState("error");
      }
    })();
  }, []);

  const providerLabel = PROVIDER_LABELS[provider] || provider;
  const providerColor = PROVIDER_COLORS[provider] || "#0284c7";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .oc-page {
          min-height: calc(100vh - 120px);
          display: flex; align-items: center; justify-content: center;
          padding: 2rem 1rem; position: relative;
          font-family: 'Inter', sans-serif; overflow: hidden;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #f8fafc 100%);
        }
        .oc-bg-blobs { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .oc-blob {
          position: absolute; border-radius: 50%;
          filter: blur(70px); opacity: 0.35;
          animation: ocBlobMove 12s ease-in-out infinite alternate;
        }
        .oc-blob-1 { width: 400px; height: 400px; background: radial-gradient(circle, #38bdf8, #818cf8); top: -120px; left: -120px; animation-duration: 14s; }
        .oc-blob-2 { width: 350px; height: 350px; background: radial-gradient(circle, #c084fc, #f472b6); bottom: -100px; right: -80px; animation-duration: 10s; animation-delay: -4s; }
        .oc-blob-3 { width: 250px; height: 250px; background: radial-gradient(circle, #34d399, #38bdf8); bottom: 30%; left: 10%; animation-duration: 18s; animation-delay: -8s; }
        @keyframes ocBlobMove {
          0% { transform: translate(0,0) scale(1); }
          50% { transform: translate(30px,-20px) scale(1.08); }
          100% { transform: translate(-20px,30px) scale(0.96); }
        }
        .oc-card {
          width: 100%; max-width: 420px; border-radius: 28px;
          box-shadow: 0 30px 60px rgba(2,132,199,0.12), 0 0 0 1px rgba(148,163,184,0.12);
          position: relative; z-index: 1; background: white;
          padding: 3rem 2.5rem; text-align: center;
          display: flex; flex-direction: column; align-items: center;
        }
        .oc-provider-badge {
          display: flex; align-items: center; gap: 0.5rem;
          background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px;
          padding: 0.35rem 1rem; font-size: 0.78rem; font-weight: 700;
          color: #475569; margin-bottom: 1.75rem;
        }
        .oc-provider-dot {
          width: 10px; height: 10px; border-radius: 50%;
        }
        .oc-icon {
          width: 80px; height: 80px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.5rem;
        }
        .oc-icon--processing {
          background: #f0f9ff; color: #0284c7;
          animation: ocPulse 1.5s ease-in-out infinite;
        }
        .oc-icon--success { background: #f0fdf4; color: #16a34a; }
        .oc-icon--error { background: #fef2f2; color: #dc2626; }
        @keyframes ocPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
        .oc-spinner {
          width: 36px; height: 36px;
          border: 3.5px solid #e0f2fe; border-top-color: #0284c7;
          border-radius: 50%; animation: ocSpin 0.8s linear infinite;
        }
        @keyframes ocSpin { to { transform: rotate(360deg); } }
        .oc-title {
          font-size: 1.5rem; font-weight: 800; color: #0f172a;
          letter-spacing: -0.4px; margin: 0 0 0.5rem 0;
        }
        .oc-subtitle {
          font-size: 0.875rem; color: #64748b;
          margin: 0 0 1.75rem 0; line-height: 1.6; max-width: 300px;
        }
        .oc-progress {
          width: 100%; height: 4px; background: #e2e8f0;
          border-radius: 2px; overflow: hidden; margin-bottom: 1.5rem;
        }
        .oc-progress-bar {
          height: 100%; border-radius: 2px;
          animation: ocProgress 1.8s ease forwards;
        }
        @keyframes ocProgress { from { width: 0%; } to { width: 100%; } }
        .oc-btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.75rem; border: none; border-radius: 12px;
          background: linear-gradient(135deg, #0284c7, #38bdf8);
          color: white; font-size: 0.875rem; font-weight: 700;
          font-family: 'Inter', sans-serif; cursor: pointer; text-decoration: none;
          transition: all 0.2s; box-shadow: 0 4px 15px rgba(2,132,199,0.35);
          margin-bottom: 0.75rem;
        }
        .oc-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(2,132,199,0.45); }
        .oc-btn-outline {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.65rem 1.4rem; border: 2px solid #e2e8f0; border-radius: 12px;
          color: #64748b; background: white; font-size: 0.8rem; font-weight: 600;
          font-family: 'Inter', sans-serif; cursor: pointer; text-decoration: none;
          transition: all 0.2s;
        }
        .oc-btn-outline:hover { border-color: #94a3b8; color: #374151; }
        .oc-error-box {
          background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 10px; padding: 0.75rem 1rem;
          font-size: 0.8rem; color: #dc2626; font-weight: 500;
          margin-bottom: 1.5rem; text-align: left; line-height: 1.55;
          width: 100%; box-sizing: border-box;
        }
        @media (max-width: 480px) { .oc-card { border-radius: 20px; padding: 2rem 1.5rem; } }
      `}</style>

      <div className="oc-page">
        <BlobBackground />

        <div className="oc-card">
          {/* Provider badge */}
          <div className="oc-provider-badge">
            <span className="oc-provider-dot" style={{ background: providerColor }} />
            {providerLabel}
          </div>

          {/* ── PROCESSING ── */}
          {pageState === "processing" && (
            <>
              <div className="oc-icon oc-icon--processing">
                <div className="oc-spinner" />
              </div>
              <h1 className="oc-title">
                {th ? `กำลังเข้าสู่ระบบด้วย ${providerLabel}...` : `Signing in with ${providerLabel}...`}
              </h1>
              <p className="oc-subtitle">
                {th ? "กำลังตรวจสอบตัวตน กรุณารอสักครู่" : "Verifying your identity, please wait a moment."}
              </p>
              <div className="oc-progress">
                <div className="oc-progress-bar" style={{ background: `linear-gradient(90deg, ${providerColor}88, ${providerColor})` }} />
              </div>
            </>
          )}

          {/* ── SUCCESS ── */}
          {pageState === "success" && (
            <>
              <div className="oc-icon oc-icon--success">
                <CheckCircle size={36} />
              </div>
              <h1 className="oc-title">
                {th ? "เข้าสู่ระบบสำเร็จ!" : "Signed in successfully!"}
              </h1>
              <p className="oc-subtitle">
                {th ? `เข้าสู่ระบบด้วย ${providerLabel} สำเร็จ กำลังพาคุณไปหน้าถัดไป...` : `Signed in with ${providerLabel}. Redirecting you now...`}
              </p>
              <div className="oc-progress">
                <div className="oc-progress-bar" style={{ background: "linear-gradient(90deg, #22c55e, #16a34a)" }} />
              </div>
            </>
          )}

          {/* ── ERROR ── */}
          {pageState === "error" && (
            <>
              <div className="oc-icon oc-icon--error">
                <AlertCircle size={36} />
              </div>
              <h1 className="oc-title">
                {th ? "เข้าสู่ระบบไม่สำเร็จ" : "Sign-in failed"}
              </h1>
              {errorMsg && (
                <div className="oc-error-box">{errorMsg}</div>
              )}
              <Link to="/login" className="oc-btn-primary" id="btn-oc-retry">
                {th ? "กลับไปหน้าเข้าสู่ระบบ" : "Back to Sign In"} <ArrowRight size={16} />
              </Link>
              <Link to="/" className="oc-btn-outline" id="btn-oc-home">
                {th ? "หน้าหลัก" : "Go to Home"}
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
