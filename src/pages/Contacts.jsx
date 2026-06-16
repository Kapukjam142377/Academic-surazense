import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Contacts() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    inquiryType: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobPosition: "",
    company: "",
    title: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.inquiryType)
      newErrors.inquiryType = t("contacts.validationSelect");
    if (!formData.firstName.trim())
      newErrors.firstName = t("contacts.validationFirst");
    if (!formData.lastName.trim())
      newErrors.lastName = t("contacts.validationLast");
    if (!formData.email.trim()) {
      newErrors.email = t("contacts.validationEmailRequired");
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = t("contacts.validationEmailInvalid");
    }
    if (!formData.phone.trim()) newErrors.phone = t("contacts.validationPhone");
    if (!formData.jobPosition.trim())
      newErrors.jobPosition = t("contacts.validationJob");
    if (!formData.company.trim())
      newErrors.company = t("contacts.validationCompany");
    if (!formData.title.trim()) newErrors.title = t("contacts.validationTitle");
    if (!formData.message.trim())
      newErrors.message = t("contacts.validationMessage");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop submission
    }

    console.log("Form submitted", formData);
    alert(t("contacts.submitSuccess"));

    // Reset form on success
    setFormData({
      inquiryType: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      jobPosition: "",
      company: "",
      title: "",
      message: "",
    });
    setErrors({});
  };

  const inquiryTypes = [
    { key: "product", value: "Product inquiry" },
    { key: "quotation", value: "Request Quotation" },
    { key: "demo", value: "Lab Visit / Demonstration" },
    { key: "collab", value: "Join / Collaboration" },
    { key: "general", value: "General Question" },
  ];

  const getInputClass = (fieldName) => {
    const base =
      "w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all text-slate-900";
    if (errors[fieldName]) {
      return `${base} border-red-500 focus:ring-red-500 focus:border-red-500`;
    }
    return `${base} border-slate-200 focus:ring-blue-500 focus:border-blue-500`;
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Decorative subtle background element */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] -z-10 -translate-x-1/4 -translate-y-1/4"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest">
              {t("contacts.contactUs")}
            </h2>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            {t("contacts.formInstruction")}
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16">
          {/* Left Column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-10 lg:pr-8"
          >
            {/* Company Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                Surazense Co., Ltd.
              </h2>
              <p className="text-slate-500 font-mono mt-1 text-sm bg-slate-100 inline-block px-3 py-1 rounded-md">
                Tax ID no: 0305565004265
              </p>
            </div>

            {/* Address */}
            <div className="flex items-start gap-5 group">
              <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-blue-50 to-sky-100 rounded-2xl flex items-center justify-center shadow-sm border border-blue-100/50 group-hover:scale-105 group-hover:shadow-blue-200 transition-all duration-300">
                <MapPin className="w-7 h-7 text-blue-600" />
              </div>
              <div className="text-slate-600 space-y-1 text-[16px] pt-1">
                <p className="font-medium text-slate-800 mb-2">
                  {t("contacts.headOffice")}
                </p>
                <p>394 Village No. 4,</p>
                <p>Chaimongkon Subdistrict,</p>
                <p>Mueang Nakhon Ratchasima District,</p>
                <p>Nakhon Ratchasima, 30000, Thailand</p>
              </div>
            </div>

            {/* Contact details */}
            <div className="flex items-start gap-5 group">
              <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-blue-50 to-sky-100 rounded-2xl flex items-center justify-center shadow-sm border border-blue-100/50 group-hover:scale-105 group-hover:shadow-blue-200 transition-all duration-300">
                <Phone className="w-7 h-7 text-blue-600" />
              </div>
              <div className="text-slate-600 space-y-2 pt-1 text-[16px]">
                <p className="font-medium text-slate-800 mb-2">
                  {t("contacts.directContact")}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-slate-400">{t("contacts.phone")}:</span>{" "}
                  <span className="font-medium">+66 099-063-5925</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-slate-400">{t("contacts.email")}:</span>{" "}
                  <a
                    href="mailto:info@surazense.com"
                    className="font-medium text-blue-600 hover:text-blue-700 underline underline-offset-4"
                  >
                    info@surazense.com
                  </a>
                </p>
              </div>
            </div>

            {/* Pitch */}
            <div className="pt-6 relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-sky-400 rounded-full"></div>
              <div className="pl-6 space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  {t("contacts.pitchText1")}
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {t("contacts.pitchText2")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl shadow-blue-900/5 border border-slate-100 relative"
          >
            {/* Subtle card glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>

            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              {/* Radio Group - Pill style */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-900">
                  {t("contacts.pleaseSelect")}
                </label>
                <div className="flex flex-wrap gap-3">
                  {inquiryTypes.map((type, idx) => (
                    <label key={idx} className="cursor-pointer">
                      <input
                        type="radio"
                        name="inquiryType"
                        value={type.value}
                        checked={formData.inquiryType === type.value}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div
                        className={`px-5 py-2.5 rounded-full border ${errors.inquiryType ? "border-red-500 text-red-600" : "border-slate-200 text-slate-600"} font-medium hover:border-blue-300 peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 peer-checked:shadow-md peer-checked:shadow-blue-500/20 transition-all select-none`}
                      >
                        {t(`contacts.types.${type.key}`)}
                      </div>
                    </label>
                  ))}
                </div>
                {errors.inquiryType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.inquiryType}
                  </p>
                )}
              </div>

              {/* 2-Col Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-900">
                    {t("contacts.firstName")}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={getInputClass("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-900">
                    {t("contacts.lastName")}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={getInputClass("lastName")}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-900">
                    {t("contacts.emailAddress")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={getInputClass("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-900">
                    {t("contacts.phoneNumber")}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={getInputClass("phone")}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-900">
                    {t("contacts.jobPosition")}
                  </label>
                  <input
                    type="text"
                    name="jobPosition"
                    value={formData.jobPosition}
                    onChange={handleChange}
                    className={getInputClass("jobPosition")}
                  />
                  {errors.jobPosition && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.jobPosition}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-900">
                    {t("contacts.companyOrInstitution")}
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={getInputClass("company")}
                  />
                  {errors.company && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.company}
                    </p>
                  )}
                </div>
              </div>

              {/* Full Width Inputs */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  {t("contacts.title")}
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={getInputClass("title")}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900">
                  {t("contacts.message")}
                </label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className={`${getInputClass("message")} resize-none`}
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all text-lg flex justify-center items-center"
                >
                  {t("contacts.submit")}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
