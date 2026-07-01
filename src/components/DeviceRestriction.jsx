import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Monitor, Smartphone, ArrowLeft, Cpu } from "lucide-react";

const NARROW_BREAKPOINT = 1024; // px — standard phones and small tablets

// Detects if the device is a touch-first device (tablet/phone) using CSS media queries.
// pointer: coarse = finger touch (phones, tablets, iPad Pro)
// pointer: fine   = mouse/trackpad (laptops, desktops)
const checkIsRestricted = () => {
  if (typeof window === "undefined") return false;
  const isNarrow = window.innerWidth < NARROW_BREAKPOINT;
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  // Block if: small screen OR touch-only device (covers iPad Pro in any orientation)
  return isNarrow || isTouchDevice;
};

export default function DeviceRestriction({ children }) {
  const { language } = useLanguage();
  const [isRestricted, setIsRestricted] = useState(checkIsRestricted);

  useEffect(() => {
    const handler = () => setIsRestricted(checkIsRestricted());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  if (!isRestricted) return <>{children}</>;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #f8fafc 100%)",
        fontFamily: '"Plus Jakarta Sans", "Noto Sans Thai", sans-serif',
      }}
    >
      {/* Decorative background blobs */}
      <div
        className="absolute top-[-80px] left-[-80px] w-[340px] h-[340px] rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #bae6fd, transparent)" }}
      />
      <div
        className="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #c7d2fe, transparent)" }}
      />

      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-2xl shadow-sky-900/10 p-8 text-center flex flex-col items-center gap-6">
        {/* Icon cluster */}
        <div className="flex items-end justify-center gap-4">
          {/* Phone — blocked */}
          <div className="relative flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-400">
              <Smartphone className="w-7 h-7 stroke-[1.8]" />
            </div>
            {/* X badge */}
            <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center shadow">
              <span className="text-white text-[10px] font-black leading-none">
                ✕
              </span>
            </div>
          </div>

          {/* Laptop — allowed */}
          <div className="relative flex flex-col items-center">
            <div className="w-20 h-20 rounded-3xl bg-sky-50 border border-sky-100 flex items-center justify-center text-accent shadow-lg shadow-sky-200/50">
              <Monitor className="w-10 h-10 stroke-[1.8]" />
            </div>
            {/* Check badge */}
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow">
              <span className="text-white text-xs font-black leading-none">
                ✓
              </span>
            </div>
          </div>
        </div>

        {/* QCM badge */}
        <div className="flex items-center gap-2 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-full">
          <Cpu className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-extrabold text-accent uppercase tracking-widest">
            QCM Lab System
          </span>
        </div>

        {/* Text */}
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight leading-snug mb-3">
            {language === "th"
              ? "จำเป็นต้องใช้คอมพิวเตอร์หรือโน๊ตบุ๊ค"
              : "Laptop or Desktop Required"}
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            {language === "th"
              ? "โปรแกรมทำแล็บ QCM ต้องการการเชื่อมต่อผ่าน USB Serial Port และจอแสดงผลขนาดใหญ่เพื่อการทดลองที่ถูกต้อง กรุณาเปิดใช้งานบนคอมพิวเตอร์หรือโน๊ตบุ๊คเท่านั้น"
              : "The QCM lab program requires a USB Serial Port connection and a larger screen for accurate measurements. Please open this program on a laptop or desktop computer."}
          </p>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-slate-100" />

        {/* Requirements list */}
        <div className="w-full text-left space-y-2">
          {[
            {
              ok: true,
              th: "คอมพิวเตอร์ / โน๊ตบุ๊ค (หน้าจอ ≥ 1024px)",
              en: "Laptop or Desktop (screen ≥ 1024px)",
            },
            {
              ok: true,
              th: "Google Chrome เวอร์ชันล่าสุด (Web Serial API)",
              en: "Latest Google Chrome (Web Serial API)",
            },
            {
              ok: false,
              th: "สมาร์ทโฟน / แท็บเล็ต",
              en: "Smartphone / Tablet",
            },
          ].map((item) => (
            <div key={item.en} className="flex items-center gap-3">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                  item.ok
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-rose-100 text-rose-500"
                }`}
              >
                {item.ok ? "✓" : "✕"}
              </span>
              <span className="text-xs font-semibold text-slate-600">
                {language === "th" ? item.th : item.en}
              </span>
            </div>
          ))}
        </div>

        {/* Return home button */}
        <Link
          to="/"
          className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-sky-200 text-sm no-underline"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === "th" ? "กลับไปหน้าหลัก" : "Return to Home Page"}
        </Link>
      </div>
    </div>
  );
}
