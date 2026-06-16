import React from "react";

export default function News() {
  return (
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
        News
      </h2>
      <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
        The latest product updates and insights from Surazense. (Space to add
        news articles and updates here in the future.)
      </p>
    </div>
  );
}
