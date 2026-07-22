import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  X,
  Image as ImageIcon,
  Menu,
  Home,
  Info,
  ShoppingBag,
  Briefcase,
  Cpu,
  Handshake,
  Newspaper,
  Phone,
  User,
  LogOut,
  Clock,
  Calendar,
  Presentation,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useUser } from "../context/UserContext";

const COMPANY_WEB_URL =
  import.meta.env.VITE_COMPANY_WEB_URL || "https://surazense.com";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, itemCount, cartTotal } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  const { user, login, register, logout } = useUser();

  const [showTimeoutModal, setShowTimeoutModal] = useState(false);

  // Monitor for session expiration
  useEffect(() => {
    if (
      !user &&
      sessionStorage.getItem("surazense_session_expired") === "true"
    ) {
      setShowTimeoutModal(true);
      sessionStorage.removeItem("surazense_session_expired");
    }
  }, [user]);

  // Redirect guard: protect admin routes from non-admin logged-in users
  useEffect(() => {
    if (user && user.role !== "admin" && location.pathname === "/admin") {
      navigate("/dashboard");
    }
  }, [user, location.pathname, navigate]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginSidebarOpen, setIsLoginSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth Form States
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'signup'
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authUsername, setAuthUsername] = useState("");
  const [authFirstName, setAuthFirstName] = useState("");
  const [authLastName, setAuthLastName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const cartRef = useRef(null);

  // Close mobile drawer when changing page routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);

    if (authMode === "login") {
      const res = await login(authEmail, authPassword);
      if (res.success) {
        setIsLoginSidebarOpen(false);
        setAuthEmail("");
        setAuthPassword("");
      } else {
        setAuthError(res.message);
      }
    } else {
      const res = await register({
        email: authEmail,
        password: authPassword,
        username: authUsername,
        first_name: authFirstName,
        last_name: authLastName,
        phone: authPhone,
      });
      if (res.success) {
        setIsLoginSidebarOpen(false);
        setAuthEmail("");
        setAuthPassword("");
        setAuthUsername("");
        setAuthFirstName("");
        setAuthLastName("");
        setAuthPhone("");
      } else {
        setAuthError(res.message);
      }
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path) => {
    return location.pathname === path
      ? "text-accent font-semibold"
      : "text-slate-500 hover:text-accent font-medium";
  };

  const linkBaseClass =
    "text-[13px] tracking-wider uppercase transition-colors duration-200";

  if (location.pathname === "/admin") {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <main className="flex-1 flex flex-col w-full">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-lg border-b border-sky-100 shadow-[0_4px_20px_-1px_rgba(0,0,0,0.03)] flex justify-between items-center px-6 py-3 lg:px-12 w-full">
        <Link
          to="/"
          className="flex items-center gap-3 text-2xl font-extrabold text-accent no-underline tracking-tight"
        >
          <img
            src="/logo.png"
            alt="Surazense Logo"
            className="h-[46px] object-contain"
          />
          <span>Surazense</span>
        </Link>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <Link to="/" className={`${linkBaseClass} ${isActive("/")}`}>
            {t("nav.home")}
          </Link>
          <Link
            to="/products"
            className={`${linkBaseClass} ${isActive("/products")}`}
          >
            {t("nav.products")}
          </Link>
          <Link
            to="/dashboard"
            className={`${linkBaseClass} ${isActive("/dashboard")}`}
          >
            {t("nav.services")}
          </Link>
          <Link
            to="/event"
            className={`${linkBaseClass} ${isActive("/event")}`}
          >
            {t("nav.event")}
          </Link>
          <Link
            to="/conference"
            className={`${linkBaseClass} ${isActive("/conference")}`}
          >
            {t("nav.conference")}
          </Link>

          <Link to="/news" className={`${linkBaseClass} ${isActive("/news")}`}>
            {t("nav.news")}
          </Link>
          <Link
            to="/contacts"
            className={`${linkBaseClass} ${isActive("/contacts")}`}
          >
            {t("nav.contacts")}
          </Link>
          <div className="w-[1px] h-5 bg-slate-200 mx-2"></div>

          <button
            onClick={toggleLanguage}
            className={`${linkBaseClass} text-slate-700 hover:text-accent cursor-pointer active:scale-95 transition-transform bg-transparent border-none p-0 flex items-center gap-1`}
          >
            <span
              className={
                language === "en" ? "text-accent font-bold" : "text-slate-400"
              }
            >
              EN
            </span>
            <span className="text-slate-300">/</span>
            <span
              className={
                language === "th" ? "text-accent font-bold" : "text-slate-400"
              }
            >
              TH
            </span>
          </button>

          <div className="relative" ref={cartRef}>
            <button
              id="global-cart-icon"
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative text-slate-600 hover:text-accent transition-colors flex items-center justify-center p-1 cursor-pointer bg-transparent border-none outline-none"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-[1.15rem] h-[1.15rem] stroke-[2.5px]" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 px-1 bg-red-500 rounded-full border-[1.5px] border-white text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Cart Dropdown */}
            {isCartOpen && (
              <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl shadow-blue-900/10 border border-slate-100 py-4 px-5 z-50">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800">
                    {t("nav.yourCart")}
                  </h3>
                  <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                    {itemCount} items
                  </span>
                </div>

                <div className="space-y-4 mb-5 max-h-[60vh] overflow-y-auto">
                  {cartItems.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">
                      {t("nav.cartEmpty")}
                    </p>
                  ) : (
                    cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 items-center group"
                      >
                        <div className="w-12 h-12 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden relative">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={
                                typeof item.name === "object"
                                  ? item.name[language] || item.name.en || ""
                                  : item.name
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-300 stroke-[1.5px]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-bold text-slate-800 truncate"
                            title={
                              typeof item.name === "object"
                                ? item.name[language] || item.name.en || ""
                                : item.name
                            }
                          >
                            {typeof item.name === "object"
                              ? item.name[language] || item.name.en || ""
                              : item.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.quantity} x ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1 bg-transparent border-none cursor-pointer outline-none"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 mb-5 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">
                    {t("nav.subtotal")}
                  </span>
                  <span className="text-lg font-bold text-slate-900">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className={`w-full block text-center py-2.5 rounded-xl font-bold text-sm transition-colors no-underline ${cartItems.length > 0 ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-100 text-slate-400 pointer-events-none"}`}
                >
                  {t("nav.checkout")}
                </Link>
              </div>
            )}
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer border-none outline-none"
              >
                <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
                  {user.username ? user.username[0] : user.email[0]}
                </div>
                <span className="max-w-[100px] truncate">
                  {user.first_name || user.username || user.email.split("@")[0]}
                </span>
              </button>
              {isUserDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 py-1.5 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Signed in as
                    </p>
                    <p className="text-xs font-bold text-slate-700 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 no-underline"
                  >
                    <User className="w-4 h-4" />
                    <span>
                      {language === "th" ? "โปรไฟล์ส่วนตัว" : "My Profile"}
                    </span>
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2 no-underline"
                  >
                    <Clock className="w-4 h-4" />
                    <span>
                      {language === "th"
                        ? "ประวัติคำสั่งซื้อ"
                        : "Order History"}
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors bg-transparent border-none cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{language === "th" ? "ออกจากระบบ" : "Log Out"}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsLoginSidebarOpen(true)}
              className="bg-accent text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:-translate-y-[1px] hover:bg-accent-hover hover:shadow-[0_4px_12px_rgba(2,132,199,0.25)] active:translate-y-0 cursor-pointer border-none"
            >
              {t("nav.login")}
            </button>
          )}
        </div>

        {/* Mobile Controls (Cart & Hamburger Menu) */}
        <div className="flex lg:hidden items-center gap-4">
          {/* Mobile Cart Button */}
          <div className="relative">
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative text-slate-600 hover:text-accent transition-colors flex items-center justify-center p-1 cursor-pointer bg-transparent border-none outline-none"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-[1.25rem] h-[1.25rem] stroke-[2.5px]" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 px-1 bg-red-500 rounded-full border-[1.5px] border-white text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-slate-600 hover:text-accent p-1 cursor-pointer bg-transparent border-none outline-none flex items-center justify-center"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 stroke-[2.5px]" />
            ) : (
              <Menu className="w-6 h-6 stroke-[2.5px]" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Navigation Drawer Sheet */}
      <div
        className={`fixed top-0 left-0 h-full w-[320px] max-w-[100vw] bg-white z-[60] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-xl font-black text-accent no-underline tracking-tight"
          >
            <img
              src="/logo.png"
              alt="Surazense Logo"
              className="h-[36px] object-contain"
            />
            <span>Surazense</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors bg-transparent border-none cursor-pointer outline-none"
          >
            <X className="w-5 h-5 stroke-[2.5px]" />
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          <Link
            to="/"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold no-underline transition-all ${
              location.pathname === "/"
                ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Home className="w-5 h-5 stroke-[2.2px]" />
            <span className="uppercase tracking-wider">{t("nav.home")}</span>
          </Link>

          <Link
            to="/products"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold no-underline transition-all ${
              location.pathname === "/products"
                ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <ShoppingBag className="w-5 h-5 stroke-[2.2px]" />
            <span className="uppercase tracking-wider">
              {t("nav.products")}
            </span>
          </Link>

          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold no-underline transition-all ${
              location.pathname === "/dashboard"
                ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Briefcase className="w-5 h-5 stroke-[2.2px]" />
            <span className="uppercase tracking-wider">
              {t("nav.services")}
            </span>
          </Link>

          <Link
            to="/event"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold no-underline transition-all ${
              location.pathname === "/event"
                ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Calendar className="w-5 h-5 stroke-[2.2px]" />
            <span className="uppercase tracking-wider">{t("nav.event")}</span>
          </Link>

          <Link
            to="/conference"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold no-underline transition-all ${
              location.pathname === "/conference"
                ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Presentation className="w-5 h-5 stroke-[2.2px]" />
            <span className="uppercase tracking-wider">
              {t("nav.conference")}
            </span>
          </Link>

          <Link
            to="/news"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold no-underline transition-all ${
              location.pathname === "/news"
                ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Newspaper className="w-5 h-5 stroke-[2.2px]" />
            <span className="uppercase tracking-wider">{t("nav.news")}</span>
          </Link>

          <Link
            to="/contacts"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold no-underline transition-all ${
              location.pathname === "/contacts"
                ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Phone className="w-5 h-5 stroke-[2.2px]" />
            <span className="uppercase tracking-wider">
              {t("nav.contacts")}
            </span>
          </Link>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-4 shrink-0">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {t("nav.language")}
            </span>
            <button
              onClick={toggleLanguage}
              className="text-xs font-bold text-slate-700 hover:text-accent transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm cursor-pointer flex items-center gap-1"
            >
              <span
                className={
                  language === "en" ? "text-accent font-bold" : "text-slate-400"
                }
              >
                EN
              </span>
              <span className="text-slate-300">/</span>
              <span
                className={
                  language === "th" ? "text-accent font-bold" : "text-slate-400"
                }
              >
                TH
              </span>
            </button>
          </div>
          {user ? (
            <div className="flex flex-col gap-2">
              <div className="px-4 py-2.5 bg-slate-100 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold uppercase shrink-0">
                  {user.username ? user.username[0] : user.email[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {user.first_name ||
                      user.username ||
                      user.email.split("@")[0]}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors no-underline text-[14px]"
              >
                {language === "th" ? "โปรไฟล์ส่วนตัว" : "My Profile"}
              </Link>
              <Link
                to="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors no-underline text-[14px]"
              >
                {language === "th" ? "ประวัติคำสั่งซื้อ" : "Order History"}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl transition-colors cursor-pointer border-none text-[14px]"
              >
                {language === "th" ? "ออกจากระบบ" : "Log Out"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsLoginSidebarOpen(true);
              }}
              className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-sky-200 cursor-pointer border-none text-[14px]"
            >
              {t("nav.login")}
            </button>
          )}
        </div>
      </div>

      <main className="flex-1 flex flex-col w-full">{children}</main>

      <footer className="bg-[#4fb0da] text-white py-16 px-6 lg:px-12 mt-auto w-full">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
          {/* Column 1: Brand & Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white p-1 rounded w-12 h-12 flex items-center justify-center shadow-sm">
                <img
                  src="/logo.png"
                  alt="Surazense Logo"
                  className="w-[85%] h-[85%] object-contain"
                />
              </div>
              <span className="text-2xl font-medium tracking-tight">
                Surazense
              </span>
            </div>
            <p className="text-white/90 text-[14px] leading-relaxed mb-8 max-w-[280px]">
              {t("footer.brandDesc")}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-5">
              <a
                href="#"
                className="text-white/90 hover:text-white transition-colors hover:-translate-y-0.5 transform"
              >
                <svg
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-white/90 hover:text-white transition-colors hover:-translate-y-0.5 transform"
              >
                <svg
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-white/90 hover:text-white transition-colors hover:-translate-y-0.5 transform"
              >
                <svg
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a
                href="#"
                className="text-white/90 hover:text-white transition-colors hover:-translate-y-0.5 transform"
              >
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <h3 className="text-[17px] font-bold mb-6 text-white tracking-wide">
              {t("footer.pagesTitle")}
            </h3>
            <ul className="space-y-3.5">
              <li>
                <Link
                  to="/"
                  className="text-white/80 hover:text-white transition-colors text-[14px] no-underline"
                >
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-white/80 hover:text-white transition-colors text-[14px] no-underline"
                >
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link
                  to="/technology"
                  className="text-white/80 hover:text-white transition-colors text-[14px] no-underline"
                >
                  {t("nav.technology")}
                </Link>
              </li>
              <li>
                <Link
                  to="/collaboration"
                  className="text-white/80 hover:text-white transition-colors text-[14px] no-underline"
                >
                  {t("nav.collaboration")}
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="text-white/80 hover:text-white transition-colors text-[14px] no-underline"
                >
                  {t("nav.news")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contacts"
                  className="text-white/80 hover:text-white transition-colors text-[14px] no-underline"
                >
                  {t("nav.contacts")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Products & Services */}
          <div>
            <h3 className="text-[17px] font-bold mb-6 text-white tracking-wide">
              {t("footer.servicesTitle")}
            </h3>
            <ul className="space-y-3.5">
              <li>
                <Link
                  to="/products"
                  className="text-white/80 hover:text-white transition-colors text-[14px] no-underline"
                >
                  {t("nav.products")}
                </Link>
              </li>
              <li>
                <Link
                  to="/academic-training"
                  className="text-white/80 hover:text-white transition-colors text-[14px] no-underline"
                >
                  {t("nav.academicTraining")}
                </Link>
              </li>
              <li>
                <Link
                  to="/cancer-report"
                  className="text-white/80 hover:text-white transition-colors text-[14px] no-underline"
                >
                  {t("nav.cancerReport")}
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-white/80 hover:text-white transition-colors text-[14px] no-underline"
                >
                  {t("nav.xzenseSoftware")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Map */}
          <div className="flex flex-col pr-4">
            <h3 className="text-[17px] font-bold mb-6 text-white tracking-wide">
              {t("footer.mapsTitle")}
            </h3>
            <div className="w-full bg-white/10 overflow-hidden aspect-[1.4] flex items-center justify-center relative shadow-sm rounded-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.692899394595!2d102.04556377495457!3d14.86769648565092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311ead4fb4cb071b%3A0x964929032c5e61ae!2z4Lia4Lij4Li04Lip4Lix4LiXIOC4quC4uOC4o-C5gOC4i-C4meC4quC5jCDguIjguLPguIHguLHguJQgKOC4quC4s-C4meC4seC4geC4h-C4suC4meC5g-C4q-C4jeC5iCk!5e1!3m2!1sth!2sth!4v1781083830344!5m2!1sth!2sth"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Copyright (Bonus: Not in image but good practice) */}
        <div className="max-w-[1200px] mx-auto mt-16 pt-6 border-t border-white/20 text-center text-white/50 text-xs">
          <p>
            © {new Date().getFullYear()} Surazense Biosensors.{" "}
            {t("footer.rightsReserved")}
          </p>
        </div>
      </footer>

      {/* Login Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isLoginSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsLoginSidebarOpen(false)}
      />

      {/* Login Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[400px] max-w-[100vw] bg-white z-[70] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
          isLoginSidebarOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            {authMode === "login"
              ? t("login.loginHeader")
              : language === "th"
                ? "สมัครสมาชิก"
                : "Sign Up"}
          </h2>
          <button
            onClick={() => {
              setIsLoginSidebarOpen(false);
              setAuthError("");
            }}
            className="p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors bg-transparent border-none cursor-pointer outline-none"
          >
            <X className="w-5 h-5 stroke-[2.5px]" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-5">
            {authError && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-rose-600 text-xs font-semibold">
                {authError}
              </div>
            )}

            {authMode === "signup" && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {language === "th"
                      ? "ชื่อผู้ใช้งาน (Username)"
                      : "Username"}
                  </label>
                  <input
                    type="text"
                    required
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    placeholder="username"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-accent transition-all bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {language === "th" ? "ชื่อจริง" : "First Name"}
                    </label>
                    <input
                      type="text"
                      value={authFirstName}
                      onChange={(e) => setAuthFirstName(e.target.value)}
                      placeholder="John"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-accent transition-all bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {language === "th" ? "นามสกุล" : "Last Name"}
                    </label>
                    <input
                      type="text"
                      value={authLastName}
                      onChange={(e) => setAuthLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-accent transition-all bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {language === "th" ? "เบอร์โทรศัพท์" : "Phone"}
                  </label>
                  <input
                    type="tel"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="08XXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-accent transition-all bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400 text-sm"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {t("login.email")}
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-accent transition-all bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {t("login.password")}
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-accent transition-all bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400 text-sm"
              />
            </div>

            {authMode === "login" && (
              <div className="flex justify-between items-center text-xs mt-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-accent focus:ring-accent transition-colors"
                  />
                  <span className="text-slate-600 group-hover:text-slate-800 transition-colors font-semibold">
                    {t("login.rememberMe")}
                  </span>
                </label>
                <a
                  href="#"
                  className="text-accent hover:text-accent-hover font-bold no-underline transition-colors"
                >
                  {t("login.forgotPassword")}
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent hover:bg-accent-hover disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-sky-200 hover:shadow-xl hover:-translate-y-[1px] mt-4 cursor-pointer border-none text-[15px]"
            >
              {isSubmitting
                ? language === "th"
                  ? "กำลังดำเนินการ..."
                  : "Processing..."
                : authMode === "login"
                  ? t("login.signIn")
                  : language === "th"
                    ? "สมัครสมาชิก"
                    : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-slate-500 text-[15px] mt-8">
            {authMode === "login" ? (
              <>
                {t("login.dontHaveAccount")}
                <button
                  onClick={() => {
                    setAuthMode("signup");
                    setAuthError("");
                  }}
                  className="text-accent hover:text-accent-hover font-bold no-underline transition-colors ml-1 bg-transparent border-none cursor-pointer p-0"
                >
                  {t("login.signUp")}
                </button>
              </>
            ) : (
              <>
                {language === "th"
                  ? "มีบัญชีอยู่แล้ว?"
                  : "Already have an account?"}
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthError("");
                  }}
                  className="text-accent hover:text-accent-hover font-bold no-underline transition-colors ml-1 bg-transparent border-none cursor-pointer p-0"
                >
                  {t("login.signIn")}
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Session Timeout Warning Modal */}
      {showTimeoutModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-2xl p-8 w-full max-w-md text-center transform scale-in transition-all">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mx-auto mb-6">
              <Clock className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight mb-3">
              {language === "th" ? "เซสชันหมดอายุ" : "Session Expired"}
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              {language === "th"
                ? "คุณถูกออกจากระบบเนื่องจากไม่มีการใช้งานเป็นเวลานาน เพื่อความปลอดภัยของบัญชี กรุณาเข้าสู่ระบบอีกครั้งเพื่อดำเนินการต่อ"
                : "You have been logged out due to inactivity to protect your account. Please log in again to continue."}
            </p>
            <button
              onClick={() => {
                setShowTimeoutModal(false);
                setIsLoginSidebarOpen(true);
              }}
              className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-sky-200 cursor-pointer text-sm border-none"
            >
              {language === "th" ? "เข้าสู่ระบบอีกครั้ง" : "Log In Again"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
