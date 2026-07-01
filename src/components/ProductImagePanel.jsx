import React from "react";
import { motion } from "framer-motion";

/**
 * Left-column image display with mock carousel indicators.
 */
export default function ProductImagePanel({ product, language }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col items-center"
    >
      <div className="w-full aspect-[4/3] relative flex items-center justify-center mb-8">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name[language] || product.name.en}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-slate-50 flex items-center justify-center rounded-2xl text-slate-400">
            {language === "th" ? "ไม่มีรูปภาพสินค้า" : "No Image Available"}
          </div>
        )}
      </div>

      {/* Carousel Indicators (Mock) */}
      <div className="flex items-center justify-center gap-4">
        {[0, 1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className={`h-2.5 transition-colors cursor-pointer ${
              idx === 0
                ? "w-12 bg-slate-400"
                : "w-12 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
