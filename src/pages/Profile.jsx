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
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [dob, setDob] = useState(user?.dob || "");
  const [address, setAddress] = useState(user?.address || "");

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

              <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                {t("Personal Details", "ข้อมูลส่วนตัว")}
              </h2>

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
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t("Email Address (Locked)", "ที่อยู่อีเมล (แก้ไขไม่ได้)")}
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-4 py-3 bg-slate-100/60 border border-slate-100/50 rounded-xl text-sm font-semibold outline-none text-slate-400 cursor-not-allowed"
                  />
                </div>

                {/* First Name */}
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

                {/* Last Name */}
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

                {/* Phone */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
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
