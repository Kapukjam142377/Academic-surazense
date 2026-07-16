import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Landmark,
  Truck,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useLanguage } from "../context/LanguageContext";

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, loading } = useUser();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login?redirect=/checkout");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 font-medium">Loading...</div>
      </div>
    );
  }

  const API_URL = import.meta.env.PROD
    ? ""
    : import.meta.env.VITE_API_URL || "http://34.87.78.35:8000";

  const [form, setForm] = useState({
    name: user
      ? `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
        user.username ||
        ""
      : "",
    email: user ? user.email : "",
    phone: user ? user.phone || "" : "",
    address: "",
    paymentMethod: "Credit Card",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.address.trim()) {
      setError(
        language === "th"
          ? "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน"
          : "Please fill in all required fields.",
      );
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const orderData = {
        user_id: user ? user.id : null,
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone || null,
        shipping_address: form.address,
        payment_method: form.paymentMethod,
        items: cartItems.map((item) => ({
          product_id: item.id,
          product_name:
            typeof item.name === "object"
              ? item.name[language] || item.name.en || ""
              : item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to place order.");
      }

      const completed = await res.json();
      setCompletedOrder(completed);
      clearCart();
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          (language === "th"
            ? "เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ"
            : "An error occurred while placing your order."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-24 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 md:p-12 max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            {language === "th"
              ? "สั่งซื้อเรียบร้อย!"
              : "Order Placed Successfully!"}
          </h2>
          <p className="text-slate-500 mb-6 text-sm">
            {language === "th"
              ? `ขอบคุณสำหรับการสั่งซื้อ เลขที่คำสั่งซื้อของคุณคือ #${completedOrder.id}`
              : `Thank you for your purchase. Your order reference is #${completedOrder.id}`}
          </p>

          <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8 border border-slate-100 space-y-3">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
              <span>{language === "th" ? "รายการสินค้า" : "Item"}</span>
              <span>{language === "th" ? "ยอดรวม" : "Total"}</span>
            </div>
            <div className="border-t border-slate-200/60 my-2"></div>
            {completedOrder.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-slate-700"
              >
                <span className="font-medium">
                  {item.product_name}{" "}
                  <span className="text-slate-400">x{item.quantity}</span>
                </span>
                <span className="font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-slate-200/60 my-2"></div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-2">
              <span>
                {language === "th" ? "ยอดรวมทั้งสิ้น" : "Total Amount"}
              </span>
              <span>${completedOrder.total_amount.toFixed(2)}</span>
            </div>
          </div>

          <Link
            to="/products"
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all text-center no-underline"
          >
            {language === "th" ? "กลับไปที่ร้านค้า" : "Back to Store"}
          </Link>
        </motion.div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-24 flex flex-col items-center justify-center px-6 text-center">
        <ShoppingBag className="w-16 h-16 text-slate-300 mb-4 stroke-[1.5px]" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {language === "th" ? "ไม่มีสินค้าในตะกร้า" : "Your cart is empty"}
        </h2>
        <p className="text-slate-500 mb-6 max-w-sm">
          {language === "th"
            ? "กรุณาเลือกสินค้าจากหน้าร้านค้าเพื่อชำระเงิน"
            : "Add products from the store to proceed with checkout."}
        </p>
        <Link
          to="/products"
          className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold px-6 py-3 rounded-full transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />{" "}
          {language === "th" ? "ไปหน้าร้านค้า" : "Go to Store"}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-8 no-underline"
        >
          <ArrowLeft className="w-4 h-4" />{" "}
          {language === "th" ? "ย้อนกลับ" : "Back to Store"}
        </Link>

        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 tracking-tight uppercase">
          {language === "th" ? "ชำระเงิน" : "Checkout"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
          {/* Left Column: Form */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              {language === "th" ? "ข้อมูลการจัดส่ง" : "Shipping Information"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-rose-600 text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {language === "th" ? "ชื่อ - นามสกุล *" : "Full Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={
                      language === "th" ? "กรอกชื่อนามสกุล" : "John Doe"
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-blue-500 transition-all bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-800 text-sm"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {language === "th" ? "เบอร์โทรศัพท์ *" : "Phone Number *"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="08X-XXX-XXXX"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-blue-500 transition-all bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-800 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {language === "th" ? "อีเมล *" : "Email Address *"}
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-blue-500 transition-all bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-800 text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {language === "th" ? "ที่อยู่จัดส่ง *" : "Shipping Address *"}
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder={
                    language === "th"
                      ? "กรอกที่อยู่จัดส่งของคุณอย่างละเอียด"
                      : "Your full shipping address..."
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-blue-500 transition-all bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-800 text-sm resize-none"
                />
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {language === "th" ? "วิธีชำระเงิน" : "Payment Method"}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: "Credit Card",
                      label: "Credit Card",
                      icon: <CreditCard className="w-5 h-5" />,
                    },
                    {
                      id: "Bank Transfer",
                      label: "Bank Transfer",
                      icon: <Landmark className="w-5 h-5" />,
                    },
                    {
                      id: "Cash on Delivery",
                      label: "Cash on Delivery",
                      icon: <Truck className="w-5 h-5" />,
                    },
                  ].map((method) => (
                    <div
                      key={method.id}
                      onClick={() =>
                        handleInputChange("paymentMethod", method.id)
                      }
                      className={`border rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                        form.paymentMethod === method.id
                          ? "border-blue-500 bg-blue-50/40 text-blue-600 font-bold"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {method.icon}
                      <span className="text-xs">{method.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all text-center border-none cursor-pointer mt-6"
              >
                {isSubmitting
                  ? language === "th"
                    ? "กำลังดำเนินการ..."
                    : "Processing..."
                  : language === "th"
                    ? "ยืนยันการสั่งซื้อ"
                    : "Confirm & Place Order"}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">
              {language === "th" ? "สรุปคำสั่งซื้อ" : "Order Summary"}
            </h2>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 justify-between items-start"
                >
                  <div className="min-w-0">
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
                    <p className="text-xs text-slate-400 font-medium">
                      Qty: {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-slate-900 shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span className="font-bold text-slate-700">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
              <div className="border-t border-slate-100 my-2 pt-2 flex justify-between text-base font-black text-slate-900">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
