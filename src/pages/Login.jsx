import React, { useState } from "react";
import { Mail, Key, User, Phone } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useUser } from "../context/UserContext";

export default function Login() {
  const { t, language } = useLanguage();
  const { login, register } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const [authMode, setAuthMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (authMode === "login") {
      const res = await login(email, password);
      if (res.success) {
        navigate(redirectPath);
      } else {
        setError(res.message);
      }
    } else {
      const res = await register({
        email,
        password,
        username,
        first_name: firstName,
        last_name: lastName,
        phone,
      });
      if (res.success) {
        navigate(redirectPath);
      } else {
        setError(res.message);
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 120px)",
        padding: "2rem 1rem",
      }}
    >
      <form
        onSubmit={handleSubmit}
          style={{
            background: "#eef8ff",
            border: "2px solid #0284c7",
            borderRadius: "20px",
            padding: "2rem",
            width: "100%",
            maxWidth: "380px",
            boxShadow: "0 20px 40px rgba(2, 132, 199, 0.08)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "1.25rem",
              color: "#111827",
              fontSize: "1.4rem",
              fontWeight: 700,
            }}
          >
            {authMode === "login"
              ? t("login.loginHeader")
              : language === "th"
                ? "สมัครสมาชิก"
                : "Sign Up"}
          </h2>

          {error && (
            <div
              style={{
                background: "#ffebe9",
                border: "1px solid #ffc1c0",
                borderRadius: "8px",
                padding: "0.75rem",
                marginBottom: "1rem",
                color: "#cf222e",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {authMode === "signup" && (
              <>
                {/* Username */}
                <div style={{ position: "relative" }}>
                  <User
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#64748b",
                    }}
                    size={16}
                  />
                  <input
                    type="text"
                    required
                    placeholder={
                      language === "th"
                        ? "ชื่อผู้ใช้งาน (Username)"
                        : "Username"
                    }
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "0.75rem 1rem 0.75rem 2.5rem",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: "0.9rem",
                      outline: "none",
                      color: "#333",
                    }}
                  />
                </div>

                {/* First Name & Last Name */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
                  }}
                >
                  <input
                    type="text"
                    placeholder={language === "th" ? "ชื่อจริง" : "First Name"}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: "0.9rem",
                      outline: "none",
                      color: "#333",
                    }}
                  />
                  <input
                    type="text"
                    placeholder={language === "th" ? "นามสกุล" : "Last Name"}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: "0.9rem",
                      outline: "none",
                      color: "#333",
                    }}
                  />
                </div>

                {/* Phone */}
                <div style={{ position: "relative" }}>
                  <Phone
                    style={{
                      position: "absolute",
                      left: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#64748b",
                    }}
                    size={16}
                  />
                  <input
                    type="tel"
                    placeholder={language === "th" ? "เบอร์โทรศัพท์" : "Phone"}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "0.75rem 1rem 0.75rem 2.5rem",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: "0.9rem",
                      outline: "none",
                      color: "#333",
                    }}
                  />
                </div>
              </>
            )}

            {/* Email Input */}
            <div style={{ position: "relative" }}>
              <Mail
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                }}
                size={16}
              />
              <input
                type="email"
                required
                placeholder={t("login.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "0.75rem 1rem 0.75rem 2.5rem",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "0.9rem",
                  outline: "none",
                  color: "#333",
                }}
              />
            </div>

            {/* Password Input */}
            <div style={{ position: "relative" }}>
              <Key
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                }}
                size={16}
              />
              <input
                type="password"
                required
                placeholder={t("login.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "0.75rem 1rem 0.75rem 2.5rem",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "0.9rem",
                  outline: "none",
                  color: "#333",
                }}
              />
            </div>
          </div>

          {authMode === "login" && (
            <div
              style={{
                textAlign: "right",
                marginTop: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <a
                href="#"
                style={{
                  color: "#111827",
                  textDecoration: "none",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                }}
              >
                {t("login.forgotPassword")}
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "0.8rem",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(to right, #7dd3fc, #38bdf8)",
              color: "white",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              boxShadow: "0 4px 15px rgba(56, 189, 248, 0.4)",
              marginTop: authMode === "signup" ? "1rem" : "0",
            }}
          >
            {isSubmitting
              ? language === "th"
                ? "กำลังดำเนินการ..."
                : "Processing..."
              : authMode === "login"
                ? t("login.continue")
                : language === "th"
                  ? "สมัครสมาชิก"
                  : "Sign Up"}
          </button>

          <div
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              fontSize: "0.8rem",
              color: "#111827",
            }}
          >
            {authMode === "login" ? (
              <>
                {t("login.dontHaveAccount")}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signup");
                    setError("");
                  }}
                  style={{
                    color: "#38bdf8",
                    textDecoration: "none",
                    fontWeight: 600,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {t("login.signUp")}
                </button>
              </>
            ) : (
              <>
                {language === "th"
                  ? "มีบัญชีอยู่แล้ว?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setError("");
                  }}
                  style={{
                    color: "#38bdf8",
                    textDecoration: "none",
                    fontWeight: 600,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {t("login.signIn")}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
  );
}
