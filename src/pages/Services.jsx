import React from "react";
import DeviceRestriction from "../components/DeviceRestriction";

export default function Services() {
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
          Services
        </h2>
        <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
          Target detection modules and analytical support for research. (Space
          to add service offerings here in the future.)
        </p>
      </div>
    </DeviceRestriction>
  );
}
