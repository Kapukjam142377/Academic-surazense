import React from "react";
import DeviceRestriction from "../components/DeviceRestriction";
import { useLanguage } from "../context/LanguageContext";

export default function Event() {
  const { t } = useLanguage();
  return (
    <DeviceRestriction>
      <div
        className="glass-panel"
        style={{ maxWidth: "800px", margin: "4rem auto", textAlign: "center" }}
      >
        <h2
          style={{
            color: "var(--text-main)",
            marginBottom: "1rem",
            fontSize: "2rem",
          }}
        >
          {t("nav.event")}
        </h2>
        <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
          Explore our upcoming and past events, hands-on workshops, and biotechnology exhibitions.
          (Space to add upcoming event updates here in the future.)
        </p>
      </div>
    </DeviceRestriction>
  );
}
