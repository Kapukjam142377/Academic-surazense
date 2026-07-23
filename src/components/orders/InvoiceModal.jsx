import React from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Printer, X, FileText } from "lucide-react";

/** Format date to Stripe's format (e.g., April 27, 2026) */
function formatStripeDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function InvoiceModal({ order, language, onClose }) {
  if (!order) return null;

  const total = Number(order.total_amount ?? 0);
  const formattedDate = formatStripeDate(order.created_at);

  const handlePrint = () => {
    window.print();
  };

  // Generate clean mock receipt & invoice numbers to match Stripe format exactly
  const padId = order.id.toString().padStart(4, "0");
  const invoiceNumber = `SZHWUG3-${padId}`;
  const receiptNumber = `2444-2175-${padId}`;

  return createPortal(
    <div className="invoice-modal-overlay fixed inset-0 z-100 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm print:bg-white print:p-0 print:block">
      {/* Background Overlay (Click to close) */}
      <div onClick={onClose} className="fixed inset-0 print:hidden" />

      {/* CSS print override rule injected locally */}
      <style>{`
        /* Unify font family for the entire document (screen and print) */
        #printable-invoice-container, 
        #printable-invoice-container * {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }

        @media print {
          /* Hide the main website content */
          #root {
            display: none !important;
          }
          /* Reset body and page layouts for clean A4 printing */
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            color: black !important;
          }
          .invoice-modal-overlay {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
            overflow: visible !important;
          }
          .invoice-modal-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-w: 100% !important;
            height: auto !important;
            max-h: none !important;
            margin: 0 !important;
            padding: 40px !important;
            display: block !important;
            overflow: visible !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            background: white !important;
          }
          #printable-invoice-container {
            width: 100% !important;
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            overflow: visible !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="invoice-modal-content bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-100 flex flex-col z-10 relative max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none print:w-full print:p-0"
      >
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100 bg-slate-50 print:hidden shrink-0">
          <div className="flex items-center gap-2 text-slate-800">
            <FileText className="w-5 h-5 text-slate-600" />
            <span className="font-extrabold text-sm text-slate-700 tracking-wide">
              {order.payment_status === "paid" ? "Stripe Receipt" : "Stripe Invoice"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:bg-black rounded-xl transition-all cursor-pointer border-none shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              {language === "th" ? "พิมพ์ / บันทึก PDF" : "Print / Save PDF"}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer border-none bg-transparent"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Area - Formatted exactly like OpenAI's Stripe design */}
        <div
          id="printable-invoice-container"
          className="p-12 md:p-16 overflow-y-auto flex-1 bg-white print:overflow-visible print:p-0 text-slate-900"
        >
          {/* Top Row: Receipt/Invoice title & Brand Logo */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-[28px] font-bold tracking-tight text-black">
                {order.payment_status === "paid" ? "Receipt" : "Invoice"}
              </h1>

              {/* Document Metadata block */}
              <div className="mt-5 space-y-1 text-[13px] text-slate-800">
                <div className="flex">
                  <span className="text-slate-400 w-36 shrink-0">Invoice number</span>
                  <span className="font-medium text-slate-900">{invoiceNumber}</span>
                </div>
                {order.payment_status === "paid" && (
                  <div className="flex">
                    <span className="text-slate-400 w-36 shrink-0">Receipt number</span>
                    <span className="font-medium text-slate-900">{receiptNumber}</span>
                  </div>
                )}
                <div className="flex">
                  <span className="text-slate-400 w-36 shrink-0">
                    {order.payment_status === "paid" ? "Date paid" : "Date of issue"}
                  </span>
                  <span className="font-medium text-slate-900">{formattedDate}</span>
                </div>
                {order.payment_status !== "paid" && (
                  <div className="flex">
                    <span className="text-slate-400 w-36 shrink-0">Date due</span>
                    <span className="font-medium text-slate-900">{formattedDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Logo image from public/logo.png */}
            <div className="shrink-0">
              <img
                src="/logo.png"
                alt="SuraZense Logo"
                className="h-24 w-auto object-contain select-none print:max-h-24"
              />
            </div>
          </div>

          {/* Seller / Buyer details block (No top border between metadata and addresses) */}
          <div className="grid grid-cols-2 gap-12 text-[13px] mt-10">
            {/* Seller */}
            <div>
              <p className="font-semibold text-black">SuraZense Co., Ltd.</p>
              <p className="text-slate-500 leading-relaxed mt-1.5 whitespace-pre-line">
                394 Village No. 4, Chaimongkon Subdistrict,
                Mueang Nakhon Ratchasima District,
                Nakhon Ratchasima, 30000
                Thailand
                info@surazense.com
                TH VAT 0305565004265
              </p>
            </div>

            {/* Buyer */}
            <div>
              <p className="text-slate-400 font-semibold mb-1.5">Bill to</p>
              <p className="font-semibold text-black">{order.customer_name}</p>
              <p className="text-slate-550 leading-relaxed mt-1.5 whitespace-pre-line">
                {order.shipping_address}
                {order.customer_email && `\n${order.customer_email}`}
                {order.customer_phone && `\n${order.customer_phone}`}
              </p>
            </div>
          </div>

          {/* Bold amount highlight */}
          <div className="text-[22px] font-bold text-black mt-10 mb-2">
            ฿{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
            {order.payment_status === "paid" ? `paid on ${formattedDate}` : `due ${formattedDate}`}
          </div>
          {order.payment_status !== "paid" && (
            <div className="mb-4">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-blue-600 underline font-semibold text-[13px] hover:text-blue-800 print:hidden"
              >
                Pay online
              </a>
            </div>
          )}

          {/* Items Breakdown Table */}
          <div className="mt-8">
            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-slate-400 font-medium">
                  <th className="text-left pb-2 font-normal">Description</th>
                  <th className="text-right pb-2 font-normal w-16">Qty</th>
                  <th className="text-right pb-2 font-normal w-28">Unit price</th>
                  <th className="text-right pb-2 font-normal w-28">Amount</th>
                </tr>
              </thead>
              <tbody>
                {(order.items ?? []).map((item, idx) => (
                  <tr key={item.id ?? idx} className="border-b border-slate-100 text-slate-700">
                    <td className="py-3">
                      <span className="font-bold text-slate-900">{item.product_name}</span>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.product_category}</div>
                    </td>
                    <td className="py-3 text-right text-slate-900">{item.quantity}</td>
                    <td className="py-3 text-right text-slate-900">
                      ฿{Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 text-right font-medium text-slate-900">
                      ฿{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary pricing grid */}
          <div className="flex justify-end mt-6 text-[13px]">
            <div className="w-72 space-y-3">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">
                  ฿{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Total</span>
                <span className="font-medium text-slate-900">
                  ฿{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-250 pt-3 text-black font-bold">
                <span>{order.payment_status === "paid" ? "Amount paid" : "Amount due"}</span>
                <span>
                  ฿{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Payment History section (Only for Paid receipts) */}
          {order.payment_status === "paid" && (
            <div className="mt-10">
              <h3 className="text-[16px] font-bold text-black mb-4">Payment history</h3>
              <table className="w-full text-[13px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-400 font-medium">
                    <th className="text-left pb-2 font-normal">Payment method</th>
                    <th className="text-left pb-2 font-normal">Date</th>
                    <th className="text-right pb-2 font-normal">Amount paid</th>
                    <th className="text-right pb-2 font-normal">Receipt number</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-slate-700">
                    <td className="py-3 font-semibold text-slate-900">
                      {order.payment_method === "card" || order.payment_method === "Stripe"
                        ? "Card"
                        : (order.payment_method || "Card")}
                    </td>
                    <td className="py-3 text-slate-900">{formattedDate}</td>
                    <td className="py-3 text-right text-slate-900">
                      ฿{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 text-right text-slate-900">{receiptNumber}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
