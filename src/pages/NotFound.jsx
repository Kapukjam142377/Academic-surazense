import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  ShoppingBag,
  GraduationCap,
  Mail,
  ArrowLeft,
  Compass,
  AlertTriangle,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function NotFound() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const isTh = language === "th";

  const quickLinks = [
    {
      to: "/",
      icon: <Home className="w-5 h-5 text-sky-500" />,
      title: isTh ? "หน้าแรก" : "Home",
      desc: isTh ? "กลับสู่หน้าหลักของระบบ" : "Return to main home page",
    },
    {
      to: "/products",
      icon: <ShoppingBag className="w-5 h-5 text-indigo-500" />,
      title: isTh ? "ผลิตภัณฑ์ & อุปกรณ์" : "Products & Hardware",
      desc: isTh ? "ดูอุปกรณ์ QCM และเซนเซอร์" : "Browse QCM devices & chips",
    },
    {
      to: "/academic-training",
      icon: <GraduationCap className="w-5 h-5 text-emerald-500" />,
      title: isTh ? "หลักสูตรอบรมวิชาการ" : "Academic Training",
      desc: isTh ? "คอร์ส & การแข่งขันเคมีเซนเซอร์" : "Courses & competitions",
    },
    {
      to: "/contacts",
      icon: <Mail className="w-5 h-5 text-amber-500" />,
      title: isTh ? "ติดต่อสอบถาม" : "Contact Us",
      desc: isTh ? "ส่งข้อความถึงทีมงาน" : "Get in touch with our team",
    },
  ];

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-slate-50 via-sky-50/20 to-white flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Badge & Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative inline-block mb-6"
        >
          <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-xl shadow-sky-500/20 text-white relative">
            <span className="text-5xl font-black tracking-tight">404</span>
            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 p-2 rounded-xl shadow-md">
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-700 uppercase tracking-widest mb-3">
            <Compass className="w-3.5 h-3.5" />
            {isTh ? "ไม่พบหน้าที่ต้องการ" : "Page Not Found"}
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            {isTh
              ? "ขออภัย ไม่พบหน้าที่คุณกำลังค้นหา"
              : "Oops! We couldn't find that page"}
          </h1>

          <p className="text-slate-500 text-base max-w-lg mx-auto mb-8 leading-relaxed">
            {isTh
              ? "หน้าที่คุณต้องการอาจถูกย้าย เปลี่ยนชื่อ หรือไม่มีอยู่ในระบบ กรุณาตรวจสอบ URL หรือเลือกหน้าจากเมนูด้านล่างนี้"
              : "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}
          </p>
        </motion.div>

        {/* Quick Links Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-8"
        >
          {quickLinks.map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className="group p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/5 transition-all no-underline flex items-start gap-3.5"
            >
              <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-sky-50 transition-colors shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Back Button Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer border-none"
          >
            <ArrowLeft className="w-4 h-4" />
            {isTh ? "ย้อนกลับหน้าที่แล้ว" : "Go Back"}
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-sky-500/20 transition-all no-underline"
          >
            <Home className="w-4 h-4" />
            {isTh ? "กลับสู่หน้าหลัก" : "Return Home"}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
