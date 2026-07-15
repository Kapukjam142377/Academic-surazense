import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  MapPin,
  Key,
  Calendar,
  Mail,
  CheckCircle2,
  AlertCircle,
  Save,
  Loader2,
  ArrowLeft,
  Trash2,
  UploadCloud,
  CreditCard,
  GraduationCap,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useLanguage } from "../context/LanguageContext";

export default function Profile() {
  const { user, updateProfile } = useUser();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/profile");
    }
  }, [user, navigate]);

  // Profile Form States
  const [firstName, setFirstName] = useState(user?.first_name || user?.firstName || "");
  const [lastName, setLastName] = useState(user?.last_name || user?.lastName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [dob, setDob] = useState(user?.dob || "");
  const [address, setAddress] = useState(user?.address || "");

  // New registration fields
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [titleName, setTitleName] = useState(user?.titleName || "");
  const [customTitleName, setCustomTitleName] = useState(user?.customTitleName || "");
  const [middleName, setMiddleName] = useState(user?.middleName || "");
  const [idNumber, setIdNumber] = useState(user?.idNumber || "");
  const [currentAddress, setCurrentAddress] = useState(user?.currentAddress || "");
  const [studentCardFront, setStudentCardFront] = useState(user?.studentCardFront || "");
  const [studentCardBack, setStudentCardBack] = useState(user?.studentCardBack || "");
  const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || user?.phone || "");
  const [institutionName, setInstitutionName] = useState(user?.institutionName || "");
  const [institutionAddress, setInstitutionAddress] = useState(user?.institutionAddress || "");
  const [education, setEducation] = useState(user?.education || "");
  const [activeTab, setActiveTab] = useState("general"); // "general" or "competition"

  // Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: null });

  // Auto-dismiss toast
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(
        () => setToast({ message: "", type: null }),
        3000,
      );
      return () => clearTimeout(timer);
    }
  }, [toast.message]);

  if (!user) return null;

  const handleFileChange = (e, setFileState) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setToast({
          message: language === "th" ? "กรุณาอัปโหลดเฉพาะไฟล์รูปภาพ" : "Please upload only image files",
          type: "error"
        });
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        setToast({
          message: language === "th" ? "ขนาดไฟล์ต้องไม่เกิน 100 MB" : "File size must be under 100 MB",
          type: "error"
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileState(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const profileData = {
      first_name: firstName || null,
      last_name: lastName || null,
      username: username || null,
      phone: phone || null,
      gender: gender || null,
      dob: dob || null,
      address: address || null,
      nickname: nickname || null,
      titleName: titleName || null,
      customTitleName: customTitleName || null,
      middleName: middleName || null,
      idNumber: idNumber || null,
      currentAddress: currentAddress || null,
      studentCardFront: studentCardFront || null,
      studentCardBack: studentCardBack || null,
      mobileNumber: mobileNumber || null,
      institutionName: institutionName || null,
      institutionAddress: institutionAddress || null,
      education: education || null,
    };

    const res = await updateProfile(user.id, profileData);
    setIsSubmitting(false);

    if (res.success) {
      setToast({
        message:
          language === "th"
            ? "บันทึกข้อมูลส่วนตัวสำเร็จ!"
            : "Profile updated successfully!",
        type: "success",
      });
    } else {
      setToast({
        message:
          res.message ||
          (language === "th"
            ? "เกิดข้อผิดพลาดในการบันทึกข้อมูล"
            : "Failed to update profile"),
        type: "error",
      });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      setToast({
        message:
          language === "th"
            ? "กรุณากรอกรหัสผ่านใหม่"
            : "Please enter a new password",
        type: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({
        message:
          language === "th"
            ? "รหัสผ่านใหม่ไม่ตรงกัน"
            : "New passwords do not match",
        type: "error",
      });
      return;
    }

    setIsPasswordSubmitting(true);

    // We send password update in profile data
    const res = await updateProfile(user.id, {
      ...user,
      password: newPassword,
    });

    setIsPasswordSubmitting(false);

    if (res.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setToast({
        message:
          language === "th"
            ? "เปลี่ยนรหัสผ่านสำเร็จ!"
            : "Password updated successfully!",
        type: "success",
      });
    } else {
      setToast({
        message:
          res.message ||
          (language === "th"
            ? "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน"
            : "Failed to update password"),
        type: "error",
      });
    }
  };

  const t = (keyEn, keyTh) => {
    return language === "th" ? keyTh : keyEn;
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 pt-12 relative font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-6 py-3.5 rounded-2xl shadow-xl backdrop-blur-md border ${
              toast.type === "success"
                ? "bg-emerald-500/90 text-white border-emerald-400/30"
                : "bg-rose-500/90 text-white border-rose-400/30"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span className="text-sm font-bold tracking-wide">
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors bg-transparent border-none cursor-pointer p-0 mb-8 outline-none group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{t("Back", "ย้อนกลับ")}</span>
        </button>

        {/* Title Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-tight mb-2">
            {t("Your Profile", "โปรไฟล์ส่วนตัวของคุณ")}
          </h1>
          <p className="text-slate-500 text-sm">
            {t(
              "Manage your personal details and contact address below",
              "จัดการข้อมูลส่วนตัวและที่อยู่สำหรับติดต่อของคุณด้านล่าง",
            )}
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-sky-500 mt-4 rounded-full mx-auto md:mx-0"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Avatar & Account Summary Card */}
          <div className="lg:col-span-1 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden group">
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-600 to-sky-500"></div>

            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-100 to-sky-50 flex items-center justify-center border-4 border-white shadow-lg text-blue-600 text-3xl font-black uppercase mb-5 select-none shrink-0 group-hover:scale-105 transition-transform duration-300">
              {username ? username[0] : user.email[0]}
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 mb-1 leading-tight">
              {firstName || lastName
                ? `${firstName} ${lastName}`.trim()
                : username || user.email.split("@")[0]}
            </h2>
            <p className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider mb-6">
              {user.role}
            </p>

            <div className="w-full border-t border-slate-100 my-4"></div>

            {/* Quick stats / metadata */}
            <div className="w-full text-left space-y-3.5 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {t("Email Address", "ที่อยู่อีเมล")}
                  </p>
                  <p className="text-xs font-semibold text-slate-700 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {phone && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {t("Phone Number", "เบอร์โทรศัพท์")}
                    </p>
                    <p className="text-xs font-semibold text-slate-700">
                      {phone}
                    </p>
                  </div>
                </div>
              )}

              {user.created_at && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {t("Member Since", "เป็นสมาชิกตั้งแต่")}
                    </p>
                    <p className="text-xs font-semibold text-slate-700">
                      {new Date(user.created_at).toLocaleDateString(
                        language === "th" ? "th-TH" : "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Editing Form Panels */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Info Form */}
            <form
              key={`${user.id}-${user.updated_at || ""}`}
              onSubmit={handleProfileSubmit}
              className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-600 to-sky-500"></div>

              <h2 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                {t("Personal Details", "ข้อมูลส่วนตัว")}
              </h2>

              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-6 leading-relaxed font-semibold">
                {t(
                  "This form is created for collecting personal data for registering in competitions or presentations only.",
                  "แบบฟอร์มนี้จัดทำขึ้นเพื่อใช้ในการจัดเก็บข้อมูลส่วนบุคคลสำหรับการลงทะเบียนเข้าร่วมงานแข่งขันหรืองานนำเสนอผลงานเท่านั้น"
                )}
              </p>

              {/* Tab Switcher */}
              <div className="flex border-b border-slate-100 mb-8 gap-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("general")}
                  className={`pb-4 text-sm font-extrabold transition-all relative cursor-pointer border-none bg-transparent ${
                    activeTab === "general"
                      ? "text-blue-600 font-black"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {t("General Information", "ข้อมูลทั่วไป")}
                  {activeTab === "general" && (
                    <motion.div
                      layoutId="profileTabLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("competition")}
                  className={`pb-4 text-sm font-extrabold transition-all relative cursor-pointer border-none bg-transparent ${
                    activeTab === "competition"
                      ? "text-blue-600 font-black"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {t("Competition Form", "ฟอร์มสำหรับสมัครแข่งขัน")}
                  {activeTab === "competition" && (
                    <motion.div
                      layoutId="profileTabLine"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    />
                  )}
                </button>
              </div>

              {activeTab === "general" && (
                <motion.div
                  key="general-tab"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Username */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {t("Username", "ชื่อผู้ใช้งาน")}
                      </label>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                      />
                    </div>

                    {/* Email (Read-Only) */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {t("E-mail (อีเมล์)", "อีเมล์ (E-mail)")}
                      </label>
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="w-full px-4 py-3 bg-slate-100/60 border border-slate-100/50 rounded-xl text-sm font-semibold outline-none text-slate-400 cursor-not-allowed"
                      />
                    </div>

                    {/* First Name (ชื่อแรก/ชื่อจริง) */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {t("First Name", "ชื่อจริง")}
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                      />
                    </div>

                    {/* Last Name (นามสกุล) */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {t("Last Name", "นามสกุล")}
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                      />
                    </div>

                    {/* Phone (เบอร์โทรศัพท์) */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {t("Phone Number", "เบอร์โทรศัพท์")}
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                      />
                    </div>

                    {/* Gender select */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {t("Gender", "เพศ")}
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                      >
                        <option value="">
                          -- {t("Select Gender", "เลือกเพศ")} --
                        </option>
                        <option value="Male">{t("Male", "ชาย")}</option>
                        <option value="Female">{t("Female", "หญิง")}</option>
                        <option value="Other">{t("Other", "อื่นๆ")}</option>
                        <option value="None">
                          {t("Prefer not to say", "ไม่ต้องการระบุ")}
                        </option>
                      </select>
                    </div>

                    {/* Date of birth */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {t("Date of Birth", "วันเกิด")}
                      </label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Shipping Address Textarea */}
                  <div className="flex flex-col gap-2 mt-6">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {t("Shipping Address", "ที่อยู่สำหรับจัดส่งสินค้า")}
                    </label>
                    <textarea
                      rows="3"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t(
                        "Please enter your detailed shipping address...",
                        "กรุณากรอกที่อยู่สำหรับจัดส่งสินค้าอย่างละเอียด...",
                      )}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800 resize-y min-h-[80px]"
                    ></textarea>
                  </div>
                </motion.div>
              )}

              {activeTab === "competition" && (
                <motion.div
                  key="competition-tab"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title Name (คำนำหน้าชื่อ) */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {t("Title Name (คำนำหน้าชื่อ)", "คำนำหน้าชื่อ (Title Name)")}
                      </label>
                      <select
                        value={titleName}
                        onChange={(e) => setTitleName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                      >
                        <option value="">-- {t("Select Title", "เลือกคำนำหน้าชื่อ")} --</option>
                        <option value="Mr.">{t("Mr. (นาย)", "นาย (Mr.)")}</option>
                        <option value="Ms.">{t("Ms. (นางสาว)", "นางสาว (Ms.)")}</option>
                        <option value="Other">{t("Other (อื่นๆ)", "อื่นๆ (Other)")}</option>
                      </select>
                      {titleName === "Other" && (
                        <input
                          type="text"
                          placeholder={t("Please specify...", "โปรดระบุ...")}
                          value={customTitleName}
                          onChange={(e) => setCustomTitleName(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800 mt-2"
                        />
                      )}
                    </div>

                    {/* Nickname (ชื่อเล่น) */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {t("Nickname (ชื่อเล่น)", "ชื่อเล่น (Nickname)")}
                      </label>
                      <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                      />
                    </div>

                    {/* First Name (ชื่อแรก) */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {t("First Name (ชื่อแรก)", "ชื่อแรก (First Name)")}
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                      />
                    </div>

                    {/* Middle Name (ชื่อกลาง) */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {t("Middle Name (ชื่อกลาง)", "ชื่อกลาง (Middle Name)")}
                      </label>
                      <input
                        type="text"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                      />
                    </div>

                    {/* Last Name (นามสกุล) */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {t("Last Name (นามสกุล)", "นามสกุล (Last Name)")}
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                      />
                    </div>

                    {/* Identification Number / เลขบัตรประชาชน */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        {t("Identification Number / เลขบัตรประชาชน", "เลขบัตรประชาชน (Identification Number)")}
                      </label>
                      <input
                        type="text"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                      />
                    </div>

                    {/* Mobile Number (เบอร์มือถือ) */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {t("Mobile Number (เบอร์มือถือ)", "เบอร์มือถือ (Mobile Number)")}
                      </label>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                      />
                    </div>

                    {/* Education (ระดับการศึกษา) */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        {t("Education (ระดับการศึกษา)", "ระดับการศึกษา (Education)")}
                      </label>
                      <select
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800 cursor-pointer"
                      >
                        <option value="">-- {t("Select Education Level", "เลือกระดับการศึกษา")} --</option>
                        <option value="Primary">{t("Primary School (ประถมศึกษา)", "ประถมศึกษา (Primary School)")}</option>
                        <option value="Secondary">{t("Secondary School (มัธยมศึกษา)", "มัธยมศึกษา (Secondary School)")}</option>
                        <option value="Bachelor">{t("Bachelor's Degree (ปริญญาตรี)", "ปริญญาตรี (Bachelor's Degree)")}</option>
                      </select>
                    </div>

                    {/* Institution Name (สถาบัน/โรงเรียน) */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {t("Institution Name (สถาบัน/โรงเรียน)", "สถาบัน/โรงเรียน (Institution Name)")}
                      </label>
                      <input
                        type="text"
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Current Address (ที่อยู่ปัจจุบัน) */}
                  <div className="flex flex-col gap-2 mt-6">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {t("Current Address (ที่อยู่ปัจจุบัน)", "ที่อยู่ปัจจุบัน (Current Address)")}
                    </label>
                    <textarea
                      rows="3"
                      value={currentAddress}
                      onChange={(e) => setCurrentAddress(e.target.value)}
                      placeholder={t(
                        "Please enter your detailed current address...",
                        "กรุณากรอกที่อยู่ปัจจุบันของคุณอย่างละเอียด...",
                      )}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800 resize-y min-h-[80px]"
                    ></textarea>
                  </div>

                  {/* Institution Address (ที่อยู่ สถาบัน/โรงเรียน) */}
                  <div className="flex flex-col gap-2 mt-6">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {t("Institution Address (ที่อยู่ สถาบัน/โรงเรียน)", "ที่อยู่สถาบัน/โรงเรียน (Institution Address)")}
                    </label>
                    <textarea
                      rows="3"
                      value={institutionAddress}
                      onChange={(e) => setInstitutionAddress(e.target.value)}
                      placeholder={t(
                        "Please enter the detailed institution address...",
                        "กรุณากรอกที่อยู่สถาบัน/โรงเรียนอย่างละเอียด...",
                      )}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800 resize-y min-h-[80px]"
                    ></textarea>
                  </div>

                  {/* Student ID Card: Front (บัตรนักเรียนหน้าแรก) */}
                  <div className="flex flex-col gap-2 mt-6">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                      {t("Student ID Card: Front (บัตรนักเรียนหน้าแรก)", "Student ID Card: Front (บัตรนักเรียนหน้าแรก)")}
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium -mt-1 leading-normal">
                      {t("(Please upload a photo of your Student ID Card.)", "(Please upload a photo of your Student ID Card.)")}
                    </span>
                    <div className="mt-2 border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 bg-slate-50/50 flex flex-col items-center justify-center relative overflow-hidden group">
                      {studentCardFront ? (
                        <div className="w-full flex flex-col items-center gap-3">
                          <img src={studentCardFront} alt="Student ID Front" className="max-h-48 rounded-xl object-contain shadow-md" />
                          <button
                            type="button"
                            onClick={() => setStudentCardFront("")}
                            className="text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100/80 px-3 py-1.5 rounded-lg border-none cursor-pointer flex items-center gap-1.5 transition-colors mt-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {t("Remove Photo", "ลบรูปภาพ")}
                          </button>
                        </div>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-4">
                          <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-blue-500 transition-colors mb-3" />
                          <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors mb-1">
                            {t("Click to upload photo", "คลิกเพื่ออัปโหลดรูปภาพ")}
                          </span>
                          <span className="text-xs text-slate-400">
                            {t("Supported file: image (Max 100 MB)", "อัปโหลดไฟล์ที่รองรับ 1 รายการ: image ขนาดสูงสุด 100 MB")}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, setStudentCardFront)}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Student ID Card: Black (บัตรนักเรียนหน้าหลัง) */}
                  <div className="flex flex-col gap-2 mt-6">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <UploadCloud className="w-3.5 h-3.5 text-slate-400" />
                      {t("Student ID Card: Black (บัตรนักเรียนหน้าหลัง)", "Student ID Card: Black (บัตรนักเรียนหน้าหลัง)")}
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium -mt-1 leading-normal">
                      {t("(Please upload a photo of your Student ID Card.)", "(Please upload a photo of your Student ID Card.)")}
                    </span>
                    <div className="mt-2 border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 bg-slate-50/50 flex flex-col items-center justify-center relative overflow-hidden group">
                      {studentCardBack ? (
                        <div className="w-full flex flex-col items-center gap-3">
                          <img src={studentCardBack} alt="Student ID Back" className="max-h-48 rounded-xl object-contain shadow-md" />
                          <button
                            type="button"
                            onClick={() => setStudentCardBack("")}
                            className="text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100/80 px-3 py-1.5 rounded-lg border-none cursor-pointer flex items-center gap-1.5 transition-colors mt-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            {t("Remove Photo", "ลบรูปภาพ")}
                          </button>
                        </div>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-4">
                          <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-blue-500 transition-colors mb-3" />
                          <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors mb-1">
                            {t("Click to upload photo", "คลิกเพื่ออัปโหลดรูปภาพ")}
                          </span>
                          <span className="text-xs text-slate-400">
                            {t("Supported file: image (Max 100 MB)", "อัปโหลดไฟล์ที่รองรับ 1 รายการ: image ขนาดสูงสุด 100 MB")}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, setStudentCardBack)}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Submit Profile */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 flex items-center gap-2 cursor-pointer border-none disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed select-none active:scale-95"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSubmitting
                    ? t("Saving...", "กำลังบันทึก...")
                    : t("Save Changes", "บันทึกข้อมูล")}
                </button>
              </div>
            </form>

            {/* Password Update Card */}
            <form
              onSubmit={handlePasswordSubmit}
              className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-blue-600 to-sky-500"></div>

              <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" />
                {t("Change Password", "เปลี่ยนรหัสผ่าน")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {t("Current Password", "รหัสผ่านปัจจุบัน")}
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {t("New Password", "รหัสผ่านใหม่")}
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>

                {/* Confirm New Password */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {t("Confirm New Password", "ยืนยันรหัสผ่านใหม่")}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>
              </div>

              {/* Submit Password */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isPasswordSubmitting}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm transition-all shadow-md shadow-slate-900/10 flex items-center gap-2 cursor-pointer border-none disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed select-none active:scale-95"
                >
                  {isPasswordSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Key className="w-4 h-4" />
                  )}
                  {isPasswordSubmitting
                    ? t("Updating...", "กำลังอัปเดต...")
                    : t("Update Password", "อัปเดตรหัสผ่าน")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
