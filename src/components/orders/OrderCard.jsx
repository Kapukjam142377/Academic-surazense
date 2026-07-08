import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Package,
  FlaskConical,
  GraduationCap,
} from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";

/** Map product category → tab key */
const CATEGORY_TAB = {
  Biosensors: "shipping",
  Modules: "shipping",
  Accessories: "shipping",
  Chemicals: "chemicals",
  Courses: "courses",
};

/** Category icon */
function CategoryIcon({ category, className = "w-4 h-4" }) {
  if (category === "Chemicals")
    return <FlaskConical className={`${className} text-emerald-500`} />;
  if (category === "Courses")
    return <GraduationCap className={`${className} text-purple-500`} />;
  return <Package className={`${className} text-blue-500`} />;
}

/** Format date to locale string */
function formatDate(dateStr, language) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString(language === "th" ? "th-TH" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Detect primary tab of an order (highest subtotal per category group) */
export function getOrderTab(order) {
  const totals = { shipping: 0, chemicals: 0, courses: 0 };
  (order.items || []).forEach((item) => {
    const tab = CATEGORY_TAB[item.product_category] ?? "shipping";
    totals[tab] += item.price * item.quantity;
  });
  return Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
}

/**
 * Single order card with expandable item list.
 */
export default function OrderCard({ order, language }) {
  const [expanded, setExpanded] = useState(false);

  const primaryCategory = order.items?.[0]?.product_category ?? "Biosensors";

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Card Header */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Left: icon + order info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            <CategoryIcon category={primaryCategory} className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-slate-800">
              {language === "th" ? "คำสั่งซื้อ" : "Order"}{" "}
              <span className="text-blue-600">#{order.id}</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {formatDate(order.created_at, language)}
              {order.payment_method && (
                <span className="ml-2 text-slate-300">·</span>
              )}
              {order.payment_method && (
                <span className="ml-2">{order.payment_method}</span>
              )}
            </p>
          </div>
        </div>

        {/* Right: amount + status + toggle */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <span className="text-base font-black text-slate-900">
            ${Number(order.total_amount ?? 0).toFixed(2)}
          </span>
          <OrderStatusBadge
            status={order.status ?? "pending"}
            language={language}
          />
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer p-1 outline-none"
          >
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
            {language === "th"
              ? expanded
                ? "ซ่อน"
                : "ดูรายละเอียด"
              : expanded
                ? "Hide"
                : "Details"}
          </button>
        </div>
      </div>

      {/* Expanded: Items list */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="items"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="border-t border-slate-100 px-5 py-4 space-y-3 bg-slate-50/60">
              {/* Shipping address block — only for non-course orders */}
              {order.shipping_address && (
                <div className="bg-white rounded-xl border border-slate-100 px-4 py-3 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {language === "th" ? "ที่อยู่จัดส่ง" : "Shipping Address"}
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {order.shipping_address}
                  </p>
                  {order.customer_phone && (
                    <p className="text-xs text-slate-500 font-mono">
                      {language === "th" ? "โทร" : "Tel"}:{" "}
                      {order.customer_phone}
                    </p>
                  )}
                </div>
              )}

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {language === "th" ? "รายการสินค้า" : "Items"}
              </p>
              {(order.items ?? []).map((item, idx) => (
                <div
                  key={item.id ?? idx}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CategoryIcon
                      category={item.product_category}
                      className="w-3.5 h-3.5 shrink-0"
                    />
                    <span className="text-sm font-semibold text-slate-700 truncate">
                      {item.product_name}
                    </span>
                    <span className="text-xs text-slate-400 shrink-0">
                      x{item.quantity}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-800 shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              {/* Subtotals */}
              <div className="pt-2 border-t border-slate-200/60 flex justify-between text-sm font-black text-slate-900">
                <span>{language === "th" ? "รวมทั้งสิ้น" : "Total"}</span>
                <span>${Number(order.total_amount ?? 0).toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
