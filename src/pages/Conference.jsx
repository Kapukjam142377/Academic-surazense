import React from "react";
import DeviceRestriction from "../components/DeviceRestriction";
import { useLanguage } from "../context/LanguageContext";

export default function Conference() {
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
          {t("nav.conference")}
        </h2>
        <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
          Participate in scientific conferences, research symposiums, and
          diagnostic technology summits. (Space to add conference schedules and
          details here in the future.)
        </p>
      </div>
    </DeviceRestriction>
  );
}
