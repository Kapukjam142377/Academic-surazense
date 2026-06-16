import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../data/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("lang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);

  const changeLanguage = (lang) => {
    if (lang === "en" || lang === "th") {
      setLanguage(lang);
    }
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "th" : "en"));
  };

  const t = (keyPath) => {
    const keys = keyPath.split(".");
    let result = translations[language];
    for (const key of keys) {
      if (result && result[key] !== undefined) {
        result = result[key];
      } else {
        return keyPath;
      }
    }
    return result;
  };

  return (
    <LanguageContext.Provider
      value={{ language, changeLanguage, toggleLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
