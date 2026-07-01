import React from "react";

const STATUS_CONFIG = {
  pending: {
    label: { en: "Pending", th: "รอดำเนินการ" },
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
  confirmed: {
    label: { en: "Confirmed", th: "ยืนยันแล้ว" },
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  shipped: {
    label: { en: "Shipped", th: "กำลังจัดส่ง" },
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
  delivered: {
    label: { en: "Delivered", th: "ส่งแล้ว" },
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: { en: "Cancelled", th: "ยกเลิก" },
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    dot: "bg-rose-500",
  },
};

/**
 * Colored badge showing order status.
 * @param {string} status - one of: pending | confirmed | shipped | delivered | cancelled
 * @param {string} language - "en" | "th"
 */
export default function OrderStatusBadge({ status, language = "en" }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] ?? STATUS_CONFIG.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.border} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label[language] ?? cfg.label.en}
    </span>
  );
}
