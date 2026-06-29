import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Cpu,
  Activity,
  FileText,
  Award,
  ChevronRight,
  GraduationCap,
  Beaker,
  Users,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext";
import { MOCK_PRODUCTS } from "../data/mockProducts";

const LABS = [
  {
    id: "lab-qcm",
    titleKey: "academic.lab1Title",
    subtitleKey: "academic.lab1Subtitle",
    descKey: "academic.lab1Desc",
    icon: <Cpu className="w-6 h-6" />,
    durationKey: "academic.lab1Duration",
    topicsKey: "academic.lab1Topics",
  },
  {
    id: "lab-biomarker",
    titleKey: "academic.lab2Title",
    subtitleKey: "academic.lab2Subtitle",
    descKey: "academic.lab2Desc",
    icon: <Beaker className="w-6 h-6" />,
    durationKey: "academic.lab2Duration",
    topicsKey: "academic.lab2Topics",
  },
  {
    id: "lab-signal",
    titleKey: "academic.lab3Title",
    subtitleKey: "academic.lab3Subtitle",
    descKey: "academic.lab3Desc",
    icon: <Activity className="w-6 h-6" />,
    durationKey: "academic.lab3Duration",
    topicsKey: "academic.lab3Topics",
  },
];

const COURSES = [
  {
    id: "course-intro",
    levelKey: "academic.levelBeginner",
    levelColor: "bg-emerald-100 text-emerald-700 border-emerald-200/50",
    titleKey: "academic.course1Title",
    durationKey: "academic.course1Duration",
    descKey: "academic.course1Desc",
    skillsKey: "academic.course1Skills",
  },
  {
    id: "course-instrument",
    levelKey: "academic.levelIntermediate",
    levelColor: "bg-blue-100 text-blue-700 border-blue-200/50",
    titleKey: "academic.course2Title",
    durationKey: "academic.course2Duration",
    descKey: "academic.course2Desc",
    skillsKey: "academic.course2Skills",
  },
  {
    id: "course-data",
    levelKey: "academic.levelAdvanced",
    levelColor: "bg-purple-100 text-purple-700 border-purple-200/50",
    titleKey: "academic.course3Title",
    durationKey: "academic.course3Duration",
    descKey: "academic.course3Desc",
    skillsKey: "academic.course3Skills",
  },
];

const BACKGROUNDS = [
  {
    id: "biology",
    labelKey: "academic.biologyLabel",
    recommend: "lab-biomarker",
    course: "course-intro",
  },
  {
    id: "engineering",
    labelKey: "academic.engineeringLabel",
    recommend: "lab-qcm",
    course: "course-instrument",
  },
  {
    id: "maths",
    labelKey: "academic.mathsLabel",
    recommend: "lab-signal",
    course: "course-data",
  },
];

const teamMembers = [
  {
    name: "Dr.Thita",
    role: "Director\nPhD-Material Engineering\nB. Eng.(Hons) Ceramic Engineering",
    image: "/member12.png",
  },
  {
    name: "Weerasak",
    role: "Operation manager",
    image: "/member.png",
    position: "object-[center_35%]",
  },
  {
    name: "Adisak",
    role: "Engineering manager\nB. Eng. (Hons) & M Eng.\nElectronic engineering",
    image: "/member5.png",
    scaleClass: "scale-110",
    hoverScaleClass: "group-hover:scale-[1.15]",
  },
  {
    name: "Dr. Soodkhet",
    role: "Advisor\nPhD - MaterialScience & Engineering,\nM. Eng. Nuclear Technology,\nB. Eng. Industrial Engineering",
    image: "/member11.png",
  },
  {
    name: "Dr. Sanong",
    role: "Advisor\nPhD - Pathobiology, Cert. Molecular Diagnosis\n(Automatic in situ and Immunostaining)",
    image: "/member6.png",
    scaleClass: "scale-110",
    hoverScaleClass: "group-hover:scale-[1.15]",
  },
];

const LAB_GALLERY_IMAGES = [
  {
    id: 1,
    titleKey: "academic.gallery1Title",
    descKey: "academic.gallery1Desc",
    categoryKey: "academic.gallery1Category",
    image: "/lab-gallery-1.jpg",
    fallbackColor: "from-blue-600/20 to-sky-500/20",
    gridClass: "md:col-span-2 md:row-span-2 min-h-[320px] md:min-h-[460px]",
  },
  {
    id: 2,
    titleKey: "academic.gallery2Title",
    descKey: "academic.gallery2Desc",
    categoryKey: "academic.gallery2Category",
    image: "/lab-gallery-2.jpg",
    fallbackColor: "from-indigo-600/20 to-purple-500/20",
    gridClass: "md:col-span-1 md:row-span-1 min-h-[220px]",
  },
  {
    id: 3,
    titleKey: "academic.gallery3Title",
    descKey: "academic.gallery3Desc",
    categoryKey: "academic.gallery3Category",
    image: "/lab-gallery-3.jpg",
    fallbackColor: "from-sky-600/20 to-emerald-500/20",
    gridClass: "md:col-span-1 md:row-span-1 min-h-[220px]",
  },
  {
    id: 4,
    titleKey: "academic.gallery4Title",
    descKey: "academic.gallery4Desc",
    categoryKey: "academic.gallery4Category",
    image: "/lab-gallery-4.jpg",
    fallbackColor: "from-violet-600/20 to-pink-500/20",
    gridClass: "md:col-span-3 md:row-span-1 min-h-[320px] md:min-h-[420px]",
  },
];

function GalleryCard({ item }) {
  const [imgErr, setImgErr] = useState(false);
  const { t } = useLanguage();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: "easeOut" },
        },
      }}
      whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.12)" }}
      className={`relative overflow-hidden rounded-[2rem] border border-slate-200/50 shadow-sm bg-slate-950 group cursor-pointer ${item.gridClass} transition-shadow duration-300`}
    >
      {/* Fallback elegant background when image is missing */}
      <div
        className={`absolute inset-0 bg-gradient-to-tr ${item.fallbackColor} opacity-90 transition-opacity duration-500 z-0 flex flex-col items-center justify-center p-6 text-center`}
      >
        {imgErr && (
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Beaker className="w-8 h-8 opacity-40 animate-pulse text-blue-500" />
            <span className="text-xs font-semibold text-slate-500 tracking-wider">
              Photo Placeholder
            </span>
            <span className="text-[10px] text-slate-500 font-mono bg-slate-900/40 px-2.5 py-1 rounded border border-slate-800">
              {item.image}
            </span>
          </div>
        )}
      </div>

      {!imgErr && (
        <img
          src={item.image}
          alt={t(item.titleKey)}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover absolute inset-0 z-0 transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 md:opacity-0 md:group-hover:opacity-90 transition-opacity duration-300 z-10"></div>

      {/* Content overlay */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-20 flex flex-col justify-end transform md:translate-y-8 md:group-hover:translate-y-0 transition-transform duration-300">
        <span className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-1.5 inline-block">
          {t(item.categoryKey)}
        </span>
        <h3 className="text-lg md:text-xl font-extrabold text-white leading-snug">
          {t(item.titleKey)}
        </h3>
        <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-75">
          {t(item.descKey)}
        </p>
      </div>

      {/* Premium subtle glow overlay */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"></div>
    </motion.div>
  );
}

const CERTIFICATES = [
  {
    id: 1,
    titleKey: "academic.cert1Title",
    recipientKey: "academic.cert1Recipient",
    image: "/certificate-1.png",
  },
  {
    id: 2,
    titleKey: "academic.cert2Title",
    recipientKey: "academic.cert2Recipient",
    image: "/certificate-2.png",
  },
  {
    id: 3,
    titleKey: "academic.cert3Title",
    recipientKey: "academic.cert3Recipient",
    image: "/certificate-3.png",
  },
  {
    id: 4,
    titleKey: "academic.cert4Title",
    recipientKey: "academic.cert4Recipient",
    image: "/certificate-4.png",
  },
  {
    id: 5,
    titleKey: "academic.cert5Title",
    recipientKey: "academic.cert5Recipient",
    image: "/certificate-5.png",
  },
  {
    id: 6,
    titleKey: "academic.cert6Title",
    recipientKey: "academic.cert6Recipient",
    image: "/certificate-6.png",
  },
];

function CertificateCard({ cert }) {
  const [imgErr, setImgErr] = useState(false);
  const { t } = useLanguage();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: "easeOut" },
        },
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white border border-slate-100 rounded-[1.5rem] p-4 shadow-sm flex flex-col justify-between transition-all duration-300 relative group overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative aspect-[1.414/1] rounded-xl overflow-hidden bg-slate-900 border border-slate-100">
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-indigo-500/10 opacity-90 z-0 flex flex-col items-center justify-center p-4 text-center">
          {imgErr && (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <Award className="w-8 h-8 text-sky-500/60 animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-500 tracking-wider">
                Certificate Photo
              </span>
              <span className="text-[9px] text-slate-500 font-mono bg-slate-900/40 px-2 py-0.5 rounded border border-slate-800">
                {cert.image}
              </span>
            </div>
          )}
        </div>
        {!imgErr && (
          <img
            src={cert.image}
            alt={t(cert.titleKey)}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-103"
          />
        )}
      </div>

      <div className="mt-4 text-center">
        <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
          {t(cert.titleKey)}
        </h4>
        <p className="text-xs text-slate-400 mt-1">{t(cert.recipientKey)}</p>
      </div>
    </motion.div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

export default function AcademicTraining() {
  const { t, language } = useLanguage();
  const { user } = useUser();
  const { addToCart } = useCart();
  const [selectedBackground, setSelectedBackground] = useState("biology");
  const [registrations, setRegistrations] = useState([]);
  const [toast, setToast] = useState({ message: "", type: null });
  const [flyingItem, setFlyingItem] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (user) {
      fetchRegistrations();
    } else {
      setRegistrations([]);
    }
  }, [user]);

  // Hide toast after 3 seconds
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        setToast({ message: "", type: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.message]);

  const fetchRegistrations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users/${user.id}/registrations`);
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!user) {
      setToast({
        message:
          language === "th"
            ? "กรุณาเข้าสู่ระบบก่อนทำการลงทะเบียน"
            : "Please log in to register.",
        type: "error",
      });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/users/${user.id}/registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: courseId, status: "pending" }),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      const newReg = await res.json();
      setRegistrations((prev) => [...prev, newReg]);
      setToast({
        message:
          language === "th"
            ? "ส่งคำขอลงทะเบียนเรียบร้อยแล้ว!"
            : "Registration request submitted!",
        type: "success",
      });
    } catch (e) {
      console.error(e);
      setToast({
        message:
          language === "th" ? "การลงทะเบียนล้มเหลว" : "Registration failed.",
        type: "error",
      });
    }
  };

  const getEnrollmentStatus = (courseId) => {
    const reg = registrations.find((r) => r.course_id === courseId);
    return reg ? reg.status : null;
  };

  const handleBuyCourse = (courseId, e) => {
    let productMockId = 12;
    if (courseId === "lab-biomarker" || courseId === "course-instrument") {
      productMockId = 13;
    } else if (courseId === "lab-signal" || courseId === "course-data") {
      productMockId = 14;
    }

    const courseProduct = MOCK_PRODUCTS.find((p) => p.id === productMockId);
    if (!courseProduct) return;

    if (flyingItem) return;

    const buttonRect = e.currentTarget.getBoundingClientRect();
    const cartIcon = document.getElementById("global-cart-icon");

    if (cartIcon) {
      const cartRect = cartIcon.getBoundingClientRect();

      setFlyingItem({
        id: Date.now(),
        image: courseProduct.image,
        startX: buttonRect.left + buttonRect.width / 2,
        startY: buttonRect.top + buttonRect.height / 2,
        endX: cartRect.left + cartRect.width / 2,
        endY: cartRect.top + cartRect.height / 2,
      });

      addToCart(courseProduct);

      setTimeout(() => {
        setFlyingItem(null);
      }, 1000);
    } else {
      addToCart(courseProduct);
    }
  };

  const activeRec = BACKGROUNDS.find((bg) => bg.id === selectedBackground);
  const labTrainingText = t("academic.labTraining");
  const [labPart1, labPart2] = labTrainingText.includes("&")
    ? labTrainingText.split("&")
    : [labTrainingText, ""];

  return (
    <div className="bg-slate-50 min-h-screen pb-24 relative overflow-hidden">
      {/* Flying Item Animation */}
      {flyingItem && (
        <motion.div
          initial={{
            x: flyingItem.startX - 30,
            y: flyingItem.startY - 30,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            x: flyingItem.endX - 30,
            y: flyingItem.endY - 30,
            scale: 0.1,
            opacity: 0.2,
          }}
          transition={{
            duration: 1.0,
            ease: [0.32, 0.72, 0, 1],
          }}
          className="fixed z-[100] w-[60px] h-[60px] rounded-full border-2 border-white shadow-2xl overflow-hidden bg-white pointer-events-none flex items-center justify-center"
          style={{ top: 0, left: 0 }}
        >
          {flyingItem.image ? (
            <img
              src={flyingItem.image}
              alt="flying"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-500"></div>
          )}
        </motion.div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-24 left-1/2 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-700 shadow-emerald-500/5"
                : "bg-rose-50 border-rose-100 text-rose-700 shadow-rose-500/5"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fallback Ambient Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 via-sky-50/20 to-indigo-50/30 z-0 pointer-events-none" />

      {/* Hero Section */}
      <div className="relative pt-24 pb-20 md:pb-28 z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          {/* Knowledge is Endless Pill */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50/80 border border-blue-100/80 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-md shadow-blue-500/5 cursor-default hover:scale-[1.02] transition-transform duration-300"
          >
            <GraduationCap
              className="w-5 h-5 text-blue-600 animate-bounce"
              style={{ animationDuration: "3s" }}
            />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              {t("academic.endlessKnowledge")}
            </span>
          </motion.div>

          {/* Surazense Training Program */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-4 tracking-[-0.03em] leading-[1.05] uppercase max-w-5xl mx-auto drop-shadow-sm"
          >
            Surazense{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600">
              {t("academic.trainingProgram")}
            </span>
          </motion.h1>

          {/* Laboratory and Academic Training Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight mb-8 leading-snug max-w-4xl mx-auto uppercase"
          >
            {labPart1}{" "}
            {labPart2 && (
              <>
                <span className="text-blue-600 font-black">&</span> {labPart2}
              </>
            )}
          </motion.h2>

          {/* Fields Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-4 mb-10"
          >
            {[
              t("academic.biotech"),
              t("academic.medicalScience"),
              t("academic.engineering"),
            ].map((field, idx) => (
              <React.Fragment key={field}>
                <span className="text-xs md:text-sm font-extrabold text-slate-700 bg-white border border-slate-200/60 px-5 py-2.5 rounded-2xl shadow-sm hover:border-blue-500 hover:text-blue-600 hover:-translate-y-0.5 transition-all duration-300 cursor-default">
                  {field}
                </span>
                {idx < 2 && (
                  <span className="hidden sm:inline text-slate-300 text-lg font-light">
                    •
                  </span>
                )}
              </React.Fragment>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            className="text-base md:text-lg lg:text-xl text-slate-500 max-w-4xl mx-auto mb-12 leading-relaxed font-medium"
          >
            {t("academic.introDesc")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <a
              href="#labs"
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-[15px] hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all text-center min-w-[180px]"
            >
              {t("academic.exploreLabs")}
            </a>
            <a
              href="#courses"
              className="bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-full font-bold text-[15px] hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 transition-all text-center min-w-[180px]"
            >
              {t("academic.viewCourses")}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Medical / Engineer Training Gallery Section */}
      <section className="max-w-7xl mx-auto px-6 mb-28 relative z-10 scroll-mt-24">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm"
          >
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            <span>{t("academic.trainingAtmosphere")}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            {t("academic.labAtmosphereTitle")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base text-slate-500 font-medium max-w-2xl mx-auto mt-3"
          >
            {t("academic.labAtmosphereDesc")}
          </motion.p>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {LAB_GALLERY_IMAGES.map((item) => (
            <GalleryCard key={item.id} item={item} />
          ))}
        </motion.div>
      </section>

      {/* Student Certificates Section */}
      <section className="max-w-7xl mx-auto px-6 mb-28 relative z-10 scroll-mt-24">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm"
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
            <span>{t("academic.studentAchievements")}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            {t("academic.completionCertificates")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base text-slate-500 font-medium max-w-2xl mx-auto mt-3"
          >
            {t("academic.completionCertificatesDesc")}
          </motion.p>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {CERTIFICATES.map((cert) => (
            <CertificateCard key={cert.id} cert={cert} />
          ))}
        </motion.div>
      </section>

      {/* Interactive Selector Widget */}
      <section className="max-w-5xl mx-auto px-6 mb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/60 p-8 md:p-12 shadow-xl shadow-blue-950/5"
        >
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full mb-3 inline-block">
              {t("academic.interactiveGuide")}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2">
              {t("academic.findIdealPath")}
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              {t("academic.selectBackground")}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 justify-center mb-10">
            {BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setSelectedBackground(bg.id)}
                className={`px-6 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center justify-center cursor-pointer border ${
                  selectedBackground === bg.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 scale-[1.02]"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                {t(bg.labelKey)}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedBackground}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-200/50"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                    <Beaker className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t("academic.recommendedLab")}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  {t(LABS.find((l) => l.id === activeRec?.recommend)?.titleKey)}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {t(LABS.find((l) => l.id === activeRec?.recommend)?.descKey)}
                </p>
              </div>

              <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {t("academic.recommendedCourse")}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">
                    {t(
                      COURSES.find((c) => c.id === activeRec?.course)?.titleKey,
                    )}
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    {t(
                      COURSES.find((c) => c.id === activeRec?.course)?.descKey,
                    )}
                  </p>
                </div>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 group mt-auto"
                >
                  <span>{t("academic.inquireSyllabus")}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Laboratories Section */}
      <section
        id="labs"
        className="max-w-7xl mx-auto px-6 mb-32 relative z-10 scroll-mt-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t("academic.handsOnLabs")}
          </h2>
          <p className="text-base text-slate-500 font-medium max-w-2xl mx-auto mt-3">
            {t("academic.handsOnLabsDesc")}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {LABS.map((lab) => (
            <motion.div
              key={lab.id}
              variants={itemVariants}
              whileHover={{
                y: -6,
                boxShadow: "0 20px 40px -10px rgba(0,0,0,0.06)",
              }}
              className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between transition-all duration-300 relative group"
            >
              <div>
                {/* Accent border on top hover */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-blue-100 transition-all duration-300">
                  {lab.icon}
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-1 leading-snug group-hover:text-blue-600 transition-colors">
                  {t(lab.titleKey)}
                </h3>
                <span className="text-[13px] font-bold text-slate-400 block mb-4">
                  {t(lab.subtitleKey)}
                </span>

                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  {t(lab.descKey)}
                </p>

                <div className="border-t border-slate-100 pt-5 mb-6">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                    {t("academic.keySkills")}
                  </span>
                  <ul className="space-y-2">
                    {t(lab.topicsKey).map((topicItem, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2.5 text-slate-700 text-sm font-medium"
                      >
                        <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs shrink-0">
                          ✓
                        </span>
                        {topicItem}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100/50 mb-4">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {t("academic.duration")}
                </span>
                <span className="text-sm font-bold text-blue-600 bg-blue-50/60 px-3 py-1 rounded-full">
                  {t(lab.durationKey)}
                </span>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleEnroll(lab.id)}
                  className={`flex-1 font-bold py-2.5 rounded-xl transition-all text-xs border border-slate-200 cursor-pointer text-center ${
                    getEnrollmentStatus(lab.id)
                      ? "bg-emerald-50 text-emerald-600 cursor-default border-emerald-100 font-bold"
                      : "bg-white text-slate-700 hover:bg-slate-50 shadow-sm"
                  }`}
                  disabled={!!getEnrollmentStatus(lab.id)}
                >
                  {getEnrollmentStatus(lab.id)
                    ? language === "th"
                      ? `ลงทะเบียนแล้ว`
                      : `Enrolled`
                    : language === "th"
                      ? "ขอรับโควตาเรียน"
                      : "Request Seat"}
                </button>
                <button
                  onClick={(e) => handleBuyCourse(lab.id, e)}
                  className="flex-1 font-black py-2.5 rounded-xl bg-blue-600 text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-sky-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all text-xs border-none cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {language === "th" ? "ซื้อหลักสูตร" : "Buy Course"}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Courses Curriculum Section */}
      <section
        id="courses"
        className="max-w-7xl mx-auto px-6 relative z-10 scroll-mt-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t("academic.academicCourses")}
          </h2>
          <p className="text-base text-slate-500 font-medium max-w-2xl mx-auto mt-3">
            {t("academic.academicCoursesDesc")}
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {COURSES.map((course) => (
            <motion.div
              key={course.id}
              variants={itemVariants}
              whileHover={{
                y: -6,
                boxShadow: "0 20px 40px -10px rgba(0,0,0,0.06)",
              }}
              className="bg-white border border-slate-100 rounded-[2.25rem] p-8 shadow-sm flex flex-col justify-between transition-all duration-300 relative"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${course.levelColor}`}
                  >
                    {t(course.levelKey)}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {t(course.durationKey)}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-4 leading-snug">
                  {t(course.titleKey)}
                </h3>

                <p className="text-sm text-slate-500 mb-6 leading-relaxed font-light">
                  {t(course.descKey)}
                </p>

                <div className="border-t border-slate-100 pt-5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                    {t("academic.syllabusCompetencies")}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {t(course.skillsKey).map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200/30"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100/50 flex gap-3">
                <button
                  onClick={() => handleEnroll(course.id)}
                  className={`flex-1 font-semibold py-3 rounded-xl transition-all text-xs border border-slate-200 cursor-pointer text-center ${
                    getEnrollmentStatus(course.id)
                      ? "bg-emerald-50 text-emerald-600 cursor-default border-emerald-100 font-bold"
                      : "bg-white text-slate-700 hover:bg-slate-50 shadow-sm"
                  }`}
                  disabled={!!getEnrollmentStatus(course.id)}
                >
                  {getEnrollmentStatus(course.id)
                    ? language === "th"
                      ? `ส่งคำขอแล้ว`
                      : `Requested`
                    : language === "th"
                      ? "ขอสิลลาบัส"
                      : "Syllabus"}
                </button>
                <button
                  onClick={(e) => handleBuyCourse(course.id, e)}
                  className="flex-1 font-black py-3 rounded-xl bg-blue-600 text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-sky-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all text-xs border-none cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {language === "th" ? "ซื้อหลักสูตร" : "Buy Course"}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white relative overflow-hidden z-10 mt-32 border-y border-slate-100">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
          >
            <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-4 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {t("academic.teamSupport")}
            </h2>
            <p className="text-base text-slate-500 max-w-2xl mx-auto font-medium">
              {t("academic.teamSupportDesc")}
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-x-12 gap-y-16 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
          >
            {teamMembers.map((member, index) => {
              const roleLines = member.role.split("\n");
              const mainRole = roleLines[0];
              const subRoles = roleLines.slice(1);
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group flex flex-col items-center text-center w-full sm:w-[260px]"
                >
                  <div className="relative w-44 h-44 md:w-48 md:h-48 mb-6 overflow-hidden rounded-full border-4 border-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                    <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-full"></div>
                    <img
                      src={member.image}
                      alt={member.name}
                      className={`w-full h-full object-cover transition-transform duration-500 ${member.scaleClass || "scale-100"} ${member.hoverScaleClass || "group-hover:scale-105"} ${member.position || "object-top"}`}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {member.name}
                  </h3>
                  <h4 className="text-blue-600 text-xs font-bold mt-1.5 uppercase tracking-wider">
                    {mainRole}
                  </h4>
                  {subRoles.length > 0 && (
                    <p className="text-slate-500 text-[11px] font-medium mt-2 whitespace-pre-line leading-relaxed max-w-[220px]">
                      {subRoles.join("\n")}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
