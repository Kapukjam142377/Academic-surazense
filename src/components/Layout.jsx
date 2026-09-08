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
  Bell,
  CheckCheck,
  Trash2,
  Megaphone,
  Package,
  AlertCircle,
  FileText,
  Sparkles,
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
  // useEffect(() => {
  //   if (user && user.role !== "admin" && location.pathname === "/admin") {
  //     navigate("/dashboard");
  //   }
  // }, [user, location.pathname, navigate]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const cartRef = useRef(null);
  const notifRef = useRef(null);

  // Notification Center States
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState("all");

  const API_URL = import.meta.env.PROD
    ? ""
    : import.meta.env.VITE_API_URL || "http://34.87.78.35:8000";

  const userId = user?.id || 1;

  const MOCK_NOTIFICATIONS = [
    {
      id: 101,
      user_id: userId,
      title:
        language === "th"
          ? "ยินดีต้อนรับสู่ระบบ SuraZense"
          : "Welcome to SuraZense",
      message:
        language === "th"
          ? "ขอบคุณที่ลงทะเบียนใช้งานแพลตฟอร์มวิเคราะห์ไบโอเซนเซอร์ Xzense-101"
          : "Thank you for registering on the SuraZense biosensor platform.",
      type: "system",
      is_read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 102,
      user_id: userId,
      title:
        language === "th"
          ? "ประกาศข่าวสารใหม่: Xzense-101 Release"
          : "New Announcement: Xzense-101 Release",
      message:
        language === "th"
          ? "เปิดตัวเครื่องอ่านสัญญาณ QCM รุ่นใหม่ ความละเอียดระดับ sub-nanogram"
          : "Official launch of Xzense-101 QCM biosensor analyzer.",
      type: "announcement",
      reference_id: 1,
      is_read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 103,
      user_id: userId,
      title:
        language === "th"
          ? "คำสั่งซื้อสำเร็จ #ORD-9821"
          : "Order Confirmed #ORD-9821",
      message:
        language === "th"
          ? "เราได้รับรายการสั่งซื้อ QCM Gold Sensor Crystal เรียบร้อยแล้ว"
          : "Your order for QCM Gold Sensor Crystal has been processed.",
      type: "order",
      reference_id: 9821,
      is_read: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const fetchUserNotifications = async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/users/${user.id}/notifications`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data && data.length > 0 ? data : MOCK_NOTIFICATIONS);
      } else {
        setNotifications(MOCK_NOTIFICATIONS);
      }
    } catch (e) {
      setNotifications(MOCK_NOTIFICATIONS);
    }
  };

  const fetchUnreadCount = async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    try {
      const res = await fetch(
        `${API_URL}/api/users/${user.id}/notifications/unread-count`,
      );
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.unread_count);
      } else {
        setUnreadCount(MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length);
      }
    } catch (e) {
      setUnreadCount(MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserNotifications();
      fetchUnreadCount();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, API_URL]);

  const handleMarkAsRead = async (notifId) => {
    try {
      const res = await fetch(`${API_URL}/api/notifications/${notifId}/read`, {
        method: "PATCH",
      });
      if (res.ok) {
        fetchUserNotifications();
        fetchUnreadCount();
      }
    } catch (e) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, is_read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/users/${userId}/notifications/read-all`,
        {
          method: "PATCH",
        },
      );
      if (res.ok) {
        fetchUserNotifications();
        fetchUnreadCount();
      }
    } catch (e) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  };

  const handleDeleteNotif = async (notifId, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_URL}/api/notifications/${notifId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchUserNotifications();
        fetchUnreadCount();
      }
    } catch (err) {
      setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    if (notifFilter === "unread") return !n.is_read;
    if (notifFilter !== "all") return n.type === notifFilter;
    return true;
  });

  const getNotifIcon = (type) => {
    switch (type) {
      case "order":
        return <Package className="w-4 h-4 text-emerald-500" />;
      case "announcement":
        return <Megaphone className="w-4 h-4 text-sky-500" />;
      case "system":
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-500" />;
    }
  };

  const formatNotifTime = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  // Close mobile drawer when changing page routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
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

  if (
    location.pathname === "/admin" ||
    location.pathname.endsWith("/invoice")
  ) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 print:bg-white">
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

          {/* Notifications Dropdown (Only for logged-in users) */}
          {user && (
            <div className="relative" ref={notifRef}>
              <button
                id="global-notif-icon"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative text-slate-600 hover:text-accent transition-colors flex items-center justify-center p-1 cursor-pointer bg-transparent border-none outline-none"
                title="Notifications"
              >
                <Bell className="w-[1.15rem] h-[1.15rem] stroke-[2.5px]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 px-1 bg-sky-500 rounded-full border-[1.5px] border-white text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute top-full right-0 mt-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl shadow-blue-900/10 border border-slate-100 py-4 px-5 z-50">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-accent" />
                      <h3 className="font-bold text-slate-800 text-sm">
                        {language === "th" ? "การแจ้งเตือน" : "Notifications"}
                      </h3>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-sky-100 text-sky-700 font-bold px-2 py-0.5 rounded-full">
                          {unreadCount}{" "}
                          {language === "th" ? "ยังไม่อ่าน" : "unread"}
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-[11px] font-semibold text-accent hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>
                          {language === "th" ? "อ่านทั้งหมด" : "Read all"}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 text-[11px] no-scrollbar">
                    {["all", "unread", "order", "announcement", "system"].map(
                      (f) => (
                        <button
                          key={f}
                          onClick={() => setNotifFilter(f)}
                          className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer border-none capitalize ${
                            notifFilter === f
                              ? "bg-accent text-white font-bold"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {f}
                        </button>
                      ),
                    )}
                  </div>

                  {/* Notification Items List */}
                  <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                    {filteredNotifs.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">
                        {language === "th"
                          ? "ไม่มีการแจ้งเตือน"
                          : "No notifications found."}
                      </p>
                    ) : (
                      filteredNotifs.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            if (!n.is_read) handleMarkAsRead(n.id);
                            if (n.type === "announcement") navigate("/news");
                            if (n.type === "order") navigate("/order-history");
                            setIsNotifOpen(false);
                          }}
                          className={`group relative p-3 rounded-xl border transition-all cursor-pointer flex gap-3 items-start ${
                            !n.is_read
                              ? "bg-sky-50/70 border-sky-200/80 shadow-xs"
                              : "bg-white hover:bg-slate-50 border-slate-100"
                          }`}
                        >
                          <div className="mt-0.5 p-2 rounded-lg bg-white border border-slate-100 shadow-xs shrink-0 text-slate-600">
                            {getNotifIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0 pr-4">
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                              {n.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                              {n.message}
                            </p>
                            <span className="text-[9px] text-slate-400 font-mono mt-1 block">
                              {formatNotifTime(n.created_at)}
                            </span>
                          </div>
                          {!n.is_read && (
                            <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-1.5" />
                          )}
                          <button
                            onClick={(e) => handleDeleteNotif(n.id, e)}
                            className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 transition-opacity bg-transparent border-none cursor-pointer"
                            title="Delete notification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

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
                            {item.quantity} x ฿
                            {Number(item.price).toLocaleString("th-TH", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
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
                    ฿
                    {Number(cartTotal).toLocaleString("th-TH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
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
              onClick={() => navigate("/login")}
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
                navigate("/login");
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
                navigate("/login");
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
