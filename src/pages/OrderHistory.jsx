import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Package,
  FlaskConical,
  GraduationCap,
  ArrowLeft,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { useLanguage } from "../context/LanguageContext";
import OrderCard, { getOrderTab } from "../components/orders/OrderCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Tab definitions ──────────────────────────────────────────────────────────
const TABS = [
  {
    key: "all",
    icon: <ClipboardList className="w-4 h-4" />,
    label: { en: "All Orders", th: "ทั้งหมด" },
  },
  {
    key: "shipping",
    icon: <Package className="w-4 h-4" />,
    label: { en: "Shipping", th: "จัดส่ง" },
  },
  {
    key: "chemicals",
    icon: <FlaskConical className="w-4 h-4" />,
    label: { en: "Chemicals", th: "สารเคมี" },
  },
  {
    key: "courses",
    icon: <GraduationCap className="w-4 h-4" />,
    label: { en: "Courses", th: "คอร์สอบรม" },
  },
];

// ── Fetch helpers ─────────────────────────────────────────────────────────────
async function fetchOrdersFromAPI(userId) {
  const res = await fetch(`${API_URL}/api/orders?user_id=${userId}`);
  if (!res.ok) throw new Error("API error");
  return res.json();
}

function loadOrdersFromStorage(userId) {
  try {
    const raw = localStorage.getItem("surazense_orders");
    const all = raw ? JSON.parse(raw) : [];
    return all.filter(
      (o) => String(o.user_id) === String(userId) || o.user_id === userId,
    );
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
export default function OrderHistory() {
  const { user, loading: userLoading } = useUser();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [fetchState, setFetchState] = useState("idle"); // idle | loading | done | error
  const [activeTab, setActiveTab] = useState("all");

  // Redirect if not logged in
  useEffect(() => {
    if (!userLoading && !user) {
      navigate("/login?redirect=/orders");
    }
  }, [user, userLoading, navigate]);

  // Fetch orders
  useEffect(() => {
    if (!user) return;

    setFetchState("loading");

    fetchOrdersFromAPI(user.id)
      .then((data) => {
        setOrders(Array.isArray(data) ? data : (data.orders ?? []));
        setFetchState("done");
      })
      .catch(() => {
        // Graceful fallback to localStorage
        const local = loadOrdersFromStorage(user.id);
        setOrders(local);
        setFetchState("done");
      });
  }, [user]);

  // ── Filter orders by tab ──
  const filtered = orders.filter((order) => {
    if (activeTab === "all") return true;
    return getOrderTab(order) === activeTab;
  });

  // ── Tab counts ──
  const countByTab = TABS.reduce((acc, tab) => {
    acc[tab.key] =
      tab.key === "all"
        ? orders.length
        : orders.filter((o) => getOrderTab(o) === tab.key).length;
    return acc;
  }, {});

  // ── Loading skeleton ──
  if (userLoading || fetchState === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back link */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors mb-8 no-underline"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === "th" ? "กลับไปร้านค้า" : "Back to Store"}
        </Link>

        {/* Page heading */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight"
          >
            {language === "th" ? "ประวัติคำสั่งซื้อ" : "Order History"}
          </motion.h1>
          <p className="text-slate-400 text-sm mt-1">
            {user.first_name || user.username || user.email}
            {" · "}
            {orders.length}{" "}
            {language === "th" ? "รายการทั้งหมด" : "total orders"}
          </p>
        </div>

        {/* ── Category Tabs ── */}
        <div className="flex flex-wrap items-center gap-1 mb-8 border-b border-slate-200 pb-0">
          {TABS.map((tab, idx) => (
            <React.Fragment key={tab.key}>
              <button
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all border-b-2 -mb-px bg-transparent border-x-0 border-t-0 cursor-pointer outline-none ${
                  activeTab === tab.key
                    ? "border-b-blue-600 text-slate-900"
                    : "border-b-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.icon}
                {tab.label[language]}
                {countByTab[tab.key] > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center leading-none ${
                      activeTab === tab.key
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {countByTab[tab.key]}
                  </span>
                )}
              </button>
              {idx < TABS.length - 1 && (
                <div className="w-[1.5px] h-5 bg-blue-700 mx-1 mb-px" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Orders list ── */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <ShoppingBag className="w-14 h-14 text-slate-200 mb-4 stroke-[1.5px]" />
              <p className="text-slate-500 font-semibold text-lg">
                {language === "th"
                  ? "ยังไม่มีคำสั่งซื้อในหมวดนี้"
                  : "No orders in this category yet"}
              </p>
              <Link
                to="/products"
                className="mt-6 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold px-6 py-3 rounded-full transition-colors no-underline text-sm"
              >
                {language === "th" ? "เลือกซื้อสินค้า" : "Browse Products"}
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {filtered.map((order) => (
                <OrderCard key={order.id} order={order} language={language} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
