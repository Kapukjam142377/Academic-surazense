import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Download } from "lucide-react";

const API_URL = import.meta.env.PROD
  ? ""
  : import.meta.env.VITE_API_URL || "http://34.87.78.35:8000";

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

export default function InvoicePrintPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfGenerating, setPdfGenerating] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_URL}/api/orders/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load order details");
        return res.json();
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const triggerDownloadPDF = (targetOrder) => {
    const element = document.getElementById("printable-invoice-container");
    if (!element) return;

    setPdfGenerating(true);

    const padId = targetOrder.id.toString().padStart(4, "0");
    const docName = targetOrder.payment_status === "paid" ? "Receipt" : "Invoice";
    const docNum = targetOrder.payment_status === "paid" ? `2444-2175-${padId}` : `SZHWUG3-${padId}`;
    const filename = `${docName}_${docNum}.pdf`;

    const opt = {
      margin:       15,
      filename:     filename,
      image:        { type: "jpeg", quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: "mm", format: "a4", orientation: "portrait" }
    };

    window.html2pdf()
      .from(element)
      .set(opt)
      .save()
      .then(() => {
        setPdfGenerating(false);
      })
      .catch((err) => {
        console.error("PDF generation failed:", err);
        setPdfGenerating(false);
      });
  };

  // Auto load html2pdf.js CDN and download PDF
  useEffect(() => {
    if (order) {
      if (!window.html2pdf) {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        script.integrity = "sha512-GsLlZN/3F2ErC5IfS97tDK+NHhCaLkWTRfOBVuLkfmG1oqtf5cBHCXG36Vto39dy0OW3wLwTFTdXg05_3BG54A==";
        script.crossOrigin = "anonymous";
        script.referrerPolicy = "no-referrer";
        script.onload = () => {
          setTimeout(() => {
            triggerDownloadPDF(order);
          }, 800);
        };
        document.body.appendChild(script);
      } else {
        setTimeout(() => {
          triggerDownloadPDF(order);
        }, 800);
      }
    }
  }, [order]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-500 font-sans">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-4" />
        <p className="text-sm">Generating document view...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-600 font-sans p-6 text-center">
        <p className="text-red-500 font-bold mb-4">Error: {error || "Order not found"}</p>
        <Link to="/orders" className="text-blue-600 underline font-semibold text-sm">
          Back to Order History
        </Link>
      </div>
    );
  }

  const total = Number(order.total_amount ?? 0);
  const formattedDate = formatStripeDate(order.created_at);

  const padId = order.id.toString().padStart(4, "0");
  const invoiceNumber = `SZHWUG3-${padId}`;
  const receiptNumber = `2444-2175-${padId}`;

  return (
    <div className="bg-slate-50 min-h-screen py-10 print:bg-white print:py-0 font-sans">
      {/* Dynamic style sheet to force print layout and hide other layers */}
      <style>{`
        /* Reset fonts specifically for the invoice */
        .invoice-print-container, 
        .invoice-print-container * {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }

        @media print {
          /* Hide all headers, footers, control buttons when printing */
          .print\\:hidden, #root > *:not(.invoice-print-wrapper) {
            display: none !important;
          }
          body, html {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .invoice-print-wrapper {
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }
        }
      `}</style>

      {/* Control Toolbar (Hidden on print) */}
      <div className="max-w-3xl mx-auto mb-6 px-6 flex justify-between items-center print:hidden">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors no-underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
        <button
          onClick={() => triggerDownloadPDF(order)}
          disabled={pdfGenerating}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 active:bg-black disabled:bg-slate-400 rounded-xl transition-all cursor-pointer border-none shadow-sm"
        >
          {pdfGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download PDF
            </>
          )}
        </button>
      </div>

      {/* Main Print Container (Stripe OpenAI style) */}
      <div className="invoice-print-wrapper max-w-3xl mx-auto bg-white border border-slate-100 rounded-3xl shadow-xl p-12 md:p-16 print:p-0 print:border-none print:shadow-none print:rounded-none">
        <div id="printable-invoice-container" className="invoice-print-container text-slate-900 bg-white">
          {/* Header Row: Document type & Brand Logo */}
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
                className="h-24 w-auto object-contain select-none"
              />
            </div>
          </div>

          {/* Seller / Buyer details block */}
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
      </div>
    </div>
  );
}
